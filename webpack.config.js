var Webpack = require("webpack");

module.exports = {
  cache: true,
  entry: __dirname + "/src/angular-drag-drop.js",
  output: {
    libraryTarget: "umd",
    library: "AngularDragDrop",
    path: "./build",
    pathInfo: false,
    publicPath: "/static/",
    filename: "drag-and-drop.js",
  },
  externals: {
    angular: true,
  },
  module: {
    loaders: [
      { test: /[\/\\]angular\.js$/, loader: "exports-loader?window.angular" },
      { test: /[\/\\]angular-animate\.js$/, loader: "ng-loader?ngAnimate" },
      { test: /\.css$/,   loader: "style-loader!css-loader" },
    ],
    noParse: [
      /[\/\\]angular\.js$/,
      /[\/\\]angular-animate\.js$/,
    ]
  },
  resolve: {
    modulesDirectories: ["node_modules", "bower_components", "src"],
    root: __dirname,
    alias: {
      'angular': "angular/angular.js",
      'angular-animate': "angular-animate/angular-animate.js",
    },
  },
};