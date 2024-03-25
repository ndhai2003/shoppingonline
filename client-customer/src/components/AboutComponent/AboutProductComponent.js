import React from 'react';
import Footer from '../FooterComponent/FooterComponent';
import productImage from '../../assets/images/c2.jpg';
import missionImage from '../../assets/images/x2.jpg';

const AboutProduct = () => {
  const paragraphStyle = {
    fontSize: '24px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  };
  const centerTextStyle = {
    textAlign: 'center',
  };

  return (
    <div>
   <h1 style={centerTextStyle}>ABOUT</h1>
         <div>
        <img src={productImage} alt="Product" style={{ width: '1150px', height: 'auto' }} />
      </div>
      <p style={paragraphStyle}>
        Trang web bán quần áo online T-SHOP của chúng tôi mang lại sự tiện lợi với giao diện thân thiện và đa dạng sản phẩm chất lượng. 
        Chúng tôi không chỉ cung cấp sản phẩm mà còn tôn vinh sự độc đáo và phong cách. Trải nghiệm mua sắm được thiết kế đơn giản, an toàn. Cam kết bảo vệ thông tin cá nhân và đội ngũ hỗ trợ khách hàng sẵn sàng giúp đỡ. Sự hài lòng của bạn là ưu tiên hàng đầu của chúng tôi!
      </p>
      <div>
        <img src={missionImage} alt="Mission" style={{ width: '1150px', height: 'auto' }} />
      </div>
      <p style={paragraphStyle}>
      T-shop khích lệ mỗi người thể hiện phong cách riêng qua những sản phẩm thời trang sáng tạo, đầy năng động và phản ánh giá trị của thế hệ mới.

Với sự chú trọng đến chi tiết và nghệ thuật, T-shop cam kết mang đến trải nghiệm tốt nhất, từ chất lượng sản phẩm đến hình ảnh và bao bì.

Là thương hiệu thời trang đường phố hàng đầu, T-shop là điểm đến yêu thích của giới trẻ Việt Nam, luôn khẳng định phong cách và cá tính của mỗi cá nhân.      </p>
      {/* Thêm ảnh bổ sung ở cuối */}
     
            
            <Footer/>
          
    
    </div>
   
  

  );
  
};



export default AboutProduct;
