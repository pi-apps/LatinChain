/*global module*/

module.exports = {

  /**
   * Create a new cookie
   * @param name
   * @param value
   * @param days
   */
  create : function (name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    //'secure', subdomain '.'?
    document.cookie = name + "=" + value + "; " + expires;
  },

  /**
   * Read an existing cookie
   * @param name
   * @returns {*}
   */
  read : function (name) {
    name = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return false;
  },

  /**
   * Remove an existing cookie
   * @param name
   */
  remove : function(name) {
    this.create(name,"",-1);
  }
};