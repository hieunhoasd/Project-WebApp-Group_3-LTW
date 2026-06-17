import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const apiURL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await axios.post(`${apiURL}/auth/login`, {
        email,
        password
      });

      if (response.data.code === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        navigate('/');
        window.location.reload();
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
        setServerError("📡 Không thể kết nối tới máy chủ! Bạn đã bật lệnh 'php artisan serve' chưa?");
      } else {
        setServerError("❌ Đã xảy ra lỗi: " + error.message);
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
            <span onClick={() => navigate('/register')}>Đăng ký ngay</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;