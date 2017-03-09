/* jshint node:true */
/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
    sassOptions: {
      includePaths: [
        'bower_components/font-awesome/scss',
        'bower_components/normalize-scss/sass',
        'vendor/yamm/scss',
        'vendor/dataTables/scss'
      ]
    }
  });

  app.import('bower_components/jquery-ui/jquery-ui.js');

  app.import('bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff2', {
    destDir: 'fonts/bootstrap'
  });

  app.import('bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.woff', {
    destDir: 'fonts/bootstrap'
  });

  app.import('bower_components/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.ttf', {
    destDir: 'fonts/bootstrap'
  });

  app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff2', {
    destDir: 'fonts'
  });

  app.import('bower_components/font-awesome/fonts/fontawesome-webfont.woff', {
    destDir: 'fonts'
  });

  app.import('bower_components/font-awesome/fonts/fontawesome-webfont.ttf', {
    destDir: 'fonts'
  });

  app.import('vendor/droid-sans-mono-v7-latin/droid-sans-mono-v7-latin-regular.woff2', {
    destDir: 'assets/fonts/droid-sans-mono-v7-latin'
  });

  app.import('vendor/droid-sans-mono-v7-latin/droid-sans-mono-v7-latin-regular.woff', {
    destDir: 'assets/fonts/droid-sans-mono-v7-latin'
  });

  app.import('vendor/droid-sans-mono-v7-latin/droid-sans-mono-v7-latin-regular.ttf', {
    destDir: 'assets/fonts/droid-sans-mono-v7-latin'
  });

  app.import('bower_components/datatables.net/js/jquery.dataTables.js');
  app.import('bower_components/datatables.net-bs/js/dataTables.bootstrap.js');

  app.import('bower_components/d3/d3.js');
  app.import('bower_components/d3-tip/index.js');

  app.import('vendor/img/green_building.png', { destDir: 'img' });
  app.import('vendor/img/yellow_building.png', { destDir: 'img' });
  app.import('vendor/img/red_building.png', { destDir: 'img' });
  app.import('vendor/img/orange_building.png', { destDir: 'img' });

  app.import('vendor/img/green_person.png', { destDir: 'img' });
  app.import('vendor/img/yellow_person.png', { destDir: 'img' });
  app.import('vendor/img/red_person.png', { destDir: 'img' });
  app.import('vendor/img/orange_person.png', { destDir: 'img' });
  app.import('vendor/img/ui-bg_glass_100_f6f6f6_1x400.png', { destDir: 'assets/images' });

  return app.toTree();
};
