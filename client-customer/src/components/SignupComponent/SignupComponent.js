import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../../utils/withRouter';
import { toast } from 'react-toastify';
import MyContext from '../../contexts/MyContext';
import style from './Signup.module.css'

class Signup extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: ''
    };
  }
  render() {
    return (
      <div className={style.container}>
        <div className={style.formContainer}>
          <h2 className={style.title}>Đăng Ký</h2>
          <form>
            <input className={style.inputField} type="text" placeholder="Tài Khoản" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} />
            <input className={style.inputField} type="password" placeholder="Mật Khẩu" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} />
            <input className={style.inputField} type="text" placeholder="Họ và Tên" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} />
            <input className={style.inputField} type="text" placeholder="Số Điện Thoại" value={this.state.txtPhone} onChange={(e) => { this.setState({ txtPhone: e.target.value }) }} />
            <input className={style.inputField} type="text" placeholder="Email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} />
            <button className={style.submitButton} type="submit" onClick={(e) => this.btnSignupClick(e)}>Đăng Ký</button>
          </form>
          <button className={style.secondaryButton} type="button" onClick={(e) => this.btnActiveClick(e)}>Xác Thực Tài Khoản</button>
        </div>
      </div>
    );
  }

  btnActiveClick(e) {
    e.preventDefault();
    this.props.navigate('/active');
  }

  // event-handlers
  btnSignupClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const account = { username: username, password: password, name: name, phone: phone, email: email };
      this.apiSignup(account);
    } else {
      toast.info('Vui Lòng Nhập Đầy Đủ Thông Tin')
    }
  }
  // apis
  apiSignup(account) {
    axios.post('/api/customer/signup', account).then((res) => {
      const result = res.data;
      toast.success(result.message);
      this.props.navigate('/active');

    });
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
  componentDidMount(){
    this.getCart();
  }
}
export default withRouter(Signup);