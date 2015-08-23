	$(document).ready(function(){					
					verifyLogin();
					var GET = (window.location.search.substring(1).split('='))
					
					console.log(GET[1])
					
					//quick loader
					$(window).load(function() {
						$("#loader").fadeOut("slow");
					});
					
					getSixPack(); // add the 6 friend to the home page
					
					fillSinglePost( GET[1] )
					
					
					$("#wall").on("keypress","#posts textarea" , function(){ 
						setComment( this )
							
						});
					
					$("#wall").on( "click", "#like", function(){
						toggleLike( this )
						
					});
					
					
					
	});