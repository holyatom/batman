import Operation from '../../base/operation';
import chai from 'chai';

export default class UserCardFetch extends Operation {
  _request (app) {
    return chai.request(app)
      .get(`/api/users/${this._reqData.username}`)
      .set('X-Access-Token', this._token);
  }

  _check (res, data) {
    res.status.should.equal(200);
    res.body._id.should.equal(data._id);
    res.body.created.should.equal(data.created);
    res.body.__v.should.equal(data.__v);
    res.body.image_url.should.equal(data.image_url);
  }
}
