import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../../utils/withRouter';
import { toast } from 'react-toastify';
import style from './Menu.module.css';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      notifications: [],
      txtKeyword: '',
      showMenu: false,
    };
    this.blinkInterval = null;
  }

  toggleMenu = () => {
    this.setState((prevState) => ({
      showMenu: !prevState.showMenu,
    }));
  };

  renderCategories = () => {
    return this.state.categories.map((item) => (
      <li key={item._id} className={style.menu}>
        <Link to={'/product/category/' + item._id}>{item.name}</Link>
      </li>
    ));
  };

  render() {
    return (
      <div className={style.borderBottom}>
        <div className={style.floatLeft}>
          <button className={style.toggleButton} onClick={this.toggleMenu}>
            <span>&#9776;</span> {/* Hamburger icon */}
          </button>
          <ul className={`${style.ulMenu} ${this.state.showMenu ? style.showMenu : ''}`} >
            DANH MỤC SẢN PHẨM {' '}{this.renderCategories()}
         
          <Link to='/about-product' className={style.aboutLink}>ABOUT</Link>  </ul>

        </div>
        <div className={style.floatRight}>
          <div className={style.searchContainer}>
            <input 
              type="search"
              placeholder="Từ khóa Sản Phẩm"
              className={style.keyword}
              value={this.state.txtKeyword}
              onChange={(e) => {
                this.setState({ txtKeyword: e.target.value });
              }}
            />
            <input
              type="submit"
              value="Tìm Kiếm"
              className={style.searchButton}
              onClick={(e) => this.btnSearchClick(e)}
            />
          </div>
        </div>
        <div className="float-clear" />
      </div>
    );
  }

  btnSearchClick = (e) => {
    e.preventDefault();
    if (this.state.txtKeyword) {
      this.props.navigate('/product/search/' + this.state.txtKeyword);
    } else {
      toast.info('Vui Lòng Nhập Thông Tin Tìm Kiếm');
    }
  };

  componentDidMount() {
    this.apiGetCategories();
  }

  apiGetCategories = () => {
    axios.get('/api/customer/categories').then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  };
}

export default withRouter(Menu);