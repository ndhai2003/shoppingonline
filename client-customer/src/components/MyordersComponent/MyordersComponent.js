import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../../contexts/MyContext';
import style from './Myorders.module.css'
import { toast } from 'react-toastify';
import withRouter from '../../utils/withRouter';

class Myorders extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null
    };
  }
  render() {
    if (this.context.customer === '') return <Navigate replace to="/login" />;
    const orders = this.state.orders.map((item, index) => {
      let Straddress =
        item.customer.address.sonha +
        ' ' +
        item.customer.address.phuong +
        ' ' +
        item.customer.address.quan +
        ' ' +
        item.customer.address.thanhpho;
        return (
          <tr
            key={item._id}
            className={style.datatable}
            onClick={() => this.trItemClick(item)}
          >
            <td>{index + 1}</td>
            <td>{item._id}</td>
            <td>{new Date(item.cdate).toLocaleString()}</td>
            <td>{item.customer.name}</td>
            <td>{item.customer.phone}</td>
            <td>{Straddress}</td>
            <td>{(item.total).toLocaleString('vi-VN')} VNĐ</td>
            <td>{item.status}</td>
            <td>
              {item.status !== "HUỶ ĐƠN" && item.status !== "CANCELED" && item.status !== "APPROVED" ? (
                <>
                  <button
                    className={style.link}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.lnkHUYClick(item._id);
                    }}
                  >
                    Huỷ Đơn Hàng
                  </button>
                  <button
                    className={style.link1}
                    onClick={(e) => {
                      e.stopPropagation();
                      this.apiGetOrdersByID(item._id);
                    }}
                  >
                    Cập Nhập Địa Chỉ
                  </button>
                </>
              ) : null}
            </td>
          </tr>
        );
        
    });

    if (this.state.order) {
      var items = this.state.order.items.map((item, index) => {
        return (
          <tr key={item.product._id} className={style.datatable}>
            <td>{index + 1}</td>
            <td>{item.product.name}</td>
            <td>
              <img
                src={'data:image/jpg;base64,' + item.product.image}
                width="70px"
                height="70px"
                alt=""
              />
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
        <div className={style.container}>
          <div className={style.tableContainer}>
            <h2 className={style.title}>ORDER LIST</h2>
            <table className={style.datatable}>
              <tbody>
                <tr className={style.datatable}>
                  <th>STT</th>
                  <th>ID</th>
                  <th>Ngày Đặt</th>
                  <th>Tên Khách Hàng</th>
                  <th>Số điện thoại</th>
                  <th>Địa Chỉ</th>
                  <th>Tổng</th>
                  <th>Trạng Thái</th>  
                  <th>Chức Năng</th>
                </tr>
                {orders}
              </tbody>
            </table>
          </div>
        </div>
        {this.state.order ? (
          <div className={style.container}>
            <div className={style.detailTableContainer}>
              <h2 className={style.title}>ORDER DETAIL</h2>
              <table className={style.datatable}>
                <tbody>
                  <tr className={style.datatable}>
                    <th>STT</th>
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
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }

  lnkHUYClick(id) {
      this.apiPutOrderStatus(id, 'HUỶ ĐƠN');
      
  }
  // apis
  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
      this.apiGetOrdersByCustID(this.context.customer._id);
        toast.success(status+" Thành Công")
      } else {
        toast.error(status+" Không Thành Công")
      }
    });
  }
  GetUserToken(){
    const token_user = localStorage.getItem('token_user');
    const config = { headers: { 'x-access-token': token_user } };
    axios.get('/api/customer/getusertoken/', config).then((res) => {
      const result = res.data;
      if (result && result.success === false) {
        this.context.setCustomer(null);
        this.context.setToken('');
      } else {
       this.context.setCustomer(result);
        if (this.context.customer) {
          const cid = this.context.customer._id;
          this.apiGetOrdersByCustID(cid);
        }
      }
    });
  }
  apiGetOrdersByID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/' + cid, config).then((res) => {
      const result = res.data;
     if(result){
      console.log(result);
      this.context.setOrder(result)
     
      this.props.navigate('/addressupdate');
     }
   
    });
  }
  
  componentDidMount() {
    this.GetUserToken();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ order: item });
  }
  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/orders/customer/' + cid, config)
      .then((res) => {
        const orders = res.data;
  
        // Sắp xếp đơn hàng theo thời gian tăng dần
        const sortedOrders = orders.sort((a, b) => b.cdate-a.cdate);
  
        // Cập nhật trạng thái với mảng đơn hàng đã sắp xếp
        this.setState({ orders: sortedOrders });
  
        // In thông tin đơn hàng từ mới đến cũ ra console
        console.log('Orders from newest to oldest:', sortedOrders);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }
  
}
export default withRouter(Myorders);
