import chai from 'chai';
import { setup } from 'test/controller';
import PostController from 'server/controllers/posts';
import { app } from 'server';


let { assert } = chai;
let postsController = new PostController();
let url = `/api${postsController.urlPrefix}`;

describe('Posts Controller', () => {
  before((done) => {
    setup(app, postsController, () => {
      done();
    });
  });

  describe('POST', () => {
    it('should create new post of current user', (done) => {
      let data = {
        description: 'Oh lalalala nigggaaaaa bitheess!',
        address: 'Some village',
        image_url: 'nothing/to/show',
      };

      chai.request(app)
        .post(`${url.replace(':username', 'profile')}`)
        .send(data)
        .set('x-access-token', postsController.user.token.value)
        .end((err, res) => {
          assert.isNull(err);
          assert.equal(res.status, 200);
          assert.equal(res.body.user_id, postsController.user._id);
          assert.equal(res.body.description, data.description);
          assert.equal(res.body.address, data.address);
          assert.equal(res.body.image_url, data.image_url);
          done();
        });
    });
  });
});
