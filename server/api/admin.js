const express = require('express');
const router = express.Router();
// utils
const JwtUtil = require('../utils/JwtUtil');
// daos
const AdminDAO = require('../models/AdminDAO');
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');




router.get('/admins/:token_web_admin', async function(req, res) {
  const token_web_admin = req.params.token_web_admin;
  const admins = await AdminDAO.select_token_web_admin(token_web_admin);

  res.json(admins);
});

// product
router.get('/products', JwtUtil.checkToken, async function(req, res) {
  try {
    // pagination
    const noProducts = await ProductDAO.selectByCount();
    const sizePage = 4;
    const noPages = Math.ceil(noProducts / sizePage);
    var curPage = 1;
    if (req.query.page) curPage = parseInt(req.query.page); // /products?page=xxx
    const skip = Math.max(0, (curPage - 1) * sizePage);
    const products = await ProductDAO.selectBySkipLimit(skip, sizePage);
    // return
    const result = { products: products, noPages: noPages, curPage: curPage };
    res.json(result);
  } catch (error) {
    console.error("Error in /products endpoint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/products', JwtUtil.checkToken, async function(req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const sale = req.body.sale;
  const cid = req.body.category;
  const image = req.body.image;
  const imageDetail = req.body.imageDetail; // Assuming imageChitiet is an array of strings
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);

  // Create an object with the new imageChitiet field
  const product = {name: name, price: price, sale:sale,image: image, imageDetail: imageDetail, cdate: now, category: category };

  const result = await ProductDAO.insert(product);
  res.json(result);
});

router.put('/products/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const price = req.body.price;
  const sale = req.body.sale;
  const cid = req.body.category;
  const image = req.body.image;
  const imageDetail = req.body.imageDetail;
  const now = new Date().getTime(); // milliseconds
  const category = await CategoryDAO.selectByID(cid);
  const product = { _id: _id, name: name, price: price, sale:sale,image: image,imageDetail: imageDetail, cdate: now, category: category };
  const result = await ProductDAO.update(product);
  res.json(result);
});
router.delete('/products/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// category
router.get('/categories', JwtUtil.checkToken, async function(req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
router.post('/categories', JwtUtil.checkToken, async function(req, res) {
  const name = req.body.name;
  const size = req.body.size;
  const category = { name: name,size:size };
  const result = await CategoryDAO.insert(category);
  res.json(result);
});
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const categorie = { _id: _id, name: name };
  const result = await CategoryDAO.update(categorie);
  res.json(result);
});
router.delete('/categories/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const result = await CategoryDAO.delete(_id);
  res.json(result);
});
// login
router.post('/login', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (admin) {
      const token = JwtUtil.genToken(admin._id,admin.username);
      res.json({ success: true, message: 'Authentication successful', token: token,admin:admin});
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});

router.get('/getadmintoken', JwtUtil.checkToken, async function(req, res) {
  const username = req.username;
  const id = req.id;
  const admins = await AdminDAO.selectByID(id);
  res.json(admins);
});

router.get('/token', JwtUtil.checkToken, function(req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});
const OrderDAO = require('../models/OrderDAO');
// order
router.get('/orders', JwtUtil.checkToken, async function(req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
// order
router.put('/orders/status/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

const CustomerDAO = require('../models/CustomerDAO');
// customer

router.get('/customers', JwtUtil.checkToken, async function(req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
// order
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function(req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
router.put('/customers/deactive/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 0);
  res.json(result);
});

router.get('/thongke', JwtUtil.checkToken, async function(req, res) {
  const customerCount = await CustomerDAO.selectSLAll();
  const categoryCount = await CategoryDAO.selectSLAll();
  const orderCountPENDING = await OrderDAO.selectStatus('PENDING');
  const orderCountAPPROVED = await OrderDAO.selectStatus('APPROVED');
  const orderCountCANCELED = await OrderDAO.selectStatus('CANCELED');
  const orderCountHUYDON= await OrderDAO.selectStatus('HUỶ ĐƠN');
  const doanhthu = await OrderDAO.calculateApprovedRevenue('APPROVED');
  const productCount = await ProductDAO.selectByCount();
  const notiCount = await NotificationDAO.selectSLAll();
  const sizeCount = await SizeDAO.selectSLAll();
  const sliderCount = await SliderDAO.selectSLAll();
  
  res.json({ customersCount: customerCount, categoriesCount: categoryCount ,
    orderCountPENDING:orderCountPENDING,orderCountAPPROVED:orderCountAPPROVED,orderCountCANCELED:orderCountCANCELED,orderCountHUYDON:orderCountHUYDON,
    productCount:productCount,notiCount:notiCount,sizeCount:sizeCount,sliderCount:sliderCount,doanhthu:doanhthu,
  
  });
});

// utils
const EmailUtil = require('../utils/EmailUtil');
// customer
router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const cust = await CustomerDAO.selectByID(_id);
  if (cust) {
    const send = await EmailUtil.send(cust.email, cust._id, cust.token);
    if (send) {
      res.json({ success: true, message: 'Please check email' });
    } else {
      res.json({ success: false, message: 'Email failure' });
    }
  } else {
    res.json({ success: false, message: 'Not exists customer' });
  }
});


// Thêm chức năng mới
const NotificationDAO = require('../models/NotificationDAO');
router.get('/notifications', JwtUtil.checkToken, async function (req, res) {
  const notifications = await NotificationDAO.selectAll();
  res.json(notifications);
});
router.post('/notifications', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const notifications = { name: name };
  const result = await NotificationDAO.insert(notifications);
  res.json(result);
});
router.put('/notifications/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const notification = { _id: _id, name: name };
  const result = await NotificationDAO.update(notification);
  res.json(result);
});
router.delete('/notifications/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await NotificationDAO.delete(_id);
  res.json(result);
});

const SizeDAO = require('../models/SizeDAO');
router.get('/sizes', JwtUtil.checkToken, async function (req, res) {
  const sizes = await SizeDAO.selectAll();
  res.json(sizes);
});
router.post('/sizes', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const sizes = { name: name };
  const result = await SizeDAO.insert(sizes);
  res.json(result);
});
router.put('/sizes/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const sizes = { _id: _id, name: name };
  const result = await SizeDAO.update(sizes);
  res.json(result);
});
router.delete('/sizes/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await SizeDAO.delete(_id);
  res.json(result);
});


const SliderDAO = require('../models/SliderDAO');
router.get('/sliders', JwtUtil.checkToken, async function (req, res) {
  const sizes = await SliderDAO.selectAll();
  res.json(sizes);
});
router.post('/sliders', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const sliders = { name: name };
  const result = await SliderDAO.insert(sliders);
  res.json(result);
});
router.put('/sliders/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const sliders = { _id: _id, name: name };
  const result = await SliderDAO.update(sliders);
  res.json(result);
});
router.delete('/sliders/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await SliderDAO.delete(_id);
  res.json(result);
});



const ContactDAO = require('../models/ContactDAO');

router.get('/contacts', JwtUtil.checkToken, async function (req, res) {
  const sizes = await ContactDAO.selectAll();
  res.json(sizes);
});
router.post('/contacts', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const noidung = req.body.noidung;
  const contacts = { name: name ,noidung:noidung};
  const result = await ContactDAO.insert(contacts);
  res.json(result);
});
router.put('/contacts/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const noidung = req.body.noidung;
  const contacts = { _id: _id, name: name ,noidung:noidung};
  const result = await ContactDAO.update(contacts);
  res.json(result);
});
router.delete('/contacts/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ContactDAO.delete(_id);
  res.json(result);
});



module.exports = router;