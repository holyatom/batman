import _ from 'lodash';
import ModelController from '../base/model_controller';
import User from '../models/user';
import Following from '../models/following';


export default class UsersController extends ModelController {
  get (...args) {
    super.get(...args);
  }

  create (req, res, next) {
    if (req.authorized) return this.notFound(res);

    this.Model.findOne({ username: req.body.username }, (err, doc) => {
      if (err) return next(err);
      if (doc) return this.error(res, 'user_exist', 409);

      req.body.created = new Date();
      super.create(req, res, next);
    });
  }

  list (...args) {
    super.list(...args);
  }

  getModelItem (req, res, next) {
    let filter = { username: req.params.id };
    if (filter.username === 'profile') filter.username = req.user.username;

    this.Model.findOne(filter, (err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);

      req.modelItem = doc;
      next();
    });
  }

  mapItem (req, res, item) {
    if (!req.user) return res.json(item);

    let filter = {
      follower_id: req.user._id,
      followee_id: item._id,
    };

    Following.findOne(filter).lean().exec((err, following) => {
      if (err) return next(err);

      item.is_followed = !!following;
      return res.json(item);
    });
  }

  mapList (req, res, data) {
    let filter = {
      follower_id: req.user._id,
      followee_id: { $in: _.pluck(data.collection, '_id') },
    };

    Following.find(filter, 'followee_id').lean().exec((err, followings) => {
      if (err) return next(err);

      let followeeIds = _.indexBy(followings, 'followee_id');

      for (let user of data.collection) {
        user.is_followed = !!followeeIds[user._id];
      }

      res.json(data);
    });
  }
}

UsersController.prototype.logPrefix = 'users-controller';
UsersController.prototype.urlPrefix = '/users';
UsersController.prototype.Model = User;
UsersController.prototype.actions = ['create', 'get', 'list'];
UsersController.prototype.filterableFields = ['username'];
UsersController.prototype.listFields = ['username', 'created', 'full_name', 'image_url', '__v'];

UsersController.prototype.create.type = 'post';

UsersController.prototype.get.url = '/:id';
UsersController.prototype.get.auth = true;

UsersController.prototype.list.auth = true;
