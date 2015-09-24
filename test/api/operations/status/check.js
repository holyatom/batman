import Operation from '../../base/operation';
import chai from 'chai';

export default class StatusCheck extends Operation {
  _request (app) {
    return chai.request(app)
      .get('/api/status');
  }

  _check (res) {
    res.status.should.equal(200);
    res.body.status.should.equal('I am batman');
  }
}
