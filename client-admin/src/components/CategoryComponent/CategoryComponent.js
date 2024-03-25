import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import CategoryDetail from '../CategoryComponent/CategoryDetailComponent';
import styles from '../CategoryComponent/Category.module.css'


class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr key={item._id} className='datatable'onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{item.name}</td>
          <td>{item.size}</td>
        </tr>
      );
    });
    return (
      <div>
        <div className={styles.floatLeft}>
          <h2 className={styles.textCenter}>DANH SÁCH DANH MỤC</h2>
          <table className={styles.datatable} border="1">
            <tbody>
              <tr className={styles.datatable}>
                <th>ID</th>
                <th>Danh Mục</th>
                <th>Size</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>
        <div className={styles.inline} />
        <CategoryDetail item={this.state.itemSelected} updateCategories={this.updateCategories} />
        <div className={styles.floatClear} />
      </div>
    );
  }
  updateCategories = (categories) => { // arrow-function
    this.setState({ categories: categories });
  }
  componentDidMount() {
    this.GetAdminToken();
    this.apiGetCategories();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token  } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
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

}
export default Category;