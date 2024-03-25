import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import styles from '../CustomerComponent/Customer.module.css'

class Customer extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }
      render() {
        const customers = this.state.customers.map((item) => {
          return (
            <tr key={item._id} className='datatable' onClick={() => this.trCustomerClick(item)}>
              <td>{item._id}</td>
              <td>{item.username}</td>
              <td>{item.password}</td>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.email}</td>
              <td>{item.active}</td>
              <td>
                {item.active === 0 ? (
                  <span className={styles.link} onClick={() => this.lnkEmailClick(item)}>
                    EMAIL
                  </span>
                ) : (
                  <span className={styles.link} onClick={() => this.lnkDeactiveClick(item)}>
                    DEACTIVE
                  </span>
                )}
              </td>
            </tr>
          );
        });
    
        const orders = this.state.orders.map((item) => {
          return (
            <tr key={item._id} className={styles.datatable} onClick={() => this.trOrderClick(item)}>
              <td>{item._id}</td>
              <td>{new Date(item.cdate).toLocaleString()}</td>
              <td>{item.customer.name}</td>
              <td>{item.customer.phone}</td>
              <td>{(item.total).toLocaleString('vi-VN')} VNĐ</td>
              <td>{item.status}</td>
            </tr>
          );
        });
    
        if (this.state.order) {
          var items = this.state.order.items.map((item, index) => {
            return (
              <tr key={item.product._id} className={styles.datatable}>
                <td>{index + 1}</td>
                <td>{item.product._id}</td>
                <td>{item.product.name}</td>
                <td>
                  <img src={`data:image/jpg;base64,${item.product.image}`} width="70px" height="70px" alt="" />
                </td>
                <td>{(item.product.price).toLocaleString('vi-VN')} VNĐ</td>
                <td>{item.size}</td>
                <td>{item.quantity}</td>
                <td>{(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ</td>
              </tr>
            );
          });
        }
    
        return (
          <div>
            <div className={styles.tableContainer}>
              <h2 className={styles.title}>CUSTOMER LIST</h2>
              <table className={styles.datatable} border="1">
                <tbody>
                  <tr className={styles.datatable}>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>Tên Khách Hàng</th>
                    <th>Số Điện Thoại</th>
                    <th>Email</th>
                    <th>Active</th>
                    <th>Action</th>
                  </tr>
                  {customers}
                </tbody>
              </table>
            </div>
    
            {this.state.orders.length > 0 ? (
              <div className={styles.tableContainer}>
                <h2 className={styles.title}>ORDER LIST</h2>
                <table className={styles.datatable} border="1">
                  <tbody>
                    <tr className={styles.datatable}>
                      <th>ID</th>
                      <th>Ngày Đặt</th>
                      <th>Tên Khách Hàng</th>
                      <th>Số Điện Thoại</th>
                      <th>Tổng</th>
                      <th>Trạng Thái</th>
                    </tr>
                    {orders}
                  </tbody>
                </table>
              </div>
            ) : (
              <div />
            )}
    
            {this.state.order ? (
              <div className={styles.tableContainer}>
                <h2 className={styles.title}>ORDER DETAIL</h2>
                <table className={styles.datatable} border="1">
                  <tbody>
                    <tr className={styles.datatable}>
                      <th>STT</th>
                      <th>ID SP</th>
                      <th>Tên SP</th>
                      <th>Hình Ảnh</th>
                      <th>Giá</th>
                      <th>Size</th>
                      <th>Số Lượng</th>
                      <th>Tổng Giá</th>
                    </tr>
                    {items}
                  </tbody>
                </table>
              </div>
            ) : (
              <div />
            )}
          </div>
        );
      }
  componentDidMount() {
    this.apiGetCustomers();
    this.GetAdminToken();
  }

  GetAdminToken(){
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

  // event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }
  trOrderClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: result });
    });
  }
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }
  // apis
  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }
  // apis
  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }
}
export default Customer;