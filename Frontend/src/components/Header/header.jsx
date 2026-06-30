import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import './header.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../context/axios';


// 🌟 Import thêm FiMenu và FiX để làm nút bấm cho giao diện Mobile
import { FiSearch, FiShoppingCart, FiUser, FiLogOut, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  
  // 🌟 State mới để quản lý việc đóng/mở menu trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

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

  // Hàm tiện ích: Đóng menu mobile khi click vào một link bất kỳ
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="header-container">
      {/* 1. Phần Logo & Slogan */}
      <Link to="/" className="header-logo-section" onClick={closeMobileMenu}>
        <h1 className="logo">VELORA<span className="dot">.</span></h1>
        <span className="logo-subtitle">SPORT • STYLE • YOU</span>
      </Link>

      {/* 2. Menu Điều Hướng (Thêm class mobile-active khi nút được bấm) */}
      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><Link to="/" className="active" onClick={closeMobileMenu}>Trang chủ</Link></li>

        <li className="dropdown">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Sản phẩm <FiChevronDown size={16} />
          </Link>
          <ul className="dropdown-menu">
            {categoriesList.length > 0 ? (
              categoriesList.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.id}`} onClick={closeMobileMenu}>{cat.name}</Link>
                </li>
              ))
            ) : (
              <li style={{ padding: '8px 15px', color: '#a3aed1', fontSize: '13px' }}>Chưa có danh mục</li>
            )}
          </ul>
        </li>

        <li><Link to="/about" onClick={closeMobileMenu}>Giới thiệu</Link></li>
        <li><Link to="/contact" onClick={closeMobileMenu}>Liên hệ</Link></li>
      </ul>

      {/* 3. Khu vực Tìm kiếm & Chức năng */}
      <div className="header-actions">
        <div className="search-box">
          <input type="text" placeholder="Tìm kiếm sản phẩm..." />
          <button className="search-btn" title="Tìm kiếm">
            <FiSearch size={18} />
          </button>
        </div>

        <div className="cart-icon-wrapper" onClick={() => navigate('/cart')}>
          <button className="action-icon cart-btn" title="Giỏ hàng">
            <FiShoppingCart size={22} />
          </button>
          {getCartCount() > 0 && (
            <span className="cart-badge">{getCartCount()}</span>
          )}
        </div>

        {user ? (
          <>
            <Link to="/user-profile" className="action-icon user-icon" title="Tài khoản của tôi">
              <FiUser size={22} />
            </Link>
            {/* Thêm class text-hide-mobile để ẩn phần text này trên điện thoại */}
            <div className="user-greeting text-hide-mobile">
              Hi, <span style={{ fontWeight: 'bold' }}>{user.firstname}</span> |{' '}
              <span className="logout-btn" onClick={handleLogout} style={{ cursor: 'pointer', color: '#ff4d4f', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <FiLogOut size={16} /> Thoát
              </span>
            </div>
          </>
        ) : (
          <Link to="/login" className="action-icon login-btn" title="Đăng nhập">
            <FiUser size={22} />
          </Link>
        )}
        

        {/* 🌟 NÚT HAMBURGER (Chỉ hiện ra khi ở giao diện Mobile) */}
        <div className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </div>
      </div>
    </header>
  );
};

export default Header;