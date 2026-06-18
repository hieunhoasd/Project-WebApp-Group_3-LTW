import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getProductImageUrl } from "../../utils/productImage";
import "./productDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/products/${id}`
        );

        if (response.data?.code === 404) {
          setError("Không tìm thấy sản phẩm yêu cầu.");
          setProduct(null);
          return;
        }

        const data = response.data?.data || response.data;
        setProduct(data);
        setQuantity(1);
      } catch (err) {
        if (err.response?.status === 404) {
          setError("Không tìm thấy sản phẩm yêu cầu.");
        } else {
          setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.");
        }
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    const maxQty = product?.quantity || 1;
    setQuantity(Math.min(Math.max(1, value), maxQty));
  };

  const isOutOfStock = !product || product.quantity <= 0;

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-loading">
          <div className="loading-spinner" />
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container">
        <div className="product-detail-error">
          <h1>Không tìm thấy sản phẩm</h1>
          <p>{error || "Sản phẩm không tồn tại hoặc đã bị xóa."}</p>
          <button className="btn-back" onClick={() => navigate("/products")}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <nav className="product-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>/</span>
        <Link to="/products">Sản phẩm</Link>
        <span>/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </nav>

      <div className="product-detail-layout">
        <div className="product-detail-gallery">
          <div className="product-detail-image-wrapper">
            <img
              src={getProductImageUrl(product.image)}
              alt={product.name}
              className="product-detail-image"
            />
          </div>
          <span className="product-detail-badge">{product.category_name}</span>
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">{product.category_name}</span>
          <h1 className="product-detail-name">{product.name}</h1>

          <div className="product-detail-price">
            {Number(product.price).toLocaleString("vi-VN")}₫
          </div>

          <div className="product-detail-stock">
            {isOutOfStock ? (
              <span className="stock-badge out-of-stock">Hết hàng</span>
            ) : (
              <span className="stock-badge in-stock">
                Còn {product.quantity} sản phẩm
              </span>
            )}
          </div>

          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Mã sản phẩm</span>
              <span className="meta-value">#{product.id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Trạng thái</span>
              <span className="meta-value">
                {product.status === 1 || product.status === "1"
                  ? "Đang kinh doanh"
                  : "Ngừng kinh doanh"}
              </span>
            </div>
          </div>

          {!isOutOfStock && (
            <div className="product-detail-actions">
              <div className="quantity-control">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value, 10) || 1)
                  }
                  className="qty-input"
                />
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.quantity}
                >
                  +
                </button>
              </div>

              <button type="button" className="btn-add-to-cart">
                Thêm vào giỏ hàng
              </button>
            </div>
          )}

          <button
            type="button"
            className="btn-back-outline"
            onClick={() => navigate("/products")}
          >
            ← Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
