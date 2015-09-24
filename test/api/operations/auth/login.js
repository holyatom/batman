import Operation from '../../base/operation';
import chai from 'chai';

export default class Login extends Operation {

  constructor () {
    super();

    this._reqData = {
      username: 'lenin',
      password: '123456',
    };
  }

  _request (app) {
    return chai.request(app)
      .post('/api/auth')
      .send(this._reqData);
  }

  _check (res, data) {
    res.status.should.equal(200);
    res.body.__v.should.equal(0);
    res.body.username.should.equal(this._reqData.username);
    res.body.image_url.should.equal(data.image_url);
    res.body.created.should.equal(data.created);
    res.body._id.should.equal(data._id);
    res.body.token.value.should.exist;
    res.body.token.expires.should.exist;
  }
}
