module.exports = {

  build : {
    options : {
      banner       : '/*! <%= package.name %> - v<%= package.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      compress: {
        drop_console: true
      }
    },
    files   : {
      'build/snake.build.min.js' : ['build/snake.build.js']
    }
  }

};