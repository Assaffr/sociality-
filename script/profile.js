	$(document).ready(function(){					
					verifyLogin();
					$("button[name=finishPost]").on( "click", function(){
						
						var post_to_id = $("#myDetails").data('id')
						
						publishPost( $("#postContent").val(), post_to_id  );
						console.log( $("#postContent").val() )
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
					
					$("#wall").on( "click", "#like", function(){
						toggleLike( this )
						
					});
					
					$("#myFriends_head").on( "click", function(){
						$("#wall").html("")
						
					});
					
					$("#wall").on("keypress","#posts textarea" , function(){ 
						setComment( this )
							
						});
	});