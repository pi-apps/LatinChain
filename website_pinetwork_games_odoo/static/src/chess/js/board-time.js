function startTimer(game) {

  $('#game-timer').removeClass('hidden');

  var timeSec = 0, timeMin = 0;
  var timeSecStr = '', timeMinStr = '';

  clearInterval(gameTimer);

  gameTimer = setInterval(function() { 

    timeSec++;
    if (timeSec >= 0 && timeSec <= 9) {
      timeSecStr = '0' + timeSec;
    }
    if (timeSec >= 10 && timeSec <= 59) {
      timeSecStr = timeSec;
    }
    if (timeSec == 60) {
      timeSecStr = '00';
      timeSec = 0;
      timeMin++;
    }

    if (timeMin >= 0 && timeMin <= 9) {
      timeMinStr = '0' + timeMin;
    }
    if (timeMin >= 10 && timeMin <= 59) {
      timeMinStr = timeMin;
    }

    $('#game-timer').text(timeMinStr + ':' + timeSecStr);

    if (timeMin >= 5) {
      clearInterval(gameTimer);
    }

  }, 1000);

    if(game == undefined || game == "stop-both")
    {
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
        $('.timer_white').countimer('start');
        $('.timer_white').countimer('stop');
        $('.timer_black').countimer('start');
        $('.timer_black').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
    }else if(game.turn() == "b")
    {
        for(var i = 1; i <= 20; i++)
        {
            if(!$('.' + i).hasClass('selected'))
            {
                if(!$('.' + i).hasClass('hidden'))
                    $('.' + i).addClass('hidden');
            }
        }
    	$('.timer_white').countimer('stop');
    	$('.timer_black').countimer('resume');
        if(!$('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').addClass('hidden');
    }else if(game.turn() == "w"){
        
        for(var i = 1; i <= 20; i++)
        {
            if(!$('.' + i).hasClass('selected'))
            {
                if(!$('.' + i).hasClass('hidden'))
                    $('.' + i).addClass('hidden');
            }
        }
        
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('resume');
        if(!$('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').addClass('hidden');
    }

    if(game == undefined || game == "stop-both")
    {
    }else if (game.in_checkmate()) {
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
        
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
    }else if (game.in_draw()) {
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
        
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
    }else if (game.in_stalemate()) {
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
        
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
    }
}

function stopTimer(game) {
  clearInterval(gameTimer);
  $('#game-timer').text('00:00');

  if(game == undefined || game == "stop-both")
    {
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
        $('.timer_white').countimer('start');
        $('.timer_white').countimer('stop');
        $('.timer_black').countimer('start');
        $('.timer_black').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
    }else if(game.turn() == "b")
    {
        $('.timer_white').countimer('stop');
        $('.timer_black').countimer('resume');
        if(!$('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').addClass('hidden');
            
        for(var i = 1; i <= 20; i++)
        {
            if(!$('.' + i).hasClass('selected'))
            {
                if(!$('.' + i).hasClass('hidden'))
                    $('.' + i).addClass('hidden');
            }
        }
    }else if(game.turn() == "w"){
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('resume');
        if(!$('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').addClass('hidden');
            
        for(var i = 1; i <= 20; i++)
        {
            if(!$('.' + i).hasClass('selected'))
            {
                if(!$('.' + i).hasClass('hidden'))
                    $('.' + i).addClass('hidden');
            }
        }
    }

    if(game == undefined || game == "stop-both")
    {
    }else if (game.in_checkmate()) {
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
    }else if (game.in_draw()) {
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
    }else if (game.in_stalemate()) {
        $('.timer_black').countimer('stop');
        $('.timer_white').countimer('stop');
        if($('#btn-switch-sides').hasClass('hidden'))
            $('#btn-switch-sides').removeClass('hidden');
        for(var i = 1; i <= 20; i++)
        {
            $('.' + i).removeClass('hidden');
        }
    }
}
