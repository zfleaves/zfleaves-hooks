import { menus } from './hooks';

export default {
  exportStatic: {},
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  devServer: {
    port: 9000,
    hot: true,
    compress: true,
  },
  fastRefresh: {},
  extraBabelIncludes: ['filter-obj'],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: '@alifd/next',
        style: false,
      },
      'fusion',
    ],
  ],
  publicPath: '/zfleaves-hooks/',
  history: { type: 'hash' },
  title: 'zfleaves hooks',
  mode: 'site',
  favicon: '/zfleaves-hooks/logo.png',
  logo: '/zfleaves-hooks/logo.png',
  dynamicImport: {},
  manifest: {},
  hash: true,
  alias: {
    zfleavesHooks: process.cwd() + '/packages/hooks/src/index.ts',
    ['zfleaves-hooks']: process.cwd() + '/packages/hooks/src/index.ts',
  },
  resolve: {
    includes: ['docs', 'packages/hooks/src'],
  },
  links: [
    {
      rel: 'stylesheet',
      href: 'https://unpkg.com/@alifd/theme-design-pro@0.6.2/dist/next-noreset.min.css',
    },
    { rel: 'stylesheet', href: '/style.css' },
  ],
  navs: [
    { title: '指南', path: '/guide' },
    { title: 'Hooks', path: '/hooks' },
    { title: 'GitHub', path: 'https://github.com/zfleaves/zfleaves-hooks' },
  ],
  menus: {
    '/': [
      {
        title: '首页',
        path: 'index',
      },
    ],
    '/guide': [
      {
        title: '介绍',
        path: '/guide',
      },
    ],
    '/hooks': menus,
  },
};
