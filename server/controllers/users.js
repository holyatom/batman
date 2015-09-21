import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Following from '../models/following';


export default class UsersController extends ModelController {
  constructor () {
    super();
    this.logPrefix = 'users-controller';
    this.urlPrefix = '/users';
    this.Model = User;
    this.actions = ['create', 'get', 'list'];
    this.filterableFields = ['username'];
    this.listFields = ['username', 'created', 'full_name', 'image_url'];

    this.create.type = 'post';

    this.get.url = '/:username';
    this.get.auth = true;

    this.list.auth = true;
  }

  get (req, res, next) {
    var username = req.params.username;

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

      return res.json(doc.toJSON());
    });
  }

  create (req, res, next) {
    if (req.authorized) {
      return this.notFound(res);
    }

    var
      that = this,
      model = new this.Model(req.body);

    model.set({ created: new Date() });

    model.validate((err) => {
      if (err) {
        return this.error(res, err.errors);
      }

      this.Model.findOne({ username: model.username }, (err, doc) => {
        if (err) {
          return next(err);
        }

        if (doc) {
          return this.error(res, 'user_exist', 409);
        }

        model.save(function (err, doc) {
          if (err) {
            return next(err);
          }

          var user = doc.toJSON();
          res.json(user);
        });
      });
    });
  }

  list (...args) {
    super.list(...args);
  }

  setAdditionalFields(req, next, users) {
    var currentUserId = req.user._id;

    var userIds = _.map(users, (user) => user._id);

    var followeeFilter = {
      follower_id: currentUserId,
      followee_id: { $in: userIds }
    };

    Following.find(followeeFilter, 'followee_id', (err, followings) => {
      if (err) {
        return next(err);
      }

      var followeeIds = _.map(followings, (f) => f.followee_id);

      _.forEach(users, (user) => {
        user.is_followed = _.some(followeeIds, (id) => id.equals(user._id));
      })
    });

    var followerFilter = {
      followee_id: currentUserId,
      follower_id: { $in: userIds }
    };

    Following.find(followerFilter, 'follower_id', (err, followings) => {
      if (err) {
        return next(err);
      }

      var followerIds = _.map(followings, (f) => f.follower_id);

      _.forEach(users, (user) => {
        user.is_following = _.some(followerIds, (id) => id.equals(user._id));
      })
    });
  }
}
