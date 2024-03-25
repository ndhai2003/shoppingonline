import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import CartUtil from '../../utils/CartUtil';
import withRouter from '../../utils/withRouter';
import { toast } from 'react-toastify';
import style from './Mycart.module.css';

class Mycart extends Component {
  static contextType = MyContext;

  incrementQuantity(index) {
    const mycart = [...this.context.mycart];
    mycart[index].quantity += 1;
    this.context.setMycart(mycart);
    localStorage.setItem('mycart', JSON.stringify(mycart));
  }

  decrementQuantity(index) {
    const mycart = [...this.context.mycart];
    if (mycart[index].quantity > 1) {
      mycart[index].quantity -= 1;
      this.context.setMycart(mycart);
      localStorage.setItem('mycart', JSON.stringify(mycart));
    }
  }

  lnkRemoveClick(id) {
    const mycart = this.context.mycart;
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
      localStorage.setItem('mycart', JSON.stringify(mycart));
    }
  }

  lnkCheckoutClick() {
    if (this.context.mycart.length > 0) {
      this.props.navigate('/address');
    } else {
      toast.warning('Không có sản phẩm trong Giỏ Hàng');
    }
  }

  componentDidMount() {
    this.getCart();
  }

  getCart() {
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }

  render() {
    const mycart = this.context.mycart.map((item, index) => {
      return (
        <tr key={item.product._id} className={style.datatable}>
          <td>{index + 1}</td>
          <td>{item.product.category.name}</td>
          <td>{item.product.name}</td>
          <td>
            <img
              src={'data:image/jpg;base64,' + item.product.image}
              width="70px"
              height="70px"
              alt=""
            />
          </td>
          <td>{(item.product.price).toLocaleString('vi-VN')} VNĐ</td>
          <td>{item.size}</td>
          <td>
            <button onClick={() => this.decrementQuantity(index)}>-</button>
            {item.quantity}
            <button onClick={() => this.incrementQuantity(index)}>+</button>
          </td>
          <td>
            {(item.product.price * item.quantity).toLocaleString('vi-VN')} VNĐ
          </td>
          <td>
            <span
              className={style.link}
              onClick={() => this.lnkRemoveClick(item.product._id)}>
              Remove
            </span>
          </td>
        </tr>
      );
    });

    return (
      <div className={style.container}>
        <div className={style.tableContainer}>
          <h2 className={style.title}>ITEM LIST</h2>
          <table className={style.datatable}>
            <tbody>
              <tr className={style.datatable}>
                <th>No.</th>
                <th>Danh Mục</th>
                <th>Tên SP</th>
                <th>Hình Ảnh</th>
                <th>Giá</th>
                <th>Size</th>
                <th>Số Lượng</th>
                <th>Tổng</th>
                <th>Action</th>
              </tr>
              {mycart}
              <tr className={style.totalRow}>
                <td colSpan="6"></td>
                <td>Total</td>
                <td>
                  {CartUtil.getTotal(this.context.mycart).toLocaleString(
                    'vi-VN'
                  )}{' '}
                  VNĐ
                </td>
                <td>
                  <span
                    className={style.link}
                    onClick={() => this.lnkCheckoutClick()}
                  >
                    CHECKOUT
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withRouter(Mycart);
