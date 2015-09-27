import chai from 'chai';
import server from 'server';
import { setup } from '../setup';


let url = '/api/auth';
let env = {};

describe('Auth API', () => {
  before(done => {
    setup(server, () => done());
  });

  it('POST /api/auth should authenticate and return user', done => {
    var env = server.app.env;
    chai.request(server.app)
      .post(url)
      .send({
        username: env.user.username,
        password: env.user.password,
      })
      .then(res => {
        res.status.should.equal(200);
        res.body._id.should.equal(env.user._id);
        res.body.created.should.equal(env.user.created);
        res.body.__v.should.equal(env.user.__v);
        res.body.username.should.equal(env.user.username);
        res.body.full_name.should.equal(env.user.full_name);
        res.body.image_url.should.equal(env.user.image_url);
        res.body.token.value.should.exist;
        res.body.token.expires.exist;
        done();
      })
      .catch(err => done(err));
  });
});
