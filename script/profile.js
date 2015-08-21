	$(document).ready(function(){					
					verifyLogin();
					$("button[name=finishPost]").on( "click", function(){
						var post_to_id = $("#myDetails").data('id')
						publishPost( $("#postContent").val() );
						console.log(post_to_id)
					});	
					
					
					$offset = -3;
					//quick loader
					$(window).load(function() {
						$("#loader").fadeOut("slow");
					});		

					buildMyProfileOrOther( checkIfMyProfile() );
					
					$("#wall").on( "click", "#view-more span", function(){
						getMoreComments( $(this) );
				});
	});