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
					verifyLogin(); //some pics don't load unless this is both at start and end - todo fix
					
					
					$("#wall").on("keypress","#posts textarea" , function(){ 
							if (event.which == 13 &&  $(this).val() ){
								event.preventDefault();
								console.log( $(this).data().stid );
								console.log( $(this).val() )
								$(this).val(null)
								
							}
						});
					
					$("#wall").on( "click", "#like", function(){
						toggleLike( this )
						
					});
					
	});