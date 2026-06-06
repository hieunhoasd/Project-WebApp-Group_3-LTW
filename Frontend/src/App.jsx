import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <section className="hero-banner">
        <div className="hero-container">
          
          {/* Khối bên trái: Toàn bộ nội dung */}
          <div className="hero-content">
            
            {/* HỘP NEON: BÂY GIỜ CHỈ CHỨA TIÊU ĐỀ */}
            <div className="glow-text-box">
              <h1 className="main-title">
                MOVE <br /> FASTER
              </h1>
              <h2 className="sub-heading">SPORT STYLE</h2>
            </div>
            
            {/* ĐOẠN MÔ TẢ ĐÃ ĐƯỢC ĐƯA RA NGOÀI HỘP NEON */}
            <p className="description">
              Khám phá bộ sưu tập thời trang thể thao mới nhất <br />
              dành cho phong cách năng động.
            </p>

            {/* Khối nút bấm nằm dưới cùng */}
            <div className="hero-actions">
              <button className="btn-primary">Mua ngay</button>
              <button className="btn-secondary">Xem sản phẩm</button>
            </div>
          </div>

          {/* Khối bên phải: Hình ảnh */}
          <div className="hero-image-wrapper">
            <img
              src="./src/assets/images/banner.png"
              alt="Velora Banner"
              className="featured-image"
            />
          </div>

        </div>
      </section>
      <Home />
      <Footer />
    </>
  );
}

export default App;