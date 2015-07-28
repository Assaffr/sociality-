$(document).ready(function () {
	$("input[name='friends']").on("click", function(){
		$.ajax({
			url:"api/friends/",
			type:"GET",
			dataType: "JSON",
			success: function ( response ){

				$.each (response , function (key , value) {
				console.log( key , value.user_email );
				})
			}
		});
		
		
	});
	
	
	
	
	
	
	
	
});