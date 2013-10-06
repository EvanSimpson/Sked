$(function () {

$('#editor').on('keydown', function () {
  setTimeout(function () {
    var analyze = $('#editor').val();

    parseAll(analyze, function (sentence) {
      $('#bg').html('').append(sentence.ranges.map(function (s) {
        return $('<span>').text(s.text).addClass('live-' + s.type);
      }));

      delete sentence.ranges;
      $('#output').text(JSON.stringify(sentence, null, '  '));
      console.log($('#bg').html());
    });
  }, 0)
});

function fixScroll () {
  $('#bg')[0].scrollTop = $('#editor')[0].scrollTop;
}

$('#editor').on('keydown', fixScroll);
$('#editor').on('mousedown', fixScroll);
$('#editor').on('mousemove', fixScroll);
$('#editor').on('mouseup', fixScroll);
$('#editor').on('keyup', fixScroll);

});