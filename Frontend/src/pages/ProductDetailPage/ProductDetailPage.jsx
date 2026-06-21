import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';

// 1. IMPORT THÊM THƯ VIỆN TOAST VÀO ĐÂY
import { toast } from 'react-toastify';

// SỬA LẠI ĐƯỜNG DẪN 2 CẤP CHÍNH XÁC TẠI ĐÂY
import { useCart } from '../../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // Lấy hàm addToCart từ Context ra để sử dụng
    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:8000/api/products/${id}`)
            .then((res) => res.json())
            .then((resData) => {
                if (resData.code === 200) {
                    setProduct(resData.data);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi lấy chi tiết sản phẩm:", err);
                setLoading(false);
            });
    }, [id]);

    // Hàm xử lý sự kiện click nút thêm vào giỏ hàng
    const handleAddToCartClick = () => {
        if (product) {
            addToCart(product, 1); // Thêm sản phẩm hiện tại với số lượng mặc định là 1

            // 2. GỌI TOAST XỊN XÒ THAY CHO ALERT
            toast.success(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
        }
    };

    if (loading) return <div className="detail-loading">Đang tải thông tin sản phẩm...</div>;
    if (!product) return <div className="detail-error">Không tìm thấy sản phẩm yêu cầu!</div>;

    return (
        <>
            {/* 1. HIỂN THỊ HEADER TRÊN CÙNG */}
            <Header />

            {/* Nội dung chi tiết sản phẩm ở giữa */}
            <div className="product-detail-container">

                <div className="detail-layout">
                    {/* Khối bên trái: Hình ảnh */}
                    <div className="detail-image-section">
                        <img src={product.image} alt={product.name} />
                    </div>

                    {/* Khối bên phải: Thông tin chi tiết */}
                    <div className="detail-info-section">
                        <span className="detail-category">{product.category_name}</span>
                        <h1 className="detail-title">{product.name}</h1>

                        <p className="detail-price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </p>

                        <hr />

                        <div className="detail-description">
                            <h3>Mô tả sản phẩm:</h3>
                            <p>{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                        </div>

                        <div className="detail-status-group">
                            <p>Trạng thái: <span className="status-instock">{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span> ({product.quantity} sản phẩm)</p>
                        </div>

                        {/* Gắn sự kiện click kích hoạt hàm handleAddToCartClick */}
                        <button className="btn-add-to-cart" onClick={handleAddToCartClick}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* 2. HIỂN THỊ FOOTER DƯỚI CÙNG */}
            <Footer />
        </>
    );
};

export default ProductDetailPage;