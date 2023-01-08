module.exports = function(grunt) {

  grunt.registerTask('dev', [
    'smell',
    'build',
    'connect',
    'watch'
  ]);
};