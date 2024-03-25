import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../../contexts/MyContext';
import SliderComponent from '../SliderComponent/SliderDetailComponent';
import styles from '../SliderComponent/Slider.module.css'

class Slider extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      sliders: [],
      itemSelected: null
    };
  }
  render() {
    const cates = this.state.sliders.map((item) => {
      return (
        <tr key={item._id} className='datatable' onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td><img src={"data:image/jpg;base64," + item.name} width="100px" height="100px" alt="" /></td>
        </tr>
      );
    });
    
    return (
      <div>
      <div className={styles.floatLeft}>
        <h2 className={styles.textCenter}>DANH SÁCH ẢNH SLIDER</h2>
        <table className={styles.datatable} border="1">
          <tbody>
            <tr className={styles.datatable}>
              <th>ID</th>
              <th>Ảnh</th>

            </tr>
            {cates}
          </tbody>
        </table>
      </div>
      <div className={styles.inline} />
      <SliderComponent item={this.state.itemSelected} updateSliders={this.updateSliders} />
      <div className={styles.floatClear} />
    </div>
  );

  }


  updateSliders = (sliders) => { // arrow-function
    this.setState({ sliders: sliders });
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
    axios.get('/api/admin/sliders', config).then((res) => {
      const result = res.data;
      this.setState({ sliders: result });
    });
  }
}
export default Slider;