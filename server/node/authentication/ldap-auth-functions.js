// server/node/authentication/gated-auth-functions.js

var LdapStrategy = require('passport-ldapauth');
var logger = require('../logging');
logger.level = 'debug';

module.exports = function (passport, config, makeToken) {
  return {
    set_strategy: function () {
      passport.use(new LdapStrategy(config.AUTHENTICATION.LDAP_OPTS));
    },
    authenticate: function (req, res, next) {
      passport.authenticate('ldapauth', {session: false}, function (err, user) {
        if (err) { logger.debug('err', err); return next(err); }
        if (user) {
          res.send({
            token: makeToken({
              'username': user.uid,
              'user_id': user.uid,
              'ip': req.connection.remoteAddress,
              'isAdmin': false
            }),
            isAdmin: false,
            username: user.uid
          });
        } else {
          res.status(404).send('Incorrect username or password!');
        }
      })(req, res, next);
    }
  };
};
