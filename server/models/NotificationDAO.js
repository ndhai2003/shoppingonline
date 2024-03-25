require('../utils/MongooseUtil');
const Models = require('./Models');

const NotificationDAO = {
  async selectSLAll() {
    const query = {};
    const Count = await Models.Notification.find(query).count().exec();
    return Count;
  },
  async selectAll() {
    const query = {};
    const notification = await Models.Notification.find(query).exec();
    return notification;
  },
  async insert(notification) {
    const mongoose = require('mongoose');
    notification._id = new mongoose.Types.ObjectId();
    const result = await Models.Notification.create(notification);
    return result;
  },
  async update(notification) {
    const newvalues = { name: notification.name }
    const result = await Models.Notification.findByIdAndUpdate(notification._id, newvalues, { new: true });
    return result;
  },
  async delete(_id) {
    const result = await Models.Notification.findByIdAndRemove(_id);
    return result;
  },
  async selectByID(_id) {
    const notification = await Models.Notification.findById(_id).exec();
    return notification;
  }
};
module.exports = NotificationDAO;