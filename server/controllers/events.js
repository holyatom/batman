import ModelController from '../base/model_controller';
import Event from '../models/event';
import User from '../models/user';


export default class EventsController extends ModelController {
  constructor () {
    super();
    this.logPrefix = 'user-events-controller';
    this.urlPrefix = '/users/:username/events';
    this.Model = Event;
    this.auth = true;
    this.actions = ['create', 'list'];
    this.sortableFields = ['created'];
    this.listFields = ['description', 'date', 'image_urls', 'address', 'user_id', 'created', '__v'];

    this.create.type = 'post';
  }

  create (req, res, next) {
    var
      { username } = req.params,
      model = new this.Model(req.body);

    if (username !== 'profile') {
      return this.notFound(res);
    }

    model.set({
      user_id: req.user._id,
      created: new Date()
    });

    model.validate((err) => {
      if (err) {
        return this.error(res, err.errors);
      }

      model.save((err, doc) => {
        if (err) {
          return next(err);
        }

        res.json(doc.toJSON());
      });
    });
  }

  list (req, res, next) {
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

      req.modelUserId = doc._id;
      super.list(req, res, next);
    });
  }

  getCustomListFilters (req) {
    var currentDate = new Date();
    return {
      user_id: req.modelUserId,
      date: {$gt: currentDate}
    }
  }
}
