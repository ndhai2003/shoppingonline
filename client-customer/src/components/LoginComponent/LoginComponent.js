import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import withRouter from '../../utils/withRouter';
import { toast } from 'react-toastify';
import style from './Login.module.css'

class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: '',
      txtPassword: ''
    };
  }
  render() {
    return (
      <div className={style.container}>
        <div className={style.formContainer}>
          <h2 className={style.title}>Đăng Nhập</h2>
          <form>
            <input className={style.inputField} type="text" placeholder="Tài Khoản" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} />
            <input className={style.inputField} type="password" placeholder="Mật Khẩu" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} />
            <button className={style.submitButton} type="submit" onClick={(e) => this.btnLoginClick(e)}>Đăng Nhập</button>
          </form>
          <button className={style.secondaryButton} type="button" onClick={(e) => this.btnResetPasswordClick(e)}>Quên Mật Khẩu</button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.GetUserToken();
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
       this.props.navigate('/home');
      }
    });
  }

  btnResetPasswordClick(e) {
    e.preventDefault();
    this.props.navigate('/reset-password');
  }
  // event-handlers
  btnLoginClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    if (username && password) {
      const account = { username: username, password: password };
      this.apiLogin(account);
    } else {
      toast.error('Vui Lòng Nhập Tài Khoản Và Mật Khẩu');
    }
  }
  // apis
  apiLogin(account) {
    axios.post('/api/customer/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setToken(result.token);
       localStorage.setItem("token_user",result.token);
        this.context.setCustomer(result.customer);
        console.log()
        toast.success('Đăng Nhập Thành Công');
        this.props.navigate('/home');
      } else {
        alert(result.message);
      }
    });
  }
}
export default withRouter(Login);
