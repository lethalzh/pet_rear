let jsonwebtoken = require('jsonwebtoken');
const secret = 'test_key';

class JWT{
	constructor() {
	   
	  }
   generate(value, expires = '7 days') { 
	  // value 为传入值， expires为过期时间，这两者都会在token字符串中题先
    try {
      return jsonwebtoken.sign(value, secret, { expiresIn: expires });
    } catch (e) {
      console.error('jwt sign error --->', e);
      return '';
    }
  }
  

    verify(token) {
    try {
      return jsonwebtoken.verify(token, secret); // 如果过期将返回false
    } catch (e) {
      console.error('jwt verify error --->', e);
      return false;
    }
  }
}
module.exports = JWT