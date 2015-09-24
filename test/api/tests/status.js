import chai from 'chai';
import server, { app } from 'server';
import { setup } from '../setup';
import StatusCheck from '../operations/status/check';


describe('API status', () => {
  before(done => {
    setup(server, app, () => done());
  });

  it('GET /api/status should return batman saying', done => {
    new StatusCheck().test(app, done);
  });
});
