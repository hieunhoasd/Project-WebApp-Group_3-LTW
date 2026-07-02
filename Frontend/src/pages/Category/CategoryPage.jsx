import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header/header';
import Footer from '../../components/Footer/footer';
import ProductCard from '../../components/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
    const { categoryId } = useParams();
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('Danh mục sản phẩm');
    const [loading, setLoading] = useState(true);

    const [visibleCount, setVisibleCount] = useState(9);
    const scrollRef = useRef(null);

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
        setVisibleCount(9);
    }, [categoryId, apiBaseUrl]);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + 6);
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300; 
            
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ textAlign: 'center', padding: '150px 50px', color: '#111827', fontWeight: 'bold', minHeight: '50vh' }}>
                    <div className="loading-spinner">Đang tải bộ sưu tập...</div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="category-page-container">
                {/* 🌟 HEADER DANH MỤC (Đã gỡ Breadcrumb thừa, giữ form nền xịn) */}
                <div className="category-hero">
                    <h1 className="category-title">{categoryName}</h1>
                    <p className="category-subtitle">
                        Khám phá bộ sưu tập mới nhất với form dáng chuẩn mực, chất liệu cao cấp mang lại sự thoải mái tuyệt đối cho mọi hoạt động trong ngày.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '16px', minHeight: '30vh' }}>
                        Hiện tại danh mục này đang cập nhật sản phẩm. Vui lòng quay lại sau nhé!
                    </div>
                ) : (
                    <>
                        {/* KHU VỰC 1: LƯỚT NGANG TRENDING */}
                        {products.length >= 4 && (
                            <div className="category-section">
                                <div className="section-header-flex">
                                    <h2 className="section-heading">Đang thịnh hành</h2>
                                </div>
                                
                                <div className="trending-slider-wrapper">
                                    <button className="slider-btn prev-btn" onClick={() => scroll('left')}>
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                    </button>

                                    <div className="horizontal-scroll-track" ref={scrollRef}>
                                        {products.slice(0, 12).map(product => (
                                            <div className="scroll-item" key={`trending-${product.id}`}>
                                                <ProductCard product={product} />
                                            </div>
                                        ))}
                                    </div>

                                    <button className="slider-btn next-btn" onClick={() => scroll('right')}>
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        <hr className="divider" />

                        {/* KHU VỰC 2: TẤT CẢ SẢN PHẨM */}
                        <div className="category-section">
                            <div className="section-header-flex">
                                <h2 className="section-heading">Tất cả sản phẩm</h2>
                                <div className="filter-sort">
                                    <select className="sort-select">
                                        <option>Mới nhất</option>
                                        <option>Bán chạy nhất</option>
                                        <option>Giá: Thấp đến Cao</option>
                                        <option>Giá: Cao đến Thấp</option>
                                    </select>
                                </div>
                            </div>

                            <div className="category-grid-large">
                                {products.slice(0, visibleCount).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {visibleCount < products.length && (
                                <div className="load-more-container">
                                    <button className="btn-load-more" onClick={handleLoadMore}>
                                        Xem thêm sản phẩm
                                        <span className="arrow-down">↓</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
};

export default CategoryPage;