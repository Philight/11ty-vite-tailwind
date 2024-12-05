export default {
  plugins: {
    // 'postcss-import': {
    /*
      root: path.resolve(__dirname, 'src'),
//      path: ['app/_assets', 'app/_css'],
      skipDuplicates: true,
      resolve: (id, basedir, importOptions) => {
        const [aliasName, filename] = id.split('/');
        return aliasMapping[aliasName](filename);
      }
*/
    // },
    'postcss-nesting': {},
    autoprefixer: {},
    cssnano: {
      preset: 'default',
    },
  },
};
