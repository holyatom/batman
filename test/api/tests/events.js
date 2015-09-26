import chai from 'chai';
import server, { app } from 'server';
import { setup } from '../setup';


let url = '/api/users/:username/events';
let env = {};

let event = {
  description: 'Vodka party',
  date: '2052-09-12T14:02:19.000Z',
  image_urls: ['http://image.jpg'],
  address: 'Park, bench',
};

let createdEvent;

describe('Events API', () => {
  before(done => {
    setup(server, app, env, () => done());
  });

  it('POST /api/users/profile/events should create and return event of current user', done => {
    chai.request(app)
      .post(url.replace(':username', 'profile'))
      .set('X-Access-Token', env.user.token.value)
      .send(event)
      .then(res => {
        createdEvent = res.body;

        res.status.should.equal(200);
        res.body.__v.should.equal(0);
        res.body.user_id.should.equal(env.user._id);
        res.body.description.should.equal(event.description);
        res.body.date.should.equal(event.date);
        res.body.image_urls.should.deep.equal(event.image_urls);
        res.body.address.should.equal(event.address);
        res.body._id.should.exist;
        res.body.created.should.exist;
        done();
      })
      .catch(err => done(err));
  });

  it('GET /api/users/:username/events should return list of future user events', done => {
    chai.request(app)
      .get(url.replace(':username', env.user.username))
      .set('X-Access-Token', env.user.token.value)
      .then(res => {
        res.status.should.equal(200);
        res.body.total.should.equal(1);
        res.body.page.should.equal(1);
        res.body.per_page.should.equal(20);
        res.body.collection.length.should.equal(1);
        res.body.collection[0].should.deep.equal(createdEvent);
        done();
      })
      .catch(err => done(err));
  });
});
