import { useEffect, useState } from "react";
import axios from "axios";
import "./home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        
        // In ra console để xem Backend thực sự trả về cái gì
        console.log("Dữ liệu API Home:", response.data);
        
        let data = response.data?.data || response.data;

        // Chốt chặn an toàn: Nếu data không phải là mảng, ép nó thành mảng rỗng
        if (!Array.isArray(data)) {
          console.warn("Dữ liệu trả về không phải là mảng!", data);
          data = []; 
        }

        setProducts(data);
        setRecentProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <span className="eyebrow">Featured Collection</span>
        <h2 className="section-title">SẢN PHẨM NỔI BẬT</h2>
        <p className="section-subtitle">Định hình phong cách năng động của bạn</p>
      </div>

      <div className="product-grid">
        {/* Thêm check an toàn trước khi map */}
        {Array.isArray(products) && products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="image-container">
              <span className="product-badge">{product.category_name}</span>

              <img
                src={`${import.meta.env.VITE_STORAGE_URL}${product.image}`}
                alt={product.name}
                className="product-image"
              />

              <div className="card-overlay">
                <button className="btn-quickview">Xem Nhanh</button>
              </div>
            </div>

            <div className="info-box">
              <h3 className="product-name">{product.name}</h3>

              <p className="product-price">
                {Number(product.price).toLocaleString("vi-VN")}₫
              </p>

              <p>Còn lại: {product.quantity}</p>

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
          {/* Thêm check an toàn trước khi map */}
          {Array.isArray(recentProducts) && recentProducts.map((product) => (
            <div key={product.id} className="horizontal-product-card">
              <div className="horizontal-image">
                <img
                  src={`${import.meta.env.VITE_STORAGE_URL}${product.image}`}
                  alt={product.name}
                  className="horizontal-product-image"
                />
              </div>

              <div className="horizontal-info">
                <h4 className="horizontal-name">{product.name}</h4>

                <p className="horizontal-price">
                  {Number(product.price).toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;