import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();

  // Tối ưu: Lấy và parse dữ liệu ngay khi khởi tạo state để tránh chớp màn hình loading
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Đảm bảo dữ liệu parse ra là một object và không phải null
        if (parsedUser && typeof parsedUser === "object") {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error("Lỗi parse dữ liệu ban đầu:", error);
    }
    return null;
  });

  useEffect(() => {
    // Nếu không có user hợp lệ, lập tức điều hướng về trang login
    if (!user) {
      localStorage.removeItem("user"); // Xoá rác nếu có (vd: chuỗi "null")
      navigate("/login");
    }
  }, [user, navigate]);

  // Vẫn giữ loading state đề phòng trường hợp điều hướng chưa diễn ra xong
  if (!user) {
    return <h2>Đang chuyển hướng...</h2>;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={{ padding: "40px", minHeight: "70vh" }}>
      <h1>Thông tin tài khoản</h1>
      <hr />

      <p><strong>Họ:</strong> {user.lastname ?? "—"}</p>
      <p><strong>Tên:</strong> {user.firstname ?? "—"}</p>
      <p><strong>Email:</strong> {user.email ?? "—"}</p>
      <p><strong>Số điện thoại:</strong> {user.phone ?? "—"}</p>
      <p><strong>Vai trò:</strong> {user.role ?? "—"}</p>

      <button onClick={handleLogout}>Đăng xuất</button>
    </div>
  );
}

export default UserProfile;