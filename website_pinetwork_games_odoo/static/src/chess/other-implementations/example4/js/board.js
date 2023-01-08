/*!
 *
 *
 * Copyright 2015 Dr.R.Urban
 * Released under the MIT license
 * https://github.com/antiproton
 *
 * Date: 25.5.2015
 */
var init = function() {
selfplay = false;
//--- start example JS ---
var board,
  game = new Chess(),
  statusEl = $('#status'),
  fenEl = $('#fen'),
  pgnEl = $('#pgn');

// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function(source, piece, position, orientation) {
  if (game.game_over() === true ||
      (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};
function makemove() {
  setRequest(game.fen());
  setTimeout(function(){ document.getElementById('content').innerHTML = content;
  ziehen(content);

  }, 1500);

};
function ziehen(zug) {

 var zug_bot =  zug.split("-");
   var zug_von = zug_bot[0];
     var  zug_nach = zug_bot[1];


  var possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;

  game.move({
    from: zug_von,
    to: zug_nach,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });
  board.position(game.fen());
  updateStatus();
document.getElementById('fen').innerHTML = game.fen();
if(selfplay != false){makemove();}

};



var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return 'snapback';

  updateStatus();
  makemove();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function() {
  board.position(game.fen());
};

var updateStatus = function() {
  var status = '';

  var moveColor = 'White';
  if (game.turn() === 'b') {
    moveColor = 'Black';
  }

  // checkmate?
  if (game.in_checkmate() === true) {
    status = 'Game over, ' + moveColor + ' is in checkmate.';
  }

  // draw?
  else if (game.in_draw() === true) {
    status = 'Game over, drawn position';
  }

  // game still on
  else {
    status = moveColor + ' to move';

    // check?
    if (game.in_check() === true) {
      status += ', ' + moveColor + ' is in check';
    }
  }
if(s != false){sound();}
  statusEl.html(status);
  fenEl.html(game.fen());
  pgnEl.html(game.pgn());
 captured_pieces(game.fen());
  
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
};
board = new ChessBoard('board', cfg);

updateStatus();
$('#flipOrientationBtn').on('click', board.flip);
$('#whiteOrientationBtn').on('click', function() {
  board.orientation('white');
});

$('#blackOrientationBtn').on('click', function() {
  board.orientation('black');
});




$('#move').on('click',  function() {
setRequest(game.fen());
  setTimeout(function(){ document.getElementById('content').innerHTML = content;
  ziehen(content);

  }, 2000);

});


//--- end example JS ---

}; // end init()
$(document).ready(init);

function sound(){
	document.getElementById('sound').innerHTML = '<audio autoplay preload controls> <source src="sound/move.wav" type="audio/wav" /> </audio>';}
s ='true';
function soundcheck() {
    s = document.getElementById("soundcheck").checked;

}
function stockfcheck() {
    selfplay = document.getElementById("stockfcheck").checked;
//if(selfplay != false){makemove();}
//document.getElementById('test').innerHTML = selfplay;
}

