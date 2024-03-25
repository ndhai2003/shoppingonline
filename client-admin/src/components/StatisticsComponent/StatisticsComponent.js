// Satistics.jsx
import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import styles from '../StatisticsComponent/thongke.module.css'

class Satistics extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      thongke: {},
      itemSelected: null,
    };
  }

  render() {
    const { thongke } = this.state;
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>THỐNG KÊ SỐ LƯỢNG</h2>
        <div className={styles.formContainer1}>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}> Tổng Khách Hàng</h2>
          <h3 className={styles.title}>{thongke.customersCount}</h3>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng Danh Mục</h2>
          <h2 className={styles.title}>{thongke.categoriesCount}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng Sản Phẩm</h2>
          <h2 className={styles.title}> {thongke.productCount}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng ORDER PENDING</h2>
          <h2 className={styles.title}>{thongke.orderCountPENDING}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng ORDER APPROVED</h2>
          <h2 className={styles.title}>{thongke.orderCountAPPROVED}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng ORDER CANCELED</h2>
          <h2 className={styles.title}>{thongke.orderCountCANCELED}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng ORDER HUỶ ĐƠN TỪ KH</h2>
          <h2 className={styles.title}>{thongke.orderCountHUYDON}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng Size </h2>
          <h2 className={styles.title}>{thongke.sizeCount}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng Slider</h2>
          <h2 className={styles.title}>{thongke.sliderCount}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng Thông Báo</h2>
          <h2 className={styles.title}>{thongke.notiCount}</h2>
        </div>
        <div className={styles.formContainer2}>
          <h2 className={styles.title}>Tổng Doanh Thu</h2>
          <h2 className={styles.title}> {thongke.doanhthu ? thongke.doanhthu.toLocaleString('vi-VN'):''} VNĐ</h2>
        
        </div>
       </div>
        
      </div>
    );
 

    
  }

  componentDidMount() {
    this.apiGetSatistics();
    this.GetAdminToken();
  }

  GetAdminToken() {
    const token_admin = localStorage.getItem('token_admin');
    const config = { headers: { 'x-access-token': token_admin } };

    axios.get('/api/admin/getadmintoken/', config).then((res) => {
      const result = res.data;
      if (result && result.success === false) {
        this.context.setAdmin(null);
        this.context.setToken('');
      } else {
        this.context.setToken(token_admin);
        this.context.setAdmin(result);
        this.context.setUsername(result.username);
      }
    });
  }

  // apis
  apiGetSatistics() {
    const config = { headers: { 'x-access-token': this.context.token } };

    axios.get('/api/admin/thongke', config).then((res) => {
      const result = res.data;
      this.setState({ thongke: result });
    });
  }
}

export default Satistics;
