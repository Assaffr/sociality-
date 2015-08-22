

$(document).ready( function () {	
	
		verifyLogin();
		putUserInfo();		
					
		$("#myAccount_footer button").on("click", function(){
			if ( validateUserInfo() ){
				sendMyDetails();
				$("#updateInfoError").html("Info updated");
			}
			else
				$("#updateInfoError").html("Please fill name fields properly.");
			
		})
});