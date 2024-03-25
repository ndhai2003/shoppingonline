require('../utils/MongooseUtil');
const Models = require('./Models');

const ContactDAO = {
  async selectAll() {
    const query = {};
    const contact = await Models.Contact.find(query).exec();
    return contact;
  },
  async insert(contact) {
    const mongoose = require('mongoose');
    contact._id = new mongoose.Types.ObjectId();
    const result = await Models.Contact.create(contact);
    return result;
  },
  async update(contact) {
    const newvalues = { name: contact.name, noidung:contact.noidung }
    const result = await Models.Contact.findByIdAndUpdate(contact._id, newvalues, { new: true });
    return result;
  },
  async delete(_id) {
    const result = await Models.Contact.findByIdAndRemove(_id);
    return result;
  },
  async selectByID(_id) {
    const contact = await Models.Contact.findById(_id).exec();
    return contact;
  }
};
module.exports = ContactDAO;