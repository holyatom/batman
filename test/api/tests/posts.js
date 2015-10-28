import chai from 'chai';
import server from 'server';
import { setup } from '../setup';


let url = '/api/users/:username/posts';

let post = {
  description: 'Tea party',
  image_urls: ['http://boredom.jpg'],
  address: 'London, The Castle',
  location_name: 'Dostoevskiy kabak',
};

describe('Posts API', () => {
  before(done => setup(server, done));

  it('POST /api/users/profile/posts should create and return post of current user', done => {
    let env = server.app.env;
    chai.request(server.app)
      .post(url.replace(':username', 'profile'))
      .set('X-Access-Token', env.user.token.value)
      .send(post)
      .then(res => {
        env.createdPost = res.body;

        res.status.should.equal(200);
        res.body.__v.should.equal(0);
        res.body.description.should.equal(post.description);
        res.body.image_urls.should.deep.equal(post.image_urls);
        res.body.address.should.equal(post.address);
        res.body.location_name.should.equal(post.location_name);
        res.body.user._id.should.equal(env.user._id);
        res.body.user.full_name.should.equal(env.user.full_name);
        res.body.user.image_url.should.equal(env.user.image_url);
        res.body._id.should.exist;
        let created = +(new Date(res.body.created));
        let now = +(new Date());
        created.should.be.closeTo(now, 1000);
        done();
      })
      .catch(done);
  });

  it('GET /api/users/:username/posts should return list of user posts', done => {
    let env = server.app.env;
    chai.request(server.app)
      .get(url.replace(':username', env.user.username))
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(1);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.length.should.equal(1);
        res.body.collection[0].should.deep.equal(env.createdPost);
        done();
      })
      .catch(done);
  });
});
