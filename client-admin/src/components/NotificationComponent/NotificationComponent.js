import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import NotificationDetail from '../NotificationComponent/NotificationDetailComponent';
import styles from '../NotificationComponent/Noti.module.css'


class Notification extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.notifications.map((item) => {
      return (
        <tr key={item._id} className='datatable' onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
    
    return (
      <div>
      <div className={styles.floatLeft}>
        <h2 className={styles.textCenter}>DANH SÁCH THÔNG BÁO</h2>
        <table className={styles.datatable} border="1">
          <tbody>
            <tr className={styles.datatable}>
              <th>ID</th>
              <th>Nội Dung Thông Báo</th>

            </tr>
            {cates}
          </tbody>
        </table>
      </div>
      <div className={styles.inline} />
      <NotificationDetail item={this.state.itemSelected} updateNotifications={this.updateNotifications} />
      <div className={styles.floatClear} />
    </div>
  );

  }

  updateNotifications = (notifications) => { // arrow-function
    this.setState({ notifications: notifications });
  }
  componentDidMount() {
    this.apiGetNotifications();
    this.GetAdminToken();
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
       this.context.setUsername(result.username);
      
      }
    });

  }

  
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetNotifications() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/notifications', config).then((res) => {
      const result = res.data;
      this.setState({ notifications: result });
    });
  }
}
export default Notification;