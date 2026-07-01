import React from 'react';
import { FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';
import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Cột 1: Thông tin */}
        <div className="footer-column">
          <h3 className="footer_heading">Velora Store</h3>
          <p className="footer-desc">Mang đến phong cách thể thao tự tin và thoải mái nhất mỗi ngày.</p>
          <div className="footer-contact">
            <p><strong>Địa chỉ:</strong> ĐH Giao Thông Vận Tải TP.HCM</p>
            <p><strong>Hotline:</strong> 0352 456 789</p>
          </div>
        </div>

        {/* Cột 2: Đăng ký */}
        <div className="footer-column">
          <h3 className="footer_heading">Đăng ký bản tin</h3>
          <form className="newsletter-form">
            <input type="email" placeholder="Email của bạn..." required />
            <button type="submit">Đăng ký</button>
          </form>
          <label className="checkbox-label">
            <input type="checkbox" /> Tôi đồng ý nhận bản tin.
          </label>
        </div>

        {/* Cột 3: Theo dõi */}
        <div className="footer-column">
          <h3 className="footer_heading">Theo dõi</h3>
          <div className="social-links">
            <a href="#" className="social-item"><FiFacebook /> Facebook</a>
            <a href="#" className="social-item"><FiInstagram /> Instagram</a>
            <a href="#" className="social-item"><FiLinkedin /> LinkedIn</a>
          </div>
        </div>

      </div>
      <div className="footer-bottom">© 2026 Velora Store. Bản quyền đã được bảo lưu.</div>
    </footer>
  );
}

export default Footer;