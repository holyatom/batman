import ModelController from '../../base/model_controller';
import User from '../../models/user';


export default class UserController extends ModelController {
  get (req, res, next) {
    res.json(req.user);
  }

  create (req, res, next) {
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

UserController.prototype.logPrefix = 'user-controller';
UserController.prototype.urlPrefix = '/user';
UserController.prototype.Model = User;
UserController.prototype.actions = ['create', 'get'];

UserController.prototype.create.type = 'post';

UserController.prototype.get.auth = true;
