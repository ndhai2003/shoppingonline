require('../utils/MongooseUtil');
const Models = require('./Models');


const ProductFavoriteDAO = {
  async insert(order) {
    const mongoose = require('mongoose');
    order._id = new mongoose.Types.ObjectId();
    const result = await Models.ProductFavorite.create(order);
    return result;
  },
    async selectByCustID(_cid) {
      const query = { 'customer._id': _cid };
      const orders = await Models.ProductFavorite.find(query).exec();
      return orders;
    },

    async selectIDProduct(_cid) {
      const query = { 'product._id': _cid };
      const orders = await Models.ProductFavorite.find(query).exec();
      return orders;
    },
    async selectAll() {
      const query = {};
      const mysort = { cdate: -1 }; // descending
      const orders = await Models.ProductFavorite.find(query).sort(mysort).exec();
      return orders;
    },
    async update(_id, newStatus) {
      const newvalues = { status: newStatus };
      const result = await Models.ProductFavorite.findByIdAndUpdate(_id, newvalues, { new: true });
      return result;
    },
    async delete(_id) {
      const result = await Models.ProductFavorite.findByIdAndRemove(_id);
      return result;
    },
  };
module.exports = ProductFavoriteDAO;