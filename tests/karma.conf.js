// tests/karma.conf.js

module.exports = function(karma) {
  karma.set({
    client : {
      args : [
        karma.username, 
        karma.password,
      ]    
    },
    basePath: '.',
    files: [
      // Vendor dependencies (including test version of Ember)
      "js/vendor/jquery-1.12.2.min.js",
      "js/vendor/handlebars.min.js",
      "js/vendor/ember.min.js",

      // nodesec
      "../web/config/global_config.js",
      "../web/config/local_config.js",
      
      // CSS    
      "../web/css/dist/nodesec-blessed.min.css",
                
      // Templates
      "../web/templates/*.hbs",
      "nodesec-tests.js"
    ],
    
    logLevel   : karma.LOG_WARN,
    browsers   : ['PhantomJS'],
    singleRun  : true,
    autoWatch  : false,
    frameworks : ["qunit"],
    reporters  : ['progress', 'coverage'],
    plugins: [
      'karma-qunit',
      'karma-ember-preprocessor',
      'karma-phantomjs-launcher'
    ],
    
    preprocessors: {
      "../web/js/dist/nodesec.js" : "coverage"
      "../web/templates/*.hbs": "ember",
    },
    coverageReporter: {
      type: "text",
    }
  });
};

