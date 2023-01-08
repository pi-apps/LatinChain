// bottom panel actions keys

// Rotate board

$('#btn-flip-board').on('click', function () {
  if (typeof board.flip == 'function') {
    board.flip();
  } else {
    board.setOrientation('flip');
  }
});

// Switch sides

$('#btn-switch-sides').on('click', function () {
  /*if (typeof board.flip == 'function') {
    board.flip();
  } else {
    board.setOrientation('flip');
  }*/

  if (playerSide == 'w') {
    playerSide = 'b';
    opponentSide = 'w';
  }

  else if (playerSide == 'b') {
    playerSide = 'w';
    opponentSide = 'b';
  }

  opponentTurn();

});

// Save PGN string popup

$('#btn-save-pgn').on('click', function () {
  if ($('#board-save-pgn-area').hasClass('hidden')) {
    $('#board-load-fen-area, #board-load-pgn-area').addClass('hidden');
    $('#board-save-pgn-area').removeClass('hidden');
    $('#board-save-pgn-area textarea').text(game.pgn()).focus().select();
  } else {
    $('#board-save-pgn-area').addClass('hidden');
  }
});

// Disable engine

$('#btn-engine-disable').on('click', function () {
  /*if ($('#btn-engine-disable').hasClass('active')) {
    $('#btn-engine-disable').removeClass('active');
    $('#btn-engine-disable').text("AI");
    engineDisabled = false;
    if (playerSide != game.turn()) {
      opponentTurn();
    }
  } else {
    $('#btn-engine-disable').addClass('active');
    $('#btn-engine-disable').text("Player");
    engineDisabled = true;
  }*/
});

// Show hint where to make move

$('#btn-show-hint').on('click', function () {
  if ($(this).hasClass('disabled')) {
    console.log('Cannot show hint in opponent turn.');
    return;
  }
  stateHint = 'grep';
  $('#btn-show-hint').addClass('loading disabled');
  console.log('Hint for ' + game.fen());
  stockfish.postMessage('position fen ' + game.fen());
  stockfish.postMessage('go depth ' + staticSkill);
});

// Make one step back

$('#btn-take-back').on('click', function () {
  /*game.undo();
  board.position(game.fen());
  game.undo();
  board.position(game.fen());
  if (game.history().length == 0) {
    $('#btn-take-back').addClass('disabled');
  }*/
});

// Promotion popup ui

$('#game-promotion span').on('click', function () {

  $('#game-promotion span').removeClass('active');
  $(this).addClass('active');

  promotionFigure = $(this).attr('figure');
  promotionEvent = true;

  $('#game-promotion').addClass('hidden');

  makePromotion(moveSource, moveTarget, promotionFigure);

  opponentTurn();

});

// close popup on Esc key

$(document).on("keyup", function (e) {
  var code = e.keyCode || e.which;
  if (code == 27) {
    $('#board-load-pgn-area, #board-load-fen-area, #board-save-pgn-area').addClass('hidden');
  }
});
