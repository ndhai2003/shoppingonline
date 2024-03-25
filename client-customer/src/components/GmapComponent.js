import React, { Component } from 'react';

class Gmap extends Component {
  render() {
    return (
      <div className="align-center">
       <h2 className="text-center" style={{ paddingTop: '10px'}}>Địa Chỉ</h2>
        <iframe
          title="My Location Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7878052273554!2d106.69744577479302!3d10.82754445824929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528f4a62fce9b%3A0xc99902aa1e26ef02!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBWxINuIExhbmc!5e0!3m2!1svi!2s!4v1700152473933!5m2!1svi!2s"
          width="500"
          height="200"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    );
  }
}
export default Gmap;