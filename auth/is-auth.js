const jwt = require('jsonwebtoken');
const userConstants = require('../constants/users.json')

module.exports = (req, res, next) => {
  console.log("test");
   const authHeader = req.get('Authorization');
  try {
    if (!authHeader) {
      const error = new Error('Validation failed.');
          error.statusCode = 422;
          next(error);
    }
    console.log(authHeader);

    const token = authHeader.split(' ')[1];
    let decodedToken;
    
      decodedToken = jwt.verify(token, userConstants.HASH_KEY_CODE);

    if (!decodedToken) {

      throw new Error.statusCode(401)('Not authenticated.');
    }
   // console.log("here");

    req.userId = decodedToken.userId;
} catch (err) {
  return next(err);
}
  next();
};
