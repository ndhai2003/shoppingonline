import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import style from '../LoginComponent/Login.module.css'
class Login extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtUsername: 'admin',
      txtPassword: '123'
    };
  }
  render() {
    if (this.context.admin===null) {
      return (
        <div className={style.container}>
          <div className={style.formContainer}>
            <h2 className={style.title}>Đăng Nhập ADMIN</h2>
            <form>
              <input className={style.inputField} type="text" placeholder="Tài Khoản" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} />
              <input className={style.inputField} type="password" placeholder="Mật Khẩu" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} />
              <button className={style.submitButton} type="submit" onClick={(e) => this.btnLoginClick(e)}>Đăng Nhập</button>
            </form>
          </div>
        </div>
      );
    }
    return (<div />);
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
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
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
      
      }
    });

  }
  componentDidMount() {
    this.GetAdminToken();
  }

  // apis
  apiLogin(account) {
    axios.post('/api/admin/login', account).then((res) => {
      const result = res.data;
      if (result.success === true) {
        this.context.setAdmin(result.admin);
        localStorage.setItem("token_admin",result.token);
        this.context.setToken(result.token);
        this.context.setUsername(account.username);
        toast.success("Đăng Nhập Thành Công");
      } else {
        toast.error(result.message);
      }
    });
  }
}
export default Login;