var Config = require("./webpack.config");
var Package = require("./package.json");
var Webpack = require("webpack");

var buildUnminified = function (config, callback) {
  config.plugins = [];
  config.output.filename = Package.name + ".js";
  
  Webpack(config, callback);
};

var buildMinified = function (config, callback) {
  config.plugins = [new Webpack.optimize.UglifyJsPlugin()];
  config.output.filename = Package.name + ".min.js";
  
  Webpack(config, callback);
};

buildUnminified(Config, function (err, stats) {
  if (err) {
    console.error("[ERR] Build failed: ");
    console.trace(err);
    
    return;
  }
  
  console.log("[OK] Unminified built: " + stats.toString({colors: true}));
  
  buildMinified(Config, function (err, stats) {
    if (err) {
      console.error("[ERR] Build failed: ");
      console.trace(err);
      
      return;
    }
    
    console.log("[OK] Minified built: " + stats.toString({colors: true}));
  });

});
