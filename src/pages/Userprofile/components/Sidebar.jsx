function Sidebar({ activeTab, setActiveTab }) {
    return (
        <div className="sidebar">
            <h2>Tài khoản</h2>

            <button
                className={activeTab === "account" ? "active" : ""}
                onClick={() => setActiveTab("account")}
            >
                Thông tin tài khoản
            </button>

            <button
                className={activeTab === "orders" ? "active" : ""}
                onClick={() => setActiveTab("orders")}
            >
                Lịch sử đơn hàng
            </button>

            <button
                className={activeTab === "address" ? "active" : ""}
                onClick={() => setActiveTab("address")}
            >
                Địa chỉ đã lưu
            </button>

            <button
                className={activeTab === "reviews" ? "active" : ""}
                onClick={() => setActiveTab("reviews")}
            >
                Đánh giá
            </button>
        </div>
    );
}

export default Sidebar;