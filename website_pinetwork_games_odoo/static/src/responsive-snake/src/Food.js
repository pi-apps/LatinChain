/**
 * Food Class
 * Creating a simple 2d object
 * with an inner color and a border
 */
function Food(options) {
  this.options = options || {};
  this.width = this.options.width ? this.options.width : 10;
  this.x = this.options.x ? this.options.x : 0;
  this.y = this.options.y ? this.options.y : 0;

  this.border = this.options.border ? this.options.border : false;
  this.color = this.options.color ? this.options.color : "#FFF";
}

/**
 * Draw Food Onto the Canvas
 * @param context
 */
Food.prototype.draw = function (context) {
  context.fillStyle = this.color;

  if (this.border) {
    context.strokeStyle = this.border;
  }

  context.fillRect(this.x * this.width, this.y * this.width, this.width, this.width);
  context.strokeRect(this.x * this.width, this.y * this.width, this.width, this.width);
};

module.exports = Food;