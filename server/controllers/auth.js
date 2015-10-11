import jwt from 'jsonwebtoken';
import config from 'config';
import ModelController from '../base/model_controller';
import User from '../models/user';


export default class AuthController extends ModelController {
  generateToken (user) {
    let expires = new Date();
    let claims = {
      sub: user._id,
      iss: 'https://walk.com',
      permissions: '',
    };

    let token = jwt.sign(claims, config.secret, {
      expiresInMinutes: config.jwt.expires,
    });

    expires.setMinutes(expires.getMinutes() + config.jwt.expires);

    return {
      expires,
      value: token,
    };
  }

  login (req, res, next) {
    let { username, password } = req.body;

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
        let user = doc.toJSON();
        user.token = this.generateToken(user);
        res.json(user);
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
