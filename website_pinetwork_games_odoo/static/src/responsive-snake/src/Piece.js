/**
 * Piece Class
 * Creating a simple 2d object
 * with an inner color and a border
 */
function Piece(options) {
  this.options = options || {};
  this.width = this.options.width ? this.options.width : 10;
  this.x = this.options.x ? this.options.x : 0;
  this.y = this.options.y ? this.options.y : 0;
  this.color = this.options.color || '#FFF';
  this.border = this.options.border || '#000';
}

/**
 * Basic Position Updater
 * @param x
 * @param y
 */
Piece.prototype.updatePosition = function (x, y) {
  this.x = x;
  this.y = y;
};

/**
 * Draw Piece To Canvas
 * @param context
 * @param updateColor
 */
Piece.prototype.draw = function (context, updateColor) {
  if (typeof updateColor === 'string') {
    context.fillStyle = updateColor;
  } else {
    context.fillStyle = this.color;
  }
  context.strokeStyle = this.border;
  context.fillRect(this.x * this.width, this.y * this.width, this.width, this.width);
  context.strokeRect(this.x * this.width, this.y * this.width, this.width, this.width);
};

module.exports = Piece;