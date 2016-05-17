// server/node/authentication/auth-strategies.js

module.exports = function (passport, makeToken, config) {
  return {
    local: require('./local-auth-functions')(passport, config, makeToken),
    ldap: require('./ldap-auth-functions')(passport, config, makeToken),
    gated: require('./gated-auth-functions')(passport, config, makeToken),
  }
}
