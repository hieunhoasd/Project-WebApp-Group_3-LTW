import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import './home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  // State quản lý số lượng sản phẩm đang hiển thị (mặc định ban đầu là 20)
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/products')
      .then(res => res.json())
      .then(resData => {
        if (resData.code === 200) {
          setProducts(resData.data);
        }
      })
      .catch(err => console.error("Lỗi lấy data:", err));
  }, []);

  // Hàm xử lý khi click vào nút "Xem thêm"
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 20);
  };

  return (
    <div className="home-page-container">
      <div className="hero-banner">
        <h1>VELORA <span className="highlight">STORE</span></h1>
        <p>Khám phá bộ sưu tập thời trang thể thao cao cấp. Nâng tầm phong cách và hiệu suất tập luyện của bạn ngay hôm nay.</p>
        <button className="btn-primary">Mua ngay</button>
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
              Xem thêm sản phẩm
              <span className="arrow-down"> ↓</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;