import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('user_token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Kiểm tra: Nếu không có token HOẶC không có thông tin user HOẶC isAdmin không phải true
    if (!token || !user || !user.isAdmin) {
        // Redirect ngay lập tức sang trang 404 trước khi DOM con kịp render
        return <Navigate to="/404" replace />;
    }

    // Nếu thỏa mãn là Admin, cho phép load DOM của trang AdminPage
    return children;
};

export default AdminRoute;