module.exports = {

  options : {
    breakOnErrors   : true,
    jsLintXML       : 'reports/report.xml',
    checkstyleXML   : 'reports/checkstyle.xml',
    errorsOnly      : false,
    cyclomatic      : [4, 7, 12],
    halstead        : [14, 17, 20],
    maintainability : 97
  },

  generic : {
    //Routing Config is complex because I nested a config and constant module together
    //I will refactor and figure out a better way
    src : ['src/js/**/*.js']
  }

};