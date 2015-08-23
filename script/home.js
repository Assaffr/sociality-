	$(document).ready(function(){					
					verifyLogin();
					
					//$( "#logout" ).click(logOut);
					
					$("button[name=finishPost]").on( "click", function(){
						var post_to_id = $("strong.fullName").data('id')
						publishPost( $("#postContent").val(), post_to_id  );
					});	
					
					$offset = -3;
					
					fillWall( $offset );

					//quick loader
					$(window).load(function() {
						$("#loader").fadeOut("slow");
					});
					
					getSixPack(); // add the 6 friend to the home page
					verifyLogin();
					
					
					$("#wall").on("keypress","#posts textarea" , function(){ 
						setComment( this )
							
						});
					
					$("#wall").on( "click", "#like", function(){
						toggleLike( this )
						
					});
					
					
					$("#wall").on( "click", "#view-more span", function(){
							getMoreComments( $(this) );
					});
					
	});