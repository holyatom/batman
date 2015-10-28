import _ from 'lodash';
import ModelController from '../base/model_controller';
import Post from '../models/post';
import Following from '../models/following';
import User from '../models/user';


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
    opts.filters.user = { $in: req.followeeIds };

    return opts;
  }

  populateList (query) {
    return query.populate('user', '_id full_name image_url');
  }
}

FeedController.prototype.logPrefix = 'feed-controller';
FeedController.prototype.urlPrefix = '/feed';
FeedController.prototype.Model = Post;
FeedController.prototype.auth = true;
FeedController.prototype.actions = ['list'];
FeedController.prototype.sortableFields = ['created'];
FeedController.prototype.listFields = ['description', 'address', 'image_urls', 'user', 'location_name', 'created', '__v'];
FeedController.prototype.listOrder = '-created';

FeedController.prototype.list.type = 'get';
