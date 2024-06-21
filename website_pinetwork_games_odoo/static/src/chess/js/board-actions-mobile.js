// init mobile board

function setMobileBoard(position = false) {

  gameEnd = false;

  // init board with preloaded position (fen)
  if (position == false) {
    position = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  } else {
    console.log('Custom: ' + position);
  }

  // game rules control object
  game = new Chess(position);

  board = new Chessboard('board', {

    position: ChessUtils.FEN.startId,

    eventHandlers: {

      onPieceSelected: function(notationSquare) {
        if($('#board').hasClass('resign'))
          return;
        if(gameEnd)
          return;
        var i, movesNotation, movesPosition = [];
        movesNotation = game.moves({square: notationSquare, verbose: true});
        for (i = 0; i < movesNotation.length; i++) {
          movesPosition.push(ChessUtils.convertNotationSquareToIndex(movesNotation[i].to));
        }
        return movesPosition;
      },

      onMove: function(move) {
        if($('#board').hasClass('resign'))
          return;
        if(gameEnd)
          return;
        stopTimer(game);
        if (!gameStarted) {
          gameStarted = true;
          $('#btn-choose-white-side, #btn-choose-black-side').addClass('locked');
        }
        var nextPlayer,
          status, move;
        if(playerSide == game.turn()) {
            move = game.move({
              from: move.from,
              to: move.to,
              promotion: $('#promote_as :selected').val()
            });
        }else{
            move = game.move({
              from: move.from,
              to: move.to,
              promotion: promotionFigure
            });
        }

        /*
        var move = game.move({
            from: move.from,
            to: move.to,
            promotion: $('#promote_as :selected').val()
          });*/
        nextPlayer = 'white';
        if (game.turn() === 'b') {
          nextPlayer = 'black';
        }
        if (move !== null) {
          checkPositions('computer');
        }
        updateEngineSkill();
        setTimeout(function() {
          stockfish.postMessage('position fen ' + game.fen());
          stockfish.postMessage('go depth ' + engineSkill);
        }, 1000);
        startTimer(game);
        return game.fen();
      }

    }
  });

  gameHistoryClear();

};
