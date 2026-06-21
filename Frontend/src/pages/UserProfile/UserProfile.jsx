import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('info');
    const [loading, setLoading] = useState(true);
    const [serverError, setServerError] = useState('');
    const [userInfo, setUserInfo] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        address: 'Chưa cập nhật địa chỉ mặc định'
    });
    useEffect(() => {
        const apiURL = import.meta.env.VITE_API_BASE_URL;

        const token = localStorage.getItem('user_token');

        axios.get(`${apiURL}/user-profile`, {
            headers: {
                'Authorization': token
            }
        })
            .then((response) => {
                if (response.data.code === 200 && response.data.user) {
                    const userData = response.data.user;
                    setUserInfo(prevState => ({
                        ...prevState,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        email: userData.email,
                        phone: userData.phone || ''
                    }));
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi lấy thông tin profile:", error);
                if (error.response && error.response.status === 401) {
                    setServerError("Vui lòng đăng nhập để xem thông tin tài khoản!");
                } else {
                    setServerError("Không thể tải thông tin profile. Vui lòng thử lại sau.");
                }
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-box" style={{ textAlign: 'center', padding: '50px' }}>🔄 Đang tải hồ sơ...</div>;
    if (serverError) return <div className="error-box" style={{ color: 'red', textAlign: 'center', padding: '50px' }}>⚠️ {serverError}</div>;

    return (
        <div className="profile-container">
            {/* Sidebar trái */}
            <div className="profile-sidebar">
                <div className="user-avatar-section">
                    <img src="https://cdn-icons-png.flaticon.com/512/3177/3177440.png" alt="Avatar" className="profile-avatar" />
                    <h3>Hi, {userInfo.firstname} {userInfo.lastname}</h3>
                    <p className="user-role">Thành viên Velora</p>
                </div>
                <div className="profile-menu">
                    <button className={`menu-item ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>👤 Thông tin cá nhân</button>
                    <button className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>📦 Lịch sử đơn hàng</button>
                </div>
            </div>

            {/* Nội dung phải */}
            <div className="profile-content">
                {activeTab === 'info' ? (
                    <div className="tab-panel animate-fade">
                        <h2>Thông Tin Tài Khoản</h2>
                        <p className="panel-subtitle">Quản lý thông tin hồ sơ của bạn</p>

                        <form className="profile-form">
                            <div className="form-group" style={{ display: 'flex', gap: '15px', flexDirection: 'row' }}>
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
                                <input type="email" value={userInfo.email} disabled className="disabled-input" />
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input type="tel" value={userInfo.phone || 'Chưa cập nhật'} readOnly className="disabled-input" />
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ giao hàng</label>
                                <textarea rows="2" value={userInfo.address} readOnly className="disabled-input"></textarea>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div className="tab-panel animate-fade">
                        <h2>Lịch Sử Đơn Hàng</h2>
                        <p className="panel-subtitle">Các đơn hàng bạn đã đặt</p>
                        <div style={{ color: '#888', padding: '20px 0' }}>Tính năng đơn hàng đang được cập nhật...</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;