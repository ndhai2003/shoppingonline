import axios from 'axios';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import MyContext from '../../contexts/MyContext';
import style from '../ActiveComponent/Active.module.css'
import withRouter from '../../utils/withRouter';

class Active extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: ''
    };
  }
  render() {
    return (
      <div className={style.container}>
      <div className={style.formContainer}>
        <h2 className={style.title}>Xác Thực Tài Khoản</h2>
        <h3 className={style.title}>Vui Lòng Kiểm Tra Email Để Lấy ID và Token</h3>
        <form>
          <input className={style.inputField} type="text" placeholder="Tài Khoản" value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} />
          <input className={style.inputField} type="password" placeholder="Mật Khẩu" value={this.state.txtToken} onChange={(e) => { this.setState({ txtToken: e.target.value }) }} />
          <button className={style.submitButton} type="submit" onClick={(e) => this.btnActiveClick(e)}>Xác Thực</button>
        </form>
       
      </div>
    </div>

    );
  }
  // event-handlers
  btnActiveClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const token = this.state.txtToken;
    if (id && token) {
      this.apiActive(id, token);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
 
  // apis
  apiActive(id, token) {
    const body = { id: id, token: token };
    axios.post('/api/customer/active', body).then((res) => {
      const result = res.data;
      if (result) {
        if(result.success===false)
        toast.error("ID Không Tồn Tại")
        else{
          toast.success("ACTIVE Thành Công")
          this.props.navigate('/login');
        }
      } else {
        toast.error("ACTIVE Thất Bại")
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
export default withRouter(Active);