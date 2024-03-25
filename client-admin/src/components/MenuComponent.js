import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';


class Menu extends Component {
  static contextType = MyContext; // using this.context to access global state
  render() {
    return (
      <div className="border-bottom" style={{ display: 'flex' }}>
      
          <ul className="menu" style={{ flexDirection: 'column' }}>
            <li className="menu"><Link to='/admin/home'>Home</Link></li>
            <li className="menu"><Link to='/admin/category'>Danh Mục</Link></li>
            <li className="menu"><Link to='/admin/size'>Size</Link></li>
            <li className="menu"><Link to='/admin/product'>Sản Phẩm</Link></li>
            <li className="menu"><Link to='/admin/order'>Order</Link></li>
            <li className="menu"><Link to='/admin/customer'>Thành Viên</Link></li>
            <li className="menu"><Link to='/admin/notification'>Thông Báo</Link></li>
            <li className="menu"><Link to='/admin/slider'>Slider</Link></li>
            <li className="menu"><Link to='/admin/thongke'>Thống Kê</Link></li>
            <li className="menu"><Link to='/admin/contact'>Liên Hệ</Link></li>
          </ul>
       
        <div className="float-right">
          HELLO <b>{this.context.username}</b> {}
          <Link to='/admin/home' onClick={() => this.lnkLogoutClick()}>Đăng Xuất</Link>
        </div>
        <div className="float-clear" />
      </div>
    );
  }
  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
    localStorage.removeItem('token_admin');
    this.context.setAdmin(null);
  }
}
export default Menu;