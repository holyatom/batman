import chai from 'chai';
import server from 'server';
import { setup } from '../setup';


let url = '/api/users';

let user = {
  username: 'lenin',
  password: '123456',
  full_name: 'Vladimir Iliych Lenin'
};

let createdUser;

describe('Users API', () => {
  before(done => {
    setup(server, () => done());
  });

  it('POST /api/users should create and return user', done => {
    chai.request(server.app)
      .post(url)
      .send(user)
      .then(res => {
        createdUser = res.body;

        res.status.should.equal(200);
        res.body.__v.should.equal(0);
        res.body.username.should.equal(user.username);
        res.body.full_name.should.equal(user.full_name);
        res.body.image_url.should.equal('/images/default_avatar.jpg');
        res.body._id.should.exist;
        res.body.created.should.exist;
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username should return user card', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`${url}/${user.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body._id.should.equal(createdUser._id);
        res.body.created.should.equal(createdUser.created);
        res.body.__v.should.equal(createdUser.__v);
        res.body.username.should.equal(createdUser.username);
        res.body.full_name.should.equal(createdUser.full_name);
        res.body.image_url.should.equal(createdUser.image_url);
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/profile should return current user card', done => {
    var env = server.app.env;
    chai.request(server.app)
      .get(`${url}/profile`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body._id.should.equal(env.user._id);
        res.body.created.should.equal(env.user.created);
        res.body.__v.should.equal(env.user.__v);
        res.body.username.should.equal(env.user.username);
        res.body.full_name.should.equal(env.user.full_name);
        res.body.image_url.should.equal(env.user.image_url);
        done();
      })
      .catch(err => done(err));
  });
});
