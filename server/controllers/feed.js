import _ from 'lodash';
import ModelController from '../base/model_controller';
import Post from '../models/post';
import Following from '../models/following';


export default class FeedController extends ModelController {
  list (req, res, next) {
    Following.find({ follower_id: req.user._id }).lean().exec((err, collection) => {
      if (err) return next(err);

      req.followeeIds = _.pluck(collection, 'followee_id');
      super.list(req, res, next);
    });
  }

  getListOptions (req) {
    let opts = super.getListOptions(req);
    opts.filters.user_id = { $in: req.followeeIds };

    return opts;
  }
}

FeedController.prototype.logPrefix = 'feed-controller';
FeedController.prototype.urlPrefix = '/feed';
FeedController.prototype.Model = Post;
FeedController.prototype.auth = true;
FeedController.prototype.actions = ['list'];
FeedController.prototype.sortableFields = ['created'];
FeedController.prototype.listFields = ['description', 'address', 'image_urls', 'created', '__v'];
FeedController.prototype.listOrder = '-created';

FeedController.prototype.list.type = 'get';
