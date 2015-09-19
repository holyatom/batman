import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Follower from '../models/following';


export default class FollowersController extends ModelController {
  constructor() {
    super();
    this.logPrefix = 'followers-controller';
    this.urlPrefix = '/users/:username/followers';
    this.Model = User;
    this.listFields = 'username full_name image_url';
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

      var filters = {
        followee_id: followeeId
      };

      Follower.find(filters, 'follower_id', (err, docs) => {
        if (err) {
          return next(err);
        }

        req.followerIds = _.map(docs, (el) => el.follower_id);

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
