import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Follower from '../models/follower';


export default class FolloweesController extends ModelController {
  constructor() {
    super();
    this.logPrefix = 'followees-controller';
    this.urlPrefix = '/users/:username/following';
    this.Model = User;
    this.auth = this;
    this.actions = ['create', 'list'];

    this.create.type = 'put';
    this.create.url = '/:followee_username';
  }

  create (req, res, next) {
    this.findFollowerId(req, res, next)
      .then(this.findFollowee)
      .then(this.assertNotFollowingSelf)
      .then(this.assertNotYetFollowing)
      .then(this.saveFollower)
      .then(this.sendNoContent)
      .catch(this.handleError);
  }

  findFollowerId (req, res, next) {
    console.log('findCurrentUser');
    return new Promise((resolve, reject) => {
      var { username } = req.params;

      if (username !== 'profile') {
        return this.notFound(res);
      }

      var followerId = req.user._id;
      resolve({ req, res, next, followerId });
    });
  }

  findFollowee (value) {
    console.log('findFollowee');
    var
      { req, res } = value,
      { followee_username } = req.params;

    User.findOne({ username: followee_username }, (err, doc) => {
      if (err) {
        throw err;
      }

      if (!doc) {
        return this.notFound(res);
      }

      var followeeId = doc._id;

      return _.assign(value, { followeeId });
    });
  }

  assertNotFollowingSelf (value) {
    console.log('assertNotFollowingSelf');
    var { followerId, followeeId } = value;

    if (followerId.equals(followeeId)) {
      // TODO Change error code
      return this.notFound();
    }

    return value;
  }

  assertNotYetFollowing (value) {
    console.log('assertNotYetFollowing');
    return value;
  }

  saveFollower (value) {
    console.log('saveFollower');
    return value;
  }

  sendNoContent (value) {
    console.log('sendNoContent');
    res.json({message: 'No content'})
  }

  handleError (err) {
    console.log(`handleError: ${err}`);
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

      var followerId = doc._id;
      var currentDate = new Date();

      var followerFilters = {
        follower_id: followerId,
        started: { $lt: currentDate },
        ended: { $or: [
          { $gt: currentDate },
          { $eq: null }
        ]}
      };

      Follower.find(followerFilters, 'followee_id', (err, docs) => {
        if (err) {
          return next(err);
        }

        req.followeeIds = docs;

        super.list(req, res, next);
      });
    });
  }

  getCustomListFilters (req) {
    return {
      _id: { $in: req.followeeIds }
    };
  }
}
