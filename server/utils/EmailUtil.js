//CLI: npm install nodemailer --save
const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});
const EmailUtil = {
  send(email, id, token) {
    const text = 'Thanks for signing up, please input these informations to activate your account:\n\t .id: ' + id + '\n\t .token: ' + token;
    return new Promise(function (resolve, reject) {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'Signup | Verification',
        text: text
      };
      transporter.sendMail(mailOptions, function (err, result) {
        if (err) reject(err);
        resolve(true);
      });
    });
  },
  sendToken(email, resetToken) {
    const text = 'Please input this information to recover the password for your account:\n\t .TOKEN: ' + resetToken ;
    return new Promise(function (resolve, reject) {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: 'RESET PASSWORD | Verification',
        text: text
      };
      transporter.sendMail(mailOptions, function (err, result) {
        if (err) reject(err);
        resolve(true);
      });
    });
  },
  

};
module.exports = EmailUtil;