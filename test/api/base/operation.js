import _ from 'lodash';
import chai from 'chai';


export default class Operation {

  constructor (login) {
    this._reqData = {};
    this._res = undefined;
    this._login = login;
  }

  test (app, done) {
    this.request(app)
      .then(res => {
        this.check(res, {});
        done();
      })
      .catch(err => done(err));
  }

  request (app, reqDataOpts) {
    _.assign(this._reqData, reqDataOpts);

    if (this._login) {
      this._token = this._login.res.token.value;
    }

    var req = this._request(app);
    req.then(res => this._res = res);
    return req;
  }

  check (res, checkData) {
    this._res = res;
    this._check(res, checkData);
  }

  get res () {
    return this._res.body;
  }
}
