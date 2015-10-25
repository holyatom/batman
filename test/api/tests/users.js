import chai from 'chai';
import server from 'server';
import { setup } from '../setup';


let url = '/api/users';

let user = {
  username: 'lenin',
  password: '123456',
  full_name: 'Vladimir Iliych Lenin',
};

describe('Users API', () => {
  before(done => setup(server, done));

  it('POST /api/users should create and return user', done => {
    let env = server.app.env;
    chai.request(server.app)
      .post(url)
      .send(user)
      .then(res => {
        env.createdUser = res.body;

        res.status.should.equal(200);
        res.body.__v.should.equal(0);
        res.body.username.should.equal(user.username);
        res.body.full_name.should.equal(user.full_name);
        res.body.image_url.should.equal('/images/default_avatar.jpg');
        res.body._id.should.exist;
        let created = +(new Date(res.body.created));
        let now = +(new Date());
        created.should.be.closeTo(now, 1000);
        done();
      })
      .catch(done);
  });

  it('GET /api/users/:username should return user card', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}/${user.username}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body._id.should.equal(env.createdUser._id);
        res.body.created.should.equal(env.createdUser.created);
        res.body.__v.should.equal(env.createdUser.__v);
        res.body.username.should.equal(env.createdUser.username);
        res.body.full_name.should.equal(env.createdUser.full_name);
        res.body.image_url.should.equal(env.createdUser.image_url);
        res.body.is_followed.should.equal(false);
        done();
      })
      .catch(done);
  });

  it('GET /api/users/profile should return current user card', done => {
    let env = server.app.env;
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
        res.body.is_followed.should.equal(false);
        done();
      })
      .catch(done);
  });

  it('GET /api/users should return list of users', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(`${url}`)
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(2);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.should.deep.equal([
          {
            _id: env.user._id,
            __v: env.user.__v,
            created: env.user.created,
            username: env.user.username,
            full_name: env.user.full_name,
            image_url: env.user.image_url,
            is_followed: false,
          },
          {
            _id: env.createdUser._id,
            __v: env.createdUser.__v,
            created: env.createdUser.created,
            username: env.createdUser.username,
            full_name: env.createdUser.full_name,
            image_url: env.createdUser.image_url,
            is_followed: false,
          },
        ]);
        done();
      })
      .catch(done);
  });
});
