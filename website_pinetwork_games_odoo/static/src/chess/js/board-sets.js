$('#game-difficulty-option').click(function() {
  $('#game-difficulty-skill-settings').toggleClass('hidden');
});

$('#game-difficulty-skill-settings .close').click(function() {
  $('#game-difficulty-skill-settings').addClass('hidden');
});

$('#game-difficulty-skill-settings .values span').click(function() {
  $('#game-difficulty-skill-settings .values span').removeClass('selected');
  var value = parseInt($(this).attr('class'));
  console.log(value);
  $(this).addClass('selected');
  $('#game-difficulty-skill-value').text(value);
});