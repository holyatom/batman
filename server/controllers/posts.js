import _ from 'lodash';
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

  mapItem (req, res, item) {
    delete item['user_id'];

    item.user = {
      id: req.user._id,
      full_name: req.user.full_name,
      image_url: req.user.image_url,
    };

    res.json(item);
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
    opts.filters.user_id = req.modelUser._id;

    return opts;
  }

  mapList (req, res, data) {
    _.forEach(data.collection, post => {
      post.user = {
        id: req.modelUser._id,
        full_name: req.modelUser.full_name,
        image_url: req.modelUser.image_url,
      };
    });

    res.json(data);
  }
}

PostsController.prototype.logPrefix = 'user-posts-controller';
PostsController.prototype.urlPrefix = '/users/:username/posts';
PostsController.prototype.Model = Post;
PostsController.prototype.auth = true;
PostsController.prototype.actions = ['create', 'list'];
PostsController.prototype.sortableFields = ['created'];
PostsController.prototype.listFields = ['description', 'address', 'image_urls', 'location_name', 'created', '__v'];

PostsController.prototype.create.type = 'post';
