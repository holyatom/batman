var
  SYMLINKS,
  proxyLog,
  proxy,
  createSymlink,
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

proxy = function (runner, callback) {
  // end: false means when runner died, don't kill process stream
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

proxyLog = function (runner) {
  runner.stdout.on('data', function (data) { process.stdout.write(data.toString()); })
  runner.stderr.on('data', function (data) { process.stderr.write(data.toString()); })
};

gulp.task('symlink', function () {
  for (var key in SYMLINKS) {
    createSymlink(key, SYMLINKS[key])
  };
});

gulp.task('dev', function () {
  nodemon({
    script: 'server/index.js',
    exec: 'babel-node'
  });
});

gulp.task('mocha', function () {
  var runner = exec('mocha');
  proxy(runner);
});

gulp.task('test', ['mocha']);
