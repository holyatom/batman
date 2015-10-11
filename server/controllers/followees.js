import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Following from '../models/following';


export default class FolloweesController extends ModelController {
  list (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    this.Model.findOne({ username }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);

      Following.find({ follower_id: item._id }).lean().exec((err, collection) => {
        if (err) return next(err);

        req.followeeIds = _.pluck(collection, 'followee_id');
        super.list(req, res, next);
      });
    });
  }

  getListOptions (req) {
    let opts = super.getListOptions(req);
    opts.filters._id = { $in: req.followeeIds };

    return opts;
  }

  count (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    this.Model.findOne({ username }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);

      Following.count({ follower_id: item._id }, (err, count) => {
        if (err) return next(err);
        res.json({ count });
      });
    });
  }
}

FolloweesController.prototype.logPrefix = 'followees-controller';
FolloweesController.prototype.urlPrefix = '/users/:username/following';
FolloweesController.prototype.Model = User;
FolloweesController.prototype.auth = true;
FolloweesController.prototype.actions = ['count', 'list'];
FolloweesController.prototype.listFields = ['username', 'full_name', 'image_url'];

FolloweesController.prototype.count.type = 'get';
FolloweesController.prototype.count.url = '/count';
