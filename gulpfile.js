var
  SYMLINKS,
  createSymlink,
  pkg = require('./package.json'),
  gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  symlink = require('gulp-symlink');


SYMLINKS = {
  'config': './config > node_modules',
  'libs': './libs > node_modules'
};

createSymlink = function (key, path) {
  path = path.split('>');
  gulp
    .src(path[0].trim())
    .pipe(symlink(path[1].trim() + '/' + key, { force: true }));
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

gulp.task('staging', function () {
  nodemon({
    script: 'server/index.js',
    exec: 'babel-node',
    env: { 'NODE_ENV': 'staging' }
  });
});
