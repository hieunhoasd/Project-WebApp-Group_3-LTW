import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import './home.css';

const Home = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState([]);
  // State quản lý số lượng sản phẩm đang hiển thị (mặc định ban đầu là 20)
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    fetch(`${apiBaseUrl}/products`)
      .then(res => res.json())
      .then(resData => {
        if (resData.code === 200) {
          setProducts(resData.data);
        }
      })
      .catch(err => console.error("Lỗi lấy data:", err));
  }, [apiBaseUrl]);

  // Hàm xử lý khi click vào nút "Xem thêm"
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 20);
  };

  return (
    <div className="home-page-container">
      {/* KHU VỰC BANNER ĐÃ ĐƯỢC TÙY CHỈNH NỔI BẬT HƠN */}
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>VELORA <span className="highlight">STORE</span></h1>
          <p>Khám phá bộ sưu tập thời trang thể thao cao cấp. Nâng tầm phong cách và hiệu suất tập luyện của bạn ngay hôm nay.</p>
          <button className="btn-primary">Mua ngay</button>
        </div>
      </div>

      <div className="container">
        <h2 className="section-title">Sản phẩm nổi bật</h2>

        <div className="product-grid">
          {products.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products.length > visibleCount && (
          <div className="load-more-container">
            <button className="btn-load-more" onClick={handleLoadMore}>
              Xem tất cả sản phẩm nổi bật
              <span className="arrow-down"> ↓</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;