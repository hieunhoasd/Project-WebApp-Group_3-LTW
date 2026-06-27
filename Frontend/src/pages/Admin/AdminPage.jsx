import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import './AdminPage.css';
import toast from 'react-hot-toast';
import axios from '../../context/axios';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    LogOut,
    Search,
    Bell,
    Settings,
    CircleDollarSign,
    ShoppingBag,
    BarChart3,
    Activity,
    Plus,
    RefreshCw,
    Loader2,
    Trash2,
    PackageX,
    PackagePlus, X, Save,
    ImagePlus
} from 'lucide-react';
const AdminPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');

    // --- QUẢN LÝ USER ---
    const [usersList, setUsersList] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [userFormData, setUserFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        role: 'customer'
    });

    // --- QUẢN LÝ SẢN PHẨM ---
    const [productsList, setProductsList] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [categoriesList, setCategoriesList] = useState([]);
    const [showCreateProductModal, setShowCreateProductModal] = useState(false);
    const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [newProductData, setNewProductData] = useState({
        category_id: '',
        name: '',
        price: '',
        quantity: '',
        description: '',
        image: null
    });

    // --- QUẢN LÝ ĐƠN HÀNG & MODAL XÓA CHUNG ---
    const [orders, setOrders] = useState([]);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const user = JSON.parse(localStorage.getItem('user')) || { firstname: 'Hệ thống', lastname: 'Admin' };


    // ==========================================
    // CONFIG STYLE TOAST ĐỒNG BỘ CHO VELORA STORE
    // ==========================================
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
        iconTheme: {
            primary: '#4318ff',
            secondary: '#ffffff',
        },
    };

    const toastErrorStyle = {
        style: {
            borderRadius: '10px',
            background: '#fff5f5',
            color: '#e53e3e',
            boxShadow: '0 10px 25px rgba(229, 62, 62, 0.08)',
            fontWeight: '550',
            fontSize: '14px',
            padding: '12px 20px',
            border: '1px solid rgba(229, 62, 62, 0.1)'
        }
    };

    // ==========================================
    // KHU VỰC API FETCH DATA
    // ==========================================
    const fetchCategories = async () => {
        try {
            const response = await axios.get('/admin/categories');
            if (response.data.code === 200) setCategoriesList(response.data.data);
        } catch (error) {
            console.error("Lỗi kết nối API lấy danh mục:", error);
        }
    };

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await axios.get('/admin/users');
            if (response.data.code === 200) setUsersList(response.data.data);
        } catch (error) {
            console.error("Lỗi kết nối API lấy users:", error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await axios.get('/admin/products');
            if (response.data.code === 200) setProductsList(response.data.data);
        } catch (error) {
            console.error("Lỗi kết nối API lấy sản phẩm:", error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get('/admin/orders');
            if (response.data.code === 200) setOrders(response.data.data);
        } catch (error) {
            console.error("Lỗi lấy đơn hàng:", error);
        }
    };

    // Tự động điều phối tải dữ liệu khi đổi tab và tải dữ liệu ban đầu
    useEffect(() => {
        if (activeTab === 'orders') fetchAllOrders();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'products') fetchProducts();
    }, [activeTab]);

    useEffect(() => {
        fetchUsers();
        fetchProducts();
        fetchCategories();
    }, []);


    // ==========================================
    // KHU VỰC XỬ LÝ HÀNH ĐỘNG (ACTIONS)
    // ==========================================

    // 1. Quản lý Đơn hàng
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            if (response.data.code === 200) {
                toast.success("Cập nhật trạng thái đơn hàng thành công!", toastSuccessStyle);
                fetchAllOrders();
            } else {
                toast.error(response.data.message || "Cập nhật thất bại.", toastErrorStyle);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            toast.error("Bạn không có quyền thực hiện thao tác này hoặc phiên đăng nhập hết hạn.", toastErrorStyle);
        }
    };

    // 2. Thêm mới Khách hàng
    const handleUserFormChange = (e) => {
        setUserFormData({ ...userFormData, [e.target.name]: e.target.value });
    };

    const handleCreateUserSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/admin/users', userFormData);
            if (response.data.code === 201 || response.data.code === 200) {
                toast.success('Thêm tài khoản mới thành công!', toastSuccessStyle);
                setIsCreateModalOpen(false);
                setUserFormData({ firstname: '', lastname: '', email: '', password: '', phone: '', role: 'customer' });
                fetchUsers();
            } else {
                toast.error(response.data.message || 'Thêm thất bại, vui lòng kiểm tra lại!', toastErrorStyle);
            }
        } catch (error) {
            toast.error('Lỗi kết nối server hoặc Email đã tồn tại!', toastErrorStyle);
        }
    };

    // 3. Quản lý ảnh sản phẩm
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProductData({ ...newProductData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Thêm mới Sản phẩm
    const handleCreateProductSubmit = async (e) => {
        e.preventDefault();
        if (!newProductData.category_id || !newProductData.name || !newProductData.price || !newProductData.quantity) {
            toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc!", toastErrorStyle);
            return;
        }

        setIsSubmittingProduct(true);
        const formData = new FormData();
        formData.append('category_id', newProductData.category_id);
        formData.append('name', newProductData.name);
        formData.append('price', newProductData.price);
        formData.append('quantity', newProductData.quantity);
        formData.append('description', newProductData.description);
        if (newProductData.image) formData.append('image', newProductData.image);

        try {
            const response = await axios.post('/admin/products', formData);
            if (response.data.code === 200) {
                toast.success("Thêm sản phẩm mới thành công!", toastSuccessStyle);
                setProductsList([response.data.data, ...productsList]);
                setShowCreateProductModal(false);
                setNewProductData({ category_id: '', name: '', price: '', quantity: '', description: '', image: null });
                setImagePreview(null);
            } else {
                toast.error(response.data.message || "Không thể thêm sản phẩm, vui lòng thử lại!", toastErrorStyle);
            }
        } catch (error) {
            console.error("Lỗi kết nối API tạo sản phẩm:", error);
            toast.error("Lỗi phân quyền hoặc máy chủ gặp sự cố!", toastErrorStyle);
        } finally {
            setIsSubmittingProduct(false);
        }
    };

    // 4. Kiểm soát Modal Xóa Đa Năng
    const openDeleteModal = (id, name, type = 'user') => {
        setItemToDelete({ id, name, type });
        setShowConfirmModal(true);
    };

    const closeDeleteModal = () => {
        setShowConfirmModal(false);
        setItemToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const targetUrl = itemToDelete.type === 'product'
            ? `/admin/products/${itemToDelete.id}`
            : `/admin/users/${itemToDelete.id}`;

        const typeLabel = itemToDelete.type === 'product' ? 'sản phẩm' : 'tài khoản';

        try {
            const response = await axios.delete(targetUrl);
            if (response.data.code === 200) {
                if (itemToDelete.type === 'product') {
                    setProductsList(productsList.filter(p => p.id !== itemToDelete.id));
                } else {
                    setUsersList(usersList.filter(u => u.id !== itemToDelete.id));
                }
                toast.success(`Xóa ${typeLabel} thành công!`, toastSuccessStyle);
            } else {
                toast.error(response.data.message || `Không thể xóa ${typeLabel} này!`, toastErrorStyle);
            }
        } catch (error) {
            console.error("Lỗi khi xóa dữ liệu:", error);
            toast.error(`Đã xảy ra lỗi hệ thống khi xóa ${typeLabel}!`, toastErrorStyle);
        } finally {
            closeDeleteModal();
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ==========================================
    // KHU VỰC FILTER SEARCH
    // ==========================================
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
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <h2 className="admin-brand-logo">VELORA<span>.</span></h2>
                    </Link>
                </div>
                <div className="sidebar-menu-title">Menu Quản Trị</div>

                {/* ĐÃ SỬA ICON Ở PHẦN NÀY */}
                <ul className="sidebar-menu">
                    <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
                        <span className="menu-icon"><LayoutDashboard size={20} /></span> Tổng quan
                    </li>
                    <li className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
                        <span className="menu-icon"><Package size={20} /></span> Sản phẩm
                    </li>
                    <li className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
                        <span className="menu-icon"><ShoppingCart size={20} /></span> Đơn hàng
                    </li>
                    <li className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>
                        <span className="menu-icon"><Users size={20} /></span> Khách hàng
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
                        Đăng xuất <span className="logout-icon"><LogOut size={18} /></span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="main-content-pro">
                <header className="topbar-glass">
                    <div className="search-bar-pro">
                        <span className="search-icon">
                            <Search size={18} strokeWidth={2.5} color="#707eae" />
                        </span>
                        <input
                            type="text"
                            placeholder={activeTab === 'products' ? "Tìm theo tên hoặc ID sản phẩm..." : "Tìm nhanh theo tên hoặc email..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="topbar-actions">
                        <button className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={20} color="#707eae" />
                            <span className="notify-dot"></span>
                        </button>
                        <button className="btn-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Settings size={20} color="#707eae" />
                        </button>
                    </div>
                </header>

                <div className="content-wrapper-pro">

                    {/* 📊 TAB TỔNG QUAN (DASHBOARD) */}
                    {activeTab === 'dashboard' && (
                        <div className="animate-fade-in dashboard-grid-wrapper">
                            <div className="welcome-banner">
                                <div className="welcome-text">
                                    <h1>Xin chào, {user.firstname}!</h1>
                                    <p>Hôm nay là một ngày tuyệt vời để theo dõi hiệu suất kinh doanh của Velora.</p>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="stat-card-pro">
                                    <div className="stat-icon-box revenue-icon">
                                        {/* Icon Doanh thu */}
                                        <CircleDollarSign size={28} strokeWidth={1.5} color="#10b981" />
                                    </div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Tổng doanh thu</p>
                                        <h3 className="stat-value">124,500,000 đ</h3>
                                        <span className="stat-trend trend-up">▲ +12% tháng này</span>
                                    </div>
                                </div>

                                <div className="stat-card-pro">
                                    <div className="stat-icon-box orders-icon">
                                        {/* Icon Đơn hàng */}
                                        <ShoppingCart size={28} strokeWidth={1.5} color="#3b82f6" />
                                    </div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Đơn hàng mới</p>
                                        <h3 className="stat-value">1,420</h3>
                                    </div>
                                </div>

                                <div className="stat-card-pro">
                                    <div className="stat-icon-box products-icon">
                                        {/* Icon Sản phẩm */}
                                        <ShoppingBag size={28} strokeWidth={1.5} color="#8b5cf6" />
                                    </div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Sản phẩm hiện có</p>
                                        <h3 className="stat-value">{productsList.length || '...'}</h3>
                                    </div>
                                </div>

                                <div className="stat-card-pro">
                                    <div className="stat-icon-box users-icon">
                                        {/* Icon Khách hàng */}
                                        <Users size={28} strokeWidth={1.5} color="#f59e0b" />
                                    </div>
                                    <div className="stat-info-box">
                                        <p className="stat-label">Khách hàng hệ thống</p>
                                        <h3 className="stat-value">{usersList.length || '...'}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="dashboard-double-section">
                                <div className="chart-placeholder-card">
                                    <div className="card-title-heavy" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BarChart3 size={22} strokeWidth={2} color="#64748b" />
                                        Doanh số tuần này
                                    </div>
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
                                    <div className="card-title-heavy" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Activity size={22} strokeWidth={2} color="#64748b" />
                                        Hoạt động hệ thống
                                    </div>
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
                                    <button className="btn-primary" onClick={() => setShowCreateProductModal(true)} style={{ padding: '8px 16px', fontSize: '14px', background: '#4318ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Plus size={16} strokeWidth={2.5} /> Thêm sản phẩm mới
                                    </button>
                                    <button className="btn-primary" onClick={fetchProducts} style={{ padding: '8px 16px', fontSize: '14px', background: '#4318ff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <RefreshCw size={16} strokeWidth={2.5} /> Làm mới dữ liệu
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                {isLoadingProducts ? (
                                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#a3aed1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        {/* Có thể thêm class animation xoay (spin) vào icon này nếu CSS của bạn có sẵn */}
                                        <Loader2 size={32} strokeWidth={2} className="animate-spin" />
                                        <span>Đang tải kho sản phẩm...</span>
                                    </div>
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
                                                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                                                onClick={() => openDeleteModal(product.id, product.name, 'product')}
                                                            >
                                                                <Trash2 size={16} strokeWidth={2} /> Xóa
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
                            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <h2>Danh sách Khách hàng hệ thống</h2>
                                {/* Nhóm các nút hành động */}
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setIsCreateModalOpen(true)}
                                        style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', background: '#4318ff', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                                    >
                                        <Plus size={16} strokeWidth={2.5} /> Thêm Account
                                    </button>

                                    <button
                                        className="btn-primary"
                                        onClick={fetchUsers}
                                        style={{ padding: '8px 16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', background: '#4318ff', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                                    >
                                        <RefreshCw size={16} strokeWidth={2.5} /> Làm mới dữ liệu
                                    </button>
                                </div>
                            </div>

                            <div className="table-responsive">
                                {isLoadingUsers ? (
                                    <div style={{ textAlign: 'center', padding: '50px 0', color: '#a3aed1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <Loader2 size={32} strokeWidth={2} className="animate-spin" />
                                        <span>Đang tải dữ liệu khách hàng...</span>
                                    </div>
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
                                                                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                                                onClick={() => openDeleteModal(u.id, `${u.firstname} ${u.lastname}`, 'user')}
                                                            >
                                                                <Trash2 size={16} strokeWidth={2} /> Xóa
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

                            {/* MODAL FORM TẠO TÀI KHOẢN MỚI */}
                            {isCreateModalOpen && (
                                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                                    <div className="animate-fade-in" style={{ background: '#fff', padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '460px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)' }}>

                                        {/* Tiêu đề Form */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                            <h3 style={{ margin: 0, color: '#2b3674', fontSize: '20px', fontWeight: '700' }}>Tạo tài khoản hệ thống</h3>
                                            <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3aed1', padding: '4px' }}>
                                                <X size={22} />
                                            </button>
                                        </div>

                                        {/* Nội dung Form */}
                                        <form onSubmit={handleCreateUserSubmit}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#2b3674' }}>Họ</label>
                                                    <input required type="text" name="firstname" value={userFormData.firstname} onChange={handleUserFormChange} placeholder="Nguyễn" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#2b3674' }}>Tên</label>
                                                    <input required type="text" name="lastname" value={userFormData.lastname} onChange={handleUserFormChange} placeholder="Văn An" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '14px' }}>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#2b3674' }}>Email đăng nhập</label>
                                                <input required type="email" name="email" value={userFormData.email} onChange={handleUserFormChange} placeholder="example@gmail.com" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
                                            </div>

                                            <div style={{ marginBottom: '14px' }}>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#2b3674' }}>Số điện thoại</label>
                                                <input type="text" name="phone" value={userFormData.phone} onChange={handleUserFormChange} placeholder="0362xxxxxx" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
                                            </div>

                                            <div style={{ marginBottom: '14px' }}>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#2b3674' }}>Mật khẩu ban đầu</label>
                                                <input required type="password" name="password" value={userFormData.password} onChange={handleUserFormChange} placeholder="••••••••" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px' }} />
                                            </div>

                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#2b3674' }}>Phân quyền vai trò</label>
                                                <select name="role" value={userFormData.role} onChange={handleUserFormChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '14px', background: '#fff', cursor: 'pointer' }}>
                                                    <option value="customer">Khách hàng (Customer)</option>
                                                    <option value="admin">Quản trị viên (Admin)</option>
                                                </select>
                                            </div>

                                            {/* Thanh điều hướng nút */}
                                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                                <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#f4f7fe', color: '#2b3674', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                                                    Hủy bỏ
                                                </button>
                                                <button type="submit" style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#4318ff', color: '#fff', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 14px 0 rgba(67, 24, 255, 0.3)' }}>
                                                    Lưu dữ liệu
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {/* tab order*/}
                    {activeTab === 'orders' && (
                        <div className="animate-fade-in" style={{ padding: '20px', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ marginBottom: '20px', color: '#2b3674', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={24} strokeWidth={2} color="#4318ff" />
                                Quản lý đơn hàng hệ thống
                            </h2>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '12px' }}>Mã ĐH</th>
                                        <th style={{ padding: '12px' }}>Khách hàng</th>
                                        <th style={{ padding: '12px' }}>Số điện thoại</th>
                                        <th style={{ padding: '12px' }}>Địa chỉ giao hàng</th>
                                        <th style={{ padding: '12px' }}>Tổng tiền</th>
                                        <th style={{ padding: '12px' }}>Ngày đặt</th>
                                        <th style={{ padding: '12px' }}>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                                <td style={{ padding: '12px', fontWeight: 'bold' }}>#{order.id}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div>{order.firstname} {order.lastname}</div>
                                                    <small style={{ color: 'gray' }}>{order.email}</small>
                                                </td>
                                                <td style={{ padding: '12px' }}>{order.phone_receiver}</td>
                                                <td style={{ padding: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {order.shipping_address}
                                                </td>
                                                <td style={{ padding: '12px', color: '#e53e3e', fontWeight: 'bold' }}>
                                                    {Number(order.total_price).toLocaleString('vi-VN')} đ
                                                </td>
                                                <td style={{ padding: '12px' }}>
                                                    {new Date(order.created_at).toLocaleDateString('vi-VN')}
                                                </td>
                                                {/* Thẻ <select> cập nhật trạng thái động giữ nguyên */}
                                                <td style={{ padding: '12px' }}>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        style={{
                                                            padding: '6px 12px',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            border: 'none',
                                                            outline: 'none',
                                                            cursor: 'pointer',
                                                            borderRadius: '6px', // Bo góc nhẹ cho giống chiếc badge hiển thị
                                                            appearance: 'none',  // Xóa bỏ icon mũi tên mặc định của trình duyệt
                                                            WebkitAppearance: 'none',
                                                            MozAppearance: 'none',
                                                            textAlign: 'center',
                                                            display: 'inline-block',
                                                            transition: 'all 0.2s ease',

                                                            background:
                                                                order.status === 'completed' ? '#ecfdf5' :
                                                                    order.status === 'pending' ? '#fffbeb' :
                                                                        order.status === 'processing' ? '#eff6ff' :
                                                                            order.status === 'shipped' ? '#f5f3ff' :
                                                                                order.status === 'canceled' ? '#fef2f2' :
                                                                                    '#f8fafc',

                                                            color:
                                                                order.status === 'completed' ? '#10b981' :
                                                                    order.status === 'pending' ? '#d97706' :
                                                                        order.status === 'processing' ? '#3b82f6' :
                                                                            order.status === 'shipped' ? '#8b5cf6' :
                                                                                order.status === 'canceled' ? '#ef4444' :
                                                                                    '#64748b'
                                                        }}
                                                    >
                                                        <option value="pending" style={{ color: '#d97706', background: '#fff', fontWeight: '500' }}>• Chờ xử lý</option>
                                                        <option value="processing" style={{ color: '#3b82f6', background: '#fff', fontWeight: '500' }}>• Đang xử lý</option>
                                                        <option value="shipped" style={{ color: '#8b5cf6', background: '#fff', fontWeight: '500' }}>• Đang giao</option>
                                                        <option value="completed" style={{ color: '#10b981', background: '#fff', fontWeight: '500' }}>• Hoàn thành</option>
                                                        <option value="canceled" style={{ color: '#ef4444', background: '#fff', fontWeight: '500' }}>• Đã hủy</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" style={{ padding: '40px 20px', textAlign: 'center', color: '#a3aed1' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                                    <PackageX size={36} strokeWidth={1.5} color="#cbd5e1" />
                                                    <span>Hiện chưa có đơn hàng nào trên hệ thống.</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* 🌟 CUSTOM WINDOW MODAL: THÊM SẢN PHẨM MỚI (TOÀN DIỆN TRƯỜNG DỮ LIỆU) */}
            {showCreateProductModal && (
                <div className="modal-overlay">
                    <div className="modal-card animate-scale-up" style={{ maxWidth: '500px', textAlign: 'left', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3 style={{ margin: 0, color: '#2b3674', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <PackagePlus size={22} strokeWidth={2.5} color="#4318ff" />
                                Thêm sản phẩm mới
                            </h3>
                            <button
                                onClick={() => { setShowCreateProductModal(false); setImagePreview(null); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a3aed1', display: 'flex', padding: '4px', borderRadius: '4px', transition: 'background 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
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
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: '#2b3674' }}>
                                    Hình ảnh đại diện
                                </label>

                                {/* Vùng Custom Upload File (Dạng Dashed Box hiện đại) */}
                                <label
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '20px',
                                        background: '#f8fafc',
                                        border: '2px dashed #cbd5e1',
                                        borderRadius: '12px',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        color: '#64748b'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#4318ff';
                                        e.currentTarget.style.backgroundColor = '#f0f5ff';
                                        e.currentTarget.style.color = '#4318ff';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#cbd5e1';
                                        e.currentTarget.style.backgroundColor = '#f8fafc';
                                        e.currentTarget.style.color = '#64748b';
                                    }}
                                >
                                    <ImagePlus size={32} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Nhấn để chọn ảnh tải lên</span>
                                    <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: '400' }}>Hỗ trợ định dạng JPG, PNG</span>

                                    {/* Input thật bị ẩn đi (display: none) */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        style={{ display: 'none' }}
                                    />
                                </label>

                                {/* Khu vực hiển thị ảnh xem trước (Preview) */}
                                {imagePreview && (
                                    <div className="animate-fade-in" style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ position: 'relative', padding: '4px', border: '1px solid #e0e5f2', borderRadius: '10px', background: '#fff' }}>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                style={{ maxWidth: '100%', height: '120px', borderRadius: '6px', objectFit: 'cover' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-actions-btn" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
                                <button type="button" className="btn-modal-cancel" onClick={() => { setShowCreateProductModal(false); setImagePreview(null); }} style={{ margin: 0, padding: '10px 18px' }}>
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="btn-modal-delete" style={{ margin: 0, padding: '10px 18px', background: '#4318ff', display: 'flex', alignItems: 'center', gap: '6px' }} disabled={isSubmittingProduct}>
                                    {isSubmittingProduct ? (
                                        <>
                                            <Loader2 size={16} strokeWidth={2.5} className="animate-spin" /> Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} strokeWidth={2.5} /> Thêm sản phẩm
                                        </>
                                    )}
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