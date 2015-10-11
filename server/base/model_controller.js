import _ from 'lodash';
import Q from 'q';
import { contains } from 'libs/utils';
import ValidationError from 'libs/errors/validation_error';
import Controller from './controller';
import middlewares from '../middlewares';


export default class ModelController extends Controller {
  router () {
    if (!this.actions) throw new Error('Actions are not specified');

    let baseUrl = `/api${this.urlPrefix}`;

    if (this.auth) this._app.use(baseUrl, middlewares.auth);

    for (let action of this.actions ) {
      let handlers = [];
      let handler = this[action];
      let method = handler.type || 'get';
      let handlerUrl = handler.url || '';
      let url = `${baseUrl}${handlerUrl}`;

      if (handler.auth) {
        handlers.push(middlewares.auth);
      }

      if (handler.url && contains(handler.url, '/:id')) {
        handlers.push(this.getModelItem);
      }

      handlers.push(handler);
      super[method](url, ...handlers);
    }
  }

  create (req, res, next) {
    let model = new this.Model(req.body);

    model.validate((err) => {
      if (err) return this.error(res, err.errors);

      model.save((err, doc) => {
        if (err) return next(err);

        if (this.mapItem) {
          this.mapItem(req, res, doc.toJSON());
        } else {
          res.json(doc.toJSON());
        }
      });
    });
  }

  update (req, res) {
    res.json({ message: 'Empty method' });
  }

  get (req, res) {
    if (this.mapItem) {
      this.mapItem(req, res, req.modelItem.toJSON());
    } else {
      res.json(req.modelItem.toJSON());
    }
  }

  delete (req, res) {
    this.Model.remove(req.modelItem, (err) => {
      if (err) return next(err);
      res.json({ success: true });
    });
  }

  list (req, res, next) {
    let opts;
    try {
      opts = this.getListOptions(req);
    } catch (err) {
      if (err instanceof ValidationError) {
        return this.error(res, err.getError());
      } else {
        throw err;
      }
    }

    let countQuery = this.Model.count(opts.filters);
    let query = this.Model
      .find(opts.filters)
      .sort(opts.order || '_id')
      .select(opts.select)
      .skip((opts.page - 1) * opts.perPage)
      .limit(opts.perPage)
      .lean();

    let dfd = Q.all([query.exec(), countQuery.exec()]);
    dfd.fail((err) => next(err));
    dfd.done(([collection, count]) => {
      let data = {
        collection,
        total: count,
        page: opts.page,
        per_page: opts.perPage,
      };

      if (this.mapList) {
        this.mapList(req, res, data);
      } else {
        res.json(data);
      }
    });
  }

  getModelItem (req, res, next) {
    let filter = { _id: req.params.id };

    this.Model.findOne(filter, (err, doc) => {
      if (err) return next(err);
      if (!doc) return this.notFound(res);

      req.modelItem = doc;
      next();
    });
  }

  getListOptions (req) {
    let pagination = this.getPagination(req);
    this.validate(pagination);

    let opts = {
      order: '',
      select: '',
      filters: {},
      page: +pagination.page,
      perPage: +pagination.perPage,
    };

    if (req.query.order && this.sortableFields) {
      opts.order = this.getListOrder(req) || opts.order;
    }

    if ((this.filterableFields || []).length) {
      opts.filters = this.getListFilters(req);
    }

    if (!this.listFields) {
      throw new Error('listFields value is not specified');
    }

    opts.select = this.listFields.join(' ');

    return opts;
  }

  getPagination (req) {
    let page = req.query.page || this.defaultPage;
    let perPage = req.query.per_page || this.defaultPerPage;

    return { page, perPage };
  }

  validate (pagination) {
    let { page, perPage } = pagination;
    let error = {};

    page = parseInt('' + page, 10);
    if (isNaN(page)) error.page = 'bad_int_value';

    perPage = parseInt('' + perPage, 10);
    if (isNaN(perPage)) error.per_page = 'bad_int_value';

    if (!_.isEmpty(error)) throw new ValidationError(error);

    if (perPage <= 0) {
      error.per_page = 'less_than_allowed';
    } else if (perPage > this.maxPerPage) {
      error.per_page = 'more_than_allowed';
    }

    if (page <= 0) error.page = 'less_than_allowed';

    if (!_.isEmpty(error)) throw new ValidationError(error);
  }

  getListFilters (req) {
    let filter = {};

    for (let key in req.query) {
      if (!_.startsWith(key, '_')) continue;

      let operation = null;
      let field = key.substr(1);

      if (contains(field, '__')) {
        [field, operation] = field.split('__');
      }

      if (!contains(this.filterableFields, field)) continue;

      if (!operation) filter[field] = req.query[key];

      if (operation === 'contains') {
        filter[field] = { $regex: req.query[key], $options: 'i' };
      }
    }

    return filter;
  }

  getListOrder (req) {
    let { order } = req.query;
    let field = _.startsWith(order, '-') ? order.substr(1) : order;

    if (contains(this.sortableFields, field)) return req.query.order;
  }
}

ModelController.prototype.logPrefix = 'model-controller';
ModelController.prototype.urlPrefix = '';
ModelController.prototype.Model = null;
ModelController.prototype.sortableFields = null;
ModelController.prototype.filterableFields = null;
ModelController.prototype.listFields = null;
ModelController.prototype.auth = false;

ModelController.prototype.defaultPage = 1;
ModelController.prototype.defaultPerPage = 20;
ModelController.prototype.maxPerPage = 100;

ModelController.prototype.create.type = 'post';
ModelController.prototype.update.type = 'put';
ModelController.prototype.delete.type = 'delete';

ModelController.prototype.get.url = '/:id';
ModelController.prototype.update.url = '/:id';
ModelController.prototype.delete.url = '/:id';
