import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './header.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Bổ sung thư viện axios

const Header = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  // State để lấy thông tin user từ localStorage
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user đã lưu lúc đăng nhập
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🌟 HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = async (e) => {
    e.preventDefault();
    const apiURL = import.meta.env.VITE_API_BASE_URL;

    try {
      // Gọi API báo Backend hủy Session
      await axios.post(`${apiURL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Lỗi khi đăng xuất server:", error);
    } finally {
      // Dù API thành công hay lỗi mạng, vẫn phải xóa user ở dưới Local và đá ra ngoài
      localStorage.removeItem('user');
      navigate('/login');
      window.location.reload(); // Tải lại trang để reset toàn bộ state
    }
  };

  return (
    <header className="header-container">
      {/* 1. Phần Logo & Slogan */}
      <a href="/" className="header-logo-section">
        <h1 className="logo">VELORA<span className="dot">.</span></h1>
        <span className="logo-subtitle">SPORT • STYLE • YOU</span>
      </a>

      {/* 2. Menu Điều Hướng */}
      <ul className="nav-links">
        <li><a href="/" className="active">Trang chủ</a></li>

        <li className="dropdown">
          <a href="/shop">Sản phẩm ▾</a>
          <ul className="dropdown-menu">
            <li><a href="/category/ao-nam">Áo Nam</a></li>
            <li><a href="/category/quan-nam">Quần Nam</a></li>
            <li><a href="/category/ao-nu">Áo Nữ</a></li>
            <li><a href="/category/quan-nu">Quần Nữ</a></li>
            <li><a href="/category/do-the-thao">Đồ thể thao</a></li>
            <li><a href="/category/phu-kien">Phụ kiện</a></li>
          </ul>
        </li>

        <li><a href="/about">Giới thiệu</a></li>
        <li><a href="/contact">Liên hệ</a></li>
      </ul>

      {/* 3. Khu vực Tìm kiếm & Chức năng */}
      <div className="header-actions">
        <div className="search-box">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button className="search-btn" title="Tìm kiếm">🔍</button>
        </div>

        <div
          className="cart-icon-wrapper"
          style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
          onClick={() => navigate('/cart')}
        >
          <button className="action-icon" title="Giỏ hàng" style={{ pointerEvents: 'none' }}>
            🛒
          </button>
          {getCartCount() > 0 && (
            <span className="cart-badge">{getCartCount()}</span>
          )}
        </div>

        {/* 🌟 KIỂM TRA ĐĂNG NHẬP ĐỂ HIỂN THỊ ICON USER HOẶC NÚT LOGIN */}
        {user ? (
          <>
            <a href="/user-profile" className="action-icon user-icon" title="Tài khoản của tôi">
              👤
            </a>
            <div className="user-greeting">
              Hi, <span style={{ fontWeight: 'bold' }}>{user.firstname}</span> |{' '}
              {/* Đổi thẻ a href thành span có onClick */}
              <span className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff4d4f' }}>
                Đăng xuất
              </span>
            </div>
          </>
        ) : (
          <div className="user-greeting">
            <a href="/login" className="login-link-btn" style={{ fontWeight: 'bold' }}>Đăng nhập</a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;