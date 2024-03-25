require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username: username }, { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async selectSLAll() {
    const query = {};
    const Count = await Models.Customer.find(query).count().exec();
    return Count;
  },
  
  async insert(customer) {
    const mongoose = require('mongoose');
    customer._id = new mongoose.Types.ObjectId();
    const result = await Models.Customer.create(customer);
    return result;
  },
  async active(_id, token, active) {
      try{
        const query = { _id: _id, token: token };
        const newvalues = { active: active };
        const result = await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
        return result;
      }catch (error) {
        console.log(error)
        return  { success: false, message: 'ID Không Tồn Tại' };
      }
  },
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async update(customer) {
    const newvalues = { username: customer.username, password: customer.password, name: customer.name, phone: customer.phone, email: customer.email };
    const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
    return result;
  },
  async updateAddress(customerId, addressUpdate) {
    const newvalues = { address:addressUpdate };
    const result = await Models.Customer.findByIdAndUpdate(customerId, newvalues, { new: true });
    return result;
  },
  async selectAll() {
    const query = {};
    const customers = await Models.Customer.find(query).exec();
    return customers;
  },
  async selectID(_id) {
    try{
      const query ={_id:_id}
    const customer = await Models.Customer.findOne(query).exec();
    return customer;
    }catch{
      return null;
    }
  
  },

  async selectByID(_id) {
    try{
      const customer = await Models.Customer.findById(_id).exec();
      return customer;
    }catch{
      return null;
    }
  
  },

  async updateResetToken(customerId, resetToken) {
    try {
      const updatedCustomer = await Models.Customer.findByIdAndUpdate(
        customerId,
        { resetToken: resetToken },
        { new: true } // Return the updated document
      );

      return updatedCustomer;
    } catch (error) {
      console.error('Error updating reset token:', error);
      return null;
    }
  },
  async selectByEmail(email) {
    const query = { $or: [ { email: email }] };
    const customer = await Models.Customer.findOne(query);
    return customer;
  },
  async  updatePasswordWithEmailAndToken(email, resetToken, newPassword) {
    try {
      const customer = await Models.Customer.findOne({ email:email, resetToken: resetToken });
      
      if (!customer) {
        return { success: false, message: 'Sai Email Hoặc TOKEN' };
      }
      // Update the password and other fields
      customer.password = newPassword;
      customer.active = 1; // Assuming you want to activate the account when updating the password
      customer.resetToken = null; // Clear the reset token after updating the password
      const updatedCustomer = await customer.save();
  
      return { success: true, message: 'Khôi Phục Mật Khẩu Thành Công' };
    } catch (error) {
      console.error('Error updating password with email and token:', error);
      return { success: false, message: 'Khôi Phục Mật Khẩu Thất Bại' };
    }
  }
};
module.exports = CustomerDAO;