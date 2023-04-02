var WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin; const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const pkg = require('./package.json');


const env = process.env.NODE_ENV;

module.exports = function (env, argv) {

  let builddir = argv.mode== 'production' ? 'dist' : 'test';

  return {
   resolve: {
        fallback: {
            buffer: require.resolve('buffer/'),
        }},
    // resolve: { fallback:{ "buffer" : false  } },
    //externals: ["fs"],
    watch: argv.mode != 'production',
    target: 'web',
    optimization: {

    },

    mode: argv.mode,
    entry: {
      "mdsite": './src/viewer.js',
      // USER SCRIPTS
      "scripts/currentpage": "./src/user_scripts/currentlink.js",
      "scripts/bilingual": "./src/user_scripts/bilingual.js",
      "scripts/forkme" : "./src/user_scripts/forkme.js",
      "scripts/mark_unsaved" : "./src/user_scripts/mark_unsaved.js"
    },
    devtool: argv.mode != "production" ? 'inline-source-map' : false, 
    // devServer: argv.mode != "production" ? {contentBase: 'dist'} : {contentBase: 'dist'},

    output: {
    //   filename: '[name].js',
      path: path.resolve(__dirname, builddir, "")
    },

    module: {
      rules: [

        {
          test: /\.svg$/,
          type: 'asset/inline'
        },

        {
          test: /\.(less|css|scss)$/,
          use: [
            'style-loader' ,
            'css-loader',
            'sass-loader'
          ],
        },
        {
          test: /\.(woff|ttf)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
          ],
        }
      ]

    },
    plugins: [
      new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
       new WebpackBundleSizeAnalyzerPlugin('./plain-report.txt'),
      new webpack.DefinePlugin({
        // Definitions...
        'VERSION': JSON.stringify(pkg.version)
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new HtmlWebpackPlugin({

        chunks: ["mdsite"],
        filename: 'index.html',
        minify: false,
        inject: false,
        template: path.join(__dirname, "src/templates/index.ejs"),
      }
      ),
      // new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/loader/]),

    ],
  
  };
}
