import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import ContactDetail from '../ContactComponent/ContactDetailComponent';
import styles from '../ContactComponent/Contact.module.css'


class Contact extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
        contacts: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.contacts.map((item) => {
      return (
        <tr key={item._id} className={styles.datatable} onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.noidung}</td>
        </tr>
      );
    });
    
    return (
      <div>
      <div className={styles.floatLeft}>
        <h2 className={styles.textCenter}>DANH SÁCH LIÊN HỆ</h2>
        <table className={styles.datatable} border="1">
          <tbody>
            <tr className={styles.datatable}>
              <th>ID</th>
              <th>Title</th>
              <th>Nội Dung</th>
            </tr>
            {cates}
          </tbody>
        </table>
      </div>
      <div className={styles.inline} />
      <ContactDetail item={this.state.itemSelected} updateContacts={this.updateContacts} />
      <div className={styles.floatClear} />
    </div>
  );
      
  }

  updateContacts = (contacts) => { // arrow-function
    this.setState({ contacts: contacts });
  }
  componentDidMount() {
    this.apiGetContacts();
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
  apiGetContacts() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/contacts', config).then((res) => {
      const result = res.data;
      this.setState({ contacts: result });
    });
  }
}
export default Contact;