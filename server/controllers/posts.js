import ModelController from '../base/model_controller';
import Post from '../models/post';
import User from '../models/user';


export default class PostsController extends ModelController {
  constructor () {
    super();
    this.logPrefix = 'user-posts-controller';
    this.urlPrefix = '/users/:username/posts';
    this.Model = Post;
    this.auth = true;
    this.actions = ['create', 'list'];
    this.sortableFields = ['created'];

    this.create.type = 'post';
  }

  create (req, res, next) {
    var
      { username } = req.params,
      model = new this.Model(req.body);

    if (username !== 'profile') {
      return this.notFound(res);
    }

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
    var { username } = req.params;

    if (username === 'profile') {
      username = req.user.username;
    }

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

  getCustomListFilters (req) {
    return {
      user_id: req.modelUserId
    }
  }
}
