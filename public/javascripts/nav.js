$(function(){
	
	$.get('/month/'+moment().year()+'/'+moment().month(), function(html){
		$(".main").append(html);
	},'html');

	
	
});