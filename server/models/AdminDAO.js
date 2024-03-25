require('../utils/MongooseUtil');
const Models = require('./Models');

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async selectByID(_id) {
    const admin = await Models.Admin.findById(_id).exec();
    return admin;
  },
};
module.exports = AdminDAO;