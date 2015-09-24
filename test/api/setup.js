import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from 'config';
import middlewares from 'server/middlewares';
import { contains } from 'libs/utils';
import Controller from 'server/base/controller';


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

export function setup (server, app, done) {
  chai.use(chaiHttp);

  app.use(bodyParser.json());
  app.use(middlewares.lang);
  app.use(middlewares.jwt);

  Controller.prototype.log = (type, message) => { /* suppress logging */ };

  server.initControllers();

  database(() => done());
};
