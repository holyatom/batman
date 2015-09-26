import _ from 'lodash';
import chai from 'chai';


export default class Factory {
  constructor () {
    this.postUrl = null;
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

  create (app, data, done) {
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
        return this.post(app, data);
      })
      .then((res) => {
        this.counter += 1;
        return this.postCreate(res.body);
      })
      .then((item) => {
        if (done) done(null, item);
      })
      .catch((err) => {
        if (done) done(err);
      });
  }

  post (app, data) {
    return chai.request(app)
      .post(this.postUrl)
      .send(data);
  }
}
