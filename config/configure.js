// Configuration file for nodesec

// -----------------------------------
// Helper program for making sure that the configuration across 
// all of the files is the same


var fs = require('fs');

try {
        var jsmin = require('jsmin');
} catch(e) {
        var jsmin = require('../server/node/node_modules/jsmin');
}


function do_parse(x) {
    return JSON.parse(jsmin.jsmin(x))
}

function combine(x, g) {
  for(k in g)
    x[k] = g[k] 
  return x
}

function make_server_config(server, cb) {
    console.log('making server config');
    out = JSON.parse(JSON.stringify(server));
    
    cb(out)
}

function make_local_config(lconfig, cb) {
    console.log('making client config');
    out = JSON.parse(JSON.stringify(lconfig));
    
    cb(out);
}

function make_global_config(gconfig, cb) {
    console.log('making loading config');
    out = JSON.parse(JSON.stringify(gconfig));

    cb(out);
}

// Point to various configuration files in the /config directory
var config_paths = {
    "global"  : "global-config.js", 
    "local"  : "local-config.js",
    "server"  : "server-config.js"
}

var filepaths = {
  "global": "../web/config/",
  "local": "../web/config/",
  "server": "../server/node/"
}

// ---
// Setup local config
local_client = do_parse(fs.readFileSync(config_paths.local, "utf8"));
make_local_config(local_client, function(config) {
    fs.writeFileSync(filepaths.local + "local_config.js", "var config = " + JSON.stringify(config, null, ' '));    
});


// ---
// Setup server config
server_client = do_parse(fs.readFileSync(config_paths.server, "utf8"));
make_server_config(server_client, function(config) {
    fs.writeFileSync(filepaths.server + "config.js", "module.exports = " + JSON.stringify(config, null, ' '));
});


// ---
// Setup global config
global_client = do_parse(fs.readFileSync(config_paths.global, "utf8"));
make_global_config(global_client, function(config) {
    fs.writeFileSync(filepaths.global + "global_config.js", "var gconfig = " + JSON.stringify(config, null, ' '));
});
