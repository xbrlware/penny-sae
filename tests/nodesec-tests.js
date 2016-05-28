
// ---------------------------------------------------------------------------
// Global Variables
// ----------------------------------------------------------------------------

var LOGINPAGE    = '/login';

// ----------------------------------------------------------------------------
// Setup testing environment
// ----------------------------------------------------------------------------

__karma__.loaded = function() {};

var USERNAME = __karma__.config.args[0];
var PASSWORD = __karma__.config.args[1];

// clear cookies
localStorage.clear();

App.setupForTesting();

var karma_started = false;

App.initializer({
   name: "run tests",
   initialize: function(container, application) {
       if (!karma_started) {
           karma_started = true;
           __karma__.start();
       }
   }
});

module('integration tests', {
    setup: function() {
        Ember.run(function() {
      //localStorage.clear();
        });
    },
  teardown: function() {
    App.reset();
  }
});

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------


Ember.Test.registerAsyncHelper('loggingIn', function(app, page) {
    // Goes to login in page and logs in. Not only is it a test, but it
    // gets the authorization that the rest of the tests need
    visit(page);
    andThen(function() {
        fillIn("#input-username", USERNAME);
        fillIn("#input-password", PASSWORD);
        click("#auth-submit");
            andThen(function() {
                console.warn('(( --> Logging In <-- ))');
                if (find('.frontpage-table').length > 0) {
                    console.log('Successfully logged in!');
                    ok(true);
                }
            });
    });
    return app.testHelpers.wait();
});

Ember.Test.registerHelper('tickerInput', function(app) {
    visit('/');
    andThen(function() {
      fillIn("input.ember-view.ember-text-field.input-fat.centered", "biel");
        click("button");
        andThen(function() {
        if (find("a.navbar-brand.red-text").length > 0) {
          ok(true);
        } else {
          ok(false);
        }
      });
    });
  return app.testHelpers.wait();
});


Ember.Test.registerHelper('logOut', function(app) {
  visit('/sidebar/-');
  andThen(function() {
    click('a#btn-logout');
    console.warn('(( --> Logging Out <-- ))');
    andThen(function() {
      visit('/login');
      andThen(function() {
        if (find("#auth-submit").length > 0) {
          console.log('successfully logged out!');
          ok(true);
        } else {
          console.error('logout failed!');
          ok(false);
        }
      });
    });
  });
});

App.injectTestHelpers();
//moduleFor('controller:main', 'main controller');

// ----------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------

// Test #1 --> Splash page and login
test('Testing the Loading of the Splash Page and Logging in', function() {
    loggingIn(LOGINPAGE);
});


// Test #2
test('Input ticket into textfield and move on to frontpage', function() {
  tickerInput();
});


// Test #3
test('Log out of Nodesec', function() {
  logOut();
});
