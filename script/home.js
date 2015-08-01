	$(document).ready(function(){					
					verifyLogin();
					$( "#logout" ).click(logOut);
					$("button[name=finishPost]").on( "click", function(){
						publishPost(  $("#postContent").val(), login.userID );
					});	
					
					showFirstPosts();
	});