$(function () {

var editors = 1;

$(window).on('resize', function () {
  $('.fullheight').height(window.innerHeight);
})
$(window).trigger('resize');


$(".add").click(function(){
  editors++;
  $(".add").before('<textarea id="editor'+editors+'" class="editor"></textarea>');
  // setListener();
});


console.log('clearing');
var events = [];

function regenerateEvents () {
  $('#myevents').html('');

  for (var i = 0; i < events.length; i++) {
    // Empty. Populate event if visible.
    if (!events[i]) {
      continue;
    }

    // Time to parse.
    var event = events[i];
    if (event.hours.start != null) {
      var start = moment(event.hours.start, 'ha');
      var end = event.hours.end ? moment(event.hours.end, 'ha') : moment(start).add('hours', 1);
      console.log(event.hours.start, start.format());

      var starthours = start.hours();
      var endhours = end.hours();
      if (endhours < starthours) {
        endhours += 12;
      }
      var duration = endhours <= starthours ? 1 : endhours - starthours;

      $('#myevents').append($('<div>').css({
        top: starthours * 60 + 'px',
        height: duration * 60 + 'px'
      }).text(event.description))
      // start.hours();
      // var hour = amPm(parseInt(sentence.event.hours.start), sentence.event.hours.ampm);
      // $('#out'+hour).text("Start time: "+ sentence.event.hours.start);
      // $('#output'+num).text(JSON.stringify(sentence, null, '  '));
      // $('#output'+num).css({"visibility":"visible"});
    }
  }
}

$('#editor-parent').on('keydown', '.editor', function () {
  // Get the ID of the current editor.
  var num = $(this).attr("id")[$(this).attr("id").length-1];
  setTimeout(function () {
    var analyze = $("#editor"+num).val();
    parseAll(analyze, function (sentence) {
      events[num] = sentence.event;
      regenerateEvents();
    });
  }, 0)
});

});