import { useState } from 'react';
import './login.css';

function Login() {
  // state để chuyển đổi giữa Đăng nhập (true) và Đăng ký (false)
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Tiêu đề Welcome đổi font mảnh hơn */}
        <h2 className="auth-title">Velora xin chào</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Đăng nhập để tiếp tục mua sắm' : 'Tạo tài khoản mới ngay'}
        </p>

        <form className="auth-form">
          {/* Nếu là Đăng ký thì mới hiện ô nhập Tên */}
          {!isLogin && (
            <div className="input-group">
              <input type="text" placeholder="Tên của bạn" required />
            </div>
          )}

          <div className="input-group">
            <input type="email" placeholder="Tài khoản email" required />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>

          <button type="submit" className="auth-btn">
            {isLogin ? 'Join or Login' : 'Register'}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <p>
              Chưa có tài khoản?{' '}
              <span onClick={() => setIsLogin(false)}>Đăng ký ngay</span>
            </p>
          ) : (
            <p>
              Đã có tài khoản rồi?{' '}
              <span onClick={() => setIsLogin(true)}>Đăng nhập</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;