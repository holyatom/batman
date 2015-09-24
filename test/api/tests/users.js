import chai from 'chai';
import server, { app } from 'server';
import { setup, clearDb } from '../setup';
import UserCreation from '../operations/user/creation';
import Login from '../operations/auth/login';
import UserCardFetch from '../operations/user/card';


describe('Users API', () => {
  before((done) => {
    setup(server, app, () => done());
  });

  it('POST /api/users should create and return user', done => {
    new UserCreation().test(app, done);
  });

  it('GET /api/users/:username should return user card', done => {
    var login = new Login();
    var userCreation = new UserCreation();
    var userCardFetch = new UserCardFetch(login);

    var user;

    login.request(app)
      .then(res => {
        return userCreation.request(app, {
          username: 'ivan',
          full_name: 'Ivan Ivanov'
        });
      })
      .then(res => {
        user = res.body;
        return userCardFetch.request(app, {
          username: user.username
        });
      })
      .then(res => {
        userCardFetch.check(res, user);
        done();
      })
      .catch(err => done(err));
  });
});
