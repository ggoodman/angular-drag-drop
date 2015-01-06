var Webpack = require("webpack");

module.exports = {
  entry: __dirname + "/src/dragular.js",
  output: {
    path: "./build",
    pathInfo: false,
    publicPath: "/build/",
    filename: "dragular.js",
  },
  module: {
    loaders: [
      { test: /[\/\\]angular\.js$/, loader: "exports-loader?window.angular" },
      { test: /[\/\\]angular-animate\.js$/, loader: "ng-loader?ngAnimate" },
      { test: /\.html$/,  loader: "raw-loader" },
      { test: /\.css$/,   loader: "style-loader!css-loader" },
    ],
    noParse: [
      /[\/\\]bower_components[\/\\]/,
    ]
  },
  resolve: {
    modulesDirectories: ["node_modules", "bower_components", "src"],
    root: __dirname,
    alias: {
      // 'angular': "angular/angular.js",
      // 'angular-animate': "angular-animate/angular-animate.js",
    },
  },
};