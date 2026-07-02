import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const toastSuccessStyle = {
        style: {
            borderRadius: '10px',
            background: '#ffffff',
            color: '#2b3674',
            boxShadow: '0 10px 25px rgba(67, 24, 255, 0.08)',
            fontWeight: '550',
            fontSize: '14px',
            padding: '12px 20px',
            border: '1px solid rgba(67, 24, 255, 0.1)'
        },
        iconTheme: { primary: '#4318ff', secondary: '#ffffff' },
    };

    const handleGoToDetail = () => navigate(`/product/${product.id}`);

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, 1);
        toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, toastSuccessStyle);
    };

    const handleWishlist = (e) => {
        e.stopPropagation();
        toast.success('Đã lưu vào danh sách yêu thích!', toastSuccessStyle);
    };

    const formatPrice = (price) => {
        if (!price) return '0đ';
        return price.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <div className="product-card">
            {/* 1. ẢNH VÀ ICON */}
            <div className="product-img-wrapper" onClick={handleGoToDetail}>
                <div className="card-badge badge-red">-20%</div>

                <button className="icon-btn top-right" onClick={handleWishlist} title="Yêu thích">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </button>

                <button className="icon-btn bottom-right" onClick={(e) => { e.stopPropagation(); handleGoToDetail(); }} title="Xem nhanh">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                </button>

                <img src={product.image} alt={product.name} loading="lazy" />
            </div>

            {/* 2. THÔNG TIN */}
            <div className="product-content">
                <span className="category-text">{product.category_name || 'QUẦN NAM'}</span>
                
                <h3 className="product-title" onClick={handleGoToDetail}>
                    {product.name}
                </h3>

                <div className="rating-row">
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg key={star} width="12" height="12" fill="#facc15" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                        ))}
                    </div>
                    <span className="review-count">(128)</span>
                </div>

                <div className="price-row">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.price && (
                        <span className="old-price">{formatPrice(product.price * 1.25)}</span>
                    )}
                </div>

                {/* 3. NÚT MUA */}
                <div className="action-row">
                    <button className="btn-add-main" onClick={handleAddToCartClick}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                        <span className="btn-text">Thêm vào giỏ</span>
                    </button>
                    <button className="btn-wishlist-square" onClick={handleWishlist}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;