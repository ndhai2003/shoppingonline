import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import SizeDetail from '../SizeComponent/SizeDetailComponent';
import styles from '../SizeComponent/Size.module.css'

class Size extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
        sizes: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.sizes.map((item) => {
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
        <h2 className={styles.textCenter}>DANH SÁCH SIZE</h2>
        <table className={styles.datatable} border="1">
          <tbody>
            <tr className={styles.datatable}>
              <th>ID</th>
              <th>SIZE</th>

            </tr>
            {cates}
          </tbody>
        </table>
      </div>
      <div className={styles.inline} />
      <SizeDetail item={this.state.itemSelected} updateSizes={this.updateSizes} />
      <div className={styles.floatClear} />
    </div>
  );
  }


  updateSizes = (sizes) => { // arrow-function
    this.setState({ sizes: sizes });
  }
  componentDidMount() {
    this.apiGetSizes();
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
  apiGetSizes() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/sizes', config).then((res) => {
      const result = res.data;
      this.setState({ sizes: result });
    });
  }
}
export default Size;