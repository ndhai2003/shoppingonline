import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from './Myprofile.module.css'

class Myprofile extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'customer',
      txtUsername: '',
      txtPassword: '',
      txtName: '',
      txtPhone: '',
      txtEmail: '',
      txtSonha: '',
      txtPhuong:'',
      txtQuan:'',
      txtThanhpho: '',
    
    };
  }

  render() {
    if (this.context.customer ==="") return (<Navigate replace to='/login' />);
    return (
      <div className={styles.container}>
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Thông Tin Khách Hàng</h2>
      <div className={styles.tabContainer}>
        <button className={this.state.activeTab === 'customer' ? styles.activeTab : styles.tab}
          onClick={() => this.changeTab('customer')}>Thông Tin Khách Hàng
        </button>
        <button
          className={this.state.activeTab === 'address' ? styles.activeTab : styles.tab}
          onClick={() => this.changeTab('address')}> Địa Chỉ Nhận Hàng
        </button>
      </div>
      {this.state.activeTab === 'customer' ? (
        <form>
         <input type="text" placeholder="Tài Khoản" value={this.state.txtUsername} onChange={(e) => { this.setState({ txtUsername: e.target.value }) }} className={styles.inputField} />
            <input type="password" placeholder="Mật Khẩu" value={this.state.txtPassword} onChange={(e) => { this.setState({ txtPassword: e.target.value }) }} className={styles.inputField} />
            <input type="text" placeholder="Tên" value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} className={styles.inputField} />
            <input type="tel" placeholder="Số Điện Thoại" value={this.state.txtPhone} onChange={(e) => { this.setState({ txtPhone: e.target.value }) }} className={styles.inputField} />
            <input type="email" placeholder="Email" value={this.state.txtEmail} onChange={(e) => { this.setState({ txtEmail: e.target.value }) }} className={styles.inputField} />
          <button type="submit" className={styles.submitButton} onClick={(e) => this.btnUpdateClick(e)}>
            Cập Nhật Thông Tin
          </button>
        </form>
      ) : (
        <form>
          <input type="text" placeholder="Số nhà/Đường" value={this.state.txtSonha} onChange={(e) => { this.setState({ txtSonha: e.target.value }) }} className={styles.inputField} />
              <input type="text" placeholder="Phường/Xã" value={this.state.txtPhuong} onChange={(e) => { this.setState({ txtPhuong: e.target.value }) }} className={styles.inputField} />
              <input type="text" placeholder="Quận/Huyện" value={this.state.txtQuan} onChange={(e) => { this.setState({ txtQuan: e.target.value }) }} className={styles.inputField} />
              <input type="text" placeholder="Thành Phố" value={this.state.txtThanhpho} onChange={(e) => { this.setState({ txtThanhpho: e.target.value }) }} className={styles.inputField} />
          <button type="submit" className={styles.submitButton} onClick={(e) => this.btnUpdateAddressClick(e)}>
            Cập Nhật Địa Chỉ
          </button>
        </form>
      )}
    </div>
  </div>
    );
  }


  GetUserToken(){
    const token_user = localStorage.getItem('token_user');
    const config = { headers: { 'x-access-token': token_user } };
    axios.get('/api/customer/getusertoken/', config).then((res) => {
      const result = res.data;
      if(result && result.success===false){
        this.context.setCustomer(null);
        this.context.setToken('');
     }
     else{
       this.context.setToken(token_user);
       this.context.setCustomer(result);
       if (this.context.customer) {
        this.setState({
          txtUsername: this.context.customer.username,
          txtPassword: this.context.customer.password,
          txtName: this.context.customer.name,
          txtPhone: this.context.customer.phone,
          txtEmail: this.context.customer.email,
          txtSonha: this.context.customer.address ? this.context.customer.address.sonha || '' : '',
          txtPhuong: this.context.customer.address ? this.context.customer.address.phuong || '' : '',
          txtQuan: this.context.customer.address ? this.context.customer.address.quan || '' : '',
          txtThanhpho: this.context.customer.address ? this.context.customer.address.thanhpho || '' : '',
          
        });
      }
     }
    });
  }


  componentDidMount() {
    this.GetUserToken();
    this.getCart();
  }
  
  // event-handlers
  btnUpdateClick(e) {
    e.preventDefault();
    const username = this.state.txtUsername;
    const password = this.state.txtPassword;
    const name = this.state.txtName;
    const phone = this.state.txtPhone;
    const email = this.state.txtEmail;
    if (username && password && name && phone && email) {
      const customer = { username, password, name, phone, email };
      this.apiPutCustomer(this.context.customer._id, customer);
    } else {
      toast.info('Vui Lòng Nhập Đầy Đủ Thông Tin')
    }
  }

  btnUpdateAddressClick(e) {
    e.preventDefault();
    const sonha = this.state.txtSonha;
    const phuong = this.state.txtPhuong;
    const quan = this.state.txtQuan;
    const thanhpho = this.state.txtThanhpho;
    if (sonha!=="" && phuong!=="" && quan!=="" && thanhpho!=="") {
      const address = { sonha, phuong, quan, thanhpho };
      this.apiPutAddress(this.context.customer._id, address);
    } else {
      toast.info('Vui Lòng Nhập Đầy Đủ Thông Tin')
    }
  }

  // apis
  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token} };
    axios.put('/api/customer/customers/' + id, customer, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success('Cập Nhập Thông Tin Thành Công');
        this.context.setCustomer(result);
      } else {
        toast.error("Cập Nhập Thông Tin Thất Bại");
      }
    });
  }

  apiPutAddress(id, address) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/customer/address/' + id, address, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success('Cập Nhập Địa Chỉ Thành Công');
        this.context.setCustomer(result);

      } else {
        toast.error("Cập Nhập Địa Chỉ Thất Bại");
      }
    });
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
  
  

  changeTab(tab) {
    this.setState({ activeTab: tab });
  }
}

export default Myprofile;
