import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import Home from "./pages/Home/home";
import Login from "./pages/Login/login";
import Products from "./pages/Products/products";
import ProductDetail from "./pages/ProductDetail/productDetail";
import Userprofile from "./pages/Userprofile/userprofile";
import "./App.css";




const HomePage = () => {
  return (
    <>
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
              src="/src/assets/images/banner.png"
              alt="Velora Banner"
              className="featured-image"
            />
          </div>

        </div>
      </section>
      <Home />
    </>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Userprofile />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;