var Path = require('path');

module.exports = {
    entry: {
        'dragular': __dirname + '/src/dragular.js',
    },
    output: {
        path: './build',
        pathInfo: false,
        publicPath: '/build/',
        filename: '[name].js',
    },
    module: {
        loaders: [{
            test: /\.html$/,
            loader: 'raw-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.less/,
            loader: 'style-loader!css-loader!less-loader'
        }, ],
    },
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        root: __dirname,
    },
};

console.log(module.exports);