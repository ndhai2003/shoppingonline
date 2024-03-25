import React, { Component } from 'react';
import axios from 'axios';
import MyContext from '../../contexts/MyContext';

class ContactInfo extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }
  render() {
    return (
      <div className="align-center">
        <h2 className="text-center">Thông Tin Liên Hệ</h2>
        {this.state.contacts.map((contact) => (
          <div key={contact._id.$oid}>
             <p><strong>{contact.name} </strong> {contact.noidung}</p>

          </div>
        ))}
      </div>
    );
  }


  apiGetContacts = () => {
    axios.get('/api/customer/contacts').then((res) => {
      const result = res.data;
      this.setState({ contacts: result });
    });
  };

  componentDidMount(){
    this.apiGetContacts();
    this.getCart();
  }
  getCart(){
    const storedMycart = localStorage.getItem('mycart');
    if (storedMycart) {
      const mycart = JSON.parse(storedMycart);
      this.context.setMycart(mycart);
    }
  }
}

export default ContactInfo;
