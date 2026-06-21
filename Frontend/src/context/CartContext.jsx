import React, { createContext, useState, useContext, useEffect } from 'react';

// Khởi tạo Context
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

    // 🌟 THÊM MỚI: Hàm cập nhật số lượng (dùng khi bấm nút + / - trong giỏ hàng)
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return; // Không cho phép giảm số lượng xuống dưới 1
        setCartItems((prevItems) =>
            prevItems.map(item =>
                item.id === productId ? { ...item, cart_quantity: newQuantity } : item
            )
        );
    };

    // 🌟 THÊM MỚI: Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item.id !== productId));
    };

    // Tính tổng số lượng sản phẩm đang có trong giỏ
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.cart_quantity, 0);
    };

    // 🌟 Đã chuyển comment ra ngoài return để không bị lỗi JSX
    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            getCartCount,
            updateQuantity,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);