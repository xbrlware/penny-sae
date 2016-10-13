// server/node/authentication/auth.js

module.exports = function (app, config) {
  // ***
  // Setup
  var passport = require('passport');
  var cookieParser = require('cookie-parser');
  var methodOverride = require('method-override');
  var jwt = require('jwt-simple');
  var moment = require('moment');
  var _ = require('underscore')._;

  var logger = require('../logging');
  logger.level = 'debug';

  app.use(cookieParser());
  app.use(methodOverride());
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  // ***
  // Logging in
  function makeToken (params) {
    var timeoutDate = moment().add(config.TIMEOUT_AMOUNT, config.TIMEOUT_UNITS).valueOf();
    // <>
    // If using `gated` authentication, we set the timeout date to very far away
    if (config.AUTHENTICATION.STRATEGY === 'gated') {
      timeoutDate = moment().add(999, 'days').valueOf();
    }
    // <>

    return jwt.encode({
      iss: params.username,
      ip: params.ip,
      user_id: params.user_id,
      isAdmin: params.isAdmin,
      exp: timeoutDate
    }, app.get('jwtTokenSecret'));
  }
  // Set authentication strategy (either `ldap` or `local`)
  var authStrategies = require('./auth-strategies')(passport, makeToken, config);

  authStrategies[config.AUTHENTICATION.STRATEGY].set_strategy();

  app.post('/login', function (req, res, next) {
    logger.info('trying to login');
    authStrategies[config.AUTHENTICATION.STRATEGY].authenticate(req, res, next);
  });

  // ***
  // Verifying that user is logged in
  function checkToken (req, res, next) {
    req.user = undefined;
    req.user_id = undefined;
    req.isAdmin = undefined;

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      try {
        var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
        logger.info('decoded.exp' + decoded.exp);

        if (decoded.exp <= Date.now()) {
          logger.info(new Date(decoded.exp), '-- token expires');
          logger.info('token has expired...');
          return next();
        } else if (decoded.ip !== req.connection.remoteAddress) {
          logger.debug('ip address mismatch');
          return next();
        } else {
          req.user = decoded.iss;
          req.user_id = decoded.user_id;
          req.isAdmin = decoded.isAdmin;

          if (Date.now() >= (decoded.exp - config.TIMEOUT_WARNING_WINDOW)) {
            logger.info('>>> about to expire', (decoded.exp - Date.now()) / 1000, ' seconds');
            res.send({
              new_token: makeToken({
                'username': req.user,
                'ip': req.ip,
                'user_id': req.user_id,
                'isAdmin': req.isAdmin
              })
            });
          } else {
            return next();
          }
        }
      } catch (err) {
        logger.debug('errror decoding', err);
        return next();
      }
    } else {
      logger.debug('no token on header!');
      return next();
    }
  }

  function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(403).send('Not authenticated!');
  }

  function ensureAdmin (req, res, next) {
    if (req.isAdmin) { return next(); }
    res.status(401).send('Forbidden!');
  }

  app.get('/check_token', checkToken, ensureAuthenticated, function (req, res, next) {
    res.send({'authenticated': true});
  });

  app.get('/-check_gated', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('cookies :: ' + '\n' + JSON.stringify(req.cookies, true, 2));
    res.write('\n\n');
    res.write('headers :: ' + '\n' + JSON.stringify(req.headers, true, 2));

    res.send();
  });

  if (config.AUTHENTICATION.ENABLED) {
    app.get(/^\/[^-]/, checkToken, ensureAuthenticated);
    app.post(/^\/[^-]/, checkToken, ensureAuthenticated);

    var adminRequired = ['/check_er', '/fetch_history', '/post_update'];
    _.map(adminRequired, function (path) {
      app.post(path, ensureAdmin);
    });
  }
};
