import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
    // Lấy mảng cartItems và hàm xóa giỏ hàng từ Context
    const { cartItems = [], clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};

    const [formData, setFormData] = useState({
        phone_receiver: storedUser.phone || '',
        shipping_address: '',
        note: ''
    });

    // Tính tổng tiền hiển thị tạm thời ở Frontend dựa trên cartItems
    const totalAmount = (cartItems && cartItems.length > 0)
        ? cartItems.reduce((total, item) => total + item.price * item.cart_quantity, 0)
        : 0;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.error('Giỏ hàng của bạn đang trống!');
            return;
        }

        if (!formData.phone_receiver || !formData.shipping_address) {
            toast.error('Vui lòng điền đầy đủ số điện thoại và địa chỉ nhận hàng!');
            return;
        }

        setLoading(true);
        try {
            // ✅ ĐÃ CẬP NHẬT: Cấu trúc orderData tinh gọn, khớp chuẩn 100% với Backend validation
            const orderData = {
                user_id: storedUser.id || 1,
                shipping_address: formData.shipping_address,
                phone_receiver: formData.phone_receiver,
                note: formData.note,
                items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.cart_quantity // Không cần gửi price lên để tránh Client đổi giá bậy bạ
                }))
            };

            const response = await fetch('http://127.0.0.1:8000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            // Nhận diện mã 200 hoặc response.ok thành công từ Backend mới
            if (response.ok || result.code === 200) {
                toast.success('🎉 Đặt hàng thành công!');
                clearCart(); // Xóa sạch LocalStorage thông qua Context
                setIsSuccess(true);
            } else {
                toast.error(result.message || 'Có lỗi xảy ra khi xử lý đơn hàng.');
            }
        } catch (error) {
            console.error('Lỗi đặt hàng:', error);
            toast.error('Không thể kết nối đến máy chủ!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="checkout-page-container">

                {/* NẾU ĐẶT HÀNG THÀNH CÔNG */}
                {isSuccess ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '16px', margin: '20px auto', maxWidth: '600px', boxShadow: '0 10px 25px rgba(22, 163, 74, 0.1)' }}>
                        <div style={{ fontSize: '60px', marginBottom: '15px' }}>✅</div>
                        <h2 style={{ color: '#16a34a', fontSize: '26px', marginBottom: '15px', fontWeight: 'bold' }}>
                            Đặt hàng thành công!
                        </h2>
                        <p style={{ color: '#4a5568', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
                            Cảm ơn bạn đã tin tưởng mua sắm. Đơn hàng của bạn đang được xử lý và sẽ được giao đến:<br />
                            <strong style={{ color: '#2b3674', display: 'block', marginTop: '10px' }}>📍 {formData.shipping_address}</strong>
                            <strong style={{ color: '#2b3674', display: 'block', marginTop: '5px' }}>📞 {formData.phone_receiver}</strong>
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-submit-order"
                            style={{ width: 'auto', padding: '12px 30px', backgroundColor: '#16a34a', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)' }}
                        >
                            ⬅ Quay lại trang chủ
                        </button>
                    </div>
                ) : (
                    /* NẾU CHƯA ĐẶT HÀNG: FORM CHECKOUT BÌNH THƯỜNG */
                    <>
                        <h2 className="checkout-title">
                            💳 Thanh toán đơn hàng
                        </h2>

                        <div className="checkout-grid">
                            {/* KHU VỰC 1: FORM NHẬP THÔNG TIN GIAO HÀNG */}
                            <div className="checkout-form-section">
                                <h3 className="section-subtitle">📌 Thông tin nhận hàng</h3>
                                <form onSubmit={handleSubmitOrder}>
                                    <div className="form-group">
                                        <label>Số điện thoại nhận hàng *</label>
                                        <input
                                            type="text"
                                            name="phone_receiver"
                                            value={formData.phone_receiver}
                                            onChange={handleInputChange}
                                            placeholder="Nhập số điện thoại người nhận"
                                            required
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Địa chỉ giao hàng *</label>
                                        <textarea
                                            name="shipping_address"
                                            value={formData.shipping_address}
                                            onChange={handleInputChange}
                                            placeholder="Ghi rõ số nhà, tên đường, phường/xã, quận/huyện..."
                                            required
                                            rows="3"
                                            className="form-control"
                                            style={{ resize: 'none' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Ghi chú đơn hàng (Tùy chọn)</label>
                                        <textarea
                                            name="note"
                                            value={formData.note}
                                            onChange={handleInputChange}
                                            placeholder="Lưu ý cho người bán hoặc shipper..."
                                            rows="2"
                                            className="form-control"
                                            style={{ resize: 'none' }}
                                        />
                                    </div>

                                    <div className="payment-method-box">
                                        <p style={{ margin: 0 }}>💵 <strong>Phương thức thanh toán:</strong> Thanh toán khi nhận hàng (COD)</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-submit-order"
                                    >
                                        {loading ? '⏳ ĐANG XỬ LÝ ĐƠN HÀNG...' : '🚀 XÁC NHẬN ĐẶT HÀNG'}
                                    </button>
                                </form>
                            </div>

                            {/* KHU VỰC 2: TÓM TẮT ĐƠN HÀNG (KHÔNG HÌNH ẢNH) */}
                            <div className="checkout-summary-section">
                                <h3 className="section-subtitle">🛒 Đơn hàng của bạn ({cartItems.length})</h3>

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
                                        <span className="price-tag">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default CheckoutPage;