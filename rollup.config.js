/* eslint-disable */
// plugins that we are going to use
import babel from 'rollup-plugin-babel';
import flow from 'rollup-plugin-flow';

// list of plugins used during building process
const plugins = targets => [
  // remove flow annotations from output
  flow(),
  // use Babel to transpile to ES5
  babel({
    // ignore node_modules/ in transpilation process
    exclude: 'node_modules/**',
    // ignore .babelrc (if defined) and use options defined here
    babelrc: false,
    // use recommended babel-preset-env without es modules enabled
    // and with possibility to set custom targets e.g. { node: '8' }
    presets: [['@babel/preset-env', { modules: false, targets }]],
    // solve a problem with spread operator transpilation https://github.com/rollup/rollup/issues/281
    plugins: ['@babel/plugin-proposal-object-rest-spread'],
    // removes comments from output
    comments: false
  })
];

// packages that should be treated as external dependencies, not bundled
const external = []; // e.g. ['axios']

export default [
  {
    // source file / entrypoint
    input: 'src/index.js',
    // output configuration
    output: {
      // name visible for other scripts
      name: 'npmLibPackageExample',
      // output file location
      file: './lib/index.js',
      // format of generated JS file, also: esm, and others are available
      format: 'cjs',
      // add sourcemaps
      sourcemap: true
    },
    external,
    // build es modules for node 8
    plugins: plugins({ node: '8' })
  }
];
