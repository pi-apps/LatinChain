/**
 * Particle Class
 * @param options
 * @constructor
 */
function Particle(options) {
  this.options = options || {};
  this.x = this.options.x;
  this.y = this.options.y;

  this.decay = (this.options.hasOwnProperty('decay') && this.options.decay);
  this.life = 100;

  this.velocity = {
    x : -5 + Math.random() * 10,
    y : -8 + Math.random() * 10
  };

  this.radius = parseInt(Math.random() * 5);

  this.color = this.options.color ? this.options.color : this.getBW();
  this.border = this.options.border ?  this.options.border : null;
}

/**
 * Get Black Or White Color With Decay
 * @returns {string}
 */
Particle.prototype.getBW = function() {
  var rand = ((!(Math.random()+ 0.5 | 0) === true) ? 255 : 0);
  return 'rgb(' +
    parseInt(rand) + ',' +
    parseInt(rand) + ',' +
    parseInt(rand) + ',' + (this.decay ?  this.life / 100 : "1") + ')';
};

/**
 * Particle Draw Onto Canvas
 * @param context
 */
Particle.prototype.draw = function (context) {
  //decay
  if (this.decay) {
    this.life = ~~(this.life *.96);
    this.radius = (this.radius *.96);
  }

  context.fillStyle = this.color;

  if (this.border) {
    context.strokeStyle = this.border;
  }

  context.beginPath();

  context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);

  context.fill();
  context.closePath();
};

module.exports = Particle;