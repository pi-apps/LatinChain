var
  board,                  // chess board obj
  game,                   // chess game control obj

  gameTimer,
  gameStarted = false,

  playerSide = 'w',       // manual seetings
  opponentSide = 'b',
  firstTurn = 'player',

  promotionPos,
  moveSource,
  moveTarget,

  promotionFigure = 'q',  // promotion figure, Queen as default
  promotionEvent,

  togglePlayer = false,
  engineDisabled = false,

  engineSkill = 10,       // default engine depth (AI difficulty)
  staticSkill = 16,


  stateAnalyze = false,   // flag if game in analyze state
  stateAnalyzeMatch = '',

  stateHint = false,
  gameEnd = false;        // flag for stall, checkmate, etc

// Init engine

var stockfish = new Worker('/website_pinetwork_games_odoo/static/src/chess/js/engine/stockfish-nnue-16-single.js');

function dumpLog(data) {
  if (!data) {
    $('.chess-log').html('');
  } else {
    $('.chess-log').html($('.chess-log').html() + data + '<br />');
  }
}

function listMoves() {
  var movesArray = game.history();
  var movesHtml = '';
  var turnFrom = 1;
  for (i = 0; i < movesArray.length; i = i + 2) {
    if (movesArray[i+1] == undefined) {
      movesHtml += '<li><span turn=' + turnFrom + '>' + movesArray[i] + '</span><span></span></li>';
    } else {
      movesHtml += '<li><span turn=' + turnFrom + '>' + movesArray[i] + '</span><span turn=' + (turnFrom + 1) + '>' + movesArray[i+1] + '</span></li>';
    }
    turnFrom = turnFrom + 2;
  }
  $('#game-turns-history ol').html(movesHtml);
  $('#game-turns-history li span').off().click(function() {
    var turnN = parseInt($(this).attr('turn'));
    console.log('History: show turn ' + $(this).attr('turn'));
    moves = JSON.parse(localStorage.getItem('boardHistory'));
    console.log(moves[turnN-1]);
    //loadBoard(moves[turnN-1], true);
  });
}

function calcFieldNum( fieldCode ) {
  let letters = ['a','b','c','d','e','f','g','h'];
  var j   = 0;
  var num = 0;

  if ( board.orientation() === 'w' ) {
    for ( var i = 8; i > 0; i-- ) {
      letters.map( function( letter ) {
        if ( letter + i === fieldCode ) {
          num = j;
        }
        j++;
      });
    }
  } else {
    letters = letters.reverse();
    for ( var i = 1; i <= 8; i++ ) {
      letters.map( function( letter ) {
        if ( letter + i === fieldCode ) {
          num = j;
        }
        j++;
      });
    }
  }

  return num;
}

// Engine response event

stockfish.onmessage = function(event) {

  console.log(event.data);

  /* dumpLog(event.data); */

  var eventStr = event.data;

  if (stateHint == 'grep') {

    var match = eventStr.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);

    if (match) {

      $('#board .square-' + match[1]).css('background', '#f7c5cd');
      $('#board .square-'+ match[2]).css('background', '#f7c5cd');
      $('#board_chess_square_'+calcFieldNum(match[1])).css('background', '#f7c5cd');
      $('#board_chess_square_'+calcFieldNum(match[2])).css('background', '#f7c5cd');

      stateHint = false;
      $('#btn-show-hint').removeClass('loading disabled');

      setTimeout(function() {
        $('#board .square-55d63').css('background', '');
        $('.chess_square').css('background', '');
      }, 2500);

    }

    return;
  }

  if (stateAnalyze == 'grep') {

    var regex = new RegExp("info depth " + staticSkill + " seldepth .*? pv (.*)");
    var seldepthMatch = regex.exec(eventStr);

    if (seldepthMatch) {

      console.log('Analyze entry match.');

      var moves = seldepthMatch[1].split(' ');
      stateAnalyzeMatch = '';

      for (var i = 0, len = 5; i < len; i++) {
        stateAnalyzeMatch += (i + 1) + '. ' + moves[i] + ' ';
      }

    };

    var regex = new RegExp("bestmove .*");
    var bestmoveMatch = regex.exec(eventStr);

    if (bestmoveMatch) {

      $('#game-analyze-string').text(stateAnalyzeMatch).removeClass('hidden');;

      stateAnalyze = false;
      $('#btn-analyze').removeClass('disabled loading');

    }

    return;
  }

  if ((eventStr.indexOf('bestmove') + 1) && stateAnalyze == 'done') {
    stateAnalyze = false;
    return;
  }

  if (eventStr.indexOf('bestmove') + 1) {
    $('#board-positions-data').text('Tactical solution: ' + event.data);
  }

  // console.log('stateAnalyze: ' + stateAnalyze);
  // console.log('stateHint: ' + stateHint);

  if (!stateAnalyze && !stateHint) {

  var match = eventStr.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);

    if (match) {

      console.log('Match and move.');

      stopTimer(game);

      var move = game.move({
        from: match[1],
        to: match[2],
        promotion: match[3]
      });

      console.log(game.fen());

      board.position(game.fen());

      checkPositions('player');
      checkAnalyzeOption();

      if (game.history().length > 0) {
        //$('#btn-take-back').removeClass('disabled');
      }

      listMoves();
      startTimer(game);

      gameHistoryAddMove(game.fen());

    }

  }

};
