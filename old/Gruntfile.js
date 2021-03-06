module.exports = function (grunt) {
  // watch has problems finding the working directory
  // watch requires this variable
  var cwd = process.cwd();

  grunt.initConfig({
    cfg: grunt.file.readJSON('grunt.config.json'),

    bless: {
      css: {
        options: {
          compress: true,
          cleanup: true
        },
        files: {
          '<%= cfg.cdt %>nodesec-blessed.min.css': '<%= cfg.cdt %>nodesec.min.css'
        }
      }
    },

    concat: {
      devCSS: {
        src: '<%= cfg.css_files %>',
        dest: '<%= cfg.cdt %>concat.css'
      },
      libsJS: {
        src: '<%= cfg.lib_files %>',
        dest: '<%= cfg.jdt %>libs.concat.js'
      },
      appsJS: {
        src: '<%= cfg.app_files %>',
        dest: '<%= cfg.jdt %>apps.concat.js'
      },
      prodJS: {
        src: ['<%= cfg.jdt %>libs.min.js', '<%= cfg.jdt %>apps.min.js'],
        dest: '<%= cfg.jdt %>nodesec.js'
      },
      devJS: {
        src: ['<%= cfg.jdt %>libs.concat.js', '<%= cfg.jdt %>apps.concat.js'],
        dest: '<%= cfg.jdt %>nodesec.js'
      }
    },

    cssmin: {
      target: {
        files: {
          '<%= cfg.cdt %>nodesec.min.css': '<%= cfg.cdt %>concat.css'
        }
      }
    },

    emberTemplates: {
      compile: {
        options: {
          templateBasePath: '<%= cfg.tmp %>'
        },
        files: {
          '<%= cfg.tdt %>templates.js': ['<%= cfg.tmp %>*.hbs', '<%= cfg.tmp %>detail/*.hbs', '<%=cfg.tmp %>components/*.hbs']
        }
      }
    },

    jshint: {
      files: ['<%= cfg.app %>*.js']
    },

    less: {
      dev: {
        options: {
          compress: true,
          ieCompat: true
        },
        files: {
          '<%= cfg.css %>style.less.css': '<%= cfg.lss %>style.less'
        }
      }
    },
    uglify: {
      options: {
        compress: {
          dead_code: true,
          conditionals: true,
          booleans: true,
          loops: true,
          unused: true,
          join_vars: true,
          if_return: true,
          negate_iife: true
        },
        preserveComments: false

      },
      libs: {
        files: {
          '<%= cfg.jdt %>libs.min.js': '<%= cfg.jdt %>libs.concat.js'
        }
      },
      apps: {
        files: {
          '<%= cfg.jdt %>apps.min.js': '<%= cfg.jdt %>apps.concat.js'
        }
      }
    },

    watch: {
      options: {
        cliArgs: ['--grunt-file', require('path').join(cwd, 'Gruntfile.js')]
      },
      app: {
        files: ['<%= cfg.app %>/*/*.js'],
        tasks: ['devApp']
      },
      lib: {
        files: ['<%= cfg.lib %>*.js', '<%= cfg.tmp %>*.hbs'],
        tasks: ['devLib']
      },
      less: {
        files: ['<%= cfg.lss %>*.less'],
        tasks: ['css']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bless');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ember-templates');

  grunt.registerTask('prodApp', ['concat:appsJS', 'uglify:apps', 'concat:prodJS']);
  grunt.registerTask('prodLib', ['concat:libsJS', 'uglify:libs', 'concat:prodJS']);
  grunt.registerTask('devApp', ['concat:appsJS', 'concat:devJS']);
  grunt.registerTask('devLib', ['emberTemplates', 'concat:libsJS', 'concat:devJS']);
  grunt.registerTask('css', ['less:dev', 'concat:devCSS', 'cssmin', 'bless']);
  grunt.registerTask('wth', ['watch']);
  grunt.registerTask('cmp', ['emberTemplates']);
  grunt.registerTask('production', ['css', 'cmp', 'concat:libsJS', 'uglify:libs', 'concat:appsJS', 'uglify:apps', 'concat:prodJS']);
  grunt.registerTask('development', ['css', 'cmp', 'concat:libsJS', 'concat:appsJS', 'concat:devJS']);
};
