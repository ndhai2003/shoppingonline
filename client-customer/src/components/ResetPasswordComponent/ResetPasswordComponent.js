import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import MyContext from '../../contexts/MyContext';
import style from './Reset.module.css'
import withRouter from '../../utils/withRouter';

class ResetPW extends Component {
      static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtEmail: '',
      txtPassword: '',
      txtToken: '',

    };
  }
  render() {
    return (
      <div className={style.container}>
      <div className={style.formContainer}>
        <h2 className={style.title}>Khôi Phục Mật Khẩu</h2>
        <form>
          <div className={style.inputRow}>
            <input className={style.inputField} type="text" placeholder="Email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }}/>
            <button
              className={style.submitButtonSend}
              type="button"
              onClick={(e) => this.btnSendTokenClick(e)}
            >
              Gửi TOKEN
            </button>
          </div>
          <input
            className={style.inputField}
            type="text"
            placeholder="TOKEN"
            value={this.state.txtToken}
            onChange={(e) => { this.setState({ txtToken: e.target.value }) }}
          />
          <input
            className={style.inputField}
            type="password"
            placeholder="Mật Khẩu Mới"
            value={this.state.txtPassword}
            onChange={(e) => { this.setState({ txtPassword: e.target.value }) }}
          />
          <button
            className={style.submitButton}
            type="submit"
            onClick={(e) => this.btnConfirmClick(e)}
          >
            Xác Nhận
          </button>
        </form>
      </div>
    </div>
    
    );
  }
  // event-handlers

  btnSendTokenClick(e) {
    e.preventDefault();
    const email = this.state.txtEmail;
    if (email) {
      const account = {email: email };
      this.apiSendToken(account);
    } else {
      toast.info('Vui Lòng Nhập Email')
    }
  }
  apiSendToken(account){
    axios.post('/api/customer/reset-password', account).then((res) => {
        const result = res.data;
        if(result.success===true){
          toast.success(result.message);
          this.props.navigate('/login');
        }
        else{
          toast.error(result.message);
        }
      });
  }


  btnConfirmClick(e) {
    e.preventDefault();
    const email = this.state.txtEmail;
    const resetToken = this.state.txtToken;
    const password = this.state.txtPassword;
    if (email && resetToken && password) {
      const account = { email: email, resetToken: resetToken, password: password };
      this.apiConfirm(account);
    } else {
      toast.info('Vui Lòng Nhập Đầy Đủ Thông Tin')
    }
  }
  // apis

  apiConfirm(account) {
    axios.post('/api/customer/comfirm', account).then((res) => {
      const result = res.data;
      if(result.success===true){
        toast.success(result.message);

      }else{
        toast.error(result.message);
      }
      
    
    });
  }
  componentDidMount(){
    this.getCart();
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
}
export default withRouter(ResetPW);
