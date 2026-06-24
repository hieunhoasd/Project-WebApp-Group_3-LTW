import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';
function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="notfound-container">
            <h1 className="notfound-code">404</h1>
            <h2 className="notfound-title">Không tìm thấy trang hoặc từ chối quyền truy cập!</h2>
            <p className="notfound-desc">
                Tuyến đường bạn đang truy cập không tồn tại hoặc tài khoản của bạn không đủ đặc quyền để vào khu vực quản trị này.
            </p>
            <button className="notfound-btn" onClick={() => navigate('/')}>
                Quay về Trang Chủ
            </button>
        </div>
    );
}

export default NotFound;