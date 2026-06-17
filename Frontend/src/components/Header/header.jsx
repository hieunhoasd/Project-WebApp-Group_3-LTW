import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="container">
      <header>
        <div className="logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          <h1>VELORA</h1>
          <p>SPORT • STYLE • YOU</p>
        </div>

        <nav>
          <ul className="main-menu">
            <li>
              <a href="javascript:void(0)" onClick={() => handleScrollToSection("top")} className="menu-item-btn">
                Trang chủ
              </a>
            </li>

            <li className="dropdown">
              <a href="javascript:void(0)">Sản phẩm ▾</a>
              <ul className="dropdown-menu">
                <li><Link to="/products#quan-ao-nam">Quần áo dành cho nam</Link></li>
                <li><Link to="/products#quan-ao-nu">Quần áo dành cho nữ</Link></li>
                <li><Link to="/products#ao-khoac">Áo khoác</Link></li>
                <li><Link to="/products#giay">Giày</Link></li>
              </ul>
            </li>
            <li><a href="javascript:void(0)">Giới thiệu</a></li>
            <li>
              <a href="javascript:void(0)" onClick={() => handleScrollToSection("thong-tin-cua-hang")} className="menu-item-btn">
                Liên hệ
              </a>
            </li>
          </ul>
        </nav>

        <div className="search">
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Tìm kiếm..." />
            <button type="submit" title="Tìm kiếm">
              <img src="/src/assets/images/a.png" alt="Tìm kiếm" />
            </button>
            <button type="button" title="Giỏ hàng">
              <img src="/src/assets/images/b.png" alt="Giỏ hàng" />
            </button>

            {user ? (
              <div className="user-logged-box">
                <span className="user-name">Hi, {user.fullname}</span>
                <span className="logout-link" onClick={handleLogout}>Đăng xuất</span>
              </div>
            ) : (
              <button type="button" title="Tài khoản" onClick={() => navigate("/login")}>
                <img src="/src/assets/images/c.png" alt="Tài khoản" />
              </button>
            )}
          </form>
        </div>
      </header>
    </div>
  );
}

export default Header;