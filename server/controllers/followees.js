import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Following from '../models/following';


export default class FolloweesController extends ModelController {
  constructor() {
    super();
    this.logPrefix = 'followees-controller';
    this.urlPrefix = '/users/:username/following';
    this.Model = User;
    this.auth = this;
    this.actions = ['create', 'delete', 'get', 'list'];

    this.create.type = 'put';
    this.create.url = '/:followee_username';

    this.delete.url = '/:followee_username';

    this.get.url = '/:followee_username';
  }

  create (req, res, next) {
      var { username, followee_username } = req.params;

      if (username !== 'profile') {
          return this.notFound(res);
      }

      var followerId = req.user._id;

      this.Model.findOne({ username: followee_username }, (err, doc) => {
        if (err) {
          return next(err);
        }

        if (!doc) {
          return this.notFound(res);
        }

        var followeeId = doc._id;

        if (followerId.equals(followeeId)) {
          return this.error(res, 'self_following', 409);
        }

        var following = new Following({
          follower_id: followerId,
          followee_id: followeeId,
          started: new Date(),
          ended: null,
        });

        following.validate((err) => {
          if (err) {
            return this.error(res, err.errors);
          }

          var filter = {
            follower_id: followerId,
            followee_id: followeeId,
            started: { $lt: new Date() },
            ended: null,
          };

          Following.findOne(filter, (err, doc) => {
            if (err) {
              return next(err);
            }

            if (doc) {
              return this.error(res, 'already_followed', 409);
            }

            following.save((err, doc) => {
              if (err) {
                return next(err);
              }

              res.status(204).end();
            });
          });
        });
      });
  }

  get (req, res, next) {
    var { username, followee_username } = req.params;

    if (username === 'profile') {
      username = req.user.username;
    }

    this.Model.findOne({ username }, (err, doc) => {
      if (err) {
        return next(err);
      }

      if (!doc) {
        return this.notFound(res);
      }

      var followerId = doc._id;

      this.Model.findOne({ username: followee_username }, (err, doc) => {
        if (err) {
          return next(err);
        }

        if (!doc) {
          return this.notFound(res);
        }

        var followeeId = doc._id;

        var filter = {
          follower_id: followerId,
          followee_id: followeeId,
          started: { $lt: new Date() },
          ended: null,
        };

        Following.findOne(filter, (err, doc) => {
          if (err) {
            return next(err);
          }

          if (doc) {
            return res.status(204).end();
          }
          else {
            return this.notFound(res);
          }
        });
      });
    });
  }

  delete (req, res, next) {
    var { username, followee_username } = req.params;

    if (username !== 'profile') {
      return this.notFound(res);
    }

    var followerId = req.user._id;

    this.Model.findOne({username: followee_username}, (err, doc) => {
      if (err) {
        return next(err);
      }

      if (!doc) {
        return this.notFound(res);
      }

      var followeeId = doc._id;

      if (followerId.equals(followeeId)) {
        return this.error(res, 'self_unfollowing', 409);
      }

      var filter = {
        follower_id: followerId,
        followee_id: followeeId,
        started: { $lt: new Date() },
        ended: null,
      };

      Following.findOne(filter, (err, doc) => {
        if (err) {
          return next(err);
        }

        if (!doc) {
          return this.error(res, 'not_followed', 409);
        }

        doc.set({
          ended: new Date(),
        });

        doc.save((err, doc) => {
          if (err) {
            return next(err);
          }

          res.status(204).end();
        });
      });
    });
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

      var followerFilters = {
        follower_id: followerId,
        started: { $lt: new Date() },
        ended: null,
      };

      Following.find(followerFilters, 'followee_id', (err, docs) => {
        if (err) {
          return next(err);
        }

        req.followeeIds = _.map(docs, (el) => el.followee_id);

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
