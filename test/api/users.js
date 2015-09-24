import chai from 'chai';
import server, { app } from 'server';
import { setup } from './setup';


let should = chai.should();

describe('Users API', () => {
  before((done) => {
    setup(server, app, () => done());
  });

  it('POST /api/users should create and return user', (done) => {
    chai.request(app)
      .post('/api/users')
      .send({
        username: 'lenin',
        password: '123456',
        full_name: 'Vladimir Ilyich Lenin'
      })
      .then((res) => {
        res.status.should.equal(200);
        res.body.__v.should.equal(0);
        res.body.username.should.equal('lenin');
        res.body.full_name.should.equal('Vladimir Ilyich Lenin');
        res.body.image_url.should.equal('/images/default_avatar.jpg');
        res.body.created.should.exist;
        res.body._id.should.exist;
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});