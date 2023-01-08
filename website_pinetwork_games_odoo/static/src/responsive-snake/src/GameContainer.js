/*global module, require, $ */

var cookie = require('./util/cookie');

/**
 * Basic Game Object
 * @param options
 * @constructor
 */
var GameContainer = function (options) {
  this.started = false;
  this.disabled = false;
  this.score = 0;
  this.settings = $.extend({ inst : false }, options);
  this.inst = this.settings.inst;

  if (!this.inst) {
    throw new Error("A Game Instance Must Be Supplied");
  }

  this.ui = {
    canvas : $('#snake-canvas'),
    scoreboard : $('#score span', '#scoreboard'),
    userScore : $('#hi-score span','#scoreboard'),
    botScore : $('#bot-hi-score span', '#scoreboard')
  };

  this.keys = {
    user : this.inst.name + '_user',
    bot : this.inst.name + '_bot'
  };

this.$canvas = this.inst.$canvas;
  this.updateScoreboard();
  this.bindEvents();
};

/**
 * Initialize The Game Session
 */
GameContainer.prototype.start = function () {
  this.started = true;
  this.inst.start();
};

/**
 * Bind The Game Events
 */
GameContainer.prototype.bindEvents = function () {
  $(document).on('keydown', this.onKeydown.bind(this));
  $(window).on('resize', this.onResize.bind(this));

  this.inst.onRestart = this.onGameRestart.bind(this);
  this.inst.onScore = this.onGameScore.bind(this);

  this.bindTouchEvents();
};


/**
 * Bind The Touch Events
 */
GameContainer.prototype.bindTouchEvents = function() {
  var self = this,
    queueFunc = this.inst.queueDirection.bind(this.inst);

  this.ui.canvas.on('touchmove', function(e) { e.preventDefault(); });
  this.ui.canvas.on("swipeUp", function() { queueFunc(self.inst.DIRECTIONS.UP); });
  this.ui.canvas.on("swipeDown", function() { queueFunc(self.inst.DIRECTIONS.DOWN); });
  this.ui.canvas.on("swipeLeft", function() { queueFunc(self.inst.DIRECTIONS.LEFT); });
  this.ui.canvas.on("swipeRight", function() { queueFunc(self.inst.DIRECTIONS.RIGHT); });
};

/**
 * Resume/Play Game
 */
GameContainer.prototype.play = function () {
  this.started = true;
  this.inst.play();
};

/**
 * Pause Current Game
 */
GameContainer.prototype.pause = function () {
  this.started = false;
  this.inst.pause();
};

/**
 * Display Canvas and Start Game
 */
GameContainer.prototype.enableGame = function () {
  this.disabled = false;
  this.$canvas.show();
  this.play();
};

/**
 * Hide Canvas and Pause Game
 */
GameContainer.prototype.disableGame = function () {
  this.disabled = true;
  this.$canvas.hide();
  this.pause();
};

/**
 * Persist Current Game Session to Cookie
 * @param score
 */
GameContainer.prototype.saveGame = function (score) {
  var hiScore = cookie.read(this.keys.user) || 0;
  if (this.inst.bot && this.inst.bot.enabled) {
    var botScore = cookie.read(this.keys.bot) || 0;
    if (botScore && score < botScore) {
      score = botScore;
    }
    cookie.create(this.keys.bot, score);
  } else if (!hiScore || (hiScore && score > hiScore)) {
    cookie.create(this.keys.user, score);
  }
};

/**
 * Update Current Scoreboard With New Score
 * @param score
 */
GameContainer.prototype.updateScoreboard = function (score) {
  this.updateScore(score || 0);

  this.ui.userScore.text(cookie.read(this.keys.user) || 0);

  if (this.inst.bot) {
    this.ui.botScore.text(cookie.read(this.keys.bot) || 0);
  }
};

/**
 * Update Actual Score and Flash In
 * @param score
 */
GameContainer.prototype.updateScore = function (score) {
  var scoreboard = this.ui.scoreboard;
    scoreboard.text(score).addClass('flash');
  setTimeout(function () {
    scoreboard.removeClass('flash');
  }, 1000)
};

/**
 * On Game Score
 * @param score
 */
GameContainer.prototype.onGameScore = function (score) {
  this.updateScore(score);
};

/**
 * Restart Current Game
 * @param score
 */
GameContainer.prototype.onGameRestart = function (score) {
  this.saveGame(score);
  this.updateScoreboard();
};

/**
 * Toggle Game Session
 */
GameContainer.prototype.toggleGame = function () {
  if (this.disabled) {
    this.enableGame();
  } else {
    this.disableGame();
  }
};

/**
 * Handle Window Resize
 */
GameContainer.prototype.onResize = function () {
  if (typeof this.inst.onResize === 'function') {
    this.inst.onResize(window.innerHeight, window.innerWidth);
  }
};

/**
 * Handle KeyDown Events
 * @param event
 */
GameContainer.prototype.onKeydown = function (event) {
  switch (event.keyCode) {
    case 38 :
      this.inst.queueDirection(this.inst.DIRECTIONS.UP);
      break;
    case 40 :
      this.inst.queueDirection(this.inst.DIRECTIONS.DOWN);
      break;
    case 37 :
      this.inst.queueDirection(this.inst.DIRECTIONS.LEFT);
      break;
    case 39 :
      this.inst.queueDirection(this.inst.DIRECTIONS.RIGHT);
      break;
    case 187: //+
      this.inst.increaseFPS(1);
      break;
    case 189: //-
      this.inst.decreaseFPS(1);
      break;
    case 66 :
      if (this.inst.bot) {
        this.inst.bot.enable();
      }
      break;
    case 82 : //r
      this.inst.restart();
      break;
    case 79 : //o
      this.toggleGame();
      break;
    case 32 : //space
      if (!this.disabled) {
        if (this.started) {
          this.pause();
        } else {
          this.play();
        }
      }
      break;
  }
};

module.exports = GameContainer;