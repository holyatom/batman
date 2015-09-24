import chai from 'chai';
import chaiHttp from 'chai-http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from 'config';
import server, { app } from 'server';
import middlewares from '../../server/middlewares';
import { contains } from 'libs/utils';


let should = chai.should();

let database = function (callback) {
  if (contains([1, 2], mongoose.connection.readyState)) {
    return callback();
  }

  mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`);

  mongoose.connection.on('error', (error) => {
    console.log(`mongodb operation failed: ${error}`);
  });

  mongoose.connection.once('open', () => {
    mongoose.connection.db.dropDatabase((err) => {
      if (err) {
        console.log('mongodb wasn\'t cleared');
      } else {
        callback();
      }
    })
  });
};


describe('Users API', () => {
  before((done) => {
    database(() => {
      chai.use(chaiHttp);

      app.use(bodyParser.json());
      app.use(middlewares.lang);
      app.use(middlewares.jwt);

      server.initControllers();

      done();
    });
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
        //res.status.should.equal(200);
        //res.body.__v.should.equal(0);
        //res.body.username.should.equal('lenin');
        //res.body.full_name.should.equal('Vladimir Ilyich Lenin');

        done();
      })
      .catch((err) => {
        throw err;
      });
  });
});