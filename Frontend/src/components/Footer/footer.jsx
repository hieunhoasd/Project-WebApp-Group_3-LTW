import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3 className="footer_heading">CHĂM SÓC KHÁCH HÀNG</h3>
          <ul className="footer_list">
            <li><a href="javascript:void(0)" className="footer-item__link">Trung Tâm Trợ Giúp</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Velora Store</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Hướng dẫn mua hàng</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer_heading">THÔNG TIN CỬA HÀNG</h3>
          <ul className="footer_list">
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                Địa chỉ: Trường Đại Học Giao Thông Vận Tải TP.HCM
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                Số điện thoại:0352.456.789
              </a>
            </li>
            <li><a href="javascript:void(0)" className="footer-item__link">Điều khoản</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer_heading">DANH MỤC</h3>
          <ul className="footer_list">
            <li><a href="javascript:void(0)" className="footer-item__link">Quần áo nam</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Quần áo nữ</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Áo khoác</a></li>
            <li><a href="javascript:void(0)" className="footer-item__link">Giày</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer_heading">THEO DÕI</h3>
          <ul className="footer_list">
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                <img src="/src/assets/images/fb.png" alt="Fb"/>
                Facebook
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                <img src="/src/assets/images/instagram.png" alt="ins"/>
                Instagram
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" className="footer-item__link">
                <img src="/src/assets/images/linkedin.png" alt="linked"/>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;