import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Following from '../models/following';


export default class FollowersController extends ModelController {
  list (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    this.Model.findOne({ username }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);

      Following.find({ followee_id: item._id }).lean().exec((err, collection) => {
        if (err) return next(err);

        req.followerIds = _.pluck(collection, 'follower_id');
        super.list(req, res, next);
      });
    });
  }

  getListOptions (req) {
    let opts = super.getListOptions(req);
    opts.filters._id = { $in: req.followerIds };

    return opts;
  }

  count (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    this.Model.findOne({ username }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);

      Following.count({ followee_id: item._id }, (err, count) => {
        if (err) return next(err);
        res.json({ count });
      });
    });
  }
}

FollowersController.prototype.logPrefix = 'followers-controller';
FollowersController.prototype.urlPrefix = '/users/:username/followers';
FollowersController.prototype.Model = User;
FollowersController.prototype.auth = true;
FollowersController.prototype.actions = ['list', 'count'];
FollowersController.prototype.listFields = ['username', 'full_name', 'image_url'];

FollowersController.prototype.count.type = 'get';
FollowersController.prototype.count.url = '/count';
