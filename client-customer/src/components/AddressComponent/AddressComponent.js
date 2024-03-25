import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../../utils/withRouter';
import MyContext from '../../contexts/MyContext';
import CartUtil from '../../utils/CartUtil';
import { toast } from 'react-toastify';
import style from './Address.module.css';

class Address extends Component {
    static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
        txtSonha: '',
        txtPhuong:'',
        txtQuan:'',
        txtThanhpho: '',
    };
  }
  render() {
    return (
      <div className={style.container}>
        <div className={style.formContainer}>
          <h2 className={style.title}>Địa Chỉ Nhận Hàng</h2>
          <form>
            <input className={style.inputField} type="text" placeholder="Số Nhà/Đường" value={this.state.txtSonha} onChange={(e) => { this.setState({ txtSonha: e.target.value }) }} />
            <input className={style.inputField} type="text" placeholder="Phường/Xã" value={this.state.txtPhuong} onChange={(e) => { this.setState({ txtPhuong: e.target.value }) }} />
            <input className={style.inputField} type="text" placeholder="Quận/Huyện" value={this.state.txtQuan} onChange={(e) => { this.setState({ txtQuan: e.target.value }) }} />
            <input className={style.inputField} type="text" placeholder="Thành Phố	" value={this.state.txtThanhpho} onChange={(e) => { this.setState({ txtThanhpho: e.target.value }) }} />
          
            <button className={style.submitButton} type="submit" onClick={(e) => this.lnkCheckoutClick(e)}>Đặt Hàng</button>
          </form>
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
       if (this.context.customer) {
        this.setState({
        txtSonha: this.context.customer.address ? this.context.customer.address.sonha || '' : '',
        txtPhuong: this.context.customer.address ? this.context.customer.address.phuong || '' : '',
        txtQuan: this.context.customer.address ? this.context.customer.address.quan || '' : '',
        txtThanhpho: this.context.customer.address ? this.context.customer.address.thanhpho || '' : '',     
        });
    }
      }
    });
  }

  lnkCheckoutClick(e) {
    e.preventDefault();
       if(this.context.customer){
        const customer = this.context.customer;
        const sonha =this.state.txtSonha;
        const phuong = this.state.txtPhuong;
        const quan = this.state.txtQuan;
        const thanhpho =this.state.txtThanhpho;
        if (window.confirm(
          "Địa chỉ nhận hàng:\n" +
          "Số nhà/Đường: " + sonha + '\n' +
          "Phường/Xã: " + phuong + '\n' +
          "Quận/Huyện " + quan + '\n' +
          "Thành Phố: " + thanhpho + '\n' +
          "Bạn đồng ý chứ...\nNếu không, Hãy cập nhập địa chỉ nhận hàng ở Thông Tin Khách Hàng"
      )) {
        const addressnew = {
            sonha: sonha,
            phuong: phuong,
            quan: quan,
            thanhpho: thanhpho
        };
        const customer_addressnew = {
            _id: customer._id,
            username: customer.username,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            address: addressnew,
        }
    
        if (this.context.mycart.length > 0) {
            const total = CartUtil.getTotal(this.context.mycart);
            const items = this.context.mycart;
    
            if (customer) {
                this.apiCheckout(total, items, customer_addressnew);
            } else {
                this.props.navigate('/login');
            }
        } else {
            toast.warning("Không có sản phẩm trong Giỏ hàng");
        }
    } else {
        // Người dùng chọn "No", không thêm gì cả
        // Bạn có thể xử lý theo ý của mình ở đây
    }                 
    }else{
        toast.error("Vui Lòng Đăng Nhập Trước Khi Mua Hàng");
       }
  }

  apiCheckout(total, items, customer_addressnew) {
    const body = { total: total, items: items, customer: customer_addressnew };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Đặt Hàng Thành Công")
        this.context.setMycart([]);
        localStorage.removeItem('mycart');
        this.props.navigate('/myorders');
      } else {
        toast.error("Đặt Hàng Không Thành Công")
      }
    });
  }

}
export default withRouter(Address);