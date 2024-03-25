import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import { toast } from 'react-toastify';
import styles from '../NotificationComponent/Noti.module.css'

class NotificationDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: ''
    };
  }
  render() {
    return (
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Thêm Thông Báo</h2>
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
    if (id && name) {
      const cate = { name: name };
      this.apiPutNotification(id, cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPutNotification(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/notifications/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Cập Nhập Thành Công");
        this.apiGetNotifications();
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
        this.apiDeleteNotification(id);
      } else {
        toast.info("Vui Lòng Nhập ID")
      }
    }
  }
  // apis
  apiDeleteNotification(id) {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.delete('/api/admin/notifications/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Xoá Thành Công");
        this.apiGetNotifications();
      } else {
        toast.error("Xoá Không Thành Công");
      }
    });
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostNotification(cate);
    } else {
      toast.info("Vui Lòng Nhập Đầy Đủ Thông Tin");
    }
  }
  // apis
  apiPostNotification(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/notifications', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        toast.success("Thêm Thành Công");
        this.apiGetNotifications();
      } else {
        toast.error("Thêm Không Thành Công");
      }
    });
  }
  apiGetNotifications() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/notifications', config).then((res) => {
      const result = res.data;
      this.props.updateNotifications(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
}
export default NotificationDetail;