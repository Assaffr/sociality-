	$(document).ready(function(){					
					verifyLogin();
					
					//$( "#logout" ).click(logOut);
					
					$("button[name=finishPost]").on( "click", function(){
						publishPost( $("#postContent").val() );
					});	
					
					$offset = -3;
					
					showPosts( $offset );

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