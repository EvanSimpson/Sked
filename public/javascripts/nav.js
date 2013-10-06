$(function(){
	
	$.get('/month/'+moment().month(), function(html){
		$(".main").append(html);
	},'html');
	
});