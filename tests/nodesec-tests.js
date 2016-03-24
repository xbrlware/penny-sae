
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

/*
Ember.Test.registerAsyncHelper('buttonCheck', function(app, button, key, on, off) {
    // Clicks on a button, checks it's state, clicks it again & checks state
    click(button[key][on]);
    andThen(function() {
        findWithAssert(button[key][off]);
        console.log('Button pressed: '+ key);
        if(button[key]['highlight'] !== "false"){
            testMenuItem(button[key]['highlight'], key);
        }
        click(button[key][off]);
        andThen(function() {
            findWithAssert(button[key][on]);
            console.log('Button restored: '+ key);
            ok(true);
         });
    });
});


Ember.Test.registerAsyncHelper('configLoad', function(app, configFile, cb) {
    // Helper for loading a config file for a test
    Ember.$.getJSON(configFile,'format:json',function(data){
        return cb(data[0]);
    });
});


Ember.Test.registerAsyncHelper('emberTableCheck', function(app, path) {
    // Checks if .table-container exists and then looks for rect indicating
    // that the bars have been drawn
    var linkPath = 'a[href="'+path+'"]';
    click(linkPath);
    andThen(function() {
        if(find('svg > rect').length > 0){
            ok(true);
        }else{
            console.error('(( --> Ember Table Not Found For: '+ path);
            console.error('(( ------------> # of rect found: ',find('rect').length);
            ok(false);
        }
    });
    return app.testHelpers.wait();
});
*/

Ember.Test.registerAsyncHelper('loggingIn', function(app, page) {
    // Goes to login in page and logs in. Not only is it a test, but it
    // gets the authorization that the rest of the tests need
    visit(page);
    andThen(function() {
        fillIn("#input-username", "dev");
        fillIn("#input-password", "password");
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

/*
Ember.Test.registerHelper('loggingOut', function(app, state, page){
    // Makes sure that we can log out
    visit(page);
    andThen(function(){
        click('div#login-wrapper > #btn-logout');
        andThen(function(){
            visit(state);
            andThen(function(){
                if(find('#login-wrapper').length === 1){
                    console.log('Successfully Logged Out of Geofin');
                    ok(true);
                }
            });
        });
    });
});

Ember.Test.registerAsyncHelper('testMenuItem', function(app, menuItem, key) {
    // Checks if there is a highlighted item in the dropdown menu
    if(find(menuItem).length === 1){
        console.log('Highlighted menu item found in '+key);
        ok(true);
    } else {
        console.error('Highlighted menu item not found in '+key);
        ok(false);
    }
    return app.testHelpers.wait();
});


Ember.Test.registerAsyncHelper('testTile', function(app, tileNumber) {
    // Click on a tile and see if it registers
    var testTile = TILE + ' > g:nth-child('+ tileNumber + ') > path';
    var clearBtn = '#content > nav > div > ul > li:nth-child(5) > button';
    visit('/-');
    andThen(function(){
        click(testTile);
        console.log('<---- clicking tile ---->');
        andThen(function(){
            if(find(clearBtn)){
                ok(true);
            }
        });
    });
});
*/
App.injectTestHelpers();
//moduleFor('controller:main', 'main controller');

// ----------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------

// Test #1 --> Splash page and login
test('Testing the Loading of the Splash Page and Logging in', function() {
    loggingIn(LOGINPAGE);
});

/*
// Test #2 --> Load Ember Tables for Region, City, Branch & Subjects
test('Testing the Loading of the Ember Tables', function() {
    visit(STATE+'global');
    andThen(function() {
        for(var i=0; i < TABLES.length; i++) {
            emberTableCheck(TABLES[i]);
        }
    });
});

// Test #3 --> Click on every button twice
test('Testing all of the Buttons', function() {
    expect(15);
    visit(TABLES[0]);
    andThen(function() {
        configLoad(BUTTONCONFIG,function(button){
            for(key in button){
                buttonCheck(button, key, 'default', 'selected');
            } 
        });
    });
});

// Test #4 --> Checks for tiles... incomplete
test('check for country tiles', function() {
    visit(TABLES[0]);
    andThen(function() {
        ok(find(TILEGENERIC).length === NUMTILES);
    });
});
// Test #5 --> Check heat map tile
test('Test Tile', function() {
    testTile(2);
});

// Test #6 --> Make sure we log out
test('Logging out', function(){
    loggingOut(STATE, TABLES[0]);
});
*/

