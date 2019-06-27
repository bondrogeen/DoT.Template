'use strict';

var gulp = require('gulp'),
  fs = require('fs'),
  gutil = require('gulp-util'),
  gzip = require('gulp-gzip'),
  jsonminify = require('gulp-jsonminify'),
  cssmin = require('gulp-cssmin'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  replace = require('gulp-replace'),
  htmlmin = require('gulp-htmlmin'),
  luaminify = require('gulp-luaminify'),
  prompt = require('gulp-prompt'),
  clean = require('gulp-clean'),
  rigger = require('gulp-rigger');


var files = require('./files.js');
var obj = files.obj;

var type = 0;
var files_arr = [];
var path_files_arr = [];
var initFile;

var path = {
  build: 'files/',
  src: {
    html: 'src/*.html',
    js: 'src/assets/js/**/*.js',
    style: 'src/assets/css/*.css',
    img: 'src/assets/img/**/*.*',
    lua: 'src/lua/**/*.*',
    info: 'src/info/**/*.*',
    fonts: 'src/assets/fonts/**/*.*',
    tempHtml: 'src/template/main.html',
    path_info: './src/info/',
    path_lua: './src/lua/'
  },
  watch: {
    html: 'src/**/*.html',
    js: 'src/assets/js/*.js',
    style: 'src/assets/css/*.css',
    img: 'src/assets/img/**/*.*',
    lua: 'src/lua/**/*.*',
    info: 'src/info/**/*.*',
    fonts: 'src/assets/fonts/**/*.*'
  },
  clean: './files/*.*'
};

function html() {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      removeComments: true,
      minifyJS: true
    }))
    .pipe(replace('<?lua', '\n<?lua'))
    .pipe(gulp.dest(path.build));
};

function js() {
  return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(uglify())
    .pipe(gzip())
    .pipe(gulp.dest(path.build));
};

function style() {
  return gulp.src(path.src.style)
    //        .pipe(rigger())
    .pipe(cssmin())
    .pipe(rename({
      basename: "style"
    }))
    .pipe(gzip())
    .pipe(gulp.dest(path.build));
};

function img() {
  return gulp.src(path.src.img)
    .pipe(gulp.dest(path.build));
};

function info() {
  return gulp.src(path.src.info)
    .pipe(jsonminify())
    .pipe(gulp.dest(path.build));
};

function lua() {
  return gulp.src(path.src.lua)
    .pipe(luaminify())
    .pipe(gulp.dest(path.build));
};

function cleanInfo() {
  return gulp.src(path.src.info, {
      read: false
    })
    .pipe(clean());
};

function cleanLua() {
  return gulp.src(path.src.lua, {
      read: false
    })
    .pipe(clean());
};

function cleanHtml() {
  return gulp.src(path.src.html, {
      read: false
    })
    .pipe(clean());
};

function cleanFiles() {
  return gulp.src(path.clean, {
      read: false
    })
    .pipe(clean());
};

function watch() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.lua, lua);
  gulp.watch(path.watch.style, style);
  gulp.watch(path.watch.info, info);
}

function init() {
  return gulp.src(path.src.tempHtml)
    .pipe(prompt.prompt([{
      type: 'input',
      name: 'project',
      default: obj.name,
      message: 'You name plugin ?'
    }, {
      type: 'input',
      name: 'name',
      default: obj.author.name,
      message: 'You name ?'
    }, {
      type: 'input',
      name: 'email',
      default: obj.author.email,
      message: 'You email ?'
    }, {
      type: 'input',
      name: 'description',
      default: obj.description,
      message: 'Description ?'
    }, {
      type: 'input',
      name: 'version',
      default: obj.version,
      message: 'Version ?'
    }, {
      type: 'input',
      name: 'license',
      default: obj.license,
      message: 'License ?'
    }, {
      type: 'confirm',
      name: 'mqtt',
      default: false,
      message: 'Add mqtt support ?'
    }, {
      type: 'confirm',
      name: 'run',
      default: true,
      message: 'Run plugin at startup ?'
    }, {
      type: 'confirm',
      name: 'net',
      default: false,
      message: 'Run plugin when connecting to WiFi ?'
    }], function (res) {

      obj.name = res.project;
      obj.author.name = res.name;
      obj.author.email = res.email;
      obj.description = res.description;
      obj.version = res.version;

      fs.writeFileSync('./src/lua/' + obj.name + '.lua', files.lua);
      if (res.net) fs.writeFileSync('./src/lua/' + obj.name + '.net', files.net.replace("Template", obj.name));
      if (res.run) fs.writeFileSync('./src/lua/' + obj.name + '.run', files.run.replace("Template", obj.name));
      if (res.mqtt) fs.writeFileSync('./src/lua/' + obj.name + '.mqtt', files.mqtt.replace(/Template/g, obj.name));

      obj.files = [];

      fs.readdirSync(path.src.path_lua).forEach(file => {
        obj.files.push(file);
      });

      obj.files.push(obj.name + '.info');
      obj.files.push(obj.name + '.init');
      obj.page = obj.name + '.html';

      fs.writeFileSync('./src/info/' + obj.name + '.info', JSON.stringify(obj, null, 2));

      var temp = fs.readFileSync("src/template/main.html", "utf8");
      temp = temp.replace(/Template/g, obj.name);
      fs.writeFileSync('./src/' + obj.name + '.html', temp);

      console.log('Build plagin - "gulp build" ');

    }));
};

function addInput() {
  return gulp.src(path.src.html)
    .pipe(prompt.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Type input?',
        choices: ['Select', 'Text', 'Number'],
        default: 0
    }], function (res) {
      type = res.type;
    }));
}

function inputSelect(){
  return gulp.src(path.src.html)
    .pipe(prompt.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'Type input?',
        choices: ['Select', 'Text', 'Number'],
        default: 1
    }], function (res) {
      type = res.type;
    }));
}

function loadInfo(done) {
  try {
    fs.readdirSync(path.src.path_info).forEach(file => {
      files_arr.push(path_info + file);
      if (file.indexOf('.info') != -1) {
        initFile = file;
      }
    });

    fs.readdirSync(path.src.path_lua).forEach(file => {
      files_arr.push(path.src.path_lua + file);
    });

    if (initFile) {
      obj = JSON.parse(fs.readFileSync(path.src.path_info + initFile));
    }

  } catch (err) {
    console.log("err")
  }
  return done()
}

gulp.task('new', gulp.series(cleanLua, cleanHtml, loadInfo, cleanInfo, init));
gulp.task('clean', gulp.series(cleanLua, cleanHtml, cleanInfo, cleanFiles));

gulp.task('add', gulp.series(addInput));


gulp.task('build', gulp.parallel(cleanFiles, html, js, style, img, info, lua));
gulp.task('watch', gulp.series(watch));
