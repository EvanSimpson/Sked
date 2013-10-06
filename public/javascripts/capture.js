$(function () {

var editors = 1;

function setListener(){
  $('.editor').on('keydown', function () {
    var num = $(this).attr("id")[$(this).attr("id").length-1];
    setTimeout(function () {
      var analyze = $("#editor"+num).val();

      parseAll(analyze, function (sentence) {
        delete sentence.ranges;
        console.log(sentence);
        if(sentence.event.hours.start != null){
          var hour = amPm(parseInt(sentence.event.hours.start), sentence.event.hours.ampm);
          $('#out'+hour).text("Start time: "+ sentence.event.hours.start);
        }
        $('#output'+num).text(JSON.stringify(sentence, null, '  '));
        $('#output'+num).css({"visibility":"visible"});
      });
    }, 0)
  });
}

function amPm(hour, ampm){
  if(ampm === "am"){
    return hour;
  }else if(hour > 12){
    return hour;
  }else{
    return 12+hour;
  }
}

$(".add").click(function(){
  editors++;
  $(".add").before('<textarea id="editor'+editors+'" class="editor"></textarea>');
  setListener();
});

$(".backButton")

setListener();

});