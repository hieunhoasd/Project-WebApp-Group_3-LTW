import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Kiểm tra xem URL có tham số yêu cầu mở form đánh giá không
    const isOpenReview = searchParams.get('openReview') === 'true';

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- STATE CHO PHẦN BÌNH LUẬN ---
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [rating, setRating] = useState(5);

    const userInfo = JSON.parse(localStorage.getItem('user'));
    // Lấy token để xác thực gửi comment (Lưu ý: Đổi 'token' thành key bạn đang dùng trong localStorage)
    const token = localStorage.getItem('token') || localStorage.getItem('user_token');

    const { addToCart } = useCart();

    useEffect(() => {
        fetchProductData();
    }, [id, apiBaseUrl]);

    // Gộp chung hàm gọi API để lấy cả chi tiết sản phẩm + bình luận
    const fetchProductData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${apiBaseUrl}/products/${id}`);
            const resData = await res.json();

            if (resData.code === 200) {
                // Thừa hưởng dữ liệu theo đúng cấu trúc Backend mới trả về
                setProduct(resData.data.product);
                setComments(resData.data.comments);
            }
        } catch (err) {
            console.error("Lỗi lấy dữ liệu sản phẩm:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCartClick = () => {
        if (product) {
            addToCart(product, 1);
            toast.success(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
        }
    };

    // --- HÀM XỬ LÝ GỬI BÌNH LUẬN MỚI ---
    const handleCommentSubmit = async (e) => {
        e.preventDefault();

        if (!userInfo || !token) {
            toast.warning("Vui lòng đăng nhập để đánh giá sản phẩm!");
            return;
        }

        if (!newComment.trim()) {
            toast.warning("Vui lòng nhập nội dung bình luận!");
            return;
        }

        try {
            const response = await fetch(`${apiBaseUrl}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    // Đính kèm Token bảo mật để Backend Sanctum nhận diện User
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: id,
                    content: newComment,
                    rating: rating
                })
            });

            const data = await response.json();

            if (data.code === 200) {
                toast.success(data.message || "Cảm ơn bạn đã đánh giá sản phẩm!");
                setNewComment("");
                setRating(5);
                fetchProductData(); // Load lại data để cập nhật sao và danh sách comment
            } else {
                toast.error(data.message || "Không thể gửi bình luận");
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
            toast.error("Lỗi kết nối đến server!");
        }
    };

    if (loading) return <div className="detail-loading">Đang tải thông tin sản phẩm...</div>;
    if (!product) return <div className="detail-error">Không tìm thấy sản phẩm yêu cầu!</div>;

    return (
        <>
            <Header />

            <div className="product-detail-container">
                <div className="detail-layout">
                    {/* KHU VỰC ẢNH VÀ CHI TIẾT SẢN PHẨM */}
                    <div className="detail-image-section">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="detail-info-section">
                        <span className="detail-category">{product.category_name}</span>
                        <h1 className="detail-title">{product.name}</h1>
                        <p className="detail-price">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </p>

                        {/* HIỂN THỊ SỐ SAO TRUNG BÌNH */}
                        <div style={{ margin: '10px 0', color: '#ffc107', fontSize: '18px' }}>
                            <span style={{ fontWeight: 'bold', color: '#333', marginRight: '8px' }}>{product.average_rating} ⭐</span>
                            <span style={{ fontSize: '14px', color: '#888' }}>({product.total_reviews} đánh giá)</span>
                        </div>

                        <hr />
                        <div className="detail-description">
                            <h3>Mô tả sản phẩm:</h3>
                            <p>{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                        </div>
                        <div className="detail-status-group">
                            <p>Trạng thái: <span className="status-instock">{product.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</span> ({product.quantity} sản phẩm)</p>
                        </div>
                        <button className="btn-add-to-cart" onClick={handleAddToCartClick}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>

                {/* --- KHU VỰC ĐÁNH GIÁ VÀ BÌNH LUẬN --- */}
                <div className="product-reviews-section" style={{ marginTop: '50px', padding: '20px', borderTop: '1px solid #eee' }}>
                    <h2>Đánh giá & Bình luận</h2>

                    {/* CHỈ HIỂN THỊ FORM NẾU CÓ THAM SỐ openReview (Từ trang Lịch sử đơn hàng qua) */}
                    {isOpenReview && (
                        <form onSubmit={handleCommentSubmit} className="review-form" style={{ marginBottom: '30px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
                            <h3 style={{ marginTop: 0, color: '#333' }}>Viết đánh giá của bạn</h3>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Chất lượng sản phẩm:</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="5">⭐⭐⭐⭐⭐ (Tuyệt vời)</option>
                                    <option value="4">⭐⭐⭐⭐ (Tốt)</option>
                                    <option value="3">⭐⭐⭐ (Bình thường)</option>
                                    <option value="2">⭐⭐ (Kém)</option>
                                    <option value="1">⭐ (Rất kém)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..."
                                    rows="4"
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{ padding: '10px 20px', backgroundColor: '#6200ea', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Gửi Đánh Giá
                            </button>
                        </form>
                    )}

                    {/* DANH SÁCH BÌNH LUẬN: Luôn hiển thị cho mọi người dùng truy cập vào trang */}
                    <div className="comments-list">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment.id} className="comment-item" style={{ borderBottom: '1px solid #f0f0f0', padding: '15px 0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                        <strong style={{ marginRight: '10px' }}>{comment.firstname} {comment.lastname}</strong>
                                        <span style={{ color: '#ffc107' }}>
                                            {"⭐".repeat(comment.rating)}
                                        </span>
                                    </div>
                                    <p style={{ margin: '5px 0', color: '#333' }}>{comment.content}</p>
                                    <small style={{ color: '#888' }}>
                                        {new Date(comment.created_at).toLocaleString('vi-VN')}
                                    </small>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#666' }}>Chưa có đánh giá nào. Hãy là người đầu tiên mua và đánh giá sản phẩm này!</p>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default ProductDetailPage;