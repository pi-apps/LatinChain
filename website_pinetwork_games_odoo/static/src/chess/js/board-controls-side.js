// Right panel control buttons logic

// Reset board to classic starting position

$('#btn-new-game').click(function() {

  console.log('Making new game.');

  gameStarted = false;
  gameEnd = false;

  stopTimer("stop-both");

  $('#game-settings').removeClass('hidden');
  $('#board').removeClass('resign');
  $('#btn-choose-white-side, #btn-choose-black-side').removeClass('locked');

  $('#btn-choose-black-side').removeClass('selected');
  $('#btn-choose-white-side').addClass('selected');

  playerSide = 'w';
  opponentSide = 'b';
  firstTurn = 'player';

  $('#btn-undo-move').addClass('hidden');
  $('#game-state').addClass('hidden');

  document.getElementById("btn-switch-sides").disabled = false;
  $('#btn-switch-sides').removeClass('disabled');

  document.getElementById("btn-show-hint").disabled = false;
  $('#btn-show-hint').removeClass('disabled');

  // setBoard();

  game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

  if (playerSide == 'b') {
    game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');
    board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1');

    opponentTurn();

  } else {
    game = new Chess('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    board.position('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');

    // unlock if locked
    $('#board').removeClass('locked');

    // reset turns history
    $('#game-turns-history ol').html('');
  }

});

// Empty board and enable custom pieces

$('#btn-empty-board').click(function() {

  stopTimer("stop-both");

  $('#game-timer').addClass('hidden');
  $('#btn-choose-white-side, #btn-choose-black-side').removeClass('locked');
  $('#btn-undo-move').addClass('hidden');
  $('#board').removeClass('locked');

  $('body').find('img[data-piece="wP"]').remove();
  $(window).unbind();

  board.clear();

  board = ChessBoard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true
  });

  boardPieces = true;

  $('#game-turn').addClass('hidden');

});

// Load PGN string popup

$('#btn-load-pgn').click(function() {
  if ($('#board-load-pgn-area').hasClass('hidden')) {
    $('#board-load-fen-area, #board-save-pgn-area').addClass('hidden');
    $('#board-load-pgn-area').removeClass('hidden').find('textarea').focus().select();
  } else {
    $('#board-load-pgn-area').addClass('hidden');
  }
});

$('#board-load-pgn-area button').click(function() {
  eventLoadPgnData();
  $('#board-load-pgn-area').addClass('hidden');
});

$('#board-load-pgn-area textarea').keydown(function(e) {
  e.preventDefault();
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    eventLoadPgnData();
    $('#board-load-pgn-area').addClass('hidden');
  }
});

function eventLoadPgnData() {
  if ($('#board-load-pgn-area textarea').val() == '') return;

  var fenString = '';
  Init('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  SetPgnMoveText($('#board-load-pgn-area textarea').val());
  var ff = "", ff_new = "", ff_old;

  do {
    ff_old = ff_new;
    MoveForward(1);
    ff_new = GetFEN();
    if (ff_old!=ff_new) ff += ff_new + "\n";
    fenString = ff_new;
  }
  while (ff_old != ff_new);

  console.log('PGN converted to FEN: ' + fenString);

  loadBoard(fenString);
  checkTurn();
  checkAnalyzeOption();
}

$('#board-load-pgn-area .close').click(function() {
  $('#board-load-pgn-area').addClass('hidden');
});

// Load FEN string popup

$('#btn-load-fen').click(function() {
  if ($('#board-load-fen-area').hasClass('hidden')) {
    $('#board-load-pgn-area, #board-save-pgn-area').addClass('hidden');
    $('#board-load-fen-area').removeClass('hidden').find('textarea').focus().select();
  } else {
    $('#board-load-fen-area').addClass('hidden');
  }
});

$('#board-load-fen-area button').click(function() {
  eventLoadFenData();
  $('#board-load-fen-area').addClass('hidden');
});

$('#board-load-fen-area textarea').keydown(function(e) {
  e.preventDefault();
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    eventLoadFenData();
    $('#board-load-fen-area').addClass('hidden');
  }
});

function eventLoadFenData() {
  var fenString = $('#board-load-fen-area textarea').val();
  var gameValidation = game.validate_fen(fenString);
  if (!gameValidation.valid) {
    console.log('Error ' + gameValidation.error_number + ': ' + gameValidation.error);
    return;
  };
  loadBoard(fenString);
  checkTurn();
  checkAnalyzeOption();
}

$('#board-load-fen-area .close').click(function () {
  $('#board-load-fen-area').addClass('hidden');
});

$('#board-save-pgn-area textarea').keydown(function(e) {
  var code = e.keyCode ? e.keyCode : e.which;
  if (code == 13) {
    $('#board-save-pgn-area').addClass('hidden');
  }
});

$('#board-save-pgn-area button').click(function() {
  $('#board-save-pgn-area').addClass('hidden');
});

$('#board-save-pgn-area .close').click(function() {
  $('#board-save-pgn-area').addClass('hidden');
});

// Analyze moves

$('#btn-analyze').click(function() {
  if ($(this).hasClass('disabled')) {
    console.log('Cannot analyze in opponent turn.');
    return;
  }
  stateAnalyze = 'grep';
  $('#btn-analyze').addClass('disabled loading');
  console.log('Analyze ' + game.fen());
  stockfish.postMessage('position fen ' + game.fen());
  stockfish.postMessage('go depth ' + staticSkill);
});

function checkAnalyzeOption() {
  if (game.turn() != playerSide) {
    $('#btn-analyze').addClass('disabled');
  } else {
    $('#btn-analyze').removeClass('disabled');
  }
}

$('#btn-settings').click(function() {
  $('#game-difficulty-skill-settings').toggleClass('hidden');
});

$('#btn-choose-white-side').click(function() {
  if ($(this).hasClass('locked')) return;
  $('#game-settings .btn').removeClass('selected');
  $(this).addClass('selected');
  playerSide = 'w';
  opponentSide = 'b';
  if (typeof board.setOrientation == 'function') {
    board.setOrientation(playerSide);
  } else {
    board.orientation('white');
  }
  $('#game-settings .btn').addClass('locked');
});

$('#btn-choose-black-side').click(function() {
  if ($(this).hasClass('locked')) return;
  $('#game-settings .btn').removeClass('selected');
  $(this).addClass('selected');
  playerSide = 'b';
  opponentSide = 'w';
  if (typeof board.setOrientation == 'function') {
    board.setOrientation(playerSide);
  } else {
    board.orientation('black');
  }
  opponentTurn();
  $('#game-settings .btn').addClass('locked');
});

$('#btn-resign').click(function() {
  $('#board-resign-game-area').toggleClass('hidden');
});

$('#board-resign-game-area .close').click(function() {
  $('#board-resign-game-area').addClass('hidden');
});

$('#board-resign-game-area .yes').click(function() {
  gameEnd = true;
  stopTimer("stop-both");
  $('#game-state').text('Game ended. Click in New Game.').removeClass('hidden');
  $('#game-timer').addClass('hidden');
  $('#board').addClass('resign');
  $('#board').addClass('locked');
  $('#board-resign-game-area').addClass('hidden');
  
  document.getElementById("btn-switch-sides").disabled = true;
  $('#btn-switch-sides').addClass('disabled');

  document.getElementById("btn-show-hint").disabled = true;
  $('#btn-show-hint').addClass('disabled');

  $('#game-turn').addClass('hidden');
});

$('#board-resign-game-area .no').click(function() {
  $('#board-resign-game-area').addClass('hidden');
});
