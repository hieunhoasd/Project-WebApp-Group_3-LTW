import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // (Đường dẫn lùi 1 cấp của bạn)
import { toast } from 'react-toastify';
const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    // Lấy hàm addToCart từ Context
    const { addToCart } = useCart();

    // Hàm xử lý chuyển vùng sang trang chi tiết
    const handleGoToDetail = () => {
        navigate(`/product/${product.id}`);
    };

    // Hàm xử lý thêm nhanh vào giỏ hàng khi ấn icon xe đẩy
    const handleAddToCartClick = (e) => {
        e.preventDefault(); // (Nếu có dùng thẻ Link bọc ngoài thì thêm dòng này để không bị chuyển trang)
        e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
        addToCart(product, 1);
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <div className="product-overlay" onClick={handleGoToDetail}>
                    <span className="view-detail-text">Xem chi tiết</span>
                </div>

                <img src={product.image} alt={product.name} loading="lazy" />
            </div>

            <div className="product-info">
                <span className="category-name">{product.category_name}</span>
                <h3 className="product-name" onClick={handleGoToDetail} style={{ cursor: 'pointer' }}>
                    {product.name}
                </h3>

                <div className="product-footer">
                    <p className="product-price">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                    </p>

                    {/* GẮN SỰ KIỆN onClick KÍCH HOẠT HÀM THÊM VÀO GIỎ HÀNG */}
                    <button className="btn-cart" title="Thêm vào giỏ hàng" onClick={handleAddToCartClick}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;