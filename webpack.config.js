module.exports = {
    cache: true,
    entry: {
        'angular-drag-drop': __dirname + "/src/angular-drag-drop.js",
    },
    output: {
        libraryTarget: "umd",
        library: "AngularDragDrop",
        path: "./dist",
        pathInfo: false,
        // publicPath: "/static/",
        filename: "angular-drag-drop.js",
    },
    externals: {
        'angular': 'angular',
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loaders: ['style-loader', 'css-loader', 'autoprefixer-loader', 'less-loader'],
        }],
        // noParse: [
        //   require.resolve('angular'),
        // ]
    },
    resolve: {
        modulesDirectories: ["node_modules", "src"],
        root: __dirname,
    },
};