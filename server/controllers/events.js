import ModelController from '../base/model_controller';
import Event from '../models/event';
import User from '../models/user';


export default class EventsController extends ModelController {
  create (req, res, next) {
    let { username } = req.params;

    if (username !== 'profile') return this.notFound(res);

    req.body.user_id = req.user._id;
    req.body.created = new Date();

    super.create(req, res, next);
  }

  list (req, res, next) {
    let { username } = req.params;
    if (username === 'profile') username = req.user.username;

    User.findOne({ username }).lean().exec((err, user) => {
      if (err) return next(err);
      if (!user) return this.notFound(res);

      req.modelUserId = user._id;
      super.list(req, res, next);
    });
  }

  getListOptions (req) {
    let opts = super.getListOptions(req);

    opts.filter.user_id = req.modelUserId;
    opts.filter.date = { $gt: new Date() };

    return opts;
  }
}

EventsController.prototype.logPrefix = 'user-events-controller';
EventsController.prototype.urlPrefix = '/users/:username/events';
EventsController.prototype.Model = Event;
EventsController.prototype.auth = true;
EventsController.prototype.actions = ['create', 'list'];
EventsController.prototype.sortableFields = ['created'];
EventsController.prototype.listFields = ['description', 'date', 'image_urls', 'address', 'user_id', 'created', '__v'];

EventsController.prototype.create.type = 'post';
