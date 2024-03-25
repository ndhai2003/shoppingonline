import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import MyContext from '../../contexts/MyContext';
import anh1 from '../../assets/images/logo.png';

class Inform extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      showLinks: false,
      notificationBlink: false,
      showNotifications: false, // Add this line
    };
  }

  render() {
    return (
      <div className="border-bottom">
        
        <div className="logo-container">
          <Link to='/'>
            <img src={anh1} alt="Home" className="logo-image"  />
          </Link>
        </div>

        <div className="float-left" onMouseLeave={() => this.toggleLinks(false)} onMouseEnter={() => this.toggleLinks(true)}>
            {this.context.customer === null ? (
              <div>
                <Link to='/login' style={{ textDecoration: 'none' }}>Đăng Nhập</Link> | <Link to='/signup' style={{ textDecoration: 'none' }}>Đăng Ký |</Link>
              </div>
            ) : (
              <div className="profile-container">
                <div className="profile-info">
                  Xin Chào <b>{this.context.customer.name} </b> |
                </div>
                {this.state.showLinks && (
                  <div className="profile-links" style={{width:'200px'}}>
                    <Link to='/myprofile'>Thông Tin Khách Hàng</Link>
                    <Link to='/myorders'>Đơn Hàng Đã Đặt</Link>
                    <Link to='/myproductfavorite'>Sản Phẩm Yêu Thích</Link>
                    <Link to='/home' onClick={() => this.lnkLogoutClick()}>Đăng Xuất</Link>
                  </div>
                )}
              </div>
            )}
        </div>
             
        <div className='float-left' style={{ marginLeft: '5px' }}>
        <Link to='/mycart' style={{ textDecoration: 'none' ,}}> Giỏ Hàng</Link> có <b>{this.context.mycart.length} </b> SP
        </div>
      
     
                <div className="float-right" style={{ marginLeft: '30px' }}>
          {this.state.notifications.length > 0 && (
            <span className={`cart__num c-whi f-thin c-red${this.state.notificationBlink ? ' blink' : ''}`} style={{ borderColor: this.state.darkMode ? '#yourDarkModeBorderColor' : '#yourLightModeBorderColor' }}>
              Có {this.state.notifications.length}{' '}
              <span className={`notification-icon${this.state.notifications.length > 0 ? ' with-notification' : ''}`} onClick={this.toggleNotifications}>
                🛎️
              </span>{' '}
              Thông Báo
            </span>
          )}
          {this.state.showNotifications && (
            <div className={`notifications-container right-positioned ${this.state.darkMode ? 'dark-mode' : ''}`}>
              {this.state.notifications.map((item) => (
                <div key={item._id} className={'notification-item'}>
                  <span onClick={() => this.selectNotification(item)}>{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="float-right">
      <div class="form-switch">
        <input class="form-check-input" type="checkbox" onChange={(e) => this.ckbChangeMode(e)} />&nbsp; Light / Dark mode
      </div>
      </div>
        <div className="float-clear" />
      </div>
    );
  }


  ckbChangeMode(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', 'light');
    }
  }
  

  selectNotification = (notification) => {
    this.setState({ selectedNotification: notification });
    // Thực hiện các hành động khác khi một thông báo được chọn
  };

  componentDidMount() {
    this.GetUserToken();
    this.apiGetNotifications();
    // Bắt đầu nhấp nháy khi component được mount
    this.blinkInterval = setInterval(() => {
      this.setState((prevState) => ({
        notificationBlink: !prevState.notificationBlink,
      }));
    }, 1000); // 1 giây
    this.getCart();
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
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
        this.context.setToken(token_user);
       this.context.setCustomer(result);
      }
    });
  }

  componentWillUnmount() {
    // Hủy đăng ký interval khi component unmount
    clearInterval(this.blinkInterval);
  }

  apiGetNotifications = () => {
    axios.get('/api/customer/notifications').then((res) => {
      const result = res.data;
      this.setState({ notifications: result });
    });
  };

  // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMycart([]);
    localStorage.removeItem('token_user');
  }

  toggleLinks(show) {
    this.setState({ showLinks: show });
  }

  toggleNotifications = () => {
    this.setState((prevState) => ({
      showNotifications: !prevState.showNotifications,
      notificationBlink: false, // Tắt nhấp nháy khi hiển thị thông báo
    }));
  };
}

export default Inform;
