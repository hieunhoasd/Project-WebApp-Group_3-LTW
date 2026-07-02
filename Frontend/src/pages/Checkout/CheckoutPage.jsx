import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import toast from 'react-hot-toast';
import './CheckoutPage.css';
import { FiCreditCard, FiMapPin, FiTruck, FiLoader, FiCheckCircle, FiShoppingCart } from 'react-icons/fi';

const CheckoutPage = () => {
    const { cartItems = [], clearCart } = useCart();
    const navigate = useNavigate();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    const token = localStorage.getItem('user_token');

    const [formData, setFormData] = useState({
        phone_receiver: storedUser.phone || '',
        shipping_address: storedUser.address || '',
        note: ''
    });

    const totalAmount = (cartItems && cartItems.length > 0)
        ? cartItems.reduce((total, item) => total + item.price * item.cart_quantity, 0)
        : 0;

    // ==========================================
    // CONFIG STYLE TOAST ĐỒNG BỘ CHO VELORA STORE (react-hot-toast)
    // ==========================================

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        const currentToken = localStorage.getItem('user_token') || token;
        const currentUser = JSON.parse(localStorage.getItem('user')) || {};

        if (!currentToken) {
            toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
            navigate('/login');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Giỏ hàng của bạn đang trống!');
            return;
        }

        if (!formData.phone_receiver || !formData.shipping_address) {
            toast.error('Vui lòng điền đầy đủ số điện thoại và địa chỉ nhận hàng!');
            return;
        }

        if (!currentUser.id) {
            toast.error('Không tìm thấy thông tin tài khoản! Vui lòng thử đăng xuất và đăng nhập lại.');
            return;
        }

        setLoading(true);
        try {
            const orderData = {
                user_id: currentUser.id,
                shipping_address: formData.shipping_address,
                phone_receiver: formData.phone_receiver,
                note: formData.note,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.cart_quantity
                }))
            };

            const response = await fetch(`${apiBaseUrl}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': currentToken.startsWith('Bearer ') ? currentToken : `Bearer ${currentToken}`
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            console.log("Kết quả API Đặt hàng trả về:", result);

            if (response.status === 200 || response.status === 201 || result.status === true) {

                // Gọi cực kỳ ngắn gọn, style tự động ăn theo cấu hình trong App.jsx
                toast.success('Đặt hàng thành công! Đơn hàng đang được hệ thống xử lý.');

                if (typeof clearCart === 'function') {
                    clearCart();
                }

                setTimeout(() => {
                    navigate('/');
                }, 2500);

            } else {
                let errorMessage = 'Có lỗi xảy ra khi xử lý đơn hàng.';

                if (result.errors) {
                    errorMessage = Object.values(result.errors).flat().join(', ');
                } else if (result.message) {
                    errorMessage = result.message;
                } else if (result.error) {
                    errorMessage = result.error;
                } else if (result.msg) {
                    errorMessage = result.msg;
                }

                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            toast.error('Không thể kết nối đến máy chủ! Vui lòng kiểm tra lại backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="checkout-page-container">
                <h2 className="checkout-title"><FiCreditCard size={28} /> Thanh toán đơn hàng</h2>
                <div className="checkout-grid">
                    {/* Bên trái: Form */}
                    <div className="checkout-form-section">
                        <h3 className="section-subtitle"><FiMapPin size={22} /> Thông tin nhận hàng</h3>
                        <form onSubmit={handleSubmitOrder}>
                            <div className="form-group">
                                <label>Số điện thoại nhận hàng *</label>
                                <input type="text" name="phone_receiver" value={formData.phone_receiver} onChange={handleInputChange} placeholder="Nhập số điện thoại" required className="form-control" />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ giao hàng *</label>
                                <textarea name="shipping_address" value={formData.shipping_address} onChange={handleInputChange} placeholder="Ghi rõ số nhà, tên đường..." required rows="3" className="form-control" style={{ resize: 'none' }} />
                            </div>
                            <div className="form-group">
                                <label>Ghi chú đơn hàng (Tùy chọn)</label>
                                <textarea name="note" value={formData.note} onChange={handleInputChange} placeholder="Lưu ý cho shipper..." rows="2" className="form-control" style={{ resize: 'none' }} />
                            </div>

                            <div className="payment-method-box">
                                <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FiTruck size={22} color="#6c5ce7" />
                                    <span><strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)</span>
                                </p>
                            </div>

                            <button type="submit" disabled={loading} className="btn-submit-order">
                                {loading ? (
                                    <>
                                        <FiLoader size={18} className="spinning" /> ĐANG XỬ LÝ ĐƠN HÀNG...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle size={20} /> XÁC NHẬN ĐẶT HÀNG
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Bên phải: Tóm tắt */}
                    <div className="checkout-summary-section">
                        <h3 className="section-subtitle"><FiShoppingCart size={22} /> Đơn hàng của bạn ({cartItems.length})</h3>
                        <div className="summary-items-list">
                            {cartItems.map((item) => (
                                <div key={item.id} className="summary-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px dashed #e2e8f0' }}>
                                    <div style={{ flex: 1 }}>
                                        <p className="summary-item-name" style={{ fontWeight: '500', margin: '0 0 4px 0', color: '#2d3748' }}>{item.name}</p>
                                        <p className="summary-item-qty" style={{ margin: 0, fontSize: '14px', color: '#718096' }}>
                                            Đơn giá: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)} x <strong>{item.cart_quantity}</strong>
                                        </p>
                                    </div>
                                    <span className="summary-item-price" style={{ fontWeight: '600', color: '#2d3748' }}>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.cart_quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-calculation" style={{ marginTop: '20px' }}>
                            <div className="calc-row">
                                <span>Tạm tính:</span>
                                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                            </div>
                            <div className="calc-row free-ship">
                                <span>Phí vận chuyển:</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="calc-row total">
                                <span>Tổng cộng:</span>
                                <span className="price-tag">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;