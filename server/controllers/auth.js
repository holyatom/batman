import jwt from 'jsonwebtoken';
import config from 'config';
import ModelController from '../base/model_controller';
import User from '../models/user';



export default class AuthController extends ModelController {
  _generateToken (user) {
    var
      expires = new Date(),
      claims = {
        sub: user._id,
        iss: 'https://walk.com',
        permissions: ''
      },

      token = jwt.sign(claims, config.secret, {
        expiresInMinutes: config.jwt.expires
      });

    expires.setMinutes(expires.getMinutes() + config.jwt.expires);

    return {
      value: token,
      expires: expires
    };
  }

  login (req, res, next) {
    var { username, password } = req.body;

    if (!username || !password) {
      return this.error(res, { username: 'wrong_login_or_password' });
    }

    this.Model.findOne({ username }, (err, doc) => {
      if (err) {
        next(err);
      }

      if (!doc) {
        return this.error(res, 'unknown_user', 404);
      }

      if (doc && doc.comparePassword(password)) {
        var item = doc.toJSON();
        item.token = this._generateToken(doc);
        res.json(item);
      } else {
        return this.error(res, { username: 'wrong_login_or_password' });;
      }
    });
  }
}

AuthController.prototype.logPrefix = 'auth-controller';
AuthController.prototype.urlPrefix = '/auth';
AuthController.prototype.Model = User;
AuthController.prototype.actions = ['login'];

AuthController.prototype.login.type = 'post';
