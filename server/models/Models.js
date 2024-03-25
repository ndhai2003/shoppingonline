const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
  sonha: String,
  phuong: String,
  quan: String,
  thanhpho: String,
 
}, {  versionKey: false, _id: false  });

const AdminSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
}, { versionKey: false });

const CategorySchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  size: String,
}, { versionKey: false });

const NotificationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
}, { versionKey: false });

const SizeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
}, { versionKey: false });

const SliderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String
}, { versionKey: false });

const ContactSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  noidung:String,
}, { versionKey: false });

const CustomerSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: String,
  password: String,
  name: String,
  phone: String,
  email: String,
  active: Number,
  token: String,
  resetToken: String,
  address: addressSchema, // Use addressSchema here
}, { versionKey: false });

const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number,
  sale:Number,
  image: String,
  imageDetail: [String], 
  cdate: Number,
  category: CategorySchema
}, { versionKey: false });

const ItemSchema = mongoose.Schema({
  product: ProductSchema,
  quantity: Number,
  size:String,
}, { versionKey: false, _id: false });

const OrderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  total: Number,
  status: String,
  customer: CustomerSchema,
  items: [ItemSchema]
}, { versionKey: false });

const ProductFavoriteSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  cdate: Number,
  customer: CustomerSchema,
  product: ProductSchema,
}, { versionKey: false });

// models
const Admin = mongoose.model('Admin', AdminSchema);
const Category = mongoose.model('Category', CategorySchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Size = mongoose.model('Size', SizeSchema);
const Slider = mongoose.model('Slider', SliderSchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Customer = mongoose.model('Customer', CustomerSchema);
const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const ProductFavorite = mongoose.model('ProductFavorite', ProductFavoriteSchema);
 // Include Address model

module.exports = { Admin, Category, Notification, Customer, Product, Order, ProductFavorite ,Size,Contact,Slider};
