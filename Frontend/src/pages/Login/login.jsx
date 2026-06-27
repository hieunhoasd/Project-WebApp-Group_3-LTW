import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 🌟 ĐÃ THÊM: useLocation
import './login.css';
import axios from '../../context/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const location = useLocation(); // 🌟 Lấy location để đọc tín hiệu truyền tới

  // 🌟 ĐÃ THÊM: Lấy đường dẫn cần quay lại từ state (nếu có), mặc định là trang chủ '/'
  const redirectUrl = location.state?.redirectTo || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const apiURL = import.meta.env.VITE_API_BASE_URL;

    try {
      // Gọi API đăng nhập từ Backend
      const response = await axios.post(`${apiURL}/auth/login`, {
        email,
        password
      });

      // Backend trả về status 200 và success = true
      if (response.status === 200 && response.data.success) {
        const { token, user } = response.data.data; // Phân tách dữ liệu từ bọc 'data' của Backend

        // BẮT BUỘC: Lưu token vào localStorage để các request sau đính kèm vào Header Authorization
        if (token) {
          localStorage.setItem('user_token', token);
        }

        // Lưu thông tin user để hiển thị UI
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        // 🌟 CẬP NHẬT LOGIC ĐIỀU HƯỚNG: 
        // Dùng window.location.href để vừa chuyển hướng, vừa kích hoạt reload lại trang 
        // giúp Header/CartContext nhận diện ngay User mới đăng nhập.
        if (user?.isAdmin) {
          window.location.href = '/admin';
        } else {
          // Trả khách hàng về đúng trang họ đang thao tác dở (Ví dụ: /checkout)
          window.location.href = redirectUrl;
        }
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 400 || status === 422) {
          if (responseData.errors) {
            setErrors(responseData.errors);
          } else {
            setServerError(responseData.message || "Dữ liệu nhập vào không hợp lệ.");
          }
        } else if (status === 401) {
          setServerError(responseData.message || "Tài khoản hoặc mật khẩu không chính xác!");
        } else {
          setServerError(`Lỗi hệ thống (${status}): Vui lòng quay lại sau.`);
        }
      } else if (error.request) {
        setServerError("📡 Không thể kết nối tới máy chủ Backend! Bạn đã bật lệnh 'php artisan serve' chưa?");
      } else {
        setServerError("❌ Đã xảy ra lỗi hệ thống: " + error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Velora xin chào</h2>
        <p className="auth-subtitle">Đăng nhập để tiếp tục mua sắm</p>

        {serverError && <div className="server-error-box">{serverError}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Tài khoản email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error-message">{errors.email[0]}</p>}
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error-message">{errors.password[0]}</p>}
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            Chưa có tài khoản?{' '}
            <span onClick={() => navigate('/register')} style={{ cursor: 'pointer', color: '#007bff' }}>
              Đăng ký ngay
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;