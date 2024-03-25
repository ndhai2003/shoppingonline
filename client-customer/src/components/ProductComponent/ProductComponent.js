import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../../utils/withRouter';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from './Product.module.css'

class Product extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sort: null,
    };
  }
  render() {
    const prods = this.state.products.map((item) => {
      return (
        <div key={item._id} className={styles.productContainer}>
          <figure className={styles.figure}>
            <Link to={'/product/'+item._id}>
              <img src={'data:image/jpg;base64,'+item.image} alt="" className={styles.image} />
            </Link>
            <figcaption className={styles.figcaption}>
              Tên Sản Phẩm: {item.name}<br />
              Giá: {item.price.toLocaleString('vi-VN')} VNĐ<br />
              {item.sale > 0 && (
                <>
                <span className={styles.saleIcon}>SALE {item.sale} %</span><br />
                <span>Giảm Còn: {(item.price-(item.price)*(item.sale )/100).toLocaleString('vi-VN')} VNĐ</span>
              </>
            )}
            </figcaption>
          </figure>
        </div>
      );
    });
    return (
      <div className="text-center">
        <h2 className="text-center">Danh Sách Sản Phẩm</h2>
        <div/>
        <select
         value={this.state.sort}
          onChange={(e) => this.handleSortChange(e.target.value)}
        >
          <option value="nameAsc">Tên SP (A-Z)</option>
          <option value="nameDesc">Tên SP (Z-A)</option>
          <option value="priceAsc">Giá (Thấp → Cao)</option>
          <option value="priceAsc">Giá (Cao → Thấp)</option>
        </select>
          <div/>
        {prods}
      </div>
    );
  }

  componentDidMount() { 
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    }else if(params.keyword){
        this.apiGetProductsByKeyword(params.keyword);
    }
    this.getCart();
  }
  componentDidUpdate(prevProps) { 
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    }else if(params.keyword && params.keyword !== prevProps.params.keyword){
        this.apiGetProductsByKeyword(params.keyword);

    }
  }
   // apis
   apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
        if (Array.isArray(result) && result.length > 0) {
          this.setState({ products: result });
          toast.success("Tìm Kiếm Sản Phẩm Thành Công");
        } else {
           toast.error("Không Tìm Thấy Sản Phẩm");
        }
        
      
    });
  }
  // apis
  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
  handleSortChange = (sort) => {
    this.setState({ sort }, () => {
      if (this.state.sort === 'nameAsc') {
        this.state.products.sort((a, b) => a.name.localeCompare(b.name));
      } else if (this.state.sort === 'nameDesc') {
        this.state.products.sort((a, b) => b.name.localeCompare(a.name));
      } else if (this.state.sort === 'priceAsc') {
        this.state.products.sort((a, b) => a.price - b.price);
      } else if (this.state.sort === 'priceDesc') {
        this.state.products.sort((a, b) => b.price - a.price);
      }
    });
  };
}
export default withRouter(Product);
