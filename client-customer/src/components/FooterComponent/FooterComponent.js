
import React, { Component } from 'react';
import ContactInfo from '../ContactInfoComponent/ContactInfoComponent';
class Footer extends Component {
  
  render() {
    return (
        // <footer style={{ backgroundColor: '#000000', display: 'flex', justifyContent: 'space-between', 
        // alignItems: 'center', color: '#FFFFFF' }}>

        //     <ContactInfo/>
        //     <Gmap/>
        // </footer>
        <div className='footer'>
            <div className='footer-1'>
            <ContactInfo/>
            </div>
            <div className='footer-2'>
            <iframe title="gmap" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.787874151554!2d106.69744577500683!3d10.827539189324407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528f4a62fce9b%3A0xc99902aa1e26ef02!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBWxINuIExhbmc!5e0!3m2!1svi!2s!4v1701305460982!5m2!1svi!2s" 
                width="90%" height="100%" style={{ border: 0,}} loading="lazy"   allowFullScreen="" referrerpolicy="no-referrer-when-downgrade"></iframe>
            
            </div>
        </div>
    )}
}
export default Footer;