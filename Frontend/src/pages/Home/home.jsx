import './home.css'; 

const products = [
  {
    id: 2,
    name: "Giày Bata SpeedX Neon",
    price: "850.000 ₫",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=600",
    badge: "Mới"
  },
  {
    id: 3,
    name: "Quần Jogger Active GenZ",
    price: "320.000 ₫",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&q=80&w=600",
    badge: ""
  },
  {
    id: 4,
    name: "Áo Khoác Gió Move Faster",
    price: "450.000 ₫",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
    badge: "Bán chạy"
  },
  {
    id: 5,
    name: "Hoodie CyberPunk Đen",
    price: "550.000 ₫",
    image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=600",
    badge: ""
  },
  {
    id: 6,
    name: "Túi Trống Tập Gym Velora",
    price: "290.000 ₫",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    badge: "Sale"
  },
  {
    id: 7,
    name: "Mũ Lưỡi Trai Sport Cap",
    price: "150.000 ₫",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600",
    badge: ""
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
              <img src={product.image} alt={product.name} className="product-image" />
            </div>

            {/* Thông tin sản phẩm - Đã đổi cấu trúc */}
            <div className="info-box">
              <h3 className="product-name">{product.name}</h3>
              
              {/* Gom giá tiền và nút dấu + vào chung một hàng ngang */}
              <div className="price-row">
                <p className="product-price">{product.price}</p>
                <button className="add-to-cart-icon" title="Thêm vào giỏ hàng">+</button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;