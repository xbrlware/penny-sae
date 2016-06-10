var crypto = require('crypto');
var es = require('elasticsearch');
var config = require('../config/server-config');

const KEY_SIZE = 128;
const N_ITERS = 1000;

var client = new es.Client({hosts: [config.ES.HOST]});

function make_password() {
    var password = crypto.randomBytes(512).toString('hex')
    var shash = crypto.createHash('sha256')
    shash.update(password)
    return shash.digest().toString('hex').slice(1, 10) 
}

function store_password(username, password) {
    if(!password) {
        password  = make_password();
    }
    var salt = crypto.randomBytes(KEY_SIZE).toString('hex')    
    var user_hash = crypto.createHash('sha').update(username).digest().toString('hex');
    
    crypto.pbkdf2(password, salt, N_ITERS, KEY_SIZE, 'sha512', (err, key) => {
      if (err) throw err;
      client.index({
          "index" : config.ES.INDEX.AUTH,
          "type"  : "user",
          "id"    : user_hash,
          "body"  : {
            "key_size"  : KEY_SIZE,
            "n_iters"   : N_ITERS, 
            "user_hash" : user_hash,
            "username"  : username,
            "salt"      : salt,
            "password"  : key.toString('hex')
          }
      }).then(function(response) {
          console.log("Username ->", username)
          console.log("Password ->", password)          
      }).catch(function(err) {
        console.log(err)
      })
    });    
}

store_password(process.argv[2], process.argv[3])