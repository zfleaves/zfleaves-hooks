// 引入所需的gulp插件
const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const del = require('del');

// 定义clean任务，用于删除指定目录
gulp.task('clean', async function () {
  await del('lib/**');  // 删除lib目录
  await del('es/**');   // 删除es目录
  await del('dist/**'); // 删除dist目录
});

// 定义cjs任务，将ES模块转换为CommonJS模块
gulp.task('cjs', function () {
  return gulp
    .src(['./es/**/*.js'])  // 读取es目录下的所有js文件
    .pipe(
      babel({
        configFile: '../../.babelrc',  // 使用指定的babel配置文件
      }),
    )
    .pipe(gulp.dest('lib/'));  // 输出转换后的文件到lib目录
});

// 定义es任务，将TypeScript编译为ES模块
gulp.task('es', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    module: 'ESNext',  // 指定模块类型为ESNext
  });
  return tsProject.src()  // 读取TypeScript源文件
    .pipe(tsProject())     // 编译TypeScript
    .pipe(babel())         // 使用babel转换
    .pipe(gulp.dest('es/'));  // 输出到es目录
});

// 定义declaration任务，生成类型声明文件
gulp.task('declaration', function () {
  const tsProject = ts.createProject('tsconfig.pro.json', {
    declaration: true,        // 生成声明文件
    emitDeclarationOnly: true // 仅生成声明文件
  });
  return tsProject.src()  // 读取TypeScript源文件
    .pipe(tsProject())     // 编译TypeScript
    .pipe(gulp.dest('es/'))  // 输出声明文件到es目录
    .pipe(gulp.dest('lib/')); // 输出声明文件到lib目录
});

// 定义copyReadme任务，复制README文件
gulp.task('copyReadme', async function () {
  await gulp.src('../../README.md')  // 读取根目录下的README.md
    .pipe(gulp.dest('../../packages/hooks'));  // 复制到指定目录
});

// 定义默认任务，按顺序执行所有任务
exports.default = gulp.series('clean', 'es', 'cjs', 'declaration', 'copyReadme');
