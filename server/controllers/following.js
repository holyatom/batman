import ModelController from '../base/model_controller';
import Following from '../models/following';
import User from '../models/user';


export default class FollowingController extends ModelController {
  create (req, res, next) {
    if (req.params.username !== 'profile') return this.notFound(res);

    User.findOne({ username: req.params.followee_username }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);
      if (item._id.equals(req.user._id)) return this.error(res, 'follower_equals_followee', 409);


      let model = {
        follower_id: req.user._id,
        followee_id: item._id,
      };

      this.Model.findOne(model).lean().exec((err, item) => {
        if (err) return next(err);
        if (item) return this.error(res, 'already_followed', 409);

        req.body = model;
        super.create(req, res, next);
      });
    });
  }

  mapItem (req, res, item) {
    res.send({ success: true });
  }

  getModelItem (req, res, next) {
    if (req.params.username !== 'profile') return this.notFound(res);

    User.findOne({ username: req.params.id }).lean().exec((err, item) => {
      if (err) return next(err);
      if (!item) return this.notFound(res);
      if (item._id.equals(req.user._id)) return this.error(res, 'follower_equals_followee', 409);

      let filters = {
        followee_id: item._id,
        follower_id: req.user._id,
      };

      this.Model.findOne(filters, (err, doc) => {
        if (err) return next(err);
        if (!doc) return this.notFound(res);

        req.modelItem = doc;
        next();
      });
    });
  }
}

FollowingController.prototype.logPrefix = 'following-controller';
FollowingController.prototype.urlPrefix = '/users/:username/following';
FollowingController.prototype.Model = Following;
FollowingController.prototype.auth = true;
FollowingController.prototype.actions = ['create', 'delete'];

FollowingController.prototype.create.type = 'post';
FollowingController.prototype.create.url = '/:followee_username';
