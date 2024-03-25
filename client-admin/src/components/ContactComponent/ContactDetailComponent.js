import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from '../ContactComponent/Contact.module.css'

class ContactDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      txtNoidung: '',
    };
  }
  render() {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Thêm Liên Hệ</h2>
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
                <td>Nội Dung</td>
                <td><input type="text" className={styles.inputField} value={this.state.txtNoidung} onChange={(e) => { this.setState({ txtNoidung: e.target.value }) }} /></td>
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
   // event-handlers
   btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const noidung = this.state.txtNoidung;
    if (id && name &&noidung) {
      const cate = { name: name,noidung:noidung };
      this.apiPutContacts(id, cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPutContacts(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/contacts/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Cập Nhập Thành Công");
        this.apiGetContacts();
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
    axios.delete('/api/admin/contacts/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Xoá Thành Công");
        this.apiGetContacts();
      } else {
        toast.error("Xoá Không Thành Công");
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const noidung = this.state.txtNoidung;
    if (name && noidung) {
      const cate = { name: name,noidung:noidung };
      this.apiPostContacts(cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPostContacts(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/contacts', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Thêm Thành Công");
        this.apiGetContacts();
      } else {
        toast.error("Thêm Không Thành Công");
      }
    });
  }
  apiGetContacts() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/contacts', config).then((res) => {
      const result = res.data;
      this.props.updateContacts(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name ,txtNoidung: this.props.item.noidung});
    }
  }
}
export default ContactDetail;