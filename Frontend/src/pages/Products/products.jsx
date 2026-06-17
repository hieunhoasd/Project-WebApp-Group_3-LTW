import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`);
        
        // In ra console để kiểm tra dữ liệu
        console.log("Dữ liệu API Products:", response.data);

        let data = response.data?.data || response.data;

        // Chốt chặn an toàn
        if (!Array.isArray(data)) {
          console.warn("Dữ liệu trả về không phải là mảng!", data);
          data = [];
        }

        setProducts(data);
      } catch (error) {
        console.error("Lỗi lấy sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="products-container">
      <h1 className="page-title">DANH SÁCH SẢN PHẨM</h1>

      <div className="product-grid">
        {/* Thêm check an toàn trước khi map */}
        {Array.isArray(products) && products.map((product) => (
          <div key={product.id} className="product-card" id={`product-${product.id}`}>
            <img
              src={`${import.meta.env.VITE_STORAGE_URL}${product.image}`}
              alt={product.name}
              className="product-image"
            />

            <div className="product-info">
              <h3>{product.name}</h3>

              <p>Danh mục: {product.category_name}</p>

              <p>
                Giá: {Number(product.price).toLocaleString("vi-VN")}₫
              </p>

              <p>Số lượng: {product.quantity}</p>

              <p>{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;