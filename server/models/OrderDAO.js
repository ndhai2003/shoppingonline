require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {
  async insert(order) {
    const mongoose = require('mongoose');
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.Order.create(order);
    return result;
  },
  async selectByCustID(_cid) {
    const query = { 'customer._id': _cid };
    const orders = await Models.Order.find(query).exec();
    return orders;
  },


  async selectByID(_id) {
    try{
      const customer = await Models.Order.findById(_id).exec();
      return customer;
    }catch{
      return null;
    }
  
  },
  async calculateApprovedRevenue(status) {
    const query = {'status':status};
    const orders = await Models.Order.find(query).exec();
    const totalApprovedRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  return totalApprovedRevenue;
  },

  async selectStatus(status) {
    const query = {'status':status};
    const Count = await Models.Order.find(query).count().exec();
    return Count;
  },


  async selectAll() {
    const query = {};
    const mysort = { cdate: -1 }; // descending
    const orders = await Models.Order.find(query).sort(mysort).exec();
    return orders;
  },
  async update(_id, newStatus) {
    const newvalues = { status: newStatus };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  },
  async updateAddress(_id, addressUpdate) {
    const newvalues = { customer: addressUpdate };
    const result = await Models.Order.findByIdAndUpdate(_id, newvalues, { new: true });
    return result;
  }
};
module.exports = OrderDAO;