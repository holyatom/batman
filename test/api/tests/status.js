import chai from 'chai';
import server from 'server';
import { setup } from '../setup';


describe('API status', () => {
  before(done => setup(server, done));

  it('GET /api/status should return batman saying', done => {
    chai.request(server.app)
      .get('/api/status')
      .then(res => {
        res.status.should.equal(200);
        res.body.status.should.equal('I am batman');
        done();
      })
      .catch(done);
  });
});
