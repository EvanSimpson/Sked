$(function(){
	
	$.get('/month/'+moment().year()+'/'+moment().month(), function(html){
		$(".main").append(html);
	},'html');

	$(".month-nav>a").click(function(evnt){
		console.log("Nailed it.");
	});
	
});