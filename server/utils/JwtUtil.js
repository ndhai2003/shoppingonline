//CLI: npm install jsonwebtoken --save
const jwt = require('jsonwebtoken');
const MyConstants = require('./MyConstants');
const JwtUtil = {
  genToken(id,username, password) {
    const token = jwt.sign(
      { id,username, password },
      MyConstants.JWT_SECRET,
      { expiresIn: MyConstants.JWT_EXPIRES }
    );
    return token;
  },
  checkToken(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];
    if (token) {
      jwt.verify(token, MyConstants.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          });
        } else {
          req.username = decoded.username;
          req.id = decoded.id;
          next();
        }
      });
    } else {
      return res.json({
        success: false,
        message: 'Token lỗi hoặc hết hạn'
      });
    }
  },

};
module.exports = JwtUtil;