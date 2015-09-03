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

    this.Model.findOne({ username: model.username }, function (err, doc) {
      if (err) {
        next(err);
      }

      if (doc) {
        return this.error(req.lang, 'user_exist', 400);
      }

      model.set({ created: new Date() });

      model.save(function (err, doc) {
        if (err) {
          next(err);
        }

        var user = doc.toJSON();
        res.json(user);
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
