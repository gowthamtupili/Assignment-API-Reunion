const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET;


module.exports.isValidJWT = (req, res, next) => {
  if (req.headers['authorization']) {
      try {
          let authorization = req.headers['authorization'].split(' ');
          if (authorization[0] !== 'Bearer') {
              return res.status(401).json('Invalid Request 1');
          } else {
              req.jwt = jwt.verify(authorization[1], secret);
              return next();
          }
      } catch (err) {
          return res.status(403).json('Invalid Token');
      }
  } else {
      return res.status(401).json('Invalid Request');
  }
}; 