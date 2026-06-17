import { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      const apiURL = import.meta.env.VITE_API_BASE_URL;
      try {
        const response = await axios.get(`${apiURL}/products`);
        if (response.data.code === 200) {
          const allProducts = response.data.data;

          // Lấy 10 sản phẩm đầu tiên làm Sản phẩm nổi bật
          setProducts(allProducts.slice(0, 10));

          // Lấy 6 sản phẩm ngẫu nhiên hoặc sản phẩm mới nhất làm phần Quan tâm
          setRecentProducts(allProducts.slice().reverse().slice(0, 6));
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu sản phẩm từ Server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <div className="loading-text" style={{ color: '#fff', textAlign: 'center', padding: '100px 0' }}>Đang tải danh sách sản phẩm Velora...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <span className="eyebrow">Featured Collection</span>
        <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
        <p className="section-subtitle">Định hình phong cách năng động của bạn</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="image-container">
              {product.badge && <span className="product-badge">{product.badge}</span>}
              {product.discount && <span className="discount-badge">-{product.discount}%</span>}
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="card-overlay">
                <button className="btn-quickview">Xem Nhanh</button>
              </div>
            </div>

            <div className="info-box">
              <h3 className="product-name">{product.name}</h3>

              <div className="product-stats">
                <div className="rating">
                  <span className="stars">★</span>
                  <span className="rating-value">{product.rating}</span>
                </div>
                <span className="sold-count">Đã bán {Number(product.sold || 0).toLocaleString('vi-VN')}</span>
              </div>

              <div className="price-row">
                <p className="product-price">{Number(product.price || 0).toLocaleString('vi-VN')}₫</p>
                {product.originalPrice && (
                  <p className="original-price">{Number(product.originalPrice).toLocaleString('vi-VN')}₫</p>
                )}
              </div>
              <button className="add-to-cart-icon">+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="viewed-section">
        <div className="viewed-header">
          <h2 className="viewed-title">Có thể bạn quan tâm</h2>
        </div>

        <div className="horizontal-scroll">
          {recentProducts.map((product) => (
            <div key={product.id} className="horizontal-product-card">
              <div className="horizontal-image">
                <img src={product.image} alt={product.name} className="horizontal-product-image" />
              </div>

              <div className="horizontal-info">
                <h4 className="horizontal-name">{product.name}</h4>

                <div className="horizontal-stats">
                  <div className="horizontal-rating">
                    <span className="h-stars">★</span>
                    <span className="h-rating-value">{product.rating}</span>
                  </div>
                  <span className="h-sold">Đã bán {Number(product.sold || 0).toLocaleString('vi-VN')}</span>
                </div>

                <p className="horizontal-price">{Number(product.price || 0).toLocaleString('vi-VN')}₫</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;