	$(document).ready(function(){
					$("#loginButton").on( "click", function(){
					login( $("input[id=email].login").val(), $("input[id=password].login").val() )
					});	
					$("#registerButton").on( "click", register);	
					$("input[id=re-password]").on( "focusout", matchBothPasswords);	
					$("input[id=email].register").on( "focusout", function(){
							checkEmail( $("input[id=email].register").val() );
						} );
					$("span[id=x]").on( "click", function(){
						$("#errorBox").fadeOut();
					});	

			});