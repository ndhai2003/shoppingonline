require('../utils/MongooseUtil');
const Models = require('./Models');

const SliderDAO = {
  async selectAll() {
    const query = {};
    const slider = await Models.Slider.find(query).exec();
    return slider;
  },
  async selectSLAll() {
    const query = {};
    const Count = await Models.Slider.find(query).count().exec();
    return Count;
  },
  async insert(slider) {
    const mongoose = require('mongoose');
    slider._id = new mongoose.Types.ObjectId();
    const result = await Models.Slider.create(slider);
    return result;
  },
  async update(slider) {
    const newvalues = { name: slider.name }
    const result = await Models.Slider.findByIdAndUpdate(slider._id, newvalues, { new: true });
    return result;
  },
  async delete(_id) {
    const result = await Models.Slider.findByIdAndRemove(_id);
    return result;
  },
  async selectByID(_id) {
    const slider = await Models.Slider.findById(_id).exec();
    return slider;
  }
};
module.exports = SliderDAO;