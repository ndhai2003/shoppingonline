import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from '../OrderComponent/Order.module.css'

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    const orders = this.state.orders.map((item) => {
      let Straddress =
      item.customer.address.sonha +
        ' ' +
        item.customer.address.phuong +
        ' ' +
        item.customer.address.quan +
        ' ' +
        item.customer.address.thanhpho;
      
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer.name}</td>
          <td>{item.customer.phone}</td>
          <td>{Straddress}</td>
          <td>{(item.total).toLocaleString('vi-VN')} VNĐ</td>
          <td>{item.status}</td>
          <td>
            {item.status === 'PENDING' ? (
              <div>
              <button className={styles.link} onClick={() => this.lnkApproveClick(item._id)}>APPROVE</button> 
              <button className={styles.link1} onClick={() => this.lnkCancelClick(item._id)}>CANCEL</button>
            </div>
            
            ) : (
              <div />
            )}
          </td>
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
            <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
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
        <h2 className={styles.title}>ORDER DETAIL</h2>
        <table className={styles.datatable} border="1">
            <tbody>
            <tr className={styles.datatable}>
                <th>ID</th>
                <th>Ngày Đặt</th>
                <th>Tên Khách Hàng</th>
                <th>Số điện thoại</th>
                <th>Địa Chỉ</th>
                <th>Tổng</th>
                <th>Trạng Thái</th>
                <th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>
        {this.state.order ?
           <div className={styles.tableContainer}>
           <h2 className={styles.title}>ORDER DETAIL</h2>
           <table className={styles.datatable} border="1">
              <tbody>
              <tr className={styles.datatable}>
                  <th>STT</th>
                  <th>ID SP	</th>
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
          : <div />}
      </div>
    );
  }
  componentDidMount() {
    this.GetAdminToken();
    this.apiGetOrders();
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
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }
  lnkApproveClick(id) {
    this.apiPutOrderStatus(id, 'APPROVED');
    
  }
  lnkCancelClick(id) {
    this.apiPutOrderStatus(id, 'CANCELED');
  }
  // apis
  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
        toast.success(status+" Thành Công")
      } else {
        toast.error(status+" Không Thành Công")
      }
    });
  }

}
export default Order;