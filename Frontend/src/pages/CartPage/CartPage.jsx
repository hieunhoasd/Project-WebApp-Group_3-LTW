import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import { toast } from 'react-toastify';
import './CartPage.css';

const CartPage = () => {
    // Lấy dữ liệu và các hàm xử lý từ Context ra
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    // Hàm định dạng tiền tệ VNĐ cho chuẩn giao diện
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    // 🌟 TÍNH TỔNG TIỀN TOÀN BỘ GIỎ HÀNG
    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.cart_quantity), 0);
    };

    const handleRemove = (id, name) => {
        removeFromCart(id);
        toast.info(`Đã xóa "${name}" khỏi giỏ hàng`);
    };

    return (
        <>
            <Header />
            <div className="cart-page-container">
                <h1 className="cart-page-title">Giỏ hàng của bạn</h1>

                {cartItems.length === 0 ? (
                    // Giao diện khi giỏ hàng trống không có gì
                    <div className="empty-cart-section">
                        <div className="empty-cart-icon">🛒</div>
                        <p>Giỏ hàng của bạn đang trống rỗng!</p>
                        <Link to="/" className="btn-go-shopping">Tiếp tục mua sắm</Link>
                    </div>
                ) : (
                    // Giao diện chính khi có sản phẩm
                    <div className="cart-layout">

                        {/* Khối bên trái: Danh sách sản phẩm */}
                        <div className="cart-items-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item-card">
                                    <div className="cart-item-img">
                                        <img src={item.image} alt={item.name} />
                                    </div>

                                    <div className="cart-item-details">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-category">{item.category_name}</p>
                                        <p className="item-unit-price">Đơn giá: {formatPrice(item.price)}</p>
                                    </div>

                                    {/* Bộ tăng giảm số lượng */}
                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.cart_quantity - 1)}
                                            className="qty-btn"
                                        >-</button>
                                        <span className="qty-value">{item.cart_quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.cart_quantity + 1)}
                                            className="qty-btn"
                                        >+</button>
                                    </div>

                                    {/* Thành tiền của từng loại sản phẩm */}
                                    <div className="cart-item-subtotal">
                                        <p className="subtotal-label">Thành tiền</p>
                                        <p className="subtotal-value">{formatPrice(item.price * item.cart_quantity)}</p>
                                    </div>

                                    {/* Nút xóa sản phẩm */}
                                    <button
                                        className="btn-delete-item"
                                        onClick={() => handleRemove(item.id, item.name)}
                                        title="Xóa khỏi giỏ hàng"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Khối bên phải: Bảng tính tổng tiền & Thanh toán */}
                        <div className="cart-summary-box">
                            <h3>Tóm tắt đơn hàng</h3>
                            <hr />
                            <div className="summary-row">
                                <span>Số lượng sản phẩm:</span>
                                <span>{cartItems.reduce((total, item) => total + item.cart_quantity, 0)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Giao hàng:</span>
                                <span className="free-ship">Miễn phí</span>
                            </div>
                            <hr />
                            <div className="summary-row total-row">
                                <span>Tổng tiền thanh toán:</span>
                                <span className="total-price-value">{formatPrice(calculateTotalPrice())}</span>
                            </div>

                            <button className="btn-checkout" onClick={() => toast.success("Tính năng thanh toán đang được phát triển!")}>
                                Tiến hành thanh toán
                            </button>

                            <Link to="/" className="continue-link">← Tiếp tục mua sắm</Link>
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CartPage;