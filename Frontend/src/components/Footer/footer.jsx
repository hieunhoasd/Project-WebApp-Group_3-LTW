import { Link } from "react-router-dom";
import "./footer.css";

// Import các icon nét thanh từ bộ Feather Icons
import { FiFacebook, FiInstagram, FiLinkedin } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* CỘT 1: CHĂM SÓC KHÁCH HÀNG */}
        <div className="footer-column">
          <h3 className="footer_heading">CHĂM SÓC KHÁCH HÀNG</h3>
          <ul className="footer_list">
            <li><a href="javascript:void(0)" className="footer-item__link">Trung Tâm Trợ Giúp</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Velora Store</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Hướng dẫn mua hàng</a></li>
          </ul>
        </div>

        {/* CỘT 2: THÔNG TIN CỬA HÀNG */}
        <div className="footer-column" id="thong-tin-cua-hang">
          <h3 className="footer_heading">THÔNG TIN CỬA HÀNG</h3>
          <ul className="footer_list">
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                Địa chỉ: Trường Đại Học Giao Thông Vận Tải TP.HCM
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                Số điện thoại: 0352.456.789
              </a>
            </li>
            <li><a href="javascript:void(0)" className="footer-item__link">Điều khoản</a></li>
          </ul>
        </div>

        {/* CỘT 3: THEO DÕI (Đã tích hợp icon mới) */}
        <div className="footer-column">
          <h3 className="footer_heading">THEO DÕI</h3>
          <ul className="footer_list">
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                <FiFacebook size={20} className="social-icon" /> Facebook
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                <FiInstagram size={20} className="social-icon" /> Instagram
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                <FiLinkedin size={20} className="social-icon" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;