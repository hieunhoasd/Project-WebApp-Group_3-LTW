import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [usersList, setUsersList] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [productsList, setProductsList] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null); // { id, name, type: 'user' | 'product' }
    const [categoriesList, setCategoriesList] = useState([]); // Lưu danh mục tải về từ DB
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
    const [imagePreview, setImagePreview] = useState(null); // Hiển thị ảnh xem trước
    const [newProductData, setNewProductData] = useState({
        category_id: '',
        name: '',
        price: '',
        quantity: '',
        description: '',
        image: null
    });

    const user = JSON.parse(localStorage.getItem('user')) || { firstname: 'Hệ thống', lastname: 'Admin' };

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/categories');
            const result = await response.json();
            if (result.code === 200) {
                setCategoriesList(result.data);
            }
        } catch (error) {
            console.error("Lỗi kết nối API lấy danh mục:", error);
        }
    };
    // Lấy danh sách users từ API
    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/users');
            const result = await response.json();
            if (result.code === 200) {
                setUsersList(result.data);
            }
        } catch (error) {
            console.error("Lỗi kết nối API lấy users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/products');
            const result = await response.json();
            if (result.code === 200) {
                setProductsList(result.data);
            }
        } catch (error) {
            console.error("Lỗi kết nối API lấy sản phẩm:", error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    // Tự động tải dữ liệu khi component được mount
    useEffect(() => {
        fetchUsers();
        fetchProducts();
        fetchCategories(); // Tải trước danh mục cho form thêm mới
    }, []);

    // Load lại dữ liệu tương ứng khi sếp đổi tab chuyển qua lại
    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'products') fetchProducts();
    }, [activeTab]);

    // 🌟 HÀM MỞ MODAL XÁC NHẬN LINH HOẠT (NHẬN BIẾT THEO TYPE)
    const openDeleteModal = (id, name, type = 'user') => {
        setItemToDelete({ id, name, type });
        setShowConfirmModal(true);
    };

    // 🌟 HÀM ĐÓNG MODAL
    const closeDeleteModal = () => {
        setShowConfirmModal(false);
        setItemToDelete(null);
    };

    // 🌟 HÀM XỬ LÝ XÓA BIẾN ĐỘNG REAL-TIME
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const targetUrl = itemToDelete.type === 'product'
            ? `http://127.0.0.1:8000/api/admin/products/${itemToDelete.id}`
            : `http://127.0.0.1:8000/api/admin/users/${itemToDelete.id}`;

        try {
            const response = await fetch(targetUrl, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (result.code === 200) {
                if (itemToDelete.type === 'product') {
                    setProductsList(productsList.filter(p => p.id !== itemToDelete.id));
                } else {
                    setUsersList(usersList.filter(u => u.id !== itemToDelete.id));
                }
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Lỗi khi kết nối server để xóa dữ liệu:", error);
        } finally {
            closeDeleteModal();
        }
    };

    // 📸 XỬ LÝ XEM TRƯỚC ẢNH KHI ADMIN CHỌN FILE
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductData({ ...newProductData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // ➕ XỬ LÝ SUBMIT FORM TẠO SẢN PHẨM MỚI (DÙNG FORMDATA ĐỂ UPLOAD FILE)
    const handleCreateProductSubmit = async (e) => {
        e.preventDefault();
        if (!newProductData.category_id || !newProductData.name || !newProductData.price || !newProductData.quantity) {
            alert("Sếp vui lòng điền đầy đủ các thông tin bắt buộc (*) nhé!");
            return;
        }

        setIsSubmittingProduct(true);

        const formData = new FormData();
        formData.append('category_id', newProductData.category_id);
        formData.append('name', newProductData.name);
        formData.append('price', newProductData.price);
        formData.append('quantity', newProductData.quantity);
        formData.append('description', newProductData.description);
        if (newProductData.image) {
            formData.append('image', newProductData.image);
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/products', {
                method: 'POST',
                body: formData // Truyền trực tiếp form data chứa file
            });
            const result = await response.json();

            if (result.code === 200) {
                // Thêm sản phẩm mới vừa tạo lên đầu danh sách hiển thị
                setProductsList([result.data, ...productsList]);
                // Đóng modal và reset trạng thái form sạch sẽ
                setShowCreateProductModal(false);
                setNewProductData({ category_id: '', name: '', price: '', quantity: '', description: '', image: null });
                setImagePreview(null);
            } else {
                alert(result.message || "Không thể thêm sản phẩm, vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi kết nối API tạo sản phẩm:", error);
            alert("Lỗi kết nối mạng, máy chủ backend không phản hồi!");
        } finally {
            setIsSubmittingProduct(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Bộ lọc tìm kiếm tổng hợp
    const filteredUsers = usersList.filter(u => {
        const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
        const email = u.email.toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || email.includes(search);
    });

    const filteredProducts = productsList.filter(p => {
        return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString().includes(searchTerm);
    });

    return (
        <div className="admin-container-pro">
            {/* SIDEBAR */}
            <aside className="sidebar-pro">
                <div className="sidebar-brand">
                    <div className="brand-logo">V</div>
                    <h2>Velora<span>.</span></h2>
                </div>
                <div className="sidebar-menu-title">Menu Quản Trị</div>
                <ul className="sidebar-menu">
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <span className="menu-icon">📊</span> Tổng quan
                    </li>
                    <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
                        <span className="menu-icon">🛍️</span> Sản phẩm
                    </li>
                    <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                        <span className="menu-icon">📝</span> Đơn hàng
                    </li>
                    <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <span className="menu-icon">👥</span> Khách hàng
                    </li>
                </ul>
                <div className="sidebar-bottom">
                    <div className="admin-badge">
                        <div className="badge-avatar">{user.firstname.charAt(0)}</div>
                        <div className="badge-info">
                            <h4>{user.firstname} {user.lastname}</h4>
                            <p>Super Admin</p>
                        </div>
                    </div>
                    <button className="btn-logout-pro" onClick={handleLogout}>
                        Đăng xuất <span className="logout-icon">➜</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content-pro">
                <header className="topbar-glass">
                    <div className="search-bar-pro">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder={activeTab === 'products' ? "Tìm theo tên hoặc ID sản phẩm..." : "Tìm nhanh theo tên hoặc email..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="topbar-actions">
                        <button className="btn-icon">🔔<span className="notify-dot"></span></button>
                        <button className="btn-icon">⚙️</button>
                    </div>
                </header>

                <div className="content-wrapper-pro">

                    {/* 📊 TAB TỔNG QUAN (DASHBOARD) */}
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in dashboard-grid-wrapper">
                            <div className="welcome-banner">
                                <div className="welcome-text">
                                    <h1>Xin chào, {user.firstname}! 👋</h1>
                                    <p>Hôm nay là một ngày tuyệt vời để theo dõi hiệu suất kinh doanh của Velora.</p>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card-pro">
                                    <div className="stat-icon-box revenue-icon">💰</div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Tổng doanh thu</p>
                                        <h3 className="stat-value">124,500,000 đ</h3>
                                        <span className="stat-trend trend-up">▲ +12% tháng này</span>
                                    </div>
                                </div>

                                <div className="stat-card-pro">
                                    <div className="stat-icon-box orders-icon">📝</div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Đơn hàng mới</p>
                                        <h3 className="stat-value">1,420</h3>
                                        <span className="stat-trend trend-up">▲ +8% hôm nay</span>
                                    </div>
                                </div>

                                <div className="stat-card-pro">
                                    <div className="stat-icon-box products-icon">🛍️</div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Sản phẩm hiện có</p>
                                        <h3 className="stat-value">{productsList.length || '...'}</h3>
                                        <span className="stat-trend trend-up">▲ Real-time từ API</span>
                                    </div>
                                </div>

                                <div className="stat-card-pro">
                                    <div className="stat-icon-box users-icon">👥</div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Khách hàng hệ thống</p>
                                        <h3 className="stat-value">{usersList.length || '...'}</h3>
                                        <span className="stat-trend trend-up">▲ Real-time từ API</span>
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-double-section">
                                <div className="chart-placeholder-card">
                                    <div className="card-title-heavy">📈 Doanh số tuần này</div>
                                    <div className="dummy-chart-bars">
                                        <div className="bar-item" style={{ '--bar-h': '42%' }}><span className="bar-day">T2</span></div>
                                        <div className="bar-item" style={{ '--bar-h': '60%' }}><span className="bar-day">T3</span></div>
                                        <div className="bar-item" style={{ '--bar-h': '48%' }}><span className="bar-day">T4</span></div>
                                        <div className="bar-item" style={{ '--bar-h': '78%' }}><span className="bar-day">T5</span></div>
                                        <div className="bar-item active" style={{ '--bar-h': '95%' }}><span className="bar-day">T6</span></div>
                                        <div className="bar-item" style={{ '--bar-h': '68%' }}><span className="bar-day">T7</span></div>
                                        <div className="bar-item" style={{ '--bar-h': '85%' }}><span className="bar-day">CN</span></div>
                                    </div>
                                </div>

                                <div className="recent-activity-card">
                                    <div className="card-title-heavy">🔔 Hoạt động hệ thống</div>
                                    <ul className="activity-list-pro">
                                        <li>
                                            <span className="act-dot dot-success"></span>
                                            <div className="act-content">
                                                <strong>Đơn hàng #9412</strong> vừa được thanh toán thành công.
                                                <small>5 phút trước</small>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="act-dot dot-warn"></span>
                                            <div className="act-content">
                                                Tài khoản khách hàng mới vừa đăng ký qua Google Auth.
                                                <small>22 phút trước</small>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="act-dot dot-danger"></span>
                                            <div className="act-content">
                                                Sản phẩm kho hàng chạm mốc kiểm tra định kỳ.
                                                <small>1 giờ trước</small>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'products' && (
                        <div className="animate-fade-in recent-orders-section">
                            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2>Danh sách Sản phẩm hệ thống</h2>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="btn-primary" onClick={() => setShowCreateProductModal(true)} style={{ padding: '8px 16px', fontSize: '14px', background: '#4318ff' }}>
                                        ➕ Thêm sản phẩm mới
                                    </button>
                                    <button className="btn-primary" onClick={fetchProducts} style={{ padding: '8px 16px', fontSize: '14px', background: '#707eae' }}>
                                        🔄 Làm mới dữ liệu
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                {isLoadingProducts ? (
                                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#a3aed1' }}>⏳ Đang tải kho sản phẩm...</div>
                                ) : (
                                    <table className="table-pro">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                {/* ĐÃ XÓA CỘT HÌNH ẢNH Ở ĐÂY */}
                                                <th>Tên sản phẩm</th>
                                                <th>Danh mục</th>
                                                <th>Giá bán</th>
                                                <th>Số lượng kho</th>
                                                <th>Ngày tạo</th>
                                                <th style={{ textAlign: 'center' }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredProducts.length > 0 ? (
                                                filteredProducts.map((product) => (
                                                    <tr key={product.id}>
                                                        <td style={{ fontWeight: '700', color: '#4318ff' }}>#{product.id}</td>
                                                        {/* ĐÃ XÓA THẺ <td> CHỨA HÌNH ẢNH Ở ĐÂY */}
                                                        <td style={{ fontWeight: '600', color: '#2b3674' }}>{product.name}</td>
                                                        <td style={{ color: '#707eae' }}>{product.category_name || 'Mặc định'}</td>
                                                        <td>{Number(product.price).toLocaleString('vi-VN')} đ</td>
                                                        <td>
                                                            <span className={`status ${product.quantity > 5 ? 'completed' : 'pending'}`}>
                                                                {product.quantity} sản phẩm
                                                            </span>
                                                        </td>
                                                        <td>{product.created_at ? new Date(product.created_at).toLocaleDateString('vi-VN') : '—'}</td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <button
                                                                className="btn-action-delete"
                                                                onClick={() => openDeleteModal(product.id, product.name, 'product')}
                                                            >
                                                                🗑️ Xóa
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    {/* Đã giảm colSpan từ 8 xuống 7 vì bớt đi 1 cột */}
                                                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#a3aed1' }}>
                                                        Không tìm thấy sản phẩm nào trong kho.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 👥 TAB KHÁCH HÀNG */}
                    {activeTab === 'users' && (
                        <div className="animate-fade-in recent-orders-section">
                            <div className="section-header">
                                <h2>Danh sách Khách hàng hệ thống</h2>
                                <button className="btn-primary" onClick={fetchUsers} style={{ padding: '8px 16px', fontSize: '14px' }}>
                                    🔄 Làm mới dữ liệu
                                </button>
                            </div>

                            <div className="table-responsive">
                                {isLoadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#a3aed1' }}>⏳ Đang tải dữ liệu dữ liệu khách hàng...</div>
                                ) : (
                                    <table className="table-pro">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Họ & Tên</th>
                                                <th>Email</th>
                                                <th>Số điện thoại</th>
                                                <th>Quyền hạn</th>
                                                <th style={{ textAlign: 'center' }}>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.length > 0 ? (
                                                filteredUsers.map((u) => (
                                                    <tr key={u.id}>
                                                        <td><strong>#{u.id}</strong></td>
                                                        <td>{u.firstname} {u.lastname}</td>
                                                        <td>{u.email}</td>
                                                        <td>{u.phone || '—'}</td>
                                                        <td>
                                                            <span className={`status ${u.role === 'admin' ? 'completed' : 'shipping'}`}>
                                                                {u.role === 'admin' ? 'Quản trị' : 'Khách hàng'}
                                                            </span>
                                                        </td>
                                                        <td style={{ textAlign: 'center' }}>
                                                            <button
                                                                className="btn-action-delete"
                                                                onClick={() => openDeleteModal(u.id, `${u.firstname} ${u.lastname}`, 'user')}
                                                            >
                                                                🗑️ Xóa
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#a3aed1' }}>
                                                        Không tìm thấy kết quả phù hợp.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* CÁC TAB KHÁC CHƯA PHÁT TRIỂN */}
                    {activeTab !== 'dashboard' && activeTab !== 'users' && activeTab !== 'products' && (
                        <div className="animate-fade-in placeholder-card">
                            <h2>Đang phát triển chức năng quản lý {activeTab}...</h2>
                        </div>
                    )}
                </div>
            </main>

            {/* 🌟 CUSTOM WINDOW MODAL: THÊM SẢN PHẨM MỚI (TOÀN DIỆN TRƯỜNG DỮ LIỆU) */}
            {showCreateProductModal && (
                <div className="modal-overlay">
                    <div className="modal-card animate-scale-up" style={{ maxWidth: '500px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: '#2b3674', fontSize: '18px' }}>📦 Thêm sản phẩm mới</h3>
                            <button onClick={() => { setShowCreateProductModal(false); setImagePreview(null); }} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#a3aed1' }}>✕</button>
                        </div>

                        <form onSubmit={handleCreateProductSubmit}>
                            {/* 📂 CHỌN DANH MỤC KHÓA NGOẠI */}
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>Danh mục sản phẩm *</label>
                                <select
                                    value={newProductData.category_id}
                                    onChange={(e) => setNewProductData({ ...newProductData, category_id: e.target.value })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none', backgroundColor: '#fff' }}
                                    required
                                >
                                    <option value="">-- Chọn danh mục phù hợp --</option>
                                    {categoriesList.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* TÊN SẢN PHẨM */}
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>Tên sản phẩm *</label>
                                <input type="text" placeholder="Nhập tên hàng hóa mới..." value={newProductData.name} onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none' }} required />
                            </div>

                            {/* GIÁ & SỐ LƯỢNG KHO */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>Giá bán (VNĐ) *</label>
                                    <input type="number" placeholder="Ví dụ: 250000" value={newProductData.price} onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none' }} required min="0" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>Số lượng kho *</label>
                                    <input type="number" placeholder="Ví dụ: 50" value={newProductData.quantity} onChange={(e) => setNewProductData({ ...newProductData, quantity: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none' }} required min="0" />
                                </div>
                            </div>

                            {/* MÔ TẢ CHI TIẾT */}
                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>Mô tả sản phẩm</label>
                                <textarea placeholder="Nhập thông tin mô tả chi tiết sản phẩm..." value={newProductData.description} onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e5f2', outline: 'none', height: '65px', resize: 'vertical' }} />
                            </div>

                            {/* TẢI FILE ẢNH HÀNG HÓA */}
                            <div style={{ marginBottom: '18px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>Hình ảnh đại diện</label>
                                <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: '13px', display: 'block', width: '100%' }} />
                                {imagePreview && (
                                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '90px', maxHeight: '90px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #4318ff' }} />
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions-btn" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                                <button type="button" className="btn-modal-cancel" onClick={() => { setShowCreateProductModal(false); setImagePreview(null); }} style={{ margin: 0, padding: '10px 18px' }}>Hủy bỏ</button>
                                <button type="submit" className="btn-modal-delete" style={{ margin: 0, padding: '10px 18px', background: '#4318ff' }} disabled={isSubmittingProduct}>
                                    {isSubmittingProduct ? '⏳ Đang lưu...' : '💾 Thêm sản phẩm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* WINDOW MODAL XÁC NHẬN XÓA TỰ ĐỘNG THAY ĐỔI THEO ĐỐI TƯỢNG */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-card animate-scale-up">
                        <div className="modal-alert-icon">⚠️</div>
                        <h3>Xác nhận xóa {itemToDelete?.type === 'product' ? 'sản phẩm' : 'tài khoản'}</h3>
                        <p>
                            Sếp có chắc chắn muốn xóa {itemToDelete?.type === 'product' ? 'sản phẩm' : 'tài khoản'} <br />
                            <strong>{itemToDelete?.name}</strong> không? <br />
                            <span>Hành động này sẽ xóa vĩnh viễn dữ liệu trong DB và không thể hoàn tác!</span>
                        </p>
                        <div className="modal-actions-btn">
                            <button className="btn-modal-cancel" onClick={closeDeleteModal}>Hủy bỏ</button>
                            <button className="btn-modal-delete" onClick={handleConfirmDelete}>Xác nhận Xóa</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;