/* eslint-disable */
// plugins that we are going to use
import babel from 'rollup-plugin-babel';
import copy from 'rollup-plugin-cpy';
import flow from 'rollup-plugin-flow';

// list of plugins used during building process
const plugins = targets => [
  // remove flow annotations from output
  flow(),
  // use Babel to transpile to ES5
  babel({
    exclude: 'node_modules/**'
  }),
  // copy Flow definitions from source to destination directory
  copy({
    files: ['src/**/*.flow.js'],
    dest: 'lib'
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
      file: 'lib/index.esm.js',
      // format of generated JS file, also: esm, and others are available
      format: 'esm',
      // add sourcemaps
      sourcemap: true
    },
    external,
    // build es modules for node 8
    plugins: plugins({ node: '8' })
  }
];
