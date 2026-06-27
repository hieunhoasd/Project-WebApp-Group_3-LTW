import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './header.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../context/axios';

// 🌟 ĐÃ THÊM: Import các icon nét thanh hiện đại từ react-icons/fi
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

const Header = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    // 1. Lấy thông tin user đã lưu lúc đăng nhập
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 2. Gọi API lấy danh mục để hiển thị lên Menu "Sản phẩm ▾"
    const fetchHeaderCategories = async () => {
      try {
        const response = await axios.get('/categories');
        if (response.data.code === 200) {
          setCategoriesList(response.data.data);
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

    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error("Lỗi khi đăng xuất server:", error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('user_token');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <header className="header-container">
      {/* 1. Phần Logo & Slogan */}
      <Link to="/" className="header-logo-section">
        <h1 className="logo">VELORA<span className="dot">.</span></h1>
        <span className="logo-subtitle">SPORT • STYLE • YOU</span>
      </Link>

      {/* 2. Menu Điều Hướng */}
      <ul className="nav-links">
        <li><Link to="/" className="active">Trang chủ</Link></li>

        {/* NƠI HIỂN THỊ CÁC DANH MỤC LẤY TỪ API */}
        <li className="dropdown">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Sản phẩm <FiChevronDown size={16} /> {/* Mũi tên trỏ xuống đẹp hơn */}
          </Link>
          <ul className="dropdown-menu">
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`}>{cat.name}</Link>
                </li>
              ))
            ) : (
              <li style={{ padding: '8px 15px', color: '#a3aed1', fontSize: '13px' }}>Chưa có danh mục</li>
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
          <button className="search-btn" title="Tìm kiếm">
            <FiSearch size={18} /> {/* Icon Tìm kiếm */}
          </button>
        </div>

        {/* ICON GIỎ HÀNG */}
        <div
          className="cart-icon-wrapper"
          onClick={() => navigate('/cart')}
        >
          <button className="action-icon cart-btn" title="Giỏ hàng">
            <FiShoppingCart size={22} />
          </button>
          {getCartCount() > 0 && (
            <span className="cart-badge">{getCartCount()}</span>
          )}
        </div>

        {/* KIỂM TRA ĐĂNG NHẬP */}
        {user ? (
          <>
            <Link to="/user-profile" className="action-icon user-icon" title="Tài khoản của tôi" style={{ display: 'flex' }}>
              <FiUser size={22} /> {/* Icon User */}
            </Link>
            <div className="user-greeting">
              Hi, <span style={{ fontWeight: 'bold' }}>{user.firstname}</span> |{' '}
              <span
                className="logout-btn"
                onClick={handleLogout}
                style={{ cursor: 'pointer', color: '#ff4d4f', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <FiLogOut size={16} /> Đăng xuất {/* Thêm icon Đăng xuất cho ngầu */}
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