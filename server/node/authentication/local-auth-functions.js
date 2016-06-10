// server/node/authentication/local-auth-functions.js

module.exports = function (passport, config, make_token) {
  var Q = require('q'),
    _ = require('underscore')._,
    es = require('elasticsearch'),
    crypto = require('crypto'),
    LocalStrategy = require('passport-local');

  var client = new es.Client({hosts: [config.ES.HOST]});

  
  function findUser (username, client, callback) {
      var user_hash = crypto.createHash('sha').update(username).digest().toString('hex')
      console.log(user_hash)

      client.get({
        index: config.ES.INDEX.AUTH,
        type: "user",
        id: crypto.createHash('sha').update(username).digest().toString('hex')
      }).then(function (response) {
        callback(response['_source'], null)
      }).catch(function(err) {
        console.log('err', err)
        callback(null, error)
      });
  }

  function validate_credentials (username, password) {
    var deferred = Q.defer();

    findUser(username, client, function (au, err) {
      if (err) { deferred.reject(err); }

      if (au !== undefined) {
          crypto.pbkdf2(password, au['salt'], au['n_iters'], au['key_size'], 'sha512', function (err, key) {
            if (au['password'] === key.toString('hex')) {
              deferred.resolve(au);
            } else {
              deferred.resolve(false);
            }
          });
      } else {
        deferred.resolve(false);
      }
    });

    return deferred.promise;
  }

  return {
    set_strategy: function () {
      passport.use('local-signin', new LocalStrategy({passReqToCallback: true},
        function (req, username, password, done) {
          validate_credentials(username, password)
            .then(function (user) { done(null, user); })
            .fail(function (err) { console.log(err); done(err, null);});
        }
      ));
    },
    authenticate: function (req, res, next) {
      passport.authenticate('local-signin', function (err, user) {
        if (err) { return next(err); }
        if (user) {
          res.send({
            token: make_token({
              'username': user.username,
              'user_id': user.id,
              'ip': req.connection.remoteAddress,
              'isAdmin': user.isAdmin
            }),
            isAdmin: user.isAdmin,
            username: user.username
          });
        } else {
          res.status(404).send('Incorrect username or password!');
        }
      })(req, res, next);
    }
  };
};