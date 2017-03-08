// server/node/authentication/local-auth-functions.js

module.exports = function (passport, config, makeToken) {
  var Q = require('q');
  var es = require('elasticsearch');
  var crypto = require('crypto');
  var LocalStrategy = require('passport-local');
  var client = new es.Client({
    hosts: config.ES.HOST
  });
  var logger = require('../logging');
  logger.level = 'debug';

  function findUser (username, client, callback) {
    // var userHash = crypto.createHash('sha').update(username).digest().toString('hex');
    client.get({
      index: config.ES.INDEX.AUTH,
      type: 'user',
      id: crypto.createHash('sha').update(username).digest().toString('hex')
    }).then(function (response) {
      callback(response['_source'], null);
    }).catch(function (err) {
      logger.debug('user not found!', err);
      callback();
    });
  }

  function validateCredentials (username, password, cb) {
    var deferred = Q.defer();

    findUser(username, client, function (au, err) {
      if (!au) { deferred.resolve(false); return deferred.promise; }

      crypto.pbkdf2(password, au['salt'], au['n_iters'], au['key_size'], 'sha512', function (err, key) {
        if (err) { logger.debug(err); }
        if (au['password'] === key.toString('hex')) {
          deferred.resolve(au);
        } else {
          deferred.resolve(false);
        }
      });
    });

    return deferred.promise;
  }

  return {
    set_strategy: function () {
      passport.use('local-signin', new LocalStrategy({passReqToCallback: true},
        function (req, username, password, done) {
          validateCredentials(username, password)
            .then(function (user) { done(null, user); })
            .fail(function (err) { logger.debug(err); done(err, null); });
        }
      ));
    },
    authenticate: function (req, res, next) {
      passport.authenticate('local-signin', function (err, user) {
        if (err) { return next(err); }
        if (user) {
          res.send({
            token: makeToken({
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
