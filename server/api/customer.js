const express = require('express');
const router = express.Router();
// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
// utils
const JwtUtil = require('../utils/JwtUtil');
// daos
const CustomerDAO = require('../models/CustomerDAO');
// daos
const OrderDAO = require('../models/OrderDAO');
// category
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});
// product
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});
router.get('/products/category/:cid', async function (req, res) {
    const _cid = req.params.cid;
    const products = await ProductDAO.selectByCatID(_cid);
    res.json(products);
  });
router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
//customer
router.post('/signup', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const resetToken = null;
  const address =null;
  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    res.json({ success: false, message: 'Exists username or email' });
  } else {
    const now = new Date().getTime(); // milliseconds
    const token = CryptoUtil.md5(now.toString());
    const newCust = { username: username, password: password, name: name, phone: phone, email: email, active: 0, token: token,resetToken:resetToken,address:address };
    const result = await CustomerDAO.insert(newCust);
    if (result) {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) {
        res.json({ success: true, message: 'Please check email' });
      } else {
        res.json({ success: false, message: 'Email failure' });
      }
    } else {
      res.json({ success: false, message: 'Insert failure' });
    }
  }
});

router.get('/checkidactive', async function (req, res) {
  const _id = req.body.id;
  const checkid = await CustomerDAO.selectByID(_id);
  res.json(checkid);


});

router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
    const result = await CustomerDAO.active(_id, token, 1);
    res.json(result);

});
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (customer) {
      if (customer.active === 1) {
        const id = customer._id;
        const token = JwtUtil.genToken(id,username);
        res.json({ success: true, message: 'Authentication successful', token: token,customer:customer});
     
      } else {
        res.json({ success: false, message: 'Account is deactive' });
      }
    } else {
      res.json({ success: false, message: 'Incorrect username or password' });
    }
  } else {
    res.json({ success: false, message: 'Please input username and password' });
  }
});


// router.get('/customers/:token_web', JwtUtil.checkToken, async function(req, res) {
//   const token_web = req.params.token_web;
//   const customers = await CustomerDAO.select_token_web(token_web);
//   res.json(customers);
// });


router.get('/getusertoken', JwtUtil.checkToken, async function(req, res) {
  const username = req.username;
  const id = req.id;
  const customers = await CustomerDAO.selectByID(id);
  res.json(customers);
});


router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token: token });
});
// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
 
  const customer = { _id: _id, username: username, password: password, name: name, phone: phone, email: email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});

router.put('/address/:id', JwtUtil.checkToken, async function (req, res) {
  const customerId = req.params.id;
  // Assuming the address fields are sent in the request body
  const sonha = req.body.sonha;
  const phuong = req.body.phuong;
  const quan = req.body.quan;
  const thanhpho = req.body.thanhpho;
  const addressUpdate = {
    sonha: sonha,
    phuong: phuong,
    quan: quan,
    thanhpho: thanhpho,
  };

  const resultAddress = await CustomerDAO.updateAddress(customerId, addressUpdate);

  res.json(resultAddress);
});



router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const order = { cdate: now, total: total, status: 'PENDING', customer: customer, items: items };
  const result = await OrderDAO.insert(order);
  res.json(result);
});
// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
router.get('/orders/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByID(_cid);
  res.json(orders);
});

router.get('/getusertoken', JwtUtil.checkToken, async function(req, res) {
  const username = req.username;
  const id = req.id;
  const customers = await CustomerDAO.selectByID(id);
  res.json(customers);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});

router.put('/orders/address/:id', JwtUtil.checkToken, async function(req, res) {
  const _id = req.params.id;
  const customer = req.body.customer;
  const result = await OrderDAO.updateAddress(_id, customer);
  res.json(result);
});

// --------------------------
const NotificationDAO = require('../models/NotificationDAO');
router.get('/notifications', async function (req, res) {
  const notifications = await NotificationDAO.selectAll();
  res.json(notifications);
});
const SizeDAO = require('../models/SizeDAO');
router.get('/sizes', async function (req, res) {
  const sizes = await SizeDAO.selectAll();
  res.json(sizes);
});

const SliderDAO = require('../models/SliderDAO');
router.get('/sliders', async function (req, res) {
  const sliders = await SliderDAO.selectAll();
  res.json(sliders);
});


const ContactDAO = require('../models/ContactDAO');
router.get('/contacts', async function (req, res) {
  const contacts = await ContactDAO.selectAll();
  res.json(contacts);
});

// ----------------------------------
router.post('/reset-password', async function (req, res) {
  const email = req.body.email;
  const dbCust = await CustomerDAO.selectByEmail(email);

  if (!dbCust) {
    return res.json({ success: false, message: 'Email Không Tồn Tại' });
  } else {
    const now = new Date().getTime(); // milliseconds
    const resetToken = CryptoUtil.md5(now.toString());
    const updateTokenResult = await CustomerDAO.updateResetToken(dbCust._id, resetToken);

    if (updateTokenResult) {
      const send = await EmailUtil.sendToken(email, resetToken);

      if (send) {
        res.json({ success: true, message: 'Vui Lòng Kiểm Tra Email' });
      } else {
        res.json({ success: false, message: 'Gửi Token Đến Email Thất Bại' });
      }
    } else {
      res.json({ success: false, message: 'Vui Lòng Thử Lại' });
    }
  }
});
router.post('/comfirm', async function (req, res) {
  const email = req.body.email;
  const resetToken = req.body.resetToken;
  const password = req.body.password; // Assuming the new password is sent in the request

  const result = await CustomerDAO.updatePasswordWithEmailAndToken(email, resetToken, password);
  res.json(result);
  console.log('', result); // Log the result

});

// Thêm chức năng mới
const ProductFavoriteDAO = require('../models/ProductFavoriteDAO');
router.get('/productfavorites', async function (req, res) {
  const productfavorites = await ProductFavoriteDAO.selectAll();
  res.json(productfavorites);
});

router.post('/productfavorites', JwtUtil.checkToken, async function (req, res) {
  
  const now = new Date().getTime(); // milliseconds
  const product = req.body.product;
  const customer = req.body.customer;
  const idproduct= product._id;
  const dbCust = await ProductFavoriteDAO.selectIDProduct(idproduct);
  if(!dbCust || (Array.isArray(dbCust) && dbCust.length === 0)){
    const order = { cdate: now, customer: customer, product: product };
    const result = await ProductFavoriteDAO.insert(order);
    
    res.json({ success: true, message: 'Thêm Thành Công' });
  }
  else{
    
    res.json({ message: 'Sản Phẩm Yêu Thích Đã Có Sẵn' });
  }
  // else{
  //   alert("Sản Phẩm Đã Được Thêm Từ Trước");
  // }
  
});
router.put('/productfavorites/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body.name;
  const productfavorites = { _id: _id, name: name };
  const result = await ProductFavoriteDAO.update(productfavorites);
  res.json(result);
});
router.delete('/productfavorites/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductFavoriteDAO.delete(_id);
  res.json(result);
});

router.get('/productfavorites/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const productfavorites = await ProductFavoriteDAO.selectByCustID(_cid);
  res.json(productfavorites);
});
router.get('/productfavorites/product/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const productfavorites = await ProductFavoriteDAO.selectIDProduct(_cid);
  res.json(productfavorites);
});


// ------------------------------
//thêm sản phẩm yêu thích vào mongo
router.post('/addfavorite', JwtUtil.checkToken, async function (req, res) {
  const now = new Date().getTime(); // milliseconds
  const product = req.body.product;
  const customer = req.body.customer;
  const order = { cdate: now, customer: customer, product: product };
  const result = await ProductFavoriteDAO.insert(order);
  res.json(result);
});

// ------------------------



module.exports = router;