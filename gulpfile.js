const gulp = require('gulp');
const webpack = require('webpack');
const rimraf = require('rimraf');
const through2 = require('through2');
const merge2 = require('merge2');
const babel = require('gulp-babel');
const getWebpackConfig = require('./script/getWebpackConfig');
const getBabelCommonConfig = require('./script/getBabelCommonConfig');
const { getProjectPath, transformLess } = require('./script/utils');

const libDir = getProjectPath('lib');
const esDir = getProjectPath('es');
const distDir = getProjectPath('dist');

function compileDist(done) {
  rimraf.sync(distDir);

  const webpackConfig = getWebpackConfig();
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error('err', info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn('warn', info.warnings);
    }

    const buildInfo = stats.toString({
      colors: true,
      children: false,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    });
    // show build info in terminal
    console.log(buildInfo);
    done(0);
  });
}

function compileLess(dir) {
  const less = gulp
    .src(['components/**/*.less'])
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.less$/)) {
          transformLess(file.path)
            .then((css) => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch((e) => {
              console.error(e);
            });
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(dir));
  return less;
}

function babelify(modules, dir) {
  const babelConfig = getBabelCommonConfig(modules);
  delete babelConfig.cacheDirectory;
  const source = [
    'components/**/*.jsx',
    'components/**/*.js',
    '!components/**/__tests__/**',
  ];

  const stream = gulp.src(source).pipe(babel(babelConfig));

  return stream.pipe(gulp.dest(dir));
}

function compile(modules) {
  const destDir = modules === false ? esDir : libDir;
  rimraf.sync(destDir);
  const less = compileLess(destDir);
  const jsFilesStream = babelify(modules, destDir);
  const assets = gulp
    .src(['components/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir));
  return merge2([less, jsFilesStream, assets]);
}

gulp.task('compile-with-es', (done) => {
  console.log('[Parallel] Compile to es...');
  compile(false).on('finish', done);
});

gulp.task('compile-with-lib', (done) => {
  console.log('[Parallel] Compile to js...');
  compile().on('finish', done);
});

gulp.task('compile-with-dist', gulp.series(compileDist));

gulp.task(
  'build',
  gulp.series(gulp.parallel('compile-with-es', 'compile-with-lib'))
);
