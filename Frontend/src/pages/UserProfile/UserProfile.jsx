import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import axios from '../../context/axios';
// 🌟 Đã thêm icon Star vào bộ Icon cao cấp
import { User, Package, Edit2, Loader2, Save, X, AlertCircle, CheckCircle, Info, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const [backupInfo, setBackupInfo] = useState({});

    const [userInfo, setUserInfo] = useState({
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
    });

    // Các state phục vụ Modal Đánh giá
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderProducts, setOrderProducts] = useState([]); // State lưu danh sách sản phẩm lấy từ API
    const [isFetchingProducts, setIsFetchingProducts] = useState(false);
    const [reviewData, setReviewData] = useState({
        product_id: '',
        rating: 5,
        content: ''
    });
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [orders, setOrders] = useState([]);

    // ==========================================
    // 1. Lấy thông tin cá nhân (Profile) từ DB
    // ==========================================
    useEffect(() => {
        const currentToken = localStorage.getItem('user_token') || localStorage.getItem('token');

        if (!currentToken) {
            setServerError("Vui lòng đăng nhập để xem thông tin tài khoản!");
            setLoading(false);
            return;
        }

        axios.get('/user-profile')
            .then((response) => {
                if (response.data.code === 200 && response.data.user) {
                    const userData = response.data.user;
                    setUserInfo({
                        id: userData.id,
                        firstname: userData.firstname || '',
                        lastname: userData.lastname || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                    });
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi lấy thông tin profile:", error);
                if (error.response && error.response.status === 401) {
                    setServerError("Phiên đăng nhập hết hạn hoặc token không hợp lệ. Vui lòng đăng nhập lại!");
                } else {
                    setServerError("Không thể tải thông tin profile. Vui lòng thử lại sau.");
                }
                setLoading(false);
            });
    }, []);

    // ==========================================
    // 2. Logic lấy lịch sử đơn hàng
    // ==========================================
    useEffect(() => {
        if (activeTab === 'orders' && userInfo.id && orders.length === 0) {
            setOrdersLoading(true);

            axios.get('/orders')
                .then((response) => {
                    if (response.data.code === 200) {
                        setOrders(response.data.data || []);
                    }
                    setOrdersLoading(false);
                })
                .catch((error) => {
                    console.error("Lỗi lấy lịch sử đơn hàng:", error);
                    setOrdersLoading(false);
                });
        }
    }, [activeTab, userInfo.id, orders.length]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const startEditing = (e) => {
        e.preventDefault();
        setBackupInfo({ ...userInfo });
        setIsEditing(true);
        setSuccessMessage('');
        setFormErrors({});
        setServerError('');
    };

    const cancelEditing = (e) => {
        e.preventDefault();
        setUserInfo({ ...backupInfo });
        setIsEditing(false);
        setFormErrors({});
        setServerError('');
    };

    // ==========================================
    // 3. Cập nhật Profile
    // ==========================================
    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setFormErrors({});
        setSuccessMessage('');
        setServerError('');
        axios.put('/user-profile/update', {
            firstname: userInfo.firstname,
            lastname: userInfo.lastname,
            phone: userInfo.phone,
            email: userInfo.email
        })
            .then((response) => {
                if (response.data.code === 200) {
                    toast.success(response.data.message || "Cập nhật hồ sơ thành công!");
                    setIsEditing(false);

                    const localUser = localStorage.getItem('user');
                    if (localUser) {
                        const parsedUser = JSON.parse(localUser);
                        parsedUser.firstname = userInfo.firstname;
                        parsedUser.lastname = userInfo.lastname;
                        parsedUser.phone = userInfo.phone;
                        parsedUser.email = userInfo.email;
                        localStorage.setItem('user', JSON.stringify(parsedUser));
                    }
                } else {
                    const errorMsg = response.data.message || "Không thể cập nhật hồ sơ.";
                    setServerError(errorMsg);
                    toast.error(errorMsg);
                }
                setUpdateLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi cập nhật hồ sơ:", error);
                setUpdateLoading(false);
                if (error.response) {
                    if (error.response.status === 422) {
                        setFormErrors(error.response.data.errors || {});
                        toast.error("Vui lòng kiểm tra lại thông tin nhập vào!");
                    } else if (error.response.status === 401) {
                        toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
                    } else {
                        toast.error(error.response.data.message || "Có lỗi xảy ra trong quá trình cập nhật.");
                    }
                } else {
                    toast.error("Không thể kết nối đến máy chủ.");
                }
            });
    };

    const renderStatus = (status) => {
        const statusMap = {
            'pending': { text: 'Chờ xử lý', color: '#f0ad4e' },
            'shipping': { text: 'Đang giao', color: '#5bc0de' },
            'completed': { text: 'Thành công', color: '#5cb85c' },
            'cancelled': { text: 'Đã hủy', color: '#d9534f' }
        };
        const current = statusMap[status] || { text: status, color: '#888' };
        return <span style={{ color: current.color, fontWeight: 'bold' }}>{current.text}</span>;
    };

    const spinKeyframes = `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .icon-spin { animation: spin 1s linear infinite; }
    `;

    // --- STATE & HÀM XỬ LÝ ĐÁNH GIÁ ĐƠN HÀNG ---

    // Mở hộp thoại đánh giá & Gọi API lấy sản phẩm
    const handleOpenReviewModal = async (order) => {
        setSelectedOrder(order);
        setIsReviewModalOpen(true);
        setIsFetchingProducts(true);
        setOrderProducts([]);

        // Reset form đánh giá
        setReviewData({
            product_id: '',
            rating: 5,
            content: ''
        });

        // Gọi API lấy danh sách sản phẩm thuộc đơn hàng này
        try {
            const response = await axios.get(`/orders/${order.id}/products`);
            if (response.data.code === 200 && response.data.data) {
                const products = response.data.data;
                setOrderProducts(products);

                // Tự động chọn sản phẩm đầu tiên nếu có
                if (products.length > 0) {
                    setReviewData(prev => ({ ...prev, product_id: products[0].id }));
                }
            }
        } catch (error) {
            console.error("Lỗi lấy sản phẩm đơn hàng:", error);
            toast.error("Không thể tải danh sách sản phẩm của đơn hàng!");
        } finally {
            setIsFetchingProducts(false);
        }
    };

    // Đóng hộp thoại
    const handleCloseReviewModal = () => {
        setIsReviewModalOpen(false);
        setSelectedOrder(null);
        setOrderProducts([]);
    };

    // Gửi đánh giá lên API Backend
    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        if (!reviewData.product_id) {
            toast.error('Vui lòng chọn sản phẩm để đánh giá!');
            return;
        }
        if (!reviewData.content.trim()) {
            toast.error('Vui lòng điền nội dung nhận xét sản phẩm!');
            return;
        }

        setIsSubmittingReview(true);

        try {
            // Sử dụng axios instance có sẵn (tự động gắn token)
            const response = await axios.post('/comments', {
                product_id: reviewData.product_id,
                content: reviewData.content,
                rating: reviewData.rating
            });

            if (response.data.code === 200) {
                toast.success(response.data.message || 'Cảm ơn bạn đã gửi đánh giá thành công!');
                handleCloseReviewModal();
            } else {
                toast.error(response.data.message || 'Có lỗi xảy ra khi gửi đánh giá!');
            }
        } catch (error) {
            console.error('Lỗi kết nối đánh giá:', error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Lỗi kết nối tới máy chủ!');
            }
        } finally {
            setIsSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="loading-box" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '100px 50px', color: '#555' }}>
            <style>{spinKeyframes}</style>
            <Loader2 className="icon-spin" size={32} color="#007bff" />
            <p>Đang tải hồ sơ...</p>
        </div>
    );

    if (serverError && !isEditing) return (
        <div className="error-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#e74c3c', padding: '50px' }}>
            <AlertCircle size={24} />
            <span>{serverError}</span>
        </div>
    );

    return (
        <div className="profile-container">
            <style>{spinKeyframes}</style>

            {/* Sidebar */}
            <div className="profile-sidebar">
                <div className="user-avatar-section">
                    <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="Avatar" className="profile-avatar" />
                    <h3>Hi, {userInfo.firstname} {userInfo.lastname}</h3>
                    <p className="user-role">Thành viên Velora</p>
                </div>
                <div className="profile-menu">
                    <button
                        className={`menu-item ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <User size={18} /> Thông tin cá nhân
                    </button>
                    <button
                        className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                    >
                        <Package size={18} /> Lịch sử đơn hàng
                    </button>
                </div>
            </div>

            {/* Content Panel */}
            <div className="profile-content">
                {activeTab === 'info' ? (
                    <div className="tab-panel animate-fade">
                        <h2>{isEditing ? "Chỉnh Sửa Thông Tin" : "Thông Tin Tài Khoản"}</h2>
                        <p className="panel-subtitle">Quản lý thông tin hồ sơ của bạn</p>

                        {!isEditing ? (
                            /* TRẠNG THÁI XEM */
                            <div className="profile-form">
                                <div className="form-group" style={{ display: 'flex', gap: '20px', flexDirection: 'row' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Họ</label>
                                        <input type="text" value={userInfo.firstname} readOnly className="disabled-input" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>Tên</label>
                                        <input type="text" value={userInfo.lastname} readOnly className="disabled-input" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Địa chỉ Email</label>
                                    <input type="email" value={userInfo.email} disabled={true} className="disabled-input" />
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input type="tel" value={userInfo.phone} readOnly className="disabled-input" />
                                </div>

                                <div className="profile-actions" style={{ marginTop: '25px' }}>
                                    <button
                                        type="button"
                                        className="btn-edit"
                                        onClick={startEditing}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#111', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }}
                                    >
                                        <Edit2 size={16} /> Chỉnh sửa thông tin
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* TRẠNG THÁI CHỈNH SỬA */
                            <form className="profile-form" onSubmit={handleUpdateProfile}>
                                <div className="form-group" style={{ display: 'flex', gap: '20px', flexDirection: 'row' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Họ</label>
                                        <input type="text" name="firstname" value={userInfo.firstname} onChange={handleInputChange} className="editable-input" required />
                                        {formErrors.firstname && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e74c3c', fontSize: '13px', marginTop: '5px' }}><Info size={14} /> {formErrors.firstname[0]}</span>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label>Tên</label>
                                        <input type="text" name="lastname" value={userInfo.lastname} onChange={handleInputChange} className="editable-input" required />
                                        {formErrors.lastname && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e74c3c', fontSize: '13px', marginTop: '5px' }}><Info size={14} /> {formErrors.lastname[0]}</span>}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Địa chỉ Email</label>
                                    <input type="email" name="email" value={userInfo.email} onChange={handleInputChange} className="editable-input" required />
                                    {formErrors.email && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e74c3c', fontSize: '13px', marginTop: '5px' }}><Info size={14} /> {formErrors.email[0]}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Số điện thoại</label>
                                    <input type="tel" name="phone" value={userInfo.phone} onChange={handleInputChange} className="editable-input" />
                                    {formErrors.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#e74c3c', fontSize: '13px', marginTop: '5px' }}><Info size={14} /> {formErrors.phone[0]}</span>}
                                </div>

                                <div className="profile-actions" style={{ marginTop: '25px', display: 'flex', gap: '15px' }}>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#4318ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        {updateLoading ? <><Loader2 className="icon-spin" size={16} /> Đang lưu...</> : <><Save size={16} /> Lưu thay đổi</>}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={cancelEditing}
                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        <X size={16} /> Hủy
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="tab-panel animate-fade">
                        <h2>Lịch Sử Đơn Hàng</h2>
                        <p className="panel-subtitle">Các đơn hàng bạn đã đặt tại Velora</p>

                        {ordersLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '40px', color: '#666' }}>
                                <Loader2 className="icon-spin" size={24} color="#555" /> Đang tải dữ liệu đơn hàng...
                            </div>
                        ) : orders.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#888', padding: '60px 0' }}>
                                <Package size={48} color="#ddd" style={{ marginBottom: '15px' }} />
                                Bạn chưa có đơn hàng nào trong hệ thống.
                            </div>
                        ) : (
                            <div className="orders-table-container" style={{ marginTop: '20px', overflowX: 'auto', borderRadius: '8px', border: '1px solid #eee' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #eee', background: '#f9f9f9' }}>
                                            <th style={{ padding: '15px' }}>Mã Đơn</th>
                                            <th style={{ padding: '15px' }}>Ngày Đặt</th>
                                            <th style={{ padding: '15px' }}>Tổng Tiền</th>
                                            <th style={{ padding: '15px' }}>Trạng Thái</th>
                                            <th style={{ padding: '15px' }}>Hành Động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#fdfdfd'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                                                <td style={{ padding: '15px', fontWeight: '600', color: '#111' }}>#{order.id}</td>
                                                <td style={{ padding: '15px', color: '#666' }}>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                                                <td style={{ padding: '15px', color: '#111', fontWeight: '600' }}>{Number(order.total_price).toLocaleString('vi-VN')} ₫</td>
                                                <td style={{ padding: '15px' }}>{renderStatus(order.status)}</td>
                                                <td style={{ padding: '15px' }}>
                                                    {(order.status === 'completed' || order.status === 'Thành công') ? (
                                                        <button
                                                            onClick={() => handleOpenReviewModal(order)}
                                                            style={{ padding: '6px 14px', backgroundColor: '#4318ff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
                                                        >
                                                            Đánh giá
                                                        </button>
                                                    ) : (
                                                        <span style={{ color: '#aaa', fontSize: '13px', fontStyle: 'italic' }}>Không khả dụng</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================
                HỘP THOẠI MODAL ĐÁNH GIÁ SẢN PHẨM 
            ======================================================== */}
            {isReviewModalOpen && selectedOrder && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999
                }}>
                    <div style={{
                        background: '#fff', padding: '30px', borderRadius: '12px', width: '480px', maxWidth: '90%', boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: '#111', fontSize: '18px' }}>Đánh giá đơn hàng #{selectedOrder.id}</h3>
                            <button onClick={handleCloseReviewModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#aaa' }}>✕</button>
                        </div>

                        {isFetchingProducts ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px', gap: '10px', color: '#666' }}>
                                <Loader2 className="icon-spin" size={20} /> Đang tải sản phẩm...
                            </div>
                        ) : (
                            <form onSubmit={handleReviewSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Sản phẩm bạn muốn nhận xét:</label>
                                    <select
                                        value={reviewData.product_id}
                                        onChange={(e) => setReviewData({ ...reviewData, product_id: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', background: '#fcfcfc' }}
                                        required
                                    >
                                        <option value="">-- Chọn sản phẩm --</option>
                                        {orderProducts.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Chất lượng sản phẩm:</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                size={28}
                                                onClick={() => setReviewData({ ...reviewData, rating: star })}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: star <= reviewData.rating ? '#f1c40f' : '#e0e0e0',
                                                    fill: star <= reviewData.rating ? '#f1c40f' : 'transparent',
                                                    transition: 'all 0.2s ease-in-out',
                                                    transform: star <= reviewData.rating ? 'scale(1.1)' : 'scale(1)'
                                                }}
                                            />
                                        ))}
                                        <span style={{ marginLeft: '10px', fontSize: '14px', color: '#666', fontWeight: '500' }}>
                                            {reviewData.rating === 5 ? 'Tuyệt vời' :
                                                reviewData.rating === 4 ? 'Rất tốt' :
                                                    reviewData.rating === 3 ? 'Bình thường' :
                                                        reviewData.rating === 2 ? 'Kém chất lượng' : 'Rất tệ'}
                                        </span>
                                    </div>
                                </div>

                                {/* Khung nhập text bình luận */}
                                <div style={{ marginBottom: '25px' }}>
                                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Cảm nhận của bạn:</label>
                                    <textarea
                                        value={reviewData.content}
                                        onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                                        placeholder="Chia sẻ trải nghiệm thực tế của bạn về sản phẩm này nhé..."
                                        rows="4"
                                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'none', outline: 'none', background: '#fcfcfc' }}
                                        required
                                    />
                                </div>

                                {/* Thanh nút bấm điều khiển */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="button" onClick={handleCloseReviewModal} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f1f1f1', color: '#555', cursor: 'pointer', fontWeight: '600' }}>
                                        Đóng lại
                                    </button>
                                    <button type="submit" disabled={isSubmittingReview} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#4318ff', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {isSubmittingReview ? <><Loader2 className="icon-spin" size={16} /> Đang gửi...</> : 'Gửi Đánh Giá'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;