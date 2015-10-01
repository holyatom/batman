import _ from 'lodash';
import Q from 'q';
import UsersController from './users';
import Following from '../models/following';


export default class FolloweesController extends UsersController {
  create (req, res, next) {
    let { username, id } = req.params;

    if (username !== 'profile') return this.notFound(res);
    if (req.modelItem) return this.error(res, 'already_followed', 409);

    this.Model.findOne({ username: id }).lean().exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);
      if (doc._id.equals(req.user._id)) return this.error(res, 'self_following', 409);

      let model = new Following({
        follower_id: req.user._id,
        followee_id: doc._id,
      });

      model.validate((err) => {
        if (err) return this.error(res, err.errors);

        model.save((err, doc) => {
          if (err) return next(err);
          res.json({ success: true });
        });
      });
    });
  }

  get (req, res, next) {
    let { username, followee_username } = req.params;
    if (username === 'profile') username = req.user.username;

    let followerQuery = this.Model.findOne({ username }).lean();
    let followeeQuery = this.Model.findOne({ username: followee_username }).lean();

    let dfd = Q.all([followerQuery.exec(), followeeQuery.exec()]);

    dfd.fail(err => next(err));
    dfd.done(([follower], [followee]) => {
      if (!follower || !followee) return this.notFound(res);

      let filter = {
        follower_id: follower._id,
        followee_id: followee._id,
      };

      Following.findOne(filter).lean().exec((err, item) => {
        if (err) return next(err);
        if (!item) return this.notFound(res);

        res.json({ success: true });
      });
    });
  }

  delete (req, res, next) {
    let { username, followee_username } = req.params;
    if (username === 'profile') username = req.user.username;

    let followerQuery = this.Model.findOne({ username }).lean();
    let followeeQuery = this.Model.findOne({ username: followee_username }).lean();

    let dfd = Q.all([followerQuery.exec(), followeeQuery.exec()]);
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

        res.json({ count });
      });
    });
  }

  getModelItem (req, res, next) {
    let { username, id } = req.params;
    if (username === 'profile') username = req.user.username;

    let followerQuery = this.Model.findOne({ username }).lean();
    let followeeQuery = this.Model.findOne({ username: id }).lean();

    let dfd = Q.all([followerQuery.exec(), followeeQuery.exec()]);

    dfd.fail(err => next(err));
    dfd.done(([follower, followee]) => {
      if (!follower || !followee) return this.notFound(res);

      let filter = {
        follower_id: follower._id,
        followee_id: followee._id,
      };

      Following.findOne(filter, (err, doc) => {
        if (err) return next(err);
        if (!doc) return this.notFound(res);

        req.modelItem = doc;
      });
    });
  }
}

FolloweesController.prototype.logPrefix = 'followees-controller';
FolloweesController.prototype.urlPrefix = '/users/:username/following';
FolloweesController.prototype.auth = true;
FolloweesController.prototype.actions = ['create', 'count', 'delete', 'get', 'list'];

FolloweesController.prototype.create.url = '/:id';

FolloweesController.prototype.delete.url = '/:id';

FolloweesController.prototype.get.url = '/:id';

FolloweesController.prototype.count.type = 'get';
FolloweesController.prototype.count.url = '/count';
