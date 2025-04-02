// 引入依赖模块
const commonConfig = require('../../gulpfile');
const gulp = require('gulp');
const fs = require('fs');
const fse = require('fs-extra');
const fg = require('fast-glob');
const gm = require('gray-matter');

// 生成描述信息的函数
async function genDesc(mdPath) {
  if (!fs.existsSync(mdPath)) {
    return;
  }
  const mdFile = fs.readFileSync(mdPath, 'utf8');
  const { content } = gm(mdFile);
  let description =
    (content.replace(/\r\n/g, '\n').match(/# \w+[\s\n]+(.+?)(?:, |\. |\n|\.\n)/m) || [])[1] || '';

  description = description.trim();
  description = description.charAt(0).toLowerCase() + description.slice(1);
  return description;
}

// 生成元数据的函数
async function genMetaData() {
  const metadata = {
    functions: [],
  };
  // 使用fast-glob查找src目录下所有以use开头的文件夹
  const hooks = fg
    .sync('src/use*', {
      onlyDirectories: true,
    })
    .map((hook) => hook.replace('src/', ''))
    .sort();
  // 使用Promise.allSettled并行处理每个hook的描述信息
  await Promise.allSettled(
    hooks.map(async (hook) => {
      const description = await genDesc(`src/${hook}/index.md`);
      return {
        name: hook,
        description,
      };
    }),
  ).then((res) => {
    metadata.functions = res.map((item) => {
      if (item.status === 'fulfilled') {
        return item.value;
      }
      return null;
    });
  });
  return metadata;
}

// 定义metadata任务，生成metadata.json文件
gulp.task('metadata', async function () {
  const metadata = await genMetaData();
  await fse.writeJson('metadata.json', metadata, { spaces: 2 });
});

// 默认任务，先执行commonConfig.default任务，再执行metadata任务
exports.default = gulp.series(commonConfig.default, 'metadata');
