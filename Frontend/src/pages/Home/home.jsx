import './home.css';

const products = [
  {
    id: 1,
    name: "Áo Thun Thể Thao Nam",
    price: "250.000",
    originalPrice: "350.000",
    image: "./src/assets/images/1.jpg",
    badge: "Bán Chạy",
    rating: 4.8,
    sold: 1250,
    discount: 28
  },
  {
    id: 2,
    name: "Giày Thể Thao Nike",
    price: "850.000",
    originalPrice: "1.200.000",
    image: "./src/assets/images/2.webp",
    badge: "Mới",
    rating: 4.9,
    sold: 340,
    discount: 29
  },
  {
    id: 3,
    name: "Quần Jogger Premium",
    price: "320.000",
    originalPrice: "450.000",
    image: "./src/assets/images/3.jpg",
    badge: "",
    rating: 4.7,
    sold: 850,
    discount: 29
  },
  {
    id: 4,
    name: "Áo Khoác Gió Move Faster",
    price: "450.000",
    originalPrice: "650.000",
    image: "./src/assets/images/4.jpg",
    badge: "Bán chạy",
    rating: 4.6,
    sold: 2100,
    discount: 31
  },
  {
    id: 5,
    name: "Áo Giữ Nhiệt Nam",
    price: "550.000",
    originalPrice: "750.000",
    image: "./src/assets/images/5.jpg",
    badge: "",
    rating: 4.5,
    sold: 620,
    discount: 27
  },
  {
    id: 6,
    name: "Quần Shorts Thể Thao",
    price: "200.000",
    originalPrice: "320.000",
    image: "./src/assets/images/6.jpg",
    badge: "Bán chạy",
    rating: 4.6,
    sold: 1420,
    discount: 37
  },
  {
    id: 7,
    name: "Áo Thun Polo Thể Thao",
    price: "280.000",
    originalPrice: "420.000",
    image: "./src/assets/images/7.jpg",
    badge: "",
    rating: 4.7,
    sold: 760,
    discount: 33
  },
  {
    id: 8,
    name: "Quần Legging Nữ Cao Cấp",
    price: "380.000",
    originalPrice: "550.000",
    image: "./src/assets/images/8.webp",
    badge: "Hot",
    rating: 4.9,
    sold: 1890,
    discount: 31
  },
  {
    id: 9,
    name: "Áo Thun Tay Dài Basic",
    price: "220.000",
    originalPrice: "350.000",
    image: "./src/assets/images/9.jpg",
    badge: "",
    rating: 4.6,
    sold: 920,
    discount: 37
  },
  {
    id: 10,
    name: "Giày Sneaker High Top",
    price: "720.000",
    originalPrice: "1.100.000",
    image: "./src/assets/images/10.webp",
    badge: "Mới",
    rating: 4.8,
    sold: 540,
    discount: 35
  },
];

const recentProducts = [
  {
    id: 20,
    name: "Áo Tank Top",
    price: "150.000",
    image: "./src/assets/images/20.jpg",
    rating: 4.5,
    sold: 540
  },
  {
    id: 21,
    name: "Áo Phông Oversize",
    price: "320.000",
    image: "./src/assets/images/21.webp",
    rating: 4.8,
    sold: 890
  },
  {
    id: 22,
    name: "Jacket Denim",
    price: "480.000",
    image: "./src/assets/images/22.webp",
    rating: 4.9,
    sold: 1100
  },
  {
    id: 23,
    name: "Áo Khoác Sport",
    price: "650.000",
    image: "./src/assets/images/23.jpg",
    rating: 4.7,
    sold: 340
  },
  {
    id: 24,
    name: "Quần Tây Formal",
    price: "420.000",
    image: "./src/assets/images/24.webp",
    rating: 4.6,
    sold: 620
  },
  {
    id: 25,
    name: "Giày Sneaker Trail",
    price: "750.000",
    image: "./src/assets/images/25.jpg",
    rating: 4.9,
    sold: 980
  },
];

function Home() {
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

            {/* Thông tin sản phẩm */}
            <div className="info-box">
              <h3 className="product-name">{product.name}</h3>
              
              {/* Đánh giá và số lượng đã bán */}
              <div className="product-stats">
                <div className="rating">
                  <span className="stars">★</span>
                  <span className="rating-value">{product.rating}</span>
                </div>
                <span className="sold-count">Đã bán {product.sold.toLocaleString('vi-VN')}</span>
              </div>

              {/* Giá tiền và nút cộng */}
              <div className="price-row">
                <p className="product-price">{product.price}₫</p>
                <p className="original-price">{product.originalPrice}₫</p>
              </div>
              <button className="add-to-cart-icon">+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Phần sản phẩm được xem - Cuộn ngang */}
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
                  <span className="h-sold">Đã bán {product.sold.toLocaleString('vi-VN')}</span>
                </div>
                
                <p className="horizontal-price">{product.price}₫</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;