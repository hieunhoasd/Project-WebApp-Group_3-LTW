import { useNavigate } from "react-router-dom";
import "./header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header>
        <div className="logo">
          <h1>VELORA</h1>
          <p>SPORT • STYLE • YOU</p>
        </div>

        <nav>
          <ul className="main-menu">
            <li><a href="#">Trang chủ</a></li>
            <li className="dropdown">
              <a href="#">Sản phẩm ▾</a>
              <ul className="dropdown-menu">
                <li><a href="#">Áo dành cho nam</a></li>
                <li><a href="#">Áo dành cho nữ</a></li>
                <li><a href="#">Áo khoác</a></li>
                <li><a href="#">Quần unisex</a></li>
                <li><a href="#">Giày</a></li>
              </ul>
            </li>            
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </nav>

        <div className="search">
          <form>
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