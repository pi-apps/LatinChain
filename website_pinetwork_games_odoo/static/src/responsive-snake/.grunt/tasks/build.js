module.exports = function(grunt) {
  grunt.registerTask('build', [
    'sass',
    'browserify',
    'uglify'
  ]);
};