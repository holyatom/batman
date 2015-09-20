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

gulp.task('mocha', function (done) {
  var runner = exec('env NODE_ENV=test mocha', function (err) {
    done(err);
  });

  proxyLog(runner);
});

gulp.task('test', ['mocha']);
