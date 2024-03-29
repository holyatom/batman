import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from 'config';
import middlewares from 'server/middlewares';
import { contains } from 'libs/utils';
import Controller from 'server/base/controller';
import userFactory from './factories/user';
import errorhandler from 'errorhandler';


let database = callback => {
  if (contains([1, 2], mongoose.connection.readyState)) {
    mongoose.connection.close();
  }

  mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`);

  mongoose.connection.on('error', error => {
    console.log(`mongodb operation failed: ${error}`);
  });

  mongoose.connection.once('open', () => {
    mongoose.connection.db.dropDatabase((err) => {
      if (err) {
        console.log('mongodb wasn\'t cleared');
      } else {
        callback();
      }
    });
  });
};

export function setup (server, done) {

  if (config.env !== 'test') {
    throw new Error('Tests must be run with NODE_ENV set to \'test\'');
  }

  chai.use(chaiHttp);
  chai.should();

  let app = server.app;
  let env = app.env = {};

  app.use(bodyParser.json());
  app.use(middlewares.lang);
  app.use(middlewares.jwt);

  // suppress logging
  Controller.prototype.log = (type, message) => {};

  server.initControllers();

  app.use((err, req, res, next) => {
    this.log('error', err.stack || err);
    next();
  });

  database(() => {
    userFactory.create(app)
      .then(user => {
        env.user = user;
        done();
      })
      .catch(err => {
        console.log(err);
        done(err);
      });
  });
}
