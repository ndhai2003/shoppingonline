import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from '../SliderComponent/Slider.module.css' 
class SliderDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      imgProduct:''
    };
  }
  render() {
    return (
      <div className={styles.formContainer}>
      <h2 className={styles.title}>Thêm Ảnh Slider</h2>
        <form>
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td><input type="text" className={styles.inputField} value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
              </tr>
              <tr>
                <td>Ảnh </td>
                <td><input type="file" className={styles.inputField} name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} /></td>
              </tr>
              <tr>
                <td></td>
                <td>
                <input type="submit" className={styles.submitButton} value="ADD NEW" onClick={(e) => this.btnAddClick(e)} />

                <input type="submit" className={styles.submitButton} value="UPDATE" onClick={(e) => this.btnUpdateClick(e)} />

                <input type="submit" className={styles.submitButton} value="DELETE" onClick={(e) => this.btnDeleteClick(e)} />

                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }

  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
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
   // event-handlers
   btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (id && image) {
      const cate = { name: image };
      this.apiPutSize(id, cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPutSize(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/sliders/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Cập Nhập Thành Công"); 
        this.apiGetSizes();
      } else {
        toast.error("Cập Nhập Không Thành Công");
      }
    });
  }
   // event-handlers
   btnDeleteClick(e) {
    e.preventDefault();
    if (window.confirm('ARE YOU SURE?')) {
      const id = this.state.txtID;
      if (id) {
        this.apiDeleteSizes(id);
      } else {
        toast.info("Vui Lòng Nhập ID");
      }
    }
  }
  // apis
  apiDeleteSizes(id) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.delete('/api/admin/sliders/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Xoá Thành Công");
        this.apiGetSizes();
      } else {
        toast.error("Xoá Không Thành Công");
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if(image){
      const slier ={name:image}
      this.apiPostSizes(slier);
    
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPostSizes(slier) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/sliders', slier, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Thêm Thành Công");
        this.apiGetSizes();
      } else {
        toast.error("Thêm Không Thành Công");
      }
    });
  }
  apiGetSizes() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/sliders', config).then((res) => {
      const result = res.data;
      this.props.updateSliders(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
}
export default SliderDetail;