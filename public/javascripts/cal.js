$(function(){

	$.get('/javascripts/data.json',function(data){
		var first = moment().date(1).day();
		var last = moment().daysInMonth();
		$(".date").each(function(i,div){
			if (i >= first && i-first+1 <= last){
				var date = moment().date(i-first+1).format("YYYY-MM-DD");
				$(div).text(i-first+1);
				$(div).parent().attr("date", date);
				if(data.events[date] != null){
					data.events[date].forEach(function(evnt){
						console.log(evnt);
						$(div).parent().find(".events").append("<div class='event'>"+evnt.title+"</div>");
					});
				}
			}			
		});
	},"json");


	$(".nav").click(function(evnt){
		$.get('/month/'++'/'+)
	});


	$(".day").click(function(obj){
		// $.get('',function());
	});
	
	
});