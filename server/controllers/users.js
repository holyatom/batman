import ModelController from '../base/model_controller';
import User from '../models/user';


export default class UsersController extends ModelController {
  get (req, res, next) {
    var username = req.params.username;

    if (username === 'profile') {
      username = req.user.username;
    }

    this.Model.findOne({ username }, (err, doc) => {
      if (err) {
        return next(err);
      }

      if (!doc) {
        return this.notFound(res);
      }

      return res.json(doc.toJSON());
    });
  }

  create (req, res, next) {
    if (req.authorized) {
      return this.notFound(res);
    }

    var
      that = this,
      model = new this.Model(req.body);

    model.set({ created: new Date() });

    model.validate((err) => {
      if (err) {
        return this.error(res, err.errors);
      }

      this.Model.findOne({ username: model.username }, (err, doc) => {
        if (err) {
          return next(err);
        }

        if (doc) {
          return this.error(res, 'user_exist', 409);
        }

        model.save(function (err, doc) {
          if (err) {
            return next(err);
          }

          var user = doc.toJSON();
          res.json(user);
        });
      });
    });
  }
}

UsersController.prototype.logPrefix = 'users-controller';
UsersController.prototype.urlPrefix = '/users';
UsersController.prototype.Model = User;
UsersController.prototype.actions = ['create', 'get'];

UsersController.prototype.create.type = 'post';

UsersController.prototype.get.url = '/:username';
UsersController.prototype.get.auth = true;
