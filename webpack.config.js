var webpack = require('webpack');

var devConfig = {
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

var prodConfig = {
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
