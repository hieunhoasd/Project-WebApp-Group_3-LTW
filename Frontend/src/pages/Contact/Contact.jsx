import React from 'react';
import './Contact.css';
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from "react-icons/io5";

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1 className="contact-title">Liên Hệ Với Chúng Tôi</h1>
                
                <div className="contact-wrapper">
                    {/* Cột thông tin */}
                    <div className="contact-info">
                        <h3>Thông tin cửa hàng Velora</h3>
                        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua các thông tin dưới đây:</p>
                        
                        <ul className="contact-list">
                            <li><div className="icon-box"><IoLocationOutline /></div> <span><strong>Địa chỉ:</strong> ĐH Giao Thông Vận Tải TP.HCM</span></li>
                            <li><div className="icon-box"><IoCallOutline /></div> <span><strong>Số điện thoại:</strong> 0352 456 789</span></li>
                            <li><div className="icon-box"><IoMailOutline /></div> <span><strong>Email:</strong> support@velora.vn</span></li>
                            <li><div className="icon-box"><IoTimeOutline /></div> <span><strong>Giờ làm việc:</strong> 8:00 AM - 9:00 PM</span></li>
                        </ul>
                    </div>

                    {/* Cột form */}
                    <div className="contact-form-container">
                        <h3>Gửi tin nhắn cho chúng tôi</h3>
                        <form className="contact-form">
                            <input type="text" placeholder="Họ và tên của bạn" required />
                            <input type="email" placeholder="Email liên hệ" required />
                            <textarea placeholder="Nội dung tin nhắn..." rows="5" required></textarea>
                            <button type="submit" className="submit-btn">Gửi Tin Nhắn</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;