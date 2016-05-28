/* config/configure.js */

var fs = require('fs')

try {
  var jsmin = require('jsmin')
} catch(e) {
  var jsmin = require('../server/node/node_modules/jsmin')
}

/** Points to user written config files.
 * @global
 */
var configPath = {
  'global': 'global-config.json',
  'local': 'local-config.json',
  'server': 'server-config.json'
}

/** Directories we write out to.
 * @global
 */
var filePath = {
  'web': '../web/config/',
  'server': '../server/node/'
}

/**
 * Parses string to object
 * @func makeConfig
 * @param {FILE_POINTER} configFile - Pointer to raw config
 * @param {string} logString - console.log message
 * @param {function} cb
 */
function makeConfig (configFile, logString, cb) {
  console.log(logString)
  out = JSON.parse(JSON.stringify(configFile))
  cb(out)
}

/**
 * Main function that parses and writes config file
 * @func setupConfig
 * @param {FILE_POINTER} readInFile - user config file
 * @param {string} logString - string used in console.log
 * @param {string} writeToPath - directory config is written to
 * @param {string} writeToName - name of file writing out to
 * @param {string} varType - differs depending on if this is for node
 */
function setupConfig (readInFile, logString, writeToPath, writeToName, varType) {
  client = JSON.parse(jsmin.jsmin(fs.readFileSync(readInFile, 'utf8')))
  makeConfig(client, 'Building ' + logString + ' config', function (config) {
    fs.writeFileSync(writeToPath + writeToName, varType + JSON.stringify(config, null, ' '))
  })
}

/* Setup local config */
setupConfig(configPath.local, 'local', filePath.web, 'local-config.js', 'var config = ')

/* Setup global config */
setupConfig(configPath.global, 'global', filePath.web, 'global-config.js', 'var gconfig = ')

/* Setup server config */
setupConfig(configPath.server, 'server', filePath.server, 'server-config.json', '')
