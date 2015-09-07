import _ from 'lodash';
import { contains } from 'libs/utils';
import Controller from './controller';
import middlewares from '../middlewares';


export default class ModelController extends Controller {
  constructor () {
    super();

    this.logPrefix = 'model-controller';
    this.urlPrefix = '';
    this.Model = null;
    this.sortableFields = null;
    this.filterableFields = null;
    this.auth = false;

    this.defaultPage = 1;
    this.defaultPerPage = 20;
    this.maxPerPage = 100;

    this.create.type = 'post';
    this.update.type = 'put';
    this.delete.type = 'delete';

    this.get.url = '/:id';
    this.update.url = '/:id';
    this.delete.url = '/:id';
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
    var
      order,
      filters = {};

    if (req.query.order && this.sortableFields) {
      order = this.getListOrder(req);
    }

    if ((this.filterableFields || {}).length) {
      filters = this.getListFilters(req);
    }

    if (this.getCustomListFilters) {
      filters = _.assign(filters, this.getCustomListFilters(req));
    }

    var { page, perPage } = this.getAndCheckPaginationParams(req, res);

    this.Model
      .find(filters)
      .sort(order)
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec((error, docs) => {
        if (error) {
          return next(error);
        }

        this.Model.count(filters, (error, count) => {
          if (error) {
            return next(error);
          }

          res.json({
            total: count,
            page: page,
            perPage: perPage,
            collection: docs
          });
        });
      });
  }

  getAndCheckPaginationParams (req, res) {
    var page = req.query.page || this.defaultPage;
    var perPage = req.query.per_page || this.defaultPerPage;

    var errorMessage = '';

    if (page <= 0) {
      errorMessage += 'page parameter is non-positive\r\n';
    }

    if (perPage <= 0) {
      errorMessage += 'per_page parameter is non-positive\r\n';
    }

    if (perPage > this.maxPerPage) {
      errorMessage += `per_page parameter exceeds max value which is ${this.maxPerPage}\r\n`;
    }

    if (!_.isEmpty(errorMessage)) {
      res.status(422).send(errorMessage);
    }

    return { page, perPage };
  }

  getListFilters (req) {
    var filter = {};

    for (let key in req.query) {
      if (!_.startsWith(key, '_')) {
        continue;
      }

      let
        operation,
        field = key.substr(1);

      if (contains(field, '__')) {
        [field, operation] = field.split('__');
      }

      if (!contains(this.filterableFields, field)) {
        continue;
      }

      if (!operation) {
        filter[field] = req.query[key];
      }

      if (operation === 'contains') {
        filter[field] = { $regex: req.query[key], $options: 'i' };
      }
    }

    return filter;
  }

  getListOrder (req) {
    var
      { order } = req.query,
      field = _.startsWith(order, '-') ? order.substr(1) : order;

    if (contains(this.sortableFields, field)) {
      return req.query.order;
    }
  }
}
