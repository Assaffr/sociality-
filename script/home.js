	$(document).ready(function(){					
					verifyLogin();
					$( "#logout" ).click(logOut);
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
	});