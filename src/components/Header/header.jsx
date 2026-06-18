import { useNavigate, useLocation, Link } from "react-router-dom";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm cuộn mượt nội bộ trang chủ (Cho nút Trang chủ và Liên hệ)
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
                {/* Click vào đây sẽ nhảy sang trang products và gắn thẻ hash định danh */}
                <li><Link to="/products#quan-ao-nam">Quần áo dành cho nam</Link></li>
                <li><Link to="/products#quan-ao-nu">Quần áo dành cho nữ</Link></li>
                <li><Link to="/products#ao-khoac">Áo khoác</Link></li>
                <li><Link to="/products#giay">Giày</Link></li>
              </ul>
            </li>            
            <li><a href="javascript:void(0)">Giới thiệu</a></li>
            {/*click đên thông tin cửa hàng*/}
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
            <button type="button" title="Tài khoản" onClick={() => navigate("/login")}>
              <img src="/src/assets/images/c.png" alt="Tài khoản" />
            </button>
          </form>
        </div>
      </header>
    </div>
  );
}

export default Header;