import config from 'config';
import jwt from 'jsonwebtoken';
import error from './error';
import User from '../models/user';


export default function (req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token) {
    return next();
  }

  jwt.verify(token, config.secret, function (err, decoded) {
    if (err || !decoded) {
      return error(res, 'bad_token', 401);
    }

    User.findOne({ _id: decoded.sub }, (err, doc) => {
      if (err || !doc) {
        return next();
      }

      req.decodedJwt = decoded
      req.authorized = true;
      req.user = doc.toJSON();
      next();
    });
  });
}
