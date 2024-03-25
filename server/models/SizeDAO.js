require('../utils/MongooseUtil');
const Models = require('./Models');

const SizeDAO = {
  async selectAll() {
    const query = {};
    const size = await Models.Size.find(query).exec();
    return size;
  },
  async selectSLAll() {
    const query = {};
    const Count = await Models.Size.find(query).count().exec();
    return Count;
  },
  async insert(size) {
    const mongoose = require('mongoose');
    size._id = new mongoose.Types.ObjectId();
    const result = await Models.Size.create(size);
    return result;
  },
  async update(size) {
    const newvalues = { name: size.name }
    const result = await Models.Size.findByIdAndUpdate(size._id, newvalues, { new: true });
    return result;
  },
  async delete(_id) {
    const result = await Models.Size.findByIdAndRemove(_id);
    return result;
  },
  async selectByID(_id) {
    const size = await Models.Size.findById(_id).exec();
    return size;
  }
};
module.exports = SizeDAO;