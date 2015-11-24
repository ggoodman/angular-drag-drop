var Webpack = require("webpack");

module.exports = {
  entry: {
    'dragular': __dirname + "/src/dragular.js",
  },
  output: {
    path: "./build",
    pathInfo: false,
    publicPath: "/build/",
    filename: "[name].js",
  },
  module: {
    loaders: [
      { test: /\.html$/,  loader: "raw-loader" },
      { test: /\.css$/,   loader: "style-loader!css-loader" },
      { test: /\.less/,   loader: "style-loader!css-loader!less-loader" },
    ],
    noParse: [
      // require.resolve('angular'),
    ]
  },
  resolve: {
    modulesDirectories: ["node_modules", "src"],
    root: __dirname,
    alias: {
      // 'angular': "angular/angular.js",
      // 'angular-animate': "angular-animate/angular-animate.js",
    },
  },
};