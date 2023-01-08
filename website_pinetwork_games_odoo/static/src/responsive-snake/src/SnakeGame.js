/*global requestAnimationFrame, module, require, $ */

var Piece = require('./Piece'),
 Food = require('./Food'),
 Bot = require('./Bot'),
 Particle = require('./Particle');

/**
 * Snake Game
 * @param options
 * @constructor
 */
var Snake = function(options) {

  this.score = 0;
  this.started = false;
  this.fps = 15;
  this.gravity = 1;
  this.particles = [];
  this.particleCount = 150;

  this.$canvas = $("canvas");
  this.canvas = this.$canvas[0];
  this.context = this.canvas.getContext('2d');

  if (this.$canvas.data('full-screen')) {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  this.animationTimeout = null;

  this.pieces = [];
  this.food = [];

  this.currentFoodColor = null;

  this.settings = $.extend({
    snakePixels    : 14,
    snakeSize      : 3,
    foodColor      : null,
    headColor      : 'rgba(0,0,0,0)',
    bot            : false,
    timeout        : 1000,
    explosion      : true
  }, options);

  this.DIRECTIONS = {
    UP   : 0,
    DOWN : 2,
    LEFT  : 1,
    RIGHT : 3
  };

  //Bot Support
  this.bot = new Bot({directions : this.DIRECTIONS, enabled : this.settings.bot});

  this.direction = this.DIRECTIONS.RIGHT;
  this.directionQueue = [];
};


/**
 * Set Options For Current Snake
 * @param options
 * @returns {*}
 */
Snake.prototype.setOptions = function(options) {
  $.extend(this.settings, options);
  if (this.settings.bot === true) {
    this.bot.enable();
  }
};

/**
 * Start Snake Game
 */
Snake.prototype.start = function() {
  this.started = true;
  this.create();
  this.createFood();
  this.play();
};

/**
 * Reset Game Session Variables
 */
Snake.prototype.reset = function() {
  this.started = false;
  this.score = 0;
  this.directionQueue = [];
  this.direction = this.DIRECTIONS.RIGHT;
  this.pieces = [];
  this.food = [];
  this.particles = [];
  this.gravity = 1;
  this.fps = 15;

  if (this.animationTimeout) {
    clearTimeout(this.animationTimeout);
  }
};

/**
 * Restart Game
 */
Snake.prototype.restart = function () {
  if (typeof this.onRestart === 'function') {
    this.onRestart(this.score);
  }
  this.reset();
  this.start();
};

/**
 * Resume/Play Game
 */
Snake.prototype.play = function() {
  this.started = true;
  if (typeof this.animationLoop === 'function') {
    this.animationLoop();
  }
};

/**
 * Pause Current Game
 */
Snake.prototype.pause = function() {
  this.started = false;
};

/**
 * Lose Current Game
 */
Snake.prototype.lose = function() {
  this.pause();
  setTimeout(this.restart.bind(this), this.settings.timeout);
};

/**
 * Add Direction To The Direction Queue
 * @param direction
 */
Snake.prototype.queueDirection = function(direction) {
  if (this.bot.enabled === true) this.bot.disable();
  //Don't Allow The Same Moves To Stack Up
  if (this.started && this.directionQueue[this.directionQueue.length - 1] !== direction) {
    this.directionQueue.push(direction);
  }
};

/**
 * Handle Window Resize
 * @param height
 * @param width
 */
Snake.prototype.onResize = function(height, width) {
  this.canvas.width = width;
  this.canvas.height = height;
};

/**
 * Create Snake
 */
Snake.prototype.create = function() {
  for (var x = 0; x < this.settings.snakeSize; x++) {
    this.pieces.push(new Piece({
      x : 0,
      y : 20,
      width : this.settings.snakePixels
    }));
  }
};

/**
 * Create a piece of food
 */
Snake.prototype.createFood = function() {
  this.food.push(new Food({
    x : Math.round(Math.random() * (this.canvas.width - this.settings.snakePixels) / this.settings.snakePixels),
    y : Math.round(Math.random() * (this.canvas.height - this.settings.snakePixels) / this.settings.snakePixels),
    width : this.settings.snakePixels,
    color : this.getFoodColor(),
    border : '#000'
  }));
};

/**
 * Get Current Food Color
 * @returns {*}
 */
Snake.prototype.getFoodColor = function() {
  if (this.settings.foodColor) {
    return this.settings.foodColor;
  }

  this.currentFoodColor = 'rgb(' +
    parseInt(Math.random() * 255) + ',' +
    parseInt(Math.random() * 255) + ',' +
    parseInt(Math.random() * 255) + ')';

  return this.currentFoodColor;
};

/**
 * Get Snake Direction
 * @returns {*}
 */
Snake.prototype.getDirection = function () {
  var direction;
  while (typeof direction === 'undefined' || (this.direction - direction + 4) % 4 === 2) {
    if (this.directionQueue.length > 0) {
      //Shift through the Queue
      direction = this.directionQueue.shift();
    }
    else {
      direction = this.direction;
    }
  }
  return direction;
};

/**
 * Check if Coordinates Cause Collision
 * @param x
 * @param y
 * @returns {boolean}
 */
Snake.prototype.isWallCollision = function(x,y) {
  var isTopCollision = y === -1,
    isRightCollision = x >= this.canvas.width / this.settings.snakePixels,
    isBottomCollision = y >= this.canvas.height / this.settings.snakePixels,
    isLeftCollision = x === -1;

  return isTopCollision || isRightCollision  || isBottomCollision || isLeftCollision;
};

/**
 * Check If "Safe" Collision
 * @param x
 * @param y
 * @returns {boolean}
 */
Snake.prototype.isSelfCollision = function(x,y) {
  for (var i = 0; i < this.pieces.length; i++) {
    if (this.pieces[i].x == x && this.pieces[i].y == y) {
      return true;
    }
  }
  return false;
};

/**
 * Check if Food Collision
 * @param x
 * @param y
 * @returns {boolean}
 */
Snake.prototype.isFoodCollision = function(x,y) {
  var found = false;
  this.food.forEach(function(food) {
    if ((x == food.x && y == food.y)) {
      found = true;
    }
  });
  return found;
};

/**
 * Remove Piece Of Food
 * @param x
 * @param y
 */
Snake.prototype.removeFood = function(x,y) {
  var self = this;
  this.food.forEach(function(food,ix) {
    if ((x == food.x && y == food.y)) {
      self.food.splice(ix);
    }
  });
};

/**
 * Create Particle Explosion
 * @param x
 * @param y
 */
Snake.prototype.createExplosion = function(x,y) {
  for (var i = 0; i < this.particleCount; i++) {
    var particle = new Particle({
      x : x * this.settings.snakePixels,
      y : y * this.settings.snakePixels,
      color : this.settings.foodColor ? this.settings.foodColor : this.currentFoodColor,
      decay : true
    });
    this.particles.push(particle);
  }
};

/**
 * Score a point and call onScore
 */
Snake.prototype.scorePoint = function() {
  this.score++;
  if (this.onScore && typeof this.onScore === 'function') {
    this.onScore(this.score);
  }
};


/**
 * Increase Snake FPS draw loop
 */
Snake.prototype.increaseFPS = function(amount) {
  this.fps += amount;
};

/**
 * Decrease Snake FPS draw loop
 */
Snake.prototype.decreaseFPS = function(amount) {
  if (this.fps - amount > 0) {
    this.fps -= amount;
  }
};

/**
 * Snake Draw Loop
 */
Snake.prototype.drawLoop = function() {
  var self = this;

  //Clear Canvas Context Before Redraw
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  if (!this.pieces.length) {
    return;
  }

  var headX = this.pieces[0].x;
  var headY = this.pieces[0].y;

  //reset direction
  this.direction = this.getDirection();

  if (this.bot && this.bot.enabled === true) {
    this.direction = this.bot.getNextMove(this.pieces, this.food[0], {x : headX, y : headY}, this.direction, this.DIRECTIONS);
  }

  switch(this.direction) {
    case this.DIRECTIONS.LEFT:
      headX--;
      break;
    case this.DIRECTIONS.RIGHT:
      headX++;
      break;
    case this.DIRECTIONS.UP:
      headY--;
      break;
    case this.DIRECTIONS.DOWN:
      headY++;
      break;
  }

  if (this.isWallCollision(headX, headY) || this.isSelfCollision(headX, headY)) {
    this.lose();
  }

  if (this.started) {
    var headShift = null;
    var food = this.isFoodCollision(headX, headY);

    if (food) {
      this.scorePoint();
      //Increase Frames Per Second
      if (this.score % 2) {
        this.fps += 0.5;
      }

      if (this.settings.explosion) {
        this.createExplosion(headX, headY, [food.color,food.border]);
      }

      this.removeFood(headX, headY);
      this.createFood();

      //create new snake head
      headShift = new Piece({
        x : headX,
        y : headY,
        width : this.settings.snakePixels
      });

    } else {
      //Pop head tail to become new  head
      headShift = this.pieces.pop();
      headShift.updatePosition(headX, headY);
    }
    //move snakeTail to snakeHead
    this.pieces.unshift(headShift);
  }

  //Draw Snake
  this.pieces.forEach(function(piece,ix) {
    piece.draw(self.context, ix === 0 ? self.settings.headColor : null);
  });

  //Draw Food
  this.food.forEach(function(food) {
    food.draw(self.context);
  });
};

/**
 * Snake Animation Loop
 */
Snake.prototype.animationLoop = function() {
  if (this.started) {
    var self = this;
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
    //Ensure FPS
    this.animationTimeout = setTimeout(function() {
      self.drawLoop.call(self);
      self.particleLoop.call(self);
      window.requestAnimationFrame(self.animationLoop.bind(self));
    }, 1000 / this.fps);
  }
};

/**
 * Snake Particle Loop
 */
Snake.prototype.particleLoop = function() {
  if (this.particles) {
    var self = this;
    var particles = [];

    this.particles.forEach(function(particle) {
      //Apply Some Gravity
      particle.velocity.y += self.gravity;

      particle.x += particle.velocity.x;
      particle.y += particle.velocity.y;

      particle.draw(self.context);

      if (particle.y < self.canvas.height * 1.1) {
        particles.push(particle);
      }
    });
    this.particles = particles;
  }
};


module.exports = Snake;
