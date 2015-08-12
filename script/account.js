

$(document).ready( function () {	
	
		verifyLogin();
		putUserInfo();		
					
		$("#myAccount_footer button").on("click", function(){
			sendMyDetails();
			
		})
});