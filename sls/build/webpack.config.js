/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const slsw = require('serverless-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (async () => {
  const isLocal = false; //slsw.lib.webpack.isLocal;
  const include = [
    // include only libs and required apps folders for ts-loader
    ...new Set(
      Object.keys(slsw.lib.entries)
        .concat(['libs'])
        .map((entry) =>
          entry
            .split('/')
            .slice(0, 2)
            .concat([''])
            .join('/')
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        ),
    ),
  ].join('|');

  return {
    mode: isLocal ? 'development' : 'production',
    entry: slsw.lib.entries,
    devtool: isLocal ? 'eval-cheap-module-source-map' : 'source-map',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: 2, // see https://webpack.js.org/plugins/terser-webpack-plugin/#parallel
          terserOptions: {
            keep_classnames: true,
            compress: {
              passes: 2,
            },
          },
        }),
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      cacheWithContext: false,
      plugins: [
        new TsconfigPathsPlugin({
          configFile: 'tsconfig.json',
        }),
      ],
    },
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, '../../.webpack'),
      filename: '[name].js',
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        // all files with a `.ts` extension in include folders will be handled by `ts-loader`
        {
          test: new RegExp(`(${include}).+\.ts$`),
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            transpileOnly: true, // see https://webpack.js.org/guides/build-performance/#typescript-loader
          },
        },
      ],
    },
  };
})();
