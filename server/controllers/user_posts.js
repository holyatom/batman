import ModelController from '../base/model_controller';
import Post from '../models/post';
import User from '../models/user';


export default class UserPostsController extends ModelController {
  create (req, res, next) {
    var model = new this.Model(req.body);

    model.set({
      user_id: req.user._id,
      created: new Date()
    });

    model.validate((err) => {
      if (err) {
        return this.error(res, err.errors);
      }

      model.save((err, doc) => {
        if (err) {
          return next(err);
        }

        res.json(doc.toJSON());
      });
    });
  }

  list (req, res, next) {
    var username = req.params.username || req.user.username;
    console.log('ERER', username);
    User.findOne({ username }, (err, doc) => {
      if (err) {
        return next(err);
      }

      if (!doc) {
        return this.notFound(res);
      }

      req.modelUserId = doc._id;
      super.list(req, res, next);
    });
  }

  modelFilters (req) {
    return {
      user_id: req.modelUserId
    }
  }
}

UserPostsController.prototype.logPrefix = 'user-posts-controller';
UserPostsController.prototype.urlPrefix = '/user';
UserPostsController.prototype.Model = Post;
// UserPostsController.prototype.auth = true;
UserPostsController.prototype.actions = ['create', 'list'];

UserPostsController.prototype.create.url = '/posts';
UserPostsController.prototype.create.type = 'post';

UserPostsController.prototype.list.url = '/posts';
