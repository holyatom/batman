import chai from 'chai';
import server, { app } from 'server';
import { setup } from './setup';


let should = chai.should();

describe('API status', () => {
  before((done) => {
    setup(server, app, () => done());
  });

  it('GET /api/status should return batman saying', (done) => {
    chai.request(app)
      .get('/api/status')
      .then((res) => {
        res.status.should.equal(200);
        res.body.status.should.equal('I am batman');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});