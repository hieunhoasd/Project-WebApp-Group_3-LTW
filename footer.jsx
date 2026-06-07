import "./footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3 className="footer_heading">CHĂM SÓC KHÁCH HÀNG</h3>
          <ul className="footer_list">
            <li><a href="#" className="footer-item__link">Trung Tâm Trợ Giúp</a></li>
            <li><a href="#" className="footer-item__link">Velora Mall</a></li>
            <li><a href="#" className="footer-item__link">Hướng dẫn mua hàng</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer_heading">GIỚI THIỆU</h3>
          <ul className="footer_list">
            <li><a href="#" className="footer-item__link">Giới thiệu</a></li>
            <li><a href="#" className="footer-item__link">Tuyển dụng</a></li>
            <li><a href="#" className="footer-item__link">Điều khoản</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer_heading">DANH MỤC</h3>
          <ul className="footer_list">
            <li><a href="#" className="footer-item__link">Trang điểm mặt</a></li>
            <li><a href="#" className="footer-item__link">Trang điểm môi</a></li>
            <li><a href="#" className="footer-item__link">Trang điểm mắt</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3 className="footer_heading">THEO DÕI</h3>
          <ul className="footer_list">
            <li><a href="#" className="footer-item__link">Facebook</a></li>
            <li><a href="#" className="footer-item__link">Instagram</a></li>
            <li><a href="#" className="footer-item__link">LinkedIn</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;