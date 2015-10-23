var
  SYMLINKS,
  proxy,
  proxyLog,
  createSymlink,
  startServer,
  _ = require('lodash'),
  pkg = require('./package.json'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  symlink = require('gulp-symlink'),
  exec = require('child_process').exec;

SYMLINKS = {
  'config': './config > node_modules',
  'libs': './libs > node_modules',
  'test': './test > node_modules',
  'server': './server > node_modules'
};

createSymlink = function (key, path) {
  path = path.split('>');
  gulp
    .src(path[0].trim())
    .pipe(symlink(path[1].trim() + '/' + key, { force: true }));
};

proxyLog = function (runner) {
  runner.stdout.on('data', function (data) { process.stdout.write(data.toString()); });
  runner.stderr.on('data', function (data) { process.stderr.write(data.toString()); });
};

proxy = function (runner, callback) {
  runner.stdout.pipe(process.stdout, { end: false });
  runner.stderr.pipe(process.stderr, { end: false });
  runner.on('exit', function (status) {
    if (status === 0) {
      if (callback) callback();
    } else {
      process.exit(status);
    }
  });
};

startServer = function (opts) {
  opts = _.assign({
    skipWatch: false,
    envVariables: {}
  }, opts);

  var
    runner,
    command = '',
    isWin = /^win/.test(process.platform),
    variables = [];

  for (key in opts.envVariables) {
    variables.push(key + '=' + opts.envVariables[key]);
  }

  if (variables.length) command += isWin ? ('set ' + variables.join(' ') + ' && ') : (variables.join(' ') + ' ');
  command += opts.skipWatch ? 'node' : 'nodemon';
  command += ' index.js';

  runner = exec(command);
  proxy(runner);
};

gulp.task('symlink', function () {
  for (var key in SYMLINKS) {
    createSymlink(key, SYMLINKS[key])
  };
});


// ===============================================================
// TEST
// ===============================================================

gulp.task('mocha', function (done) {
  var runner = exec('env NODE_ENV=test mocha', function (err) {
    done(err);
  });

  proxyLog(runner);
});

gulp.task('test', ['mocha']);


// ===============================================================
// DEVELOPMENT
// ===============================================================

gulp.task('dev', function () {
  startServer();
});


// ===============================================================
// STAGING
// ===============================================================

gulp.task('staging', function () {
  startServer({
    skipWatch: true,
    envVariables: {
      NODE_ENV: 'staging'
    }
  });
});
