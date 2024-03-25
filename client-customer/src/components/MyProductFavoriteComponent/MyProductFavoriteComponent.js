import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../../contexts/MyContext';
import withRouter from '../../utils/withRouter';
import { toast } from 'react-toastify';
import styles from '../MyProductFavoriteComponent/Favorite.module.css'

class MyProductFavorite extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      productfavorites: [],
    };
  }

  render() {
    if (this.context.customer === '') return <Navigate replace to="/login" />;

    const productfavorites = this.state.productfavorites.map((items, index) => (
      <React.Fragment key={items._id}>
        <tr className="datatable">
          <td>{index + 1}</td>
          {/* <td>{items.product._id}</td> */}
          <td>{this.formatDate(items.product.cdate)}</td>
          <td>{items.product.name}</td>
          <td>{(items.product.price).toLocaleString('vi-VN')} VNĐ</td>
          <td>
            <img src={`data:image/jpg;base64,${items.product.image}`} width="150px" height="150px" alt="" />
          </td>
          <td>
            <button className={styles.link} onClick={() => this.apiViewDetails(items.product._id)}>Xem chi tiết</button>
            <button className={styles.link1} onClick={() => this.apiDeleteProductFavorite(items._id)}>Xoá</button>
         
          </td>
        </tr>
      </React.Fragment>
    ));


    return (
      <div className={styles.container}>
        <div className={styles.tableContainer}>
          <h2 className={styles.title}>ITEM LIST</h2>
          <table className={styles.datatable}>
            <tbody>
              <tr className={styles.datatable}>
              <th>STT</th>
                <th>Ngày Thêm</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Ảnh</th>
                <th>Chức Năng</th>
              </tr>
              {productfavorites}
            
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  

  
  componentDidMount() {
    this.GetUserToken();
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetProductFavoritesByCustID(cid);
    }
  }

  formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString(); 
  }

  apiViewDetails(items) {
    this.props.navigate('/product/'+items);
  }

  apiDeleteProductFavorite(id) {
    const config = { headers: { 'x-access-token': this.context.token} };
    axios.delete('/api/customer/productfavorites/'+id, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Xoá Thành Công");
        this.apiGetProductFavorites();
      } else {
        toast.error("Xoá Không Thành Công");
      }
    });
  }


  apiGetProductFavorites() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/customer/productfavorites', config).then((res) => {
      const result = res.data;
      this.updateProductFavorites(result);
    });
  }
  updateProductFavorites = (productfavorites) => {
    this.setState({ productfavorites });
  };


  GetUserToken(){
    const token_user = localStorage.getItem('token_user');
    const config = { headers: { 'x-access-token': token_user } };
    axios.get('/api/customer/getusertoken/', config).then((res) => {
      const result = res.data;
      if(result && result.success===false){
         this.context.setCustomer(null);
         this.context.setToken('');
      }
      else{
        this.context.setToken(token_user);
        this.context.setCustomer(result);
      }
          
    });
  }
  


  apiGetProductFavoritesByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token} };
    axios.get(`/api/customer/productfavorites/customer/${cid}`, config).then((res) => {
      const result = res.data;
      this.updateProductFavorites(result);
    });
  }
}

export default withRouter(MyProductFavorite);
