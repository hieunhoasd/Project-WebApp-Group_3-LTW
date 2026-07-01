import React from 'react';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <h1 className="about-title">Velora Store</h1>

            <div className="about-body">
                <p>
                    Chào mừng bạn đến với <strong>Velora</strong> - điểm đến lý tưởng cho những người yêu thích phong cách năng động và thể thao (SPORT • STYLE • YOU).
                </p>
                <p>
                    Được thành lập với sứ mệnh mang đến những sản phẩm chất lượng cao, thiết kế hiện đại và thoải mái nhất, Velora không chỉ bán quần áo hay phụ kiện, mà chúng tôi mang đến một phong cách sống. Dù bạn là một vận động viên chuyên nghiệp hay chỉ đơn giản là tìm kiếm sự thoải mái trong các hoạt động hằng ngày, Velora luôn có những lựa chọn phù hợp nhất dành cho bạn.
                </p>

                <h3 className="about-subtitle">Sứ mệnh của chúng tôi</h3>
                <p>
                    Cung cấp các sản phẩm thể thao và thời trang với chất lượng vượt trội, giá cả hợp lý và dịch vụ chăm sóc khách hàng tận tâm.
                </p>

                <h3 className="about-subtitle">Tầm nhìn</h3>
                <p>
                    Trở thành thương hiệu thời trang thể thao được yêu thích và tin dùng hàng đầu, đồng hành cùng hàng triệu khách hàng trên hành trình chinh phục bản thân.
                </p>
            </div>
        </div>
    );
};

export default About;