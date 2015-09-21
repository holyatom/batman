import _ from 'lodash';


export default class Factory {
  constructor () {
    this.Model = null;
    this.counter = 0;
  }

  defaults () {
    return {};
  }

  preFill (data) {
    return new Promise((resolve, reject) => resolve(data));
  }

  postFill (data) {
    return new Promise((resolve, reject) => resolve(data));
  }

  postCreate (item) {
    return new Promise((resolve, reject) => resolve(item));
  }

  create (data, done) {
    if (_.isFunction(data)) {
      done = data;
      data = {};
    }

    if (!data) {
      data = {}
    } else {
      data = _.clone(data)
    }

    this.preFill(data).then((data) => {
      data = _.defaults(data, this.defaults());
      return this.postFill(data);
    })
    .then((data) => {
      return new this.Model(data).save();
    })
    .then((doc) => {
      this.counter += 1;
      return this.postCreate(doc.toJSON());
    })
    .then((item) => {
      if (done) done(null, item);
    })
    .catch((err) => {
      if (done) done(err);
    });
  }
}
