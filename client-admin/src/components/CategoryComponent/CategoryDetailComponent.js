import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from '../CategoryComponent/Category.module.css'

class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      selectedSize:"1"
    };
  }
    render() {
      return (
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Thêm Danh Mục</h2>
          <form>
            <table>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td><input type="text" className={styles.inputField} value={this.state.txtID} onChange={(e) => { this.setState({ txtID: e.target.value }) }} readOnly={true} /></td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td><input type="text" className={styles.inputField} value={this.state.txtName} onChange={(e) => { this.setState({ txtName: e.target.value }) }} /></td>
                </tr>
                <tr>
                  <td align="right">Size</td>
                  <td>
                    <select className={styles.inputFieldd} value={this.state.selectedSize} onChange={(e) => this.handleSizeChange(e)}>
                      <option value="1">Có Size</option>
                      <option value="0">Không Size</option>
                    </select>
                  </td>
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
  
  handleSizeChange = (e) => {
    this.setState({ selectedSize: e.target.value });
  };


   // event-handlers
   btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Cập Nhập Thành Công");
        this.apiGetCategories();
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
        this.apiDeleteCategory(id);
      } else {
        toast.info("Vui Lòng Nhập ID");
      }
    }
  }
  // apis
  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Xoá Thành Công");
        this.apiGetCategories();
      } else {
        toast.error("Xoá Không Thành Công");
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const size = this.state.selectedSize;
    if (name && size) {
      const cate = { name: name ,size:size};
      this.apiPostCategory(cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Thêm Thành Công");
        this.apiGetCategories();
      } else {
        toast.error("Thêm Không Thành Công");
      }
    });
  }


  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
}
export default CategoryDetail;