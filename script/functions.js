//explains function//
/**
*	Function name
*
*	what the function does
*
*	@param (type) (name) about this param
*	@return (type) (name)
*/



//INDEX PAGE//

/**
 *	login
 *
 *	when you click the login button, the email and password you typed are sent to the server to match it with the DB
 *	if there's a match, we'll get the user ID back and be transported to the homepage.
 *	otherwise, we'll get a 0 and the user will get a message seeing that the login failed.
 *	@param (type) (name) about this param - none
 *	@return (type) (name) - none
 */
function login($email, $password){
	$.ajax({
			url: "api/login",
			type: "POST",
			dataType: "TEXT",
			data: JSON.stringify({
				email: $email,
				password: $password}),
			success: function( response ) {
				if (response == 1){
					window.location.href = "home.php";
					}
				else {
					$("#login #errorReg").html("Incorrect details.");
					$("#login #errorBox").fadeIn();
				}
			}
		});
}




/**
*	checkEmail
*
*	checks that the email the user typed in is both available and validated with regex as a valid email address
*	it lets the user know if it's either taken or not valid, but if it is, it adds the class 'validated'
*	which allows us to make sure everything email wise is good when we'll finish the registration
*	but if you focusout the email input again, the class is removed to ensure nobody messes with it after it's been validated
*
*	@param (string) ($email) the email the user typed in
*	@return (type) (name)
*/
function checkEmail($email){
$("input[id=email].register").removeClass("validated");
$("span[id=emailExplain]").html("");
if ( !$("input[id=email].register").hasClass("validated") && !$email == ""){
		if ( emailRegex( $email ) ){
			$("#errorBox").fadeOut();
			$.ajax({
				url: "api/checkemail",
				type: "POST",
				dataType: "TEXT",
				data: $email,
				complete: function( response ){
					if (response.responseText == 0){
						$("input[id=email].register").addClass("validated");
						$("#errorBox").fadeOut();
					}
					if (response.responseText == 1){
						$("#errorReg").html("This email is unavailable.");
						$("#errorBox").fadeIn();
						
					}
					}					
				});
		} else {
			$("#errorReg").html("Please enter a valid email");
			$("#errorBox").fadeIn();
		}
}
}
/**
 *	emailRegex
 *
 *	runs a regex pattern test on the email the user sent to ensure it's a real email address (or...close... ;))
 *
 *	@param (string) (email) the email the user typed in
 *	@return (string) (pattern.test($email)) boolean on whether or not it passed
 */
function emailRegex($email){
	var pattern =  new RegExp("[a-z0-9._%+-]+@+[a-z0-9._%+-]+.[a-z._%+-]");
	return pattern.test($email);
}

/**
*	matchBothPasswords
*
*	makes sure the password field and the re-enter password fields match
*
*	@param (type) (name) about this param - none
*	@return (boolean) (true)
*	@return (boolean) (false)
*/
function matchBothPasswords(){
	if ( $("input[id=password].register").val() == $("input[id=re-password]").val() ){
		$("#errorBox").fadeOut();
		return true; }
	else {
		$("#errorReg").html("Please make sure both passwords match");
		$("#errorBox").fadeIn();
		return false;
	}
}
/**
 *	checkNoEmpty
 *
 *	checks that no register input field isn't empty.
 *	if one is it adds a failure text and returns false, otherwise returns true.
 *
 *	@param (type) (name) about this param - none
 *	@return (boolean) (false) one or both fields are empty
 *	@return (boolean) (true) both fields are filled
 */
function checkNoEmpty(){
	if ( !$("input[class=register]").val() ){
		$("#errorReg").html("Please make sure you've filled all fields.");
		$("#errorBox").fadeIn();
		return false;
		}
	else
		return true;

}
/**
 *	register
 *
 *	first it checks the email is validated, both passwords match and that no field is empty
 *	then it sends an ajax request that registers the user. but if we got a false in response
 *	it means the db couldn't insert the user, and then we get an error the user sees.
 *	if the response is yes the registration worked and we log the new user in.
 *	@param (type) (name) about this param - none
 *	@return (type) (name) - none
 */
function register(){
	if ( checkNoEmpty() && matchBothPasswords() && $("input[id=email].register").hasClass("validated") ) {
		$.ajax({
			url: "api/user",
			type: "POST",
			dataType: "JSON",
			data: JSON.stringify({
				user_firstname:$("input[id=first_name].register").val(),
				user_lastname:$("input[id=last_name].register").val(),
				user_email:$("input[id=email].register").val(),
				user_password:$("input[id=password].register").val()}),
			success: function( response ) {
				if (response === 1){
					login( $("input[id=email].register").val(), $("input[id=password].register").val() );
				}
				else 
					$("#errorReg").html("Oops! We couldn't register you.");
					$("#errorBox").fadeIn();
			}
		});
	}
	else {
		$("#errorReg").html("Please make sure all fields are correct.");
		$("#errorBox").fadeIn();
	}
}

//REGULAR PAGE//

 /**
 *	verifyLogin
 *
 *	sends an ajax request which sends a json encoded version of the $_SESSION array
 *	when it verifies there is, it builds an object called login
 *	which has a verification the user is logged in and also stores the user id.
 *	if the user isn't logged in, it kicks them out to the index page.
 *	@param (type) (name) about this param - none
 *	@return (type) (name)- none
 */
function verifyLogin(){
	$.ajax({
		url: "api/login/",
		type: "GET",
		dataType: "JSON",
		success: function(response) {
				if (!response.login)
					window.location.href = "index.php";
				$("span[class=firstname]").html(response.user_firstname);
				$("span[id=email]").html(response.user_email);
				$("#numFriends").html(response.num_friends);
				$("span[class=fullName]").html(response.user_firstname + " " + response.user_lastname);
				$(".profile-photo").attr("src", "user-pics/" + response.user_profile_picture );
				$("#cover_photo img").attr("src", "cover-pics/" + response.user_secret_picture );
				$("#myDetails").attr("data-id", response.user_id);
			}
		});
}
/**
 *	logOut()
 *
 *	sends an ajax request that destroys the session
 *
 *	@param (type) (name) about this param - none
 *	@return (type) (name) - none
 */
function logout() {
	$.ajax({
		url: "api/logout",
		type: "DELETE",
		success: function( response ){
			if ( response )
			window.location.href = "index.php";
			
		}	
	});
}

/**
 *	checkAmILoggedIn
 *
 *	sends an ajax request that checks if the user is logged in
 *
 *	@param (type) (name) about this param - none
 *	@return (type) (name) - none
 */
function checkAmILoggedIn(){
	$.ajax({
		url: "api/login/",
		type: "GET",
		dataType: "JSON",
		success: function(response) {
				if (response.login)
					window.location.href = "home.php";
			}
		});
}




/**
*	publishPost
*
*	publishes a post
*	if content is empty - does nothing!!!
* 	^ALSO WORKS SERVER-SIDE
*	@param (string) (postContent) post content
*	@return (type) (name) none
*/
function publishPost  ( $postContent, $postTo ){
	if ( $postContent ) {
		$.ajax({
				url: "api/post",
				type: "POST",
				dataType: "TEXT",
				data: JSON.stringify({
					post_content:$postContent,
					post_to_friend_id:$postTo }),
				success: function( response ) {
					if( response ){
						$("<div id='status-id_"+response+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='"+$("#myBar_content img").attr("src")+"'><div><a href='profile.php'>"+ $("span[class=fullName]").text() +"</a><br><span class='postSince'>Just Now</span></div></div><div id='status_content'><p>"+ $postContent +"</p></div><div id='status_footer'>" +
								"<div class='comments-head'><span id='like' data-id='"+response+"' class='like'>Like</span>-<span>Comments</span><div id='the-likes'></div></div>" +
								"<div id='comments'></div><img alt='me' src='"+$("#myBar_content img").attr("src")+"'><textarea placeholder='Leave a comment...' data-stid='"+response+"'></textarea></div></div>").prependTo("#posts").hide().fadeIn();
						$("#postContent").val("");
					}
					
				}
		});
	}
}
/**
*	showPosts
*
*	shows posts
*
*	@param
*	@return (type) (name) none
*/
function showPosts(){
	$offset+= 3;
	$.ajax({
			url: "api/post/" + $offset,
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				if ( response ){
					
					
					var user_id = $("#myDetails").data().id;
					
					$.each( response, function(key, value){
						
						var num_comments = value.comments.num_comments;
						
						//Builds the post
						$( "#loadMorePosts" ).remove();
						//$("#wall br").remove();
						$("<div id=status-id_"+value.post_id+" class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='user-pics/"+ value.user_profile_picture +"'><div><a href='profile.php?id="+ value.user_id +"'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_time_ago +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'>" +
							"<div class='comments-head'><span id='like' data-id='"+value.post_id+"' class='like'>Like</span>-<span>Comments</span><div id='the-likes'></div></div>" +
							"<div id='comments'></div><div id='comment-area'><img alt='me' class='profile-photo'><textarea placeholder='Leave a comment...' data-stid='"+value.post_id+"'></textarea></div></div></div>").appendTo("#posts").hide().fadeIn();
						
						
						// chack if *I* liked and append(...) if true
						
						$.each( value.likes, function(key, like){
							if ( like.user_id  == user_id ){
								$("#status-id_"+like.post_id+" #like").html("Unlike").removeClass("like").addClass("unlike");
								$("<img src='pics/like_n.png' class='my-like'>").appendTo( $("#status-id_"+like.post_id+" #the-likes") )
							}

							
						});
						var counter = 0;
						// the likes append
							$.each( value.likes, function(key, like){
								
								if (like.user_id == user_id){
									
								$("<img src='user-pics/"+like.user_profile_picture+"' title='"+like.user_firstname +" " +like.user_lastname+"' class='my-like'>").appendTo("#status-id_"+value.post_id+" #the-likes");
								}else{
								$("<img src='user-pics/"+like.user_profile_picture+"' title='"+like.user_firstname +" " +like.user_lastname+"'>").appendTo("#status-id_"+value.post_id+" #the-likes");
								}
							
								counter ++;
								if (like.user_id = user_id)
									
									
								if( counter == 5 )
									return false;
							});
							// The number of likes append
							if ( $(value.likes).size() )
							$("<span>("+$(value.likes).size()+")</span>").appendTo("#status-id_"+value.post_id+" #the-likes");
							
							
							if( value.comments.num_comments > 5 ){
								$("<div id='view-more' class='comments-head'><span data-clicks='0' data-id="+value.post_id+" data-num="+value.comments.num_comments+">View more comments</span></div>").insertAfter("#status-id_"+value.post_id+" .comments-head")
							}
								
							
							// the comment append
							$.each( value.comments.the_comments, function(key, comment){
							$("#status-id_"+value.post_id+" #comments").prepend("<div class='comment' data-comId='"+comment.comment_id+"'><img src='user-pics/"+comment.user_profile_picture+"'>" +
									"<div id='comment-content'>" +
									"<span><a href='profile.php?id="+comment.user_id+"'>"+comment.user_firstname +" "+ comment.user_lastname+"</a></span><br>" +
									"<span>"+comment.comment_content+"</span><br>" +
									"<span>1 Day ago</span>" +
									"</div><div class='C-B'></div></div>");
							});
					});// END EACH POST
					
					
					
				if( response.length < 3 ){
					$( "#loadMorePosts" ).remove();
					$("#wall").append("No more posts!");
					
				}
				else{
				$("#wall").append(
							"<input type='button' value='Load More Posts' id='loadMorePosts'>"
					);
				}
				$("#loadMorePosts").on("click", function(){ showPosts( $offset ) } );
				}
				$(".profile-photo").attr("src", $("#myBar_content img").attr("src") );
			}
		});
}

function getMoreComments( element ){
	
	$post_id = $(element).data().id
	$clicks = ($(element).data().clicks)+1
	$(element).data("clicks", $clicks)
	$offset = 3+(5*($clicks-1))

	$.ajax({
		url:"api/comments/"+$offset+"?post_id="+$post_id,
		type: "GET",
		dataType: "JSON",
		success: function( response ){
			$.each( response, function(key, comment){
				$("#status-id_"+$post_id+" #comments").prepend("<div class='comment' data-comId='"+comment.comment_id+"'><img src='user-pics/"+comment.user_profile_picture+"'>" +
				"<div id='comment-content'>" +
				"<span><a href='profile.php?id="+comment.user_id+"'>"+comment.user_firstname +" "+ comment.user_lastname+"</a></span><br>" +
				"<span>"+comment.comment_content+"</span><br>" +
				"<span>1 Day ago</span>" +
				"</div><div class='C-B'></div></div>");
			})
		}
	})
		if ( ($offset+5) >= $(element).data().num )
			$("#status-id_"+$post_id+" #view-more").fadeOut()
	
}

//NEEDS DOCUMENTATION!!!
function toggleLike ( element ) {
		$.ajax({
			url: "api/like/"+ $( element ).data().id,
			type: "POST",
			dataType: "JSON",
			success: function ( response ){
				if ( response ){
					
					var post_id = $( element ).data().id;
		
		
					$( element ).toggleClass( "unlike" )
					$( element ).toggleClass( "like" )

					
					if ( $(element).hasClass("like") ){
						
						$(element).html("Like")
						
						$("#status-id_"+post_id+" .my-like").fadeOut();
						
					}else if ( $(element).hasClass("unlike") ){
					$( element ).html( "Unlike" );
					$( "#status-id_"+post_id+" #the-likes" ).prepend( $("<img src='pics/like_n.png' class='my-like'>") );
					}
				}
			}
		});
}	
//NEEDS DOCUMENTATION!!!
function setComment ( element, details){
	
	if ( event.which == 13 ){
		
		event.preventDefault();	
		
		if ( $(element).val() ){
			var content = $(element).val();
			
			$.ajax({
				url: "api/comment",
				type: "POST",
				dataType: "JSON",
				data:JSON.stringify({
					post_id: $(element).data().stid, 
					comment_content: content
					 }),
				success: function ( comment_id ){
					if ( comment_id ){
						$("<div class='comment' data-comId='"+comment_id+"'><img src='"+$('.profile-photo').attr('src')+"'>" +
								"<div id='comment-content'>" +
								"<span><a href='profile.php'>"+$('#topBarNav strong').html()+"</a></span><br>" +
								"<span>"+content+"</span><br>" +
								"<span>Just Now</span>" +
								"</div><div class='C-B'></div></div>").appendTo("#status-id_"+$(element).data().stid+" #comments");
					};					
				}
			})
			$(element).val(null)
		}
	}	
	
	
}


/**
*	getSixPack
*
*	Adds six random friends to home page
*
*	@param (type) (name) about this param - none
*	@return (type) (name)- none
*/
function getSixPack() {
	
	$.ajax({
		url: "api/friends/rndSix",
		type: "GET",
		dataType: "JSON",
		success: function ( sixPack ){
			$.each( sixPack, function(key, v){
			$('<div class="friendPic"><a href="profile.php?id='+v.user_friend_id+'"><img alt="" src="user-pics/'+v.user_profile_picture+'"><span class="friendlabel">'+v.user_firstname + " " + v.user_lastname+'</span></a></div>').appendTo("#myFriends_content");
			});
		}
	});
}

//PROFILE PAGE//
/**
*	checkIfMyProfile
*
*	Checks if you are on your profile or someone else's
*	by splitting the current href and returns it
*	@param (type) (name) about this param - none
*	@return (string) ($url)- the id
*/
function checkIfMyProfile(){
	$path = window.location.href;
	$pathSplit = $path.split("=");
	$url = $pathSplit[1];
	return $url;
	
}


/**
*	buildMyProfileOrOther
*
*	gets url from checkIfMyProfile() and builds profile based on that answer
*
*	@param (string) ($url) the id from checkIfMyProfile
*	@return (type) (name)- none
*/
function buildMyProfileOrOther( $url ){
	if ( typeof($url) == 'string' ){
		buildProfilebyId( $url );
		showPostsbyId( $url );
		getSixPackbyId( $url );
		amIFriendsWithUser( $url );
	}
	if ( typeof($url) == 'undefined' ){
		buildMyProfile();
		showPosts();
		getSixPack();
	}
}

/**
*	buildMyProfile
*
*	builds your own profile
*
*	@param (type) (name) about this param - none
*	@return (type) (name)- none
*/
function buildMyProfile(){
	$.ajax({
		url: "api/profile",
		type:"GET",
		dataType: "JSON",
		success: function ( response ){
			$("span[class=profilePageFullName]").html(response[0].user_firstname + " " + response[0].user_lastname);
			$("#profilePhoto img").attr("src", "user-pics/"+response[0].user_profile_picture );
			$("#coverPhoto img").attr("src", "cover-pics/"+response[0].user_secret_picture );
			$("#writePostProfileTitle").html("Update your status");
			$("#numFriends").html(response[0].user_num_friends);
			$("section:nth-child(1) span:nth-child(2)").html("Israel"); //not in sql ;)
			if ( response[0].user_birthdate )
				$("section:nth-child(2) span:nth-child(2)").html( response[0].user_birthdate );
			else
				$("section:nth-child(2) span:nth-child(2)").html( "No birthday filled" );
			$("section:nth-child(3) span:nth-child(2)").html("<a href='notinsql.com'>Visit Homepage</a>"); //not in sql ;)
			$("section:nth-child(4) span:nth-child(2)").html("<a href='notinsql.com'>Visit Profile</a>"); //not in sql ;)
			if ( response[0].user_about )
				$("section:nth-child(5) span:nth-child(2)").html( response[0].user_about );
			else
				$("section:nth-child(5) span:nth-child(2)").html( "You haven't filled your about yet!" );
		}
		
	});
	
}

/**
*	buildProfilebyId
*
*	builds someone else's profile
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function buildProfilebyId( $id ){
	$.ajax({
		url: "api/profile/" + $id,
		type:"GET",
		dataType: "JSON",
		success: function ( response ){
			$("#myDetails").attr("data-id", response[0].user_id )
			$("span[class=profilePageFullName]").html(response[0].user_firstname + " " + response[0].user_lastname);
			$("#profilePhoto img").attr("src", "user-pics/"+response[0].user_profile_picture );
			$("#coverPhoto img").attr("src", "cover-pics/"+response[0].user_secret_picture );
			$("#writePostProfileTitle").html("Write on " + response[0].user_firstname + "'s wall!");
			$("#numFriends").html(response[0].user_num_friends);
			$("#myBar_content section:nth-child(1) span:nth-child(2)").html("Israel"); //not in sql ;)
			if ( response[0].user_birthdate )
				$("section:nth-child(2) span:nth-child(2)").html( response[0].user_birthdate );
			else
				$("section:nth-child(2) span:nth-child(2)").html( "No birthday filled" );
			$("section:nth-child(3) span:nth-child(2)").html("<a href='notinsql.com'>Visit Homepage</a>"); //not in sql ;)
			$("section:nth-child(4) span:nth-child(2)").html("<a href='notinsql.com'>Visit Profile</a>"); //not in sql ;)
			if ( response[0].user_about )
				$("section:nth-child(5) span:nth-child(2)").html( response[0].user_about );
			else
				$("section:nth-child(5) span:nth-child(2)").html( "No info yet!" );
		}
		
	});
	
}
/**
*	showPostsbyId
*
*	shows posts by id not session id - for someone else's profile page
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name) none
*/
function showPostsbyId($id ){
	$offset+= 3;
	$.ajax({
			url: "api/post/" + $id + "/" + $offset,
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				if ( response ){
					
					
					var user_id = $("#myDetails").data().id;
					
					$.each( response, function(key, value){
						
						var num_comments = value.comments.num_comments;
						
						//Builds the post
						$( "#loadMorePosts" ).remove();
						
						$("<div id=status-id_"+value.post_id+" class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='user-pics/"+ value.user_profile_picture +"'><div><a href='profile.php?id="+ value.user_id +"'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_time_ago +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'>" +
							"<div class='comments-head'><span id='like' data-id='"+value.post_id+"' class='like'>Like</span>-<span>Comments</span><div id='the-likes'></div></div>" +
							"<div id='comments'></div><div id='comment-area'><img alt='me' class='profile-photo'><textarea placeholder='Leave a comment...' data-stid='"+value.post_id+"'></textarea></div></div></div>").appendTo("#posts").hide().fadeIn();
						
						
						// chack if *I* liked and append(...) if true
						
						$.each( value.likes, function(key, like){
							if ( like.user_id  == user_id ){
								$("#status-id_"+like.post_id+" #like").html("Unlike").removeClass("like").addClass("unlike");
								$("<img src='pics/like_n.png' class='my-like'>").appendTo( $("#status-id_"+like.post_id+" #the-likes") )
							}

							
						});
						var counter = 0;
						// the likes append
							$.each( value.likes, function(key, like){
								
								if (like.user_id == user_id){
									
								$("<img src='user-pics/"+like.user_profile_picture+"' title='"+like.user_firstname +" " +like.user_lastname+"' class='my-like'>").appendTo("#status-id_"+value.post_id+" #the-likes");
								}else{
								$("<img src='user-pics/"+like.user_profile_picture+"' title='"+like.user_firstname +" " +like.user_lastname+"'>").appendTo("#status-id_"+value.post_id+" #the-likes");
								}
							
								counter ++;
								if (like.user_id = user_id)
									
									
								if( counter == 5 )
									return false;
							});
							// The number of likes append
							if ( $(value.likes).size() )
							$("<span>("+$(value.likes).size()+")</span>").appendTo("#status-id_"+value.post_id+" #the-likes");
							
							
							if( value.comments.num_comments > 5 ){
								$("<div id='view-more' class='comments-head'><span data-clicks='0' data-id="+value.post_id+" data-num="+value.comments.num_comments+">View more comments</span></div>").insertAfter("#status-id_"+value.post_id+" .comments-head")
							}
								
							
							// the comment append
							$.each( value.comments.the_comments, function(key, comment){
							$("#status-id_"+value.post_id+" #comments").prepend("<div class='comment' data-comId='"+comment.comment_id+"'><img src='user-pics/"+comment.user_profile_picture+"'>" +
									"<div id='comment-content'>" +
									"<span><a href='profile.php?id="+comment.user_id+"'>"+comment.user_firstname +" "+ comment.user_lastname+"</a></span><br>" +
									"<span>"+comment.comment_content+"</span><br>" +
									"<span>1 Day ago</span>" +
									"</div><div class='C-B'></div></div>");
							});
					});// END EACH POST
					
					
					
				if( response.length < 3 ){
					$( "#loadMorePosts" ).remove();
					$("#wall").append("No more posts!");
					
				}
				else{
				$("#wall").append(
							"<input type='button' value='Load More Posts' id='loadMorePosts'>"
					);
				}
				$("#loadMorePosts").on("click", function(){ showPosts( $offset ) } );
				}
				$(".profile-photo").attr("src", $("#myBar_content img").attr("src") );
			}
		});
}


/**
*	getSixPackbyId
*
*	Adds six random friends to someone's profile by id
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function getSixPackbyId( $id ) {
	$.ajax({
		url: "api/friends/rndSix/" + $id,
		type: "GET",
		dataType: "JSON",
		success: function ( sixPack ){
			$.each( sixPack, function(key, v){
			$('<div class="friendPic"><a href="profile.php?id='+v.user_friend_id+'"><img alt="" src="user-pics/'+v.user_profile_picture+'"><span class="friendlabel">'+v.user_firstname + " " + v.user_lastname+'</span></a></div>').appendTo("#myFriends_content");
			});
		}
	});
}


/**
*	amIFriendsWithUser
*
*	checks your friend/block status with another user - also checks if you're on your own profile
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function amIFriendsWithUser( $id ){
	$.ajax({
		url: "api/checkfriendstatus/" + $id,
		type:"GET",
		dataType: "JSON",
		success: function ( response ){
			if ( response == 0 ){
				$("#coverBottomLine").append("<span id='friendStatus'><a onclick='sendFriendRequest("+ $id +");'><img class='friend-button' src='pics/addfriend.png'></a></span>");
			}
			if ( response == 1 ){
				$("#coverBottomLine").append("<span id='friendStatus'><a onclick='unFriend("+ $id +");'><img class='friend-button' src='pics/unfriend.png'></a></span");
			}
			if ( response.iSent == 1 ){
				$("#coverBottomLine").append("<span id='friendStatus'> - Friend request sent </span>");
			}
			if ( response.theySent == 1 ){
				$("#coverBottomLine").append("<span id='friendStatus'> sent you a friend request! <a onclick='acceptFriendRequest("+ $id +");'>Accept</a> / <a onclick='rejectFriendRequest("+ $id +");'>Reject</a> </span>");
			}
			if ( response.iBlocked == 1 ){
				$("#coverBottomLine").append("<span id='friendStatus'> - You have blocked this user. </span>");
			}
			if ( response.isMe == 1 ){
				window.location.href = "profile.php";
			}			
			
		}
		
	});
}

/**
*	acceptFriendRequest
*
*	accept a friend request someone sent you
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function acceptFriendRequest( $id ){
	$.ajax({
		url: "api/acceptfriendrequest",
		data: $id + "",
		type:"POST",
		dataType: "JSON",
		success: function ( response ){
			if ( response == 1 ){
				$("#friendStatus").html("<a onclick='unFriend("+ $id +");'><img class='friend-button' src='pics/unfriend.png'></a>");
			}
			if ( response == 0 ){
				$("#friendStatus").html(" Oops! Something went wrong, refresh the page and try again");
			}
			}
		});
		
}
/**
*	rejectFriendRequest
*
*	reject a friend request someone sent you
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function rejectFriendRequest( $id ){
	$.ajax({
		url: "api/rejecttfriendrequest",
		data: $id + "",
		type:"DELETE",
		dataType: "JSON",
		success: function ( response ){
			if ( response == 1 ){
				$("#friendStatus").html(" You have rejected the friend request.");
			}
			if ( response == 0 ){
				$("#friendStatus").html(" Oops! Something went wrong, refresh the page and try again");
			}
			}
		});
}

/**
*	unFriend
*
*	unfriend a friend
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function unFriend( $id ){
	$.ajax({
		url: "api/unfriend",
		data: $id + "",
		type:"DELETE",
		dataType: "JSON",
		success: function ( response ){
			if ( response == 1 ){
				$("#friendStatus").html("<a onclick='sendFriendRequest("+ $id +");'><img class='friend-button' src='pics/addfriend.png'></a>");
			}
			if ( response == 0 ){
				$("#friendStatus").html(" Oops! Something went wrong, refresh the page and try again");
			}
			}
		});
}

/**
*	sendFriendRequest
*
*	send a friend request to someone you are not friends with and who hasn't blocked you
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name)- none
*/
function sendFriendRequest( $id ){
	$.ajax({
		url: "api/sendfriendrequest",
		data: $id + "",
		type:"POST",
		dataType: "JSON",
		success: function ( response ){
			if ( response == 1 ){
				$("#friendStatus").html(" - Friend request sent");
			}
			if ( response == 0 ){
				$("#friendStatus").html(" Oops! Something went wrong, refresh the page and try again");
			}
		}
		
	});
	
}
//ACCOUNT PAGE//
/**
*	validateUserInfo
*
*	makes sure the first and last name updated in the account page pass the regex in UserNameRegex
*
*	@param (type) (name) - none
*	@return (boolean) (true)- if they both pass
*	@return (boolean) (false)- if one or both fail
*/
function validateUserInfo(){
	if ( UserNameRegex( $("input[name=firstName]").val() ) && UserNameRegex( $("input[name=lastName]").val() ) )
		return true;
	return false;

<<<<<<< HEAD:script/functions.js
}

/**
*	UserNameRegex
*
*	regex for the first and last names in the account page - only letters, more than 3 characters
*
*	@param (string) (string) - name being tested
*	@return (boolean) (pattern.test)- result of regex test
*/
function UserNameRegex(string){
	var pattern =  new RegExp("^[a-zA-Z]{3,}$");
	return pattern.test(string);
}

/**
*	putUserInfo
*
*	gets the user info and puts it in the account page
*
*	@param (type) (name) about this param - none
*	@return (type) (name)- none
*/
function putUserInfo(){
	
	$.ajax({
		url: "api/userInfo",
		type:"GET",
		dataType: "JSON",
		success: function ( R ){
			$("input[name=firstName]").val(R.user_firstname);
			$("input[name=lastName]").val(R.user_lastname);
			$("input[name=email]").val(R.user_email);
			$("input[name=bornDate]").val(R.user_birthdate);
			$("#aboutMe").val(R.user_about);
			$("#secretAbout").val(R.user_secret_about);
=======
					
					if ( $(element).hasClass("like") ){
						
						$(element).html("Like")
						
						$("#status-id_"+post_id+" .my-like").fadeOut();
						
					}else if ( $(element).hasClass("unlike") ){
					$( element ).html( "Unlike" );
					$( "#status-id_"+post_id+" #the-likes" ).prepend( $("<img src='pics/like_n.png' class='my-like'>") );
					}
				}
			}
		});
}	
//NEEDS DOCUMENTATION!!!
function setComment ( element, details){
	
	if ( event.which == 13 ){
		
		event.preventDefault();	
		
		if ( $(element).val() ){
			var content = $(element).val();
			
			$.ajax({
				url: "api/comment",
				type: "POST",
				dataType: "JSON",
				data:JSON.stringify({
					post_id: $(element).data().stid, 
					comment_content: content
					 }),
				success: function ( comment_id ){
					if ( comment_id ){
						console.log( content )
						console.log( $(element).data().stid )
						$("<div class='comment' data-comId='"+comment_id+"'><img src='"+$('.profile-photo').attr('src')+"'>" +
								"<div id='comment-content'>" +
								"<span><a href='profile.php'>"+$('#topBarNav strong').html()+"</a></span><br>" +
								"<span>"+content+"</span><br>" +
								"<span>Just Now</span>" +
								"</div><div class='C-B'></div></div>").appendTo("#status-id_"+$(element).data().stid+" #comments");
					};					
				}
			})
			$(element).val(null)
>>>>>>> origin/master:functions.js
		}
		
	});
	
}


/**
*	sendMyDetails
*
*	sends the new user info from the account page
*
*	@param (type) (name) about this param - none
*	@return (type) (name)- none
*/
function sendMyDetails(){
	
	$.ajax({
		url:"api/user",
		type:"PUT",
		dataType: "JSON",
		data:JSON.stringify({
			 user_firstname:$("input[name=firstName]").val(),
			 user_lastname:$("input[name=lastName]").val(),
			 user_email:$("input[name=email]").val(),
			 user_about:$("#aboutMe").val(),
			 user_secret_about:$("#secretAbout").val(),
			 user_birthdate:$("input[name=bornDate]").val()
				}),
		success: function (){
			$("strong[class=fullName]").html( $("input[name=firstName]").val() + " " + $("input[name=lastName]").val() );
		}
		
	
	});
}



//IMAGE PAGE//
/**
*	uploadProfileImage
*
*	upload a profile image - works via ajax and form data.
*
*	@param (type) (name)- none
*	@return (type) (name)- none
*/
function uploadProfileImage(){
	event.preventDefault();
	var fd = new FormData();
	var input = $("#profileImageFile")[0];
	var file = input.files[0];
	fd.append("pic", file);
	$.ajax({
		url: "api/upload/profile",
		processData: false,
		contentType: false,
		type: "POST",
		data: fd,
		success: function( response ) {
			if (!response == "0"){
				$(".profile-photo").attr("src", "user-pics/" + response );
			}
			else
				$(".pic_field").html("Oops! Something went wrong, try refreshing the page.");
		}
	})
}

/**
*	uploadCoverImage
*
*	upload a cover image - works via ajax and form data.
*
*	@param (type) (name)- none
*	@return (type) (name)- none
*/
function uploadCoverImage(){
	event.preventDefault();
	var fd = new FormData();
	var input = $("#coverImageFile")[0];
	var file = input.files[0];
	fd.append("cover", file);
	$.ajax({
		url: "api/upload/cover",
		processData: false,
		contentType: false,
		type: "POST",
		data: fd,
		success: function( response ) {
			if (!response == "0"){
				$("#cover_photo img").attr("src", "cover-pics/" + response );
			}
			else
				$(".pic_field").html("Oops! Something went wrong, try refreshing the page.");
		}
	})
}


//NEEDS DOCUMENTATION!!!
$(document).ready(function(){
	$("#logout").on("click", function(){
		logout();
		
		
	})

});

	


/**
*	ucFirst
*
*	make the first letter to Uppercase
*
*	@param (string) (string) about this param
*	@return (string) (name)
*/

function ucFirst (string){
	return string[0].toUpperCase() + string.slice(1);
}
	

