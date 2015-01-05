var Webpack = require("webpack");

module.exports = {
  cache: true,
  entry: "./src/angular-drag-drop.js",
  output: {
    libraryTarget: "var",
    library: "AngularDragDrop",
    path: "./build",
    filename: "drag-and-drop.js",
  },
  externals: {
    angular: "angular",
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