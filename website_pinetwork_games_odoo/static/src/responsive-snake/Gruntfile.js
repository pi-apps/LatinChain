
/*global process, module, require*/

var path = require('path');

module.exports = function (grunt) {

  grunt.file.defaultEncoding = 'utf-8';

  //Time Grunt Tasks
  require('time-grunt')(grunt);

  //Load Config Files based of devDependencies in package.json
  require('load-grunt-config')(grunt, {
    init           : true,
    configPath     : path.join(process.cwd(), './.grunt'),
    loadGruntTasks : {
      config : require('./package.json'),
      scope  : 'devDependencies'
    }
  });

  grunt.loadTasks('./.grunt/tasks');
};