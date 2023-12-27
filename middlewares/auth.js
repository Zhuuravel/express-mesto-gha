const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret';
const Unauthorized = require('../errors/Unauthorized');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization)
  
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(new Unauthorized('Необходима авторизация'));
    }
    const token = authorization.replace('Bearer ', '');;
    let payload;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return next(new Unauthorized('Необходима авторизация'));
    }
  
    req.user = payload; // записываем пейлоуд в объект запроса
  
    next();
  }