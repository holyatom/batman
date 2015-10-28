import _ from 'lodash';
import ModelController from '../base/model_controller';
import Post from '../models/post';
import User from '../models/user';


export default class PostsController extends ModelController {
  create (req, res, next) {
    let { username } = req.params;

    if (username !== 'profile') return this.notFound(res);

    req.body.user = req.user._id;
    req.body.created = new Date();

    super.create(req, res, next);
  }

  mapDoc (req, res, next, doc) {
    doc.populate({ path: 'user', select: '_id full_name image_url' }, (err, post) => {
      if (err) return next(err);

      res.json(post.toJSON());
    });
  }

  list (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    User.findOne({ username }).lean().exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);

      req.modelUser = doc;
      super.list(req, res, next);
    });
  }

  getListOptions (req) {
    let opts = super.getListOptions(req);
    opts.filters.user = req.modelUser._id;

    return opts;
  }

  populateList (query) {
    return query.populate('user', '_id full_name image_url');
  }
}

PostsController.prototype.logPrefix = 'user-posts-controller';
PostsController.prototype.urlPrefix = '/users/:username/posts';
PostsController.prototype.Model = Post;
PostsController.prototype.auth = true;
PostsController.prototype.actions = ['create', 'list'];
PostsController.prototype.sortableFields = ['created'];
PostsController.prototype.listFields = ['description', 'address', 'image_urls', 'location_name', 'user', 'created', '__v'];

PostsController.prototype.create.type = 'post';
