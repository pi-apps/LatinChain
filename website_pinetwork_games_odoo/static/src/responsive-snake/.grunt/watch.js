module.exports = {
  gruntfile : {
    files : 'Gruntfile.js',
    tasks : ['jshint:gruntfile']
  },

  src       : {
    files : ['src/**/*.js'],
    tasks : ['browserify']
  },

  sass : {
    files : ['example/assets/scss/**/*.scss'],
    tasks : ['sass']
  }
};