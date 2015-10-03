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

  postCreate (req, resBody) {
    return new Promise((resolve, reject) => resolve(resBody));
  }

  create (app, data, done) {
    return new Promise((resolve, reject) => {
      if (_.isFunction(data)) {
        done = data;
        data = {};
      }

      if (!data) {
        data = {}
      } else {
        data = _.clone(data)
      }

      this.preFill(data)
        .then((data) => {
          data = _.defaults(data, this.defaults());
          return this.postFill(data);
        })
        .then((data) => {
          return this.post(app, data);
        })
        .then((data) => {
          this.counter += 1;
          return this.postCreate(data.req, data.res.body);
        })
        .then((item) => {
          resolve(item);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  post (app, data) {
    return new Promise((resolve, reject) => {
      chai.request(app)
        .post(this.postUrl)
        .send(data)
        .then(res => resolve({ req: data, res }))
        .catch(err => reject(err));
    });
  }
}
