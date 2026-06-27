import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css';
// ĐÃ SỬA: Import từ file cấu hình axios dùng chung thay vì thư viện gốc
import axios from '../../context/axios';

function Register() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setServerError('');

        const apiURL = import.meta.env.VITE_API_BASE_URL;

        try {
            // ĐÃ SỬA: Gửi đúng các trường dữ liệu mà Laravel Validator yêu cầu
            const response = await axios.post(`${apiURL}/auth/register`, {
                firstname,
                lastname,
                email,
                password,
                phone
            });

            // Backend trả về mã code 201 khi tạo tài khoản thành công
            if (response.status === 201 || response.data.code === 201) {
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
                        setServerError(responseData.message);
                    }
                } else {
                    setServerError(`Lỗi hệ thống (${status}): ` + (responseData.message || "Vui lòng thử lại sau."));
                }
            } else if (error.request) {
                setServerError("📡 Không thể kết nối tới máy chủ Backend! Hãy đảm bảo bạn đã chạy lệnh 'php artisan serve'.");
            } else {
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
                    {/* ĐÃ SỬA: Tách thành Họ và Tên để mapping chuẩn database */}
                    <div className="input-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Họ"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                required
                            />
                            {errors.lastname && <p className="error-message">{errors.lastname[0]}</p>}
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Tên"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                required
                            />
                            {errors.firstname && <p className="error-message">{errors.firstname[0]}</p>}
                        </div>
                    </div>

                    {/* Ô NHẬP EMAIL */}
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

                    {/* Ô NHẬP SỐ ĐIỆN THOẠI */}
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {errors.phone && <p className="error-message">{errors.phone[0]}</p>}
                    </div>

                    {/* Ô NHẬP MẬT KHẨU */}
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
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
                        <span onClick={() => navigate('/login')} style={{ cursor: 'pointer', color: '#007bff' }}>
                            Đăng nhập
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;