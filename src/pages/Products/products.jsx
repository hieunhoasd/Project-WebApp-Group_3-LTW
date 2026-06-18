import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getProductImageUrl } from "../../utils/productImage";
import "./products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products`
        );

        let data = response.data?.data || response.data;

        if (!Array.isArray(data)) {
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
        {Array.isArray(products) &&
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              id={`product-${product.id}`}
            >
              <div className="product-image">
                <img
                  src={getProductImageUrl(product.image)}
                  alt={product.name}
                />

                <div className="product-overlay">
                  <Link
                    to={`/products/${product.id}`}
                    className="btn-view"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>

                <p className="product-category">Danh mục: {product.category_name}</p>

                <p className="product-description">
                  {product.description?.length > 80
                    ? `${product.description.slice(0, 80)}...`
                    : product.description}
                </p>

                <div className="product-footer">
                  <span className="product-price">
                    {Number(product.price).toLocaleString("vi-VN")}₫
                  </span>

                  <Link
                    to={`/products/${product.id}`}
                    className="btn-add-cart"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Products;
