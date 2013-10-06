$(function(){

	function addWeek(week) {
		$(".grid").append('<div id="week'+week+'" class="week"><div class="day sunday"><div class="date"></div><div class="events"></div></div><div class="day monday"><div class="date"></div><div class="events"></div></div><div class="day tuesday"><div class="date"></div><div class="events"></div></div><div class="day wednesday"><div class="date"></div><div class="events"></div></div><div class="day thursday"><div class="date"></div><div class="events"></div></div><div class="day friday"><div class="date"></div><div class="events"></div></div><div class="day saturday"><div class="date"></div><div class="events"></div></div></div>');
	};

	function placeEvents(year, month, first, last) {		
		$.get('/javascripts/data.json',function(data){
			$(".date").each(function(i,div){
				if (i >= first && i-first+1 <= last){
					var date = moment({"year":year, "month":month, "day":i-first+1}).format("YYYY-MM-DD");
					$(div).text(i-first+1);
					$(div).parent().attr("date", date);
					if(data.events[date] != null){
						data.events[date].forEach(function(evnt){
							$(div).parent().find(".events").append("<div class='event'>"+evnt.title+"</div>");
						});
					}
				}			
			});
		},"json");
	};

	function populate(year, month) {
		$(".grid").html("");
		var first = moment({"year":year, "month":month, "day":1}).day();
		var last = moment({"year":year, "month":month}).daysInMonth();
		console.log(last);
		var week = 0;
		for(var i = 0; i <= Math.floor((first+last-1)/7); i++){
			week++;
			addWeek(week);
		}
		placeEvents(year, month, first, last);
		};


	$(".nav").click(function(evnt){
		var date = moment({year:$("#date").data("year"),month:$("#date").data("month")});
		var method = $(this).attr("id");
		if (method === "next"){
			date = date.add("M", 1);
		}else{
			date = date.subtract("M", 1);
		}
		$.get('/month/'+date.year()+'/'+date.month(), function(html){
			$(".main").html(html);
			populate(date.year(), date.month());
		},"html");
	});


	$(".day").click(function(obj){
	});

	populate($("#date").data("year"), $("#date").data("month"));
	
});