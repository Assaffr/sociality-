	$(document).ready(function(){					
					verifyLogin();
					$("button[name=finishPost]").on( "click", function(){
						publishPost( $("#postContent").val() );
					});	
					
					
					$offset = 0;
					//quick loader
					$(window).load(function() {
						$("#loader").fadeOut("slow");
					});		

					buildMyProfileOrOther( checkIfMyProfile() );
					verifyLogin();
	});