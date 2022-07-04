const path = require('path');
// import * as path from 'path';
const nodeExternals = require('webpack-node-externals');
// import nodeExternals from 'webpack-node-externals';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// import { CleanWebpackPlugin } from 'clean-webpack-plugin';
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
// import WebpackShellPluginNext from 'webpack-shell-plugin-next';
// import { fileURLToPath } from 'url';

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: 'node',
  watch: NODE_ENV === 'development',
  output: {
    // path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'build'),
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    // alias: {
    //   'resolvers': path.resolve(__dirname, 'src/resolvers/'),
    // }
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['echo "==> Starting watching for file changes"'],
        blocking: true,
      },
      onBuildEnd: {
        scripts: ['npm run run:dev'],
        blocking: false,
        parallel: true,
      }
    })
  ]
}