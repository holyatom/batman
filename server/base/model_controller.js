import _ from 'lodash';
import { contains } from 'libs/utils';
import Controller from './controller';
import middlewares from '../middlewares';
import env from 'libs/env';


export default class ModelController extends Controller {
  constructor () {
    super();
  }

  router () {
    if (!this.actions) {
      throw new Error('Actions are not specified');
    }

    var baseUrl = `/api${this.urlPrefix}`;

    if (this.auth) {
      this._app.use(baseUrl, middlewares.auth);
    }

    for (let i = 0; i < this.actions.length; i++) {
      let
        action = this.actions[i],
        handlers = [],
        handler = this[action],
        method = handler.type || 'get',
        handlerUrl = handler.url || '',
        url = `${baseUrl}${handlerUrl}`;

      if (handler.auth) {
        handlers.push(middlewares.auth);
      }

      if (handler.url && contains(handler.url, ':id')) {
        handlers.push(this.getModelItem);
      }

      handlers.push(handler);
      super[method](url, ...handlers);
    }
  }

  create (req, res) {
    res.json({ message: 'Empty method' });
  }

  update (req, res) {
    res.json({ message: 'Empty method' });
  }

  get (req, res) {
    res.json({ message: 'Empty method' });
  }

  delete (req, res) {
    res.json({ message: 'Empty method' });
  }

  list (req, res, next) {
    res.json({ message: 'Empty method' });
  }

  getModelItem (req, res, next) {
    next();
  }
}

ModelController.prototype.logPrefix = 'model-controller';
ModelController.prototype.urlPrefix = '';
ModelController.prototype.Model = null;
ModelController.prototype.sortableFields = null;
ModelController.prototype.auth = false;

ModelController.prototype.create.type = 'post';
ModelController.prototype.update.type = 'put';
ModelController.prototype.delete.type = 'delete';

ModelController.prototype.get.url = '/:id';
ModelController.prototype.update.url = '/:id';
ModelController.prototype.delete.url = '/:id';
