import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./products.css"; // File CSS của trang sản phẩm bạn đang dùng

function Products() {
  const location = useLocation();

  useEffect(() => {
    // Nếu trên URL có hash (ví dụ: #ao-khoac)
    if (location.hash) {
      // Bỏ dấu '#' đi để lấy đúng tên ID
      const id = location.hash.replace("#", ""); 
      const element = document.getElementById(id);
      
      if (element) {
        // Đợi một chút ngắn để đảm bảo giao diện đã render xong hoàn toàn
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [location]); // Chạy lại mỗi khi URL thay đổi

  return (
    <div className="products-container">
      <h1 className="page-title">DANH SÁCH SẢN PHẨM</h1>

      {/* 1. KHU VỰC QUẦN ÁO NAM */}
      <section id="quan-ao-nam" className="product-section">
        <h2>Quần áo dành cho Nam</h2>
        <div className="product-list-mock">
          {/* Map danh sách hoặc render sản phẩm Nam của bạn ở đây */}
          <p>Danh sách sản phẩm Nam...</p>
        </div>
      </section>

      {/* 2. KHU VỰC QUẦN ÁO NỮ */}
      <section id="quan-ao-nu" className="product-section">
        <h2>Quần áo dành cho Nữ</h2>
        <div className="product-list-mock">
          {/* Map danh sách sản phẩm Nữ ở đây */}
          <p>Danh sách sản phẩm Nữ...</p>
        </div>
      </section>

      {/* 3. KHU VỰC ÁO KHOÁC */}
      <section id="ao-khoac" className="product-section">
        <h2>Áo Khoác</h2>
        <div className="product-list-mock">
          {/* Map danh sách Áo khoác ở đây */}
          <p>Danh sách Áo khoác...</p>
        </div>
      </section>

      {/* 4. KHU VỰC GIÀY */}
      <section id="giay" className="product-section">
        <h2>Giày Thể Thao</h2>
        <div className="product-list-mock">
          {/* Map danh sách Giày ở đây */}
          <p>Danh sách Giày...</p>
        </div>
      </section>
    </div>
  );
}

export default Products;