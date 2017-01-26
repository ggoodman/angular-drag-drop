'use strict';

const webpack = require('webpack');

const devConfig = {
    cache: true,
    entry: {
        'angular-drag-drop': __dirname + "/src/angular-drag-drop.js"
    },
    output: {
        libraryTarget: "umd",
        library: "AngularDragDrop",
        path: "./dist",
        filename: "angular-drag-drop.js"
    },
    externals: {
        'angular': 'angular'
    }
};

const prodConfig = {
    cache: true,
    entry: {
        'angular-drag-drop': __dirname + "/src/angular-drag-drop.js"
    },
    output: {
        libraryTarget: "umd",
        library: "AngularDragDrop",
        path: "./dist",
        filename: "angular-drag-drop.min.js"
    },
    externals: {
        'angular': 'angular'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
};

module.exports = [devConfig, prodConfig];
