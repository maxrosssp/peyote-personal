module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-include-source');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-bower-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.initConfig({
    wiredep: {
      task: {
        src: ['app/index.html'],
        exclude: [/jquery/]
      }
    },

    includeSource: {
      options: {
        basePath: 'app',
      },
      source: {
        files: {
          'app/index.html': 'app/index.html'
        }
      }
    },

    ngtemplates:  {
      app:        {
        cwd:      'app',
        src:      'js/**/*.html',
        dest:     'public/javascripts/templates.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/javascripts/app.min.js': ['app/js/**/*.js']
        }
      }
    },

    cssmin: {
      options: {
        mergeIntoShorthands: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'public/stylesheets/app.css': ['app/js/**/*.css']
        }
      }
    },

    bower_concat: {
      all: {
        dest: {
          'js': 'public/javascripts/_bower.js',
          'css': 'public/stylesheets/_bower.css'
        },
        mainFiles: {
          'html5-boilerplate': ['dist/css/normalize.css', 'dist/css/main.css', 'dist/js/vendor/modernizr-2.8.3.min.js'],
          'angular-stripe': ['release/angular-stripe.js'],
          'paymentfont': ['css/paymentfont.css']
        },
        exclude: [
          'jquery',
        ],
        includeDev: true
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, cwd: 'app/images/', src: ['**'], dest: 'public/images/'},
          {expand: true, cwd: 'app/bower_components/paymentfont/fonts/', src: ['**'], dest: 'public/fonts/'}
        ]
      }
    },

    compress: {
      main: {
        options: {
          archive: 'peyote-personal.zip'
        },
        files: [
          {src: ['**', '*/**', '!node_modules/**', '!app/**', '!peyote-personal/**','!peyote-personal.zip'], dest: '/'}
        ]
      }
    }
  });

  grunt.registerTask('setup', [
    'wiredep',
    'includeSource:source'
  ]);

  grunt.registerTask('build', [
    'wiredep',
    'includeSource:source',
    'ngtemplates',
    'uglify',
    'cssmin',
    'bower_concat',
    'copy'
  ]);

  grunt.registerTask('package', [
    'build',
    'compress'
  ]);
};