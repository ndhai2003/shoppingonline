import React, { Component } from 'react';
import Menu from './MenuComponent/MenuComponent'
import Inform from './InformComponent/InformComponent';
import Home from './HomeComponent/HomeComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Product from './ProductComponent/ProductComponent';
import ProductDetail from './ProductComponent/ProductDetailComponent';
import Signup from './SignupComponent/SignupComponent';
import Active from './ActiveComponent/ActiveComponent';
import Login from './LoginComponent/LoginComponent';
import Myprofile from './MyprofileComponent/MyprofileComponent';
import Mycart from './MycartComponent/MycartComponent';
import Address from './AddressComponent/AddressComponent';
import Myorders from './MyordersComponent/MyordersComponent';
import Gmap from './GmapComponent';
import TawkMessenger from './TawkMessengerComponent';
import ContactInfo from './ContactInfoComponent/ContactInfoComponent';
import ResetPW from './ResetPasswordComponent/ResetPasswordComponent';
import MyProductFavorite from './MyProductFavoriteComponent/MyProductFavoriteComponent';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddressUpdate from './AddressComponent/AddressUpdateComponent';
import AboutProduct from './AboutComponent/AboutProductComponent';

class Main extends Component {
  render() {
    return (
        <div className="body-customer">
        <ToastContainer />
        <Inform />
        <Menu />
        <Routes>
          <Route path='/' element={<Navigate replace to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/product/category/:cid' element={<Product />} />
          <Route path='/product/search/:keyword' element={<Product />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/active' element={<Active />} />
          <Route path='/login' element={<Login />} />
          <Route path='/myprofile' element={<Myprofile />} />
          <Route path='/mycart' element={<Mycart />} />
          <Route path='/address' element={<Address />} />
          <Route path='/addressupdate' element={<AddressUpdate />} />
          <Route path='/myorders' element={<Myorders />} />
          <Route path='/gmap' element={<Gmap />} />
          <Route path='/contactinfo' element={<ContactInfo />} />
          <Route path='/reset-password' element={<ResetPW />} />
          <Route path='/myproductfavorite' element={<MyProductFavorite />} />
          <Route path='/about-product' element={<AboutProduct />} />
          
        
        </Routes>
        <TawkMessenger />
      </div>
      
      

    );
    
      
  }
}
export default Main;