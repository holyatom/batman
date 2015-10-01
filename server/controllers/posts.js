import ModelController from '../base/model_controller';
import Post from '../models/post';
import User from '../models/user';


export default class PostsController extends ModelController {
  create (req, res, next) {
    let { username } = req.params;

    if (username !== 'profile') return this.notFound(res);

    req.body.user_id = req.user._id;
    req.body.created = new Date();

    super.create(req, res, next);
  }

  list (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    User.findOne({ username }).lean().exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);

      req.modelUserId = doc._id;
      super.list(req, res, next);
    });
  }

  getListOptions (req) {
    let opts = super.getListOptions(req);
    opts.filter.user_id = req.modelUserId;

    return opts;
  }
}

PostsController.prototype.logPrefix = 'user-posts-controller';
PostsController.prototype.urlPrefix = '/users/:username/posts';
PostsController.prototype.Model = Post;
PostsController.prototype.auth = true;
PostsController.prototype.actions = ['create', 'list'];
PostsController.prototype.sortableFields = ['created'];
PostsController.prototype.listFields = ['description', 'address', 'image_urls', 'user_id', 'created', '__v'];

PostsController.prototype.create.type = 'post';
