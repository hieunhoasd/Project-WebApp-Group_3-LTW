import React from 'react';
import './Contact.css';
// Import các icon nét mảnh hiện đại từ react-icons
import { IoLocationOutline, IoCallOutline, IoMailOutline, IoTimeOutline } from "react-icons/io5";

const Contact = () => {
    return (
        <div className="contact-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Liên Hệ Với Chúng Tôi</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', justifyContent: 'space-between' }}>
                {/* Cột thông tin liên hệ */}
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <h3>Thông tin cửa hàng Velora</h3>
                    <p style={{ marginBottom: '25px', color: '#555' }}>
                        Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua các thông tin dưới đây:
                    </p>

                    {/* Đã chuyển sang dùng Flexbox để các hàng cách đều và căn giữa icon với chữ */}
                    <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* Vòng tròn viền nhạt bao quanh icon */}
                            <div style={{ backgroundColor: '#EEF2FF', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IoLocationOutline style={{ fontSize: '1.4rem', color: '#4F46E5' }} />
                            </div>
                            <span><strong>Địa chỉ:</strong> Trường Đại Học Giao Thông Vận Tải TP.HCM</span>
                        </li>

                        <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: '#EEF2FF', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IoCallOutline style={{ fontSize: '1.4rem', color: '#4F46E5' }} />
                            </div>
                            <span><strong>Số điện thoại:</strong> 0252 456 789</span>
                        </li>

                        <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: '#EEF2FF', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IoMailOutline style={{ fontSize: '1.4rem', color: '#4F46E5' }} />
                            </div>
                            <span><strong>Email:</strong> support@velora.vn</span>
                        </li>

                        <li style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ backgroundColor: '#EEF2FF', padding: '12px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IoTimeOutline style={{ fontSize: '1.4rem', color: '#4F46E5' }} />
                            </div>
                            <span><strong>Giờ làm việc:</strong> 8:00 AM - 9:00 PM (Tất cả các ngày)</span>
                        </li>
                    </ul>
                </div>

                {/* Cột form liên hệ */}
                <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                    <h3 style={{ marginBottom: '5px' }}>Gửi tin nhắn cho Velora</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                        <input
                            type="text"
                            placeholder="Họ và tên của bạn"
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email liên hệ"
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                        <textarea
                            placeholder="Nội dung tin nhắn..."
                            rows="5"
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', resize: 'vertical', outline: 'none' }}
                            required
                        ></textarea>
                        <button
                            type="submit"
                            style={{ padding: '14px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s' }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#4338ca'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#4F46E5'}
                        >
                            Gửi Tin Nhắn
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;