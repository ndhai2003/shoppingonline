import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import ProductDetail from '../ProductComponent/ProductDetailComponent';
import styles from '../ProductComponent/Product.module.css'

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      noPages: 0,
      curPage: 1,
      itemSelected: null
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
   
      return (
        
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{(item.price).toLocaleString('vi-VN')} VNĐ</td>
          <td>{(item.sale)} %</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.category.name}</td>
          <td><img src={"data:image/jpg;base64," + item.image} width="100px" height="100px" alt="" /></td>
          <td>
        {item.imageDetail && item.imageDetail.length > 0 ? (
          item.imageDetail.map((image, index) => (
            <img
              key={index}
              src={"data:image/jpg;base64,"+image}
              width="100px"
              height="100px"
              alt=""
            />
          ))
        ) : (
          <span>Không Có Hình Ảnh</span>
        )}
      </td>
        </tr>
      );
    });
    const pagination = Array.from({ length: this.state.noPages }, (_, index) => {
      if ((index + 1) === this.state.curPage) {
        return (<span key={index}>| <b>{index + 1}</b> |</span>);
      } else {
        return (<span key={index} className="link" onClick={() => this.lnkPageClick(index + 1)}>| {index + 1} |</span>);
      }
    });
    return (
      <div>
        <div className={styles.tableContainer}>
          <h2 className="text-center">DANH SÁCH SẢN PHẨM</h2>
          <table className={styles.datatable} border="1">
            <tbody>
              <tr className={styles.datatable}>
                <th>ID</th>
                <th>Tên Sản Phẩm</th>
                <th>Giá</th>
                <th>SALE</th>
                <th>Ngày Tạo</th>
                <th>Danh Mục</th>
                <th>Ảnh Chính</th>
                <th>Ảnh Chi Tiết</th>
              </tr>
              {prods}
              <tr>
                <td colSpan="8">{pagination}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.inline} />
        <ProductDetail item={this.state.itemSelected} curPage={this.state.curPage} updateProducts={this.updateProducts} />
        <div className={styles.floatClear} />
      </div>
    );
  }
  updateProducts = (products, noPages, curPage) => { // arrow-function
    this.setState({ products: products, noPages: noPages, curPage: curPage });
  }
  componentDidMount() {
    this.GetAdminToken();
    this.apiGetProducts(this.state.curPage);
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
  lnkPageClick(index) {
    this.apiGetProducts(index);
  }
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetProducts(page) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/products?page=' + page, config).then((res) => {
      const result = res.data;
      this.setState({ products: result.products, noPages: result.noPages, curPage: result.curPage });
    });
  }
}
export default Product;