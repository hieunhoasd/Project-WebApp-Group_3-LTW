import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./register.css";

function Register() {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // State lưu trữ các lỗi validation trả về từ Laravel Backend
    const [errors, setErrors] = useState({});
    // State lưu lỗi hệ thống chung (mất mạng, sập server, 404...)
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Xóa sạch các thông báo lỗi cũ trước khi gửi request mới
        setErrors({});
        setServerError('');

        const apiURL = import.meta.env.VITE_API_BASE_URL;

        try {
            const response = await axios.post(`${apiURL}/auth/register`, {
                fullname,
                email,
                password,
                phone
            });

            if (response.data.code === 201) {
                navigate('/login');
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const responseData = error.response.data;

                if (status === 400 || status === 422) {
                    if (responseData.errors) {
                        setErrors(responseData.errors);
                    } else if (responseData.message) {
                        setErrors({ email: [responseData.message] });
                    }
                }
                else {
                    setServerError(`Lỗi hệ thống (${status}): ` + (responseData.message || "Vui lòng thử lại sau."));
                }
            }
            else if (error.request) {
                setServerError("📡 Không thể kết nối tới máy chủ Backend! Hãy đảm bảo bạn đã chạy lệnh 'php artisan serve'.");
            }
            else {
                setServerError("❌ Đã xảy ra lỗi: " + error.message);
            }
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Velora xin chào</h2>
                <p className="auth-subtitle">Tạo tài khoản mới ngay</p>

                {serverError && <div className="server-error-box">{serverError}</div>}

                <form className="auth-form" onSubmit={handleRegister}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Tên của bạn"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            required
                        />
                        {errors.fullname && <p className="error-message">{errors.fullname[0]}</p>}
                    </div>

                    {/* Ô NHẬP EMAIL */}
                    <div className="input-group">
                        <input
                            type="email" /* Chuyển type thành email cho chuẩn xác */
                            placeholder="Tài khoản email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email[0]}</p>}
                    </div>

                    {/* Ô NHẬP SỐ ĐIỆN THOẠI */}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                        {errors.phone && <p className="error-message">{errors.phone[0]}</p>}
                    </div>

                    {/* Ô NHẬP MẬT KHẨU */}
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
                        Register
                    </button>
                </form>

                <div className="auth-toggle">
                    <p>
                        Đã có tài khoản rồi?{' '}
                        <span onClick={() => navigate('/login')}>Đăng nhập</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;