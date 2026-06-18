import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Login() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        {
          email,
          password,
        }
      );

      if (response.data.code === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.data)
        );

        navigate("/profile");
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Đăng nhập thất bại!"
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">
          Velora xin chào
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Đăng nhập để tiếp tục mua sắm"
            : "Tạo tài khoản mới ngay"}
        </p>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Tên của bạn"
                required
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Tài khoản email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            {isLogin
              ? "Join or Login"
              : "Register"}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <p>
              Chưa có tài khoản?{" "}
              <span
                onClick={() =>
                  setIsLogin(false)
                }
              >
                Đăng ký ngay
              </span>
            </p>
          ) : (
            <p>
              Đã có tài khoản rồi?{" "}
              <span
                onClick={() =>
                  setIsLogin(true)
                }
              >
                Đăng nhập
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;