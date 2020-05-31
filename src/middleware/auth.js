const jwt = require('jsonwebtoken');
const environment = require('../config/environment');
const config =environment.config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
      if (!authHeader) {
        req.isAuth = false;
        return next();
      }
    const token = authHeader.split(' ')[1];
    let decodedToken;
      decodedToken = jwt.verify(token, config.jwt_token);
      if (!decodedToken) {
        req.isAuth = false;
        return next();
      }
      req.userId = decodedToken.jwtData.userId;
      req.role = decodedToken.jwtData.role;
      req.isAuth = true;
      next();
  } catch (err) {
    req.isAuth = false;
    return next();
}
};
