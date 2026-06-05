import "./header.css"

function Header() {
  return (
     <div className="container">
        <header>
            <div className="search">
                <form>
                    <input type="text" placeholder="Tìm kiếm sản phẩm" />
                    <button type="submit">
                        <img src="././src/assets/images/a.png" alt="Tìm kiếm" />
                    </button>
                </form>
                <form>
                <div>
                    <button type="button" className="cart-button">
                            <img src="././src/assets/images/b.png" alt="Giỏ hàng" />
                    </button>
                    <button type="button" className="account-button">
                            <img src="././src/assets/images/c.png" alt="Đăng kí" />
                    </button>
                </div>
                </form>
            </div>  
        </header>
        <nav>
            <ul>
                <li><a href="#">Trang chủ</a></li>
                <li><a href="#">Sản phẩm</a></li>
                <li><a href="#">Giới thiệu</a></li>
                <li><a href="#">Liên hệ</a></li>
            </ul>
        </nav>
     </div>
        
  );
}

export default Header;