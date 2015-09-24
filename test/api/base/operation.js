import _ from 'lodash';


export default class Operation {

  constructor () {
    this._reqData = {};
    this._res = undefined;
  }

  test (app, done) {
    this.request(app)
      .then(res => {
        this.check(res);
        done();
      })
      .catch(err => done(err));
  }

  request (app, reqDataOpts) {
    _.assign(this._reqData, reqDataOpts);
    return this._request(app);
  }

  check (res) {
    this._res = res;
    this._check(res);
  }

  get res () {
    return this._res;
  }
}
