import config from 'config';
import domain from 'domain';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import log from 'libs/logger';
import morgan from 'morgan';
import errorhandler from 'errorhandler';
import middlewares from './middlewares';
import controllers from './controllers';


class Server {
  constructor () {
    this.log = log;
    this.logPrefix = 'server';
    this.app = express();
  }

  preRouteMiddleware () {
    this.app.use((req, res, next) => {
      var _domain = domain.create();
      _domain.add(req);
      _domain.add(res);
      _domain.run(next);
      _domain.on('error', next);
    });

    this.app.use(morgan(config.debug ? 'dev' : 'combined'));

    if (config.env !== 'production') {
      this.app.use(middlewares.cors.dev);
    }

    // Set language.
    this.app.use(middlewares.lang);

    // Parse application/json.
    this.app.use(bodyParser.json({ limit: 1024*1024 }));

    // Authenticate by JSON Web Token.
    this.app.use(middlewares.jwt);
  }

  postRouteMiddleware () {
    if (config.debug) {
      this.app.use(errorhandler({
        dumpExceptions: true,
        showStack: true
      }));
    } else {
      this.app.use((err, req, res, next) => {
        this.log('error', err.stack || err);
        middlewares.serverError(res);
      });
    }

    this.app.use((req, res, next) => middlewares.notFound(res));
  }

  initControllers () {
    for (let Controller of controllers) {
      new Controller().use(this.app);
    }
  }

  database (callback) {
    mongoose.connect(`mongodb://${config.mongodb.host}/${config.mongodb.database}`);

    mongoose.connection.on('error', (error) => {
      this.log('error', `mongodb operation failed: ${error}`);
    });

    mongoose.connection.once('open', () => {
      this.log('info', `mongodb was connected`);
      callback();
    });
  }

  run () {
    this.preRouteMiddleware();
    this.initControllers();
    this.postRouteMiddleware();

    this.app.set('port', config.server.port);

    this.database(() => {
      this.app.listen(config.server.port, config.server.ip, () => {
        this.log('info', `server running on ${config.server.ip}:${config.server.port}`);
      });
    });
  }
}

export default new Server();
