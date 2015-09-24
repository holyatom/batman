import chai from 'chai';
import server, { app } from 'server';
import { setup } from '../setup';
import UserCreation from '../operations/user/creation';


describe('Users API', () => {
  before((done) => {
    setup(server, app, () => done());
  });

  it('POST /api/users should create and return user', (done) => {
    new UserCreation().test(app, done);
  });
});
