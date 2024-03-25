import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Slider from '../SliderComponent'
import MyContext from '../../contexts/MyContext';
import Footer from '../FooterComponent/FooterComponent';
import styles from './Home.module.css'


class Home extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: [],
    };
  }
  render() {
    const newprods = this.state.newprods.map((item) => {
      if (item && item._id) {
        return (
          <div key={item._id} className={styles.productContainer}>
          <figure className={styles.figure}>
            <Link to={'/product/'+item._id}>
              <img src={'data:image/jpg;base64,'+item.image} alt="" className={styles.image} />
            </Link>
            <figcaption className={styles.figcaption}>
              Tên Sản Phẩm: {item.name}<br />
              Giá: {item.price.toLocaleString('vi-VN')} VNĐ
            </figcaption>
          </figure>
        </div>
      );
      }
    });
    const hotprods = this.state.hotprods.map((item) => {
      if (item && item._id) {
        return (
          <div key={item._id} className={styles.productContainer}>
          <figure className={styles.figure}>
            <Link to={'/product/'+item._id}>
              <img src={'data:image/jpg;base64,'+item.image} alt="" className={styles.image} />
            </Link>
            <figcaption className={styles.figcaption}>
              Tên Sản Phẩm: {item.name}<br />
              Giá: {item.price.toLocaleString('vi-VN')} VNĐ
            </figcaption>
          </figure>
        </div>
        );
      }
    });
    return (
      
      
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <div>
        <Slider/>
        </div>
       
        <div className="align-center" style={{ marginTop: '30px' }}>
          <h2 className="text-center">SẢN PHẨM MỚI NHẤT</h2>
          {newprods}
        </div>
        {this.state.hotprods.length > 0 ?
          <div className="align-center">
            <h2 className="text-center">SẨN PHẨM HOT</h2>
            {hotprods}
          </div>
          : <div />}
            
            <Footer/>
          
      </div>
      
      
    );
  }
  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
    this.getCart();
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
  // apis
  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }
  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }
}
export default Home;
