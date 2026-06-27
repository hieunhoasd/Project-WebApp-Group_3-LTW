import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const CartProvider = ({ children }) => {
    // Lấy dữ liệu giỏ hàng ban đầu từ localStorage nếu có
    const [cartItems, setCartItems] = useState(() => {
        const localData = localStorage.getItem('velora_cart');
        return localData ? JSON.parse(localData) : [];
    });

    // Mỗi khi giỏ hàng thay đổi, lưu lại vào localStorage
    useEffect(() => {
        localStorage.setItem('velora_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Nếu sản phẩm đã có, tăng số lượng lên
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, cart_quantity: item.cart_quantity + quantity } : item
                );
            }
            // Nếu chưa có, thêm sản phẩm mới vào danh sách kèm số lượng
            return [...prevItems, { ...product, cart_quantity: quantity }];
        });
    };

    // Hàm cập nhật số lượng (dùng khi bấm nút + / - trong giỏ hàng)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return; // Không cho phép giảm số lượng xuống dưới 1
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === productId ? { ...item, cart_quantity: newQuantity } : item
            )
        );
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    // 🌟 THÊM MỚI: Hàm xóa SẠCH TOÀN BỘ giỏ hàng sau khi đặt hàng thành công
    const clearCart = () => {
        setCartItems([]); // Đưa state giỏ hàng về mảng rỗng []
        localStorage.removeItem('velora_cart'); // Xóa hẳn key giỏ hàng trong bộ nhớ trình duyệt
    };

    // Tính tổng số lượng sản phẩm đang có trong giỏ
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.cart_quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            getCartCount,
            updateQuantity,
            removeFromCart,
            clearCart // 🌟 ĐỪNG QUÊN: Đã thêm clearCart vào đây để các trang khác có thể gọi dùng
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);