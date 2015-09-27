import chai from 'chai';
import server from 'server';
import { setup } from '../setup';
import userFactory from '../factories/user';


let url = '/api/auth';

describe('Auth API', () => {
  before(done => setup(server, () => {
    var password = '123456';
    userFactory.create(server.app, { password }, (err, user) => {
      if (err) {
        console.log(err);
        done(err);
      } else {
        user.password = password;
        server.app.env.authUser = user;
        done();
      }
    });
  }));

  it('POST /api/auth should authenticate and return user', done => {
    var env = server.app.env;
    chai.request(server.app)
      .post(url)
      .send({
        username: env.authUser.username,
        password: env.authUser.password,
      })
      .then(res => {
        res.status.should.equal(200);
        res.body._id.should.equal(env.authUser._id);
        res.body.created.should.equal(env.authUser.created);
        res.body.__v.should.equal(env.authUser.__v);
        res.body.username.should.equal(env.authUser.username);
        res.body.full_name.should.equal(env.authUser.full_name);
        res.body.image_url.should.equal(env.authUser.image_url);
        res.body.token.value.should.exist;
        var expires = new Date(res.body.token.expires);
        expires.should.be.above(new Date());
        done();
      })
      .catch(err => done(err));
  });
});
