import ModelController from '../base/model_controller';
import User from '../models/user';
import Follower from '../models/follower';


export default class FollowersController extends ModelController {
  constructor() {
    super();
    this.logPrefix = 'followers-controller';
    this.urlPrefix = '/users/:username/followers';
    this.Model = User;
    this.auth = true;
    this.actions = ['list'];
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

      var followeeId = doc._id;
      var currentDate = new Date();

      var followerFilters = {
        followee_id: followeeId,
        started: { $lt: currentDate },
        ended: { $or: [
          { $gt: currentDate },
          { $eq: null }
        ]}
      };

      Follower.find(followerFilters, 'follower_id', (err, docs) => {
        if (err) {
          return next(err);
        }

        req.followerIds = docs;

        super.list(req, res, next);
      });
    });
  }

  getCustomListFilters (req) {
    return {
      _id: { $in: req.followerIds }
    };
  }
}
