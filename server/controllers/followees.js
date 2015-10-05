import _ from 'lodash';
import User from '../models/user';
import ModelController from '../base/model_controller';
import Following from '../models/following';


export default class FolloweesController extends ModelController {
  create (req, res, next) {
    let { username } = req.params;

    if (username !== 'profile') return this.notFound(res);
    if (req.user.username == req.modelItem.username) return this.error(res, 'self_following', 409);

    let filter = {
      follower_id: req.user._id,
      followee_id: req.modelItem._id,
    };

    Following.findOne(filter).lean().exec((err, doc) => {
      if (err) return next(err);
      if (doc) return this.error(res, 'already_followed', 409);

      let model = new Following({
        follower_id: req.user._id,
        followee_id: req.modelItem._id,
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

  get (req, res) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    this.Model.findOne({ username }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);

      let filter = {
        follower_id: item._id,
        followee_id: req.modelItem._id,
      };

      Following.findOne(filter).lean().exec((err, item) => {
        if (err) return next(err);
        if (!item) return this.notFound(res);

        res.json({ success: true });
      });
    });
  }

  delete (req, res) {
    let { username } = req.params;
    if (username !== 'profile') return this.notFound(res);

    if (req.user.username === req.modelItem.username) return this.error(res, 'self_unfollowing', 409);

    var filter = {
      follower_id: req.user._id,
      followee_id: req.modelItem._id,
    };

    Following.findOne(filter, (err, doc) => {
      if (err) return next(err);
      if (!doc) return this.error(res, 'not_followed', 409);

      Following.remove(doc, (err) => {
        if (err) return next(err);

        res.json({ success: true });
      });
    });
  }

  list (req, res, next) {
    var { username } = req.params;

    if (username === 'profile') {
      username = req.user.username;
    }

    this.Model.findOne({ username }).lean().exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);

      var follower_id = doc._id;

      Following.find({ follower_id }, 'followee_id').lean().exec((err, docs) => {
        if (err) return next(err);

        req.followeeIds = _.pluck(docs, 'followee_id');

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
    var { username } = req.params;

    if (username === 'profile') {
      username = req.user.username;
    }

    this.Model.findOne({ username }).lean().exec((err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);

      var follower_id = doc._id;

      Following.count({ follower_id }, (err, count) => {
        if (err) return next(err);

        res.json({ count });
      });
    });
  }

  getModelItem (req, res, next) {
    let { id } = req.params;

    this.Model.findOne({ username: id }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);

      req.modelItem = item;
      next();
    });
  }
}

FolloweesController.prototype.logPrefix = 'followees-controller';
FolloweesController.prototype.urlPrefix = '/users/:username/following';
FolloweesController.prototype.Model = User;
FolloweesController.prototype.auth = true;
FolloweesController.prototype.actions = ['create', 'count', 'delete', 'get', 'list'];
FolloweesController.prototype.listFields = ['username', 'full_name', 'image_url', '__v'];

FolloweesController.prototype.create.type = 'post';
FolloweesController.prototype.create.url = '/:id';

FolloweesController.prototype.delete.type = 'delete';
FolloweesController.prototype.delete.url = '/:id';

FolloweesController.prototype.get.type = 'get';
FolloweesController.prototype.get.url = '/:id';

FolloweesController.prototype.count.type = 'get';
FolloweesController.prototype.count.url = '/count';
