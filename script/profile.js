	$(document).ready(function(){					
					verifyLogin();
					$( "#logout" ).click(logOut);
					$("button[name=finishPost]").on( "click", function(){
						publishPost( $("#postContent").val() );
					});	
					
					showFirstPosts();
					$offset = 0;
					//quick loader
					$(window).load(function() {
						$("#loader").fadeOut("slow");
					});
					
					getSixPack() // add the 6 friend to the home page
					checkIfMyProfile();
					
	});