import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import ProductCard from '../../components/ProductCard';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('Danh mục sản phẩm');
    const [loading, setLoading] = useState(true);

    // 🌟 1. Tạo state quản lý số lượng sản phẩm hiển thị (Mặc định ban đầu hiện 8 cái)
    const [visibleCount, setVisibleCount] = useState(8);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiBaseUrl}/categories/${categoryId}/products`);
                const result = await response.json();
                if (result.code === 200) {
                    setProducts(result.data);
                    setCategoryName(result.category_name);
                }
            } catch (error) {
                console.error("Lỗi lấy sản phẩm theo danh mục:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();

        // 🌟 2. Reset số lượng hiển thị về lại 8 khi người dùng chuyển danh mục
        setVisibleCount(8);
    }, [categoryId, apiBaseUrl]);

    // 🌟 3. Hàm xử lý khi click vào nút "Xem thêm" (Tăng thêm 4 sản phẩm)
    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 4);
    };

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '150px 50px', color: '#2b3674', fontWeight: 'bold', minHeight: '50vh' }}>
                    Đang tải sản phẩm...
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', fontFamily: 'Arial, sans-serif', minHeight: '60vh' }}>
                <h2 style={{ color: '#2b3674', borderBottom: '2px solid #e0e5f2', paddingBottom: '15px', marginBottom: '30px', fontWeight: 'bold' }}>
                    Danh mục: {categoryName}
                </h2>

                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#a3aed1', fontSize: '16px' }}>
                        Hiện tại danh mục này chưa có sản phẩm nào hiển thị.
                    </div>
                ) : (
                    <>
                        {/* 🌟 4. Sử dụng .slice(0, visibleCount) để ép giới hạn render sản phẩm */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '25px' }}>
                            {products.slice(0, visibleCount).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* 🌟 5. Chỉ hiển thị nút "Xem thêm" nếu tổng số sản phẩm lớn hơn số lượng đang hiển thị */}
                        {visibleCount < products.length && (
                            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                                <button
                                    onClick={handleLoadMore}
                                    style={{
                                        padding: '12px 30px',
                                        backgroundColor: '#fff',
                                        color: '#4318ff',
                                        border: '2px solid #4318ff',
                                        borderRadius: '10px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        fontSize: '15px',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 12px rgba(67, 24, 255, 0.05)'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#4318ff';
                                        e.target.style.color = '#fff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#fff';
                                        e.target.style.color = '#4318ff';
                                    }}
                                >
                                    Xem thêm sản phẩm ↓
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </>
    );
};

export default CategoryPage;