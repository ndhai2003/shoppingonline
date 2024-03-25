import axios from 'axios';
import React, { Component } from 'react';
import SlickSlider from 'react-slick'; 
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import withRouter from '../utils/withRouter';
class Slider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliders:[],
    };
  }

  render() {
    const { sliders } = this.state;
    const settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
    };
    return (
      <SlickSlider {...settings}>
        {sliders.map((image, index) => (
      <img key={index} src={`data:image/jpg;base64,${image.name}`} alt={`Slider-${index}`} preview={false} height="350px" />
        ))}
      </SlickSlider>
    );
  }
  apiGetSliders = () => {
    axios.get('/api/customer/sliders').then((res) => {
      const result = res.data;
      this.setState({ sliders: result });
    });
  }

  componentDidMount() {
    this.apiGetSliders();
  }
}

export default withRouter(Slider);