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
    this.listFields = ['username', 'full_name', 'image_url'];
    this.auth = this;
    this.actions = ['create', 'count', 'delete', 'get', 'list'];

    this.create.url = '/:followee_username';

    this.delete.url = '/:followee_username';

    this.get.url = '/:followee_username';

    this.count.type = 'get';
    this.count.url = '/count';
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
        });

        following.validate((err) => {
          if (err) {
            return this.error(res, err.errors);
          }

          var filter = {
            follower_id: followerId,
            followee_id: followeeId,
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
      };

      Following.findOne(filter, (err, doc) => {
        if (err) {
          return next(err);
        }

        if (!doc) {
          return this.error(res, 'not_followed', 409);
        }

        Following.remove(doc, (err) => {
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

      var follower_id = doc._id;

      Following.find({ follower_id }, 'followee_id', (err, docs) => {
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

  count (req, res, next) {
    var { username } = req.params;

    if (username === 'profile') {
      username = req.user.username;
    }

    User.findOne({username}, (err, doc) => {
      if (err) {
        return next(err);
      }

      if (!doc) {
        return this.notFound(res);
      }

      var follower_id = doc._id;

      Following.count({ follower_id }, (err, count) => {
        if (err) {
          return next(err);
        }

        res.send(count.toString());
      });
    });
  }
}
