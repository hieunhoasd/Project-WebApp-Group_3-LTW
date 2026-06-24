import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './header.css';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link để điều hướng mượt mà
import axios from 'axios';

const Header = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  // State quản lý thông tin user và danh sách danh mục từ Database
  const [user, setUser] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]); // State mới lưu danh mục

  useEffect(() => {
    // 1. Lấy thông tin user đã lưu lúc đăng nhập
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Gọi API lấy danh mục động từ Backend
    const fetchHeaderCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/admin/categories');
        const result = await response.json();
        if (result.code === 200) {
          setCategoriesList(result.data);
        }
      } catch (error) {
        console.error("Lỗi lấy danh mục tại Header:", error);
      }
    };

    fetchHeaderCategories();
  }, []);

  // 🌟 HÀM XỬ LÝ ĐĂNG XUẤT
  const handleLogout = async (e) => {
    e.preventDefault();
    const apiURL = import.meta.env.VITE_API_BASE_URL;

    try {
      await axios.post(`${apiURL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Lỗi khi đăng xuất server:", error);
    } finally {
      localStorage.removeItem('user');
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <header className="header-container">
      {/* 1. Phần Logo & Slogan (Dùng Link thay vì thẻ a) */}
      <Link to="/" className="header-logo-section">
        <h1 className="logo">VELORA<span className="dot">.</span></h1>
        <span className="logo-subtitle">SPORT • STYLE • YOU</span>
      </Link>

      {/* 2. Menu Điều Hướng */}
      <ul className="nav-links">
        <li><Link to="/" className="active">Trang chủ</Link></li>

        <li className="dropdown">
          <Link to="/">Sản phẩm ▾</Link>
          <ul className="dropdown-menu">
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => (
                <li key={cat.id}>
                  {/* Đường dẫn truyền ID chuẩn sang CategoryPage */}
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))
            ) : (
              <li style={{ padding: '8px 15px', color: '#a3aed1', fontSize: '13px' }}>Đang tải...</li>
            )}
          </ul>
        </li>

        <li><Link to="/about">Giới thiệu</Link></li>
        <li><Link to="/contact">Liên hệ</Link></li>
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

        {/* 🌟 KIỂM TRA ĐĂNG NHẬP */}
        {user ? (
          <>
            <Link to="/user-profile" className="action-icon user-icon" title="Tài khoản của tôi">
              👤
            </Link>
            <div className="user-greeting">
              Hi, <span style={{ fontWeight: 'bold' }}>{user.firstname}</span> |{' '}
              <span className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff4d4f' }}>
                Đăng xuất
              </span>
            </div>
          </>
        ) : (
          <div className="user-greeting">
            <Link to="/login" className="login-link-btn" style={{ fontWeight: 'bold' }}>Đăng nhập</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;