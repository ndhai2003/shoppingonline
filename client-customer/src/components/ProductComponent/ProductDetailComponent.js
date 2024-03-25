import axios from 'axios';
import React, { Component } from 'react';
import withRouter from '../../utils/withRouter';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from './ProductDetail.module.css'
class ProductDetail extends Component {
    static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1,
      selectedSize: '',
      sizes:[],
      selectedImage:null
    };
  }
  render() {
    const prod = this.state.product;
    if (prod != null) {
    return (
      
      <div className={styles.productContainer}>
  <div className={styles.mainInfo}>
    {this.state.selectedImage ? (
      <img
        src={"data:image/jpg;base64," + this.state.selectedImage}
        alt=""
        className={styles.mainImage}
      />
    ) : (
      <img
        src={"data:image/jpg;base64," + prod.image}
        alt=""
        className={styles.mainImage}
      />
    )}
    {prod.imageDetail.length > 0 && (
      <div className={styles.thumbnailContainer}>
        {prod.imageDetail.slice(0, 4).map((image, index) => (
          <img
            key={index}
            src={"data:image/jpg;base64," + image}
            alt=""
            className={`${styles.thumbnailImage} ${
              this.state.selectedImage === image ? styles.active : ''
            }`}
            onClick={() => this.handleThumbnailClick(image)}
          />
        ))}
      </div>
    )}
  </div>
  <div className={styles.productDetailsContainer}>
  <form className={styles.productForm}>
    <table className={styles.productTable}>
      <tbody>
        <tr>
          <td style={{fontSize:'20px'}}>Danh Mục: {(prod.category.name).toUpperCase()}</td>
        </tr>
        <tr>
          <td style={{fontSize:'20px'}}>Tên Sản Phẩm: {prod.name}</td>
        </tr>
        <tr>
  <td style={{ fontSize: '20px' }}>
    Giá: {prod.sale > 0
      ? (prod.price - (prod.price * prod.sale) / 100).toLocaleString('vi-VN') + ' VNĐ'
      : prod.price.toLocaleString('vi-VN') + ' VNĐ'
    }
  </td>
</tr>




       
        {prod.category.size === '1' && (
          <tr>
            <td style={{fontSize:'20px'}}>Chọn Size: 
              <select 
                value={this.state.selectedSize}
                onChange={(e) => this.handleSizeChange(e)}
                className={styles.select}
              >
                {this.state.sizes.map((sizes) => (
                  <option key={sizes._id} value={sizes.name}>
                    {sizes.name}
                  </option>
                ))}
              </select></td>
           
          </tr>
        )}
        <tr>
          <td style={{fontSize:'20px'}}>Số Lượng:
          <input 
              type="number"
              min="1"
              max="99"
              value={this.state.txtQuantity}
              onChange={(e) => this.setState({ txtQuantity: e.target.value })}
              className={styles.input}
            />
          </td>
         
        </tr>
        <tr>
          <td>
            <button
              className={[styles.submitButton, styles.addToCart].join(' ')}
              type="submit"
              onClick={(e) => this.btnAdd2CartClick(e)}
            >
              Thêm vào Giỏ Hàng
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button
              className={[styles.submitButton, styles.addToFavorite].join(' ')}
              type="submit"
              onClick={(e) => this.btnAddFavoriteClick(e)}
            >
              Yêu Thích
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
</div>

</div>
    );
            }
  }


  handleThumbnailClick(selectedImage) {
    this.setState({ selectedImage });
  }
  handleSizeChange = (e) => {
    this.setState({ selectedSize: e.target.value });
  };

  btnAddFavoriteClick(e) {
    e.preventDefault();
    const product =this.state.product;
    const customer = this.context.customer;
        if (customer) {
          this.apiFavorites(product, customer);
        } else {
          this.props.navigate('/login');
        }
  }
  // apis
  apiFavorites( product, customer) {
    const body = {  product: product, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/productfavorites', body, config).then((res) => {
      const result = res.data;
      console.log(result);
      if(result && result.success ===false){
        this.context.setCustomer(null);
        this.props.navigate('/login');
      }
      // alert(result.message);
      toast.success(result.message);
    });
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
      }
          
    });
  }

  btnAdd2CartClick = (e) => {
    e.preventDefault();
    const pro = this.state.product;
    if(pro.sale>0){
      const sp = {
        _id: pro._id,
        name: pro.name,
        price: pro.price-((pro.price*pro.sale)/100),
        image: pro.image,
        imageDetail: pro.imageDetail,
        cdate:pro.cdate,
        category:{
          _id:pro.category._id,
          name:pro.category.name,
          size:pro.category.size,
        }
      }
      const quantity = parseInt(this.state.txtQuantity);
    
      if (sp.category.size === '1') {
       
        if(this.state.selectedSize){
          if (quantity) {
            const mycart = this.context.mycart;
            const index = mycart.findIndex((x) => x.sp && x.sp._id === sp._id && x.size === this.state.selectedSize);

      
            if (index === -1) {
              const newItem = { product: sp, quantity: quantity, size: this.state.selectedSize };
              mycart.push(newItem);
            } else {
              mycart[index].quantity += quantity;
            }
      
            this.context.setMycart(mycart);
      
            // Lưu giỏ hàng vào localStorage
            localStorage.setItem('mycart', JSON.stringify(mycart));
            
            // alert('Thêm Vào Giỏ Thành Công');
            toast.success('Thêm Vào Giỏ Thành Công');
          } else {
            alert('Vui Lòng Nhập Số Lượng');
            toast.info('Vui Lòng Nhập Số Lượng');
          }
        }
        else{
          toast.warn('Vui Lòng Chọn Size');
          // alert('Vui Lòng Chọn Size');
        }
      } else {
        // Tương tự cho trường hợp khi size không phải '1'
        if (quantity) {
          const mycart = this.context.mycart;
          const index = mycart.findIndex(
            (x) => x.sp._id === sp._id && x.size === '0'
          );
    
          if (index === -1) {
            const newItem = { product: sp, quantity: quantity, size: '0' };
            mycart.push(newItem);
          } else {
            mycart[index].quantity += quantity;
          }
    
          this.context.setMycart(mycart);
    
          // Lưu giỏ hàng vào localStorage
          localStorage.setItem('mycart', JSON.stringify(mycart));
    
          toast.success('Thêm Vào Giỏ Thành Công');
        } else {
          toast.info('Vui Lòng Nhập Số Lượng');
        }}
    }
    else{    
      
      const product = this.state.product;
      const quantity = parseInt(this.state.txtQuantity);
      if (product.category.size === '1') {
        if(this.state.selectedSize){
          if (quantity) {
            const mycart = this.context.mycart;
            const index = mycart.findIndex(
              (x) => x.product._id === product._id && x.size === this.state.selectedSize
            );
      
            if (index === -1) {
              const newItem = { product: product, quantity: quantity, size: this.state.selectedSize };
              mycart.push(newItem);
            } else {
              mycart[index].quantity += quantity;
            }
      
            this.context.setMycart(mycart);
      
            // Lưu giỏ hàng vào localStorage
            localStorage.setItem('mycart', JSON.stringify(mycart));
            
            // alert('Thêm Vào Giỏ Thành Công');
            toast.success('Thêm Vào Giỏ Thành Công');
          } else {
            alert('Vui Lòng Nhập Số Lượng');
            toast.info('Vui Lòng Nhập Số Lượng');
          }
        }
        else{
          toast.warn('Vui Lòng Chọn Size');
          // alert('Vui Lòng Chọn Size');
        }
      } else {
        // Tương tự cho trường hợp khi size không phải '1'
        if (quantity) {
          const mycart = this.context.mycart;
          const index = mycart.findIndex(
            (x) => x.product._id === product._id && x.size === '0'
          );
    
          if (index === -1) {
            const newItem = { product: product, quantity: quantity, size: '0' };
            mycart.push(newItem);
          } else {
            mycart[index].quantity += quantity;
          }
    
          this.context.setMycart(mycart);
    
          // Lưu giỏ hàng vào localStorage
          localStorage.setItem('mycart', JSON.stringify(mycart));
    
          toast.success('Thêm Vào Giỏ Thành Công');
        } else {
          toast.info('Vui Lòng Nhập Số Lượng');
        }
      }
    }
   
   
    
  };
  
  componentDidMount() {
    this.GetUserToken();
    const params = this.props.params;
    this.apiGetProduct(params.id);
    this.apiGetSizes();
    this.getCart();
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
  // apis
  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result });
    });
  }
  apiGetSizes = () => {
    axios.get('/api/customer/sizes').then((res) => {
      const result = res.data;
      this.setState({ sizes: result });
      console.log(result);
    });
    
  };
}
export default withRouter(ProductDetail);