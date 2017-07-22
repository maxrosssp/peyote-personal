module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-include-source');

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
  });

  grunt.registerTask('setup', [
    'wiredep',
    'includeSource:source'
  ]);
};