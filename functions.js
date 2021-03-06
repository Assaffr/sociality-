//explains function//
/**
*	name
*
*	does
*
*	@param (type) (name)
*	@return (type) (name)
*/


//are we using this?
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
					$("#errorReg").html("Incorrect details.");
					$("#errorBox").fadeIn();
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
				user_firstname:ucFirst( $("input[id=first_name].register").val() ),
				user_lastname:ucFirst ( $("input[id=last_name].register").val() ),
				user_email:$("input[id=email].register").val(),
				user_password:$("input[id=password].register").val()}),
			success: function( response ) {
				if ( response === 1 ){
					login( $("input[id=email].register").val(), $("input[id=password].register").val() );
				}
				else {
					$("#errorReg").html("Oops! We couldn't register you.");
					$("#errorBox").fadeIn();
				}
			}
		});
	}
	else {
		$("#errorReg").html("Please make sure all fields are correct.");
		$("#errorBox").fadeIn();
	}
}


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
				$(".fullName").attr("data-id", response.user_id);
				if ( response.user_birthdate !== "0000-00-00" && response.user_birthdate !== null){
					$("span[id=dateOfBirth]").html( response.user_birthdate );
					$("span[id=age]").html( " ( " + response.user_age + " ) ");
				}
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
						$("<div id='status-id_"+response+"' class='box status'><div id='Status_head'><strong title='Delete this' data-post_id='"+response+"'>x</strong><img alt='S.writer' src='"+$("#topBarNav img").attr("src")+"'><div><a href='profile.php'>"+ $("strong[class=fullName]").text() +"</a><br><span class='postSince'>Just Now</span></div></div><div id='status_content'><p>"+ $postContent +"</p></div><div id='status_footer'>" +
								"<div class='comments-head'><span id='like' data-id='"+response+"' class='like'>Like</span>-<span>Comments</span><div id='the-likes'></div></div>" +
								"<div id='comments'></div><img alt='me' src='"+$("#topBarNav img").attr("src")+"'><textarea placeholder='Leave a comment...' data-stid='"+response+"'></textarea></div></div>").prependTo("#posts").hide().fadeIn();
						$("#postContent").val("");
					}
					
				}
		});
	}
}

/**
*	postAppender
*
*	creates main div element and content of post
*
*	@param (obj) (post) details of post
*	@return (type) (name) none
*/
function postAppender( post ){
	$("<div id=status-id_"+post.post_id+" class='box status'><div id='Status_head'><img alt='S.writer' src='user-pics/"+ post.user_profile_picture +"'><div><a href='profile.php?id="+ post.user_id +"'>"+ post.user_firstname + " " + post.user_lastname +"</a><br><a href='post.php?post-id="+post.post_id+"'><span class='postSince'>"+ post.post_time_ago +"</span></a></div></div><div id='status_content'><p>"+ post.post_content +"</p></div><div id='status_footer'>" +
			"<div class='comments-head'><span id='like' data-id='"+post.post_id+"' class='like'>Like</span>-<span>Comments</span><div id='the-likes'></div></div>" +
			"<div id='comments'></div><div id='comment-area'><img alt='me' class='profile-photo'><textarea placeholder='Leave a comment...' data-stid='"+post.post_id+"'></textarea></div></div></div>").appendTo("#posts").hide().fadeIn();
}


/**
*	CheckIfIliked
*
*	goes through obj containing all likes in current post and checks if user liked the post.
*	if they did, switches like button to unlike.
*
*	@param (obj) (likes) contains all likes
*	@param (int) (user_id) current user's id
*	@return (type) (name) - none
*/
function CheckIfIliked ( likes, user_id ){
	$.each( likes, function(key, like){
		if ( like.user_id  == user_id ){
			$("#status-id_"+like.post_id+" #like").html("Unlike").removeClass("like").addClass("unlike");
			$("<img src='pics/like_n.png' class='my-like'>").appendTo( $("#status-id_"+like.post_id+" #the-likes") )
		}

	});
}
/**
*	fiveLikesAppend
*
*	puts pictures of the users who liked the post - limited to five by counter.
*
*	@param (obj) (likes) contains all likes
*	@param (int) (user_id) current user's id
*	@return (boolean) (false) stops loop when it reaches five iterations.
*/
function fiveLikesAppend( likes, user_id ){
	
	var counter = 0;
	
	$.each( likes, function(key, like){
		if (like.user_id == user_id){
			
		$("<img src='user-pics/"+like.user_profile_picture+"' title='"+like.user_firstname +" " +like.user_lastname+"' class='my-like'>").appendTo("#status-id_"+like.post_id+" #the-likes");
		}else{
		$("<img src='user-pics/"+like.user_profile_picture+"' title='"+like.user_firstname +" " +like.user_lastname+"'>").appendTo("#status-id_"+like.post_id+" #the-likes");
		}
	
		counter ++;
			
		if( counter >= 5 )
			return false;
	});
}

/**
*	appendEx
*
*	appends the little x button to be able to delete the post.
*	checks to see current user wrote the post or it was written on their wall - otherwise no permission, no button!
*
*	@param (obj) (post) contains the whole post
*	@param (int) (user_id) current user's id
*	@return (boolean) (false) stops the function if first condition occurred.  (if we are on current user's profile)
*/
function appendEx ( post, user_id ){
	
	if( typeof( checkIfMyProfile() ) == 'undefined' ){
		$("#status-id_"+post.post_id+" #Status_head").prepend( "<strong title='Delete this' data-post_id='"+post.post_id+"'>x</strong>" )
		return false;
	}
	
	if ( post.user_id ==  user_id ){
		$("#status-id_"+post.post_id+" #Status_head").prepend( "<strong title='Delete this' data-post_id='"+post.post_id+"'>x</strong>" )
		
	}
	
	
}
/**
*	commentAppender
*
*	appends comment section to each post
*
*	@param (obj) (value) contains comment
*	@return (type) (name) - none
*/
function commentAppender( value ){
	$.each( value.comments.the_comments, function(key, comment){
	$("#status-id_"+value.post_id+" #comments").prepend("<div class='comment' data-comId='"+comment.comment_id+"'><img src='user-pics/"+comment.user_profile_picture+"'>" +
			"<div id='comment-content'>" +
			"<span><a href='profile.php?id="+comment.user_id+"'>"+comment.user_firstname +" "+ comment.user_lastname+"</a></span><br>" +
			"<span>"+comment.comment_content+"</span><br>" +
			"<span>"+ comment.comment_time_ago + " </span>" +
			"</div><div class='C-B'></div></div>");
	});
}


/**
*	fillPosts
*
*	gets response of fillWall function and creates posts
*
*	@param (array of objects) (response) the post/s (depends on many posts we got) it needs to fill the wall with
*	@return (type) (name) -none
*/
function fillPosts( response ){
				
		var user_id = $(".fullName").data("id");
		
		$( "#loadMorePosts" ).remove();
		
		$.each( response, function(key, value){	
			var num_comments = value.comments.num_comments;
			
			//Builds each single post
			postAppender( value ); 
			// chack if *I* liked and append(...) if true
			CheckIfIliked ( value.likes, user_id );
			// Five likes append
			fiveLikesAppend( value.likes, user_id );
			
			appendEx ( value, user_id );

				// The number of likes append
				if ( $(value.likes).size() )
					$("<span>("+$(value.likes).size()+")</span>").appendTo("#status-id_"+value.post_id+" #the-likes");
				
				// adds section of view more comments
				if( value.comments.num_comments > 5 ){
					if( !$("#status-id_"+value.post_id+" #view-more").hasClass("comments-head") )
					$("<div id='view-more' class='comments-head'><span data-clicks='0' data-id="+value.post_id+" data-num="+value.comments.num_comments+">View more comments</span></div>").insertAfter("#status-id_"+value.post_id+" .comments-head")
				}
				
				// the comment append
				commentAppender( value )
		});// END EACH POST
		
		
		
	if( response.length < 3 ){
		$( "#loadMorePosts" ).remove();
		$("#wall").append("<span id='no-more'>No more posts!</span>");
		
	}
	else{
	$("#wall").append(
				"<input type='button' value='Load More Posts' id='loadMorePosts'>"
		);
	}
	$("#loadMorePosts").on("click", function(){ fillWall( $offset ) } );
	}



/**
*	fillWall
*
*	ajax call to get posts with offset
*
*	@param ()
*	@return (type) (name) none
*/
function fillWall( ){
	$offset+= 3;
	$.ajax({
			url: "api/post/" + $offset,
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				
				if ( response )
					fillPosts( response );
					
				$(".profile-photo").attr("src", $("#topBarContent .profile-photo").attr("src") );
			}
		});
}

/**
*	fillSinglePost
*
*	ajax call to single post permalink
*
*	@param (int) (post_id)
*	@return (type) (name) - none
*/
function fillSinglePost( post_id ){
	$.ajax({
			url: "api/singlePost/" + post_id,
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				
				if ( response )
					fillPosts( response );
					
				$(".profile-photo").attr("src", $("#topBarContent .profile-photo").attr("src") );
				$("#view-more").remove()
				$("#no-more").remove()
			}
		});
}

/**
*	getMoreComments
*
*	it gets more comments!
*	sends ajax request with offset and post id
*
*	@param (obj) (element) span which is clicked to load more comments
*	@return (type) (name) none
*/
function getMoreComments( element ){
	
	$post_id = $(element).data("id");
	$clicks = ( $(element).data("clicks") )+1; //checks how many times you clicked the get more comments button
	$(element).data("clicks", $clicks); //puts in dom element number of times you clicked on get more comments
	$com_offset = 3+(5*($clicks-1)); //calculates offset based on number of clicks

	$.ajax({
		url:"api/comments/"+$com_offset+"?post_id="+$post_id,
		type: "GET",
		dataType: "JSON",
		success: function( response ){
			$.each( response, function(key, comment){
				$("#status-id_"+$post_id+" #comments").prepend("<div class='comment' data-comId='"+comment.comment_id+"'><img src='user-pics/"+comment.user_profile_picture+"'>" +
				"<div id='comment-content'>" +
				"<span><a href='profile.php?id="+comment.user_id+"'>"+comment.user_firstname +" "+ comment.user_lastname+"</a></span><br>" +
				"<span>"+comment.comment_content+"</span><br>" +
				"<span>" + comment.comment_time_ago + "</span>" +
				"</div><div class='C-B'></div></div>");
			})
		}
	})
		if ( ($com_offset+5) >= $(element).data("num") )
			$("#status-id_"+$post_id+" #view-more").fadeOut() //if all comments loaded, erase view more button
	
}

/**
*	deletePost
*
*	deletes a post
*
*	@param (obj) (element) x button
*	@return (type) (name) none
*/
function deletePost ( element ){
	
	var post_id = element.data("post_id")
	
	$.ajax({
		url:"api/comment/delete/"+post_id,
		type: "DELETE",
		dataType: "JSON",
		success: function( response ){
			if ( response )
				$("#status-id_"+post_id).fadeOut();
	
		}
	})
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



/**
*	checkIfMyProfile
*
*	Checks if you are on your profile or someone else's or home page
*	by splitting the current href and returns it
*	@param (type) (name) about this param - none
*	@return (boolean) (true)- if we are in the home page
*	@return (string) ($url)- the id
*/
function checkIfMyProfile(){
	$path = window.location.href;
	$pathSplit = $path.split("=");
	$url = $pathSplit[1];
	$pathSplitCheckifHome = $path.split("/");
	if ( $pathSplitCheckifHome[4] == "home.php" ){
		return true;
	}
		
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
			$("#myDetails").attr("data-id", response[0].user_id );
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
			
			showPostsbyId( response[0].user_id)
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

/**
*	showPostsbyId
*
*	shows posts by id not session id - for someone else's profile page
*
*	@param (string) ($id) the id of the profile
*	@return (type) (name) none
*/
function showPostsbyId( $id ){
	$offset+= 3;
	$.ajax({
			url: "api/wall/" + $id + "/" + $offset,
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				
				if ( response )
					fillPosts( response );
				$("#loadMorePosts").on("click", function(){ showPostsbyId( $id ) } );	
				$(".profile-photo").attr("src", $("#topBarContent .profile-photo").attr("src") );
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


/**
*	toggleLike
*
*	sends ajax request to see if there's a like and sets like status depending on answer
*
*	@param (obj) (element) like button
*	@return (type) (name) none
*/
function toggleLike ( element ) {
		$.ajax({
			url: "api/like/"+ $( element ).data("id"),
			type: "POST",
			dataType: "JSON",
			success: function ( response ){
				if ( response ){
					
					var post_id = $( element ).data("id");
		
		
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

/**
*	setComment
*
*	sets a new comment by user pressing enter
*
*	@param (obj) (element) text area for the post's comment section
*	@return (type) (name) none
*/
function setComment ( element ){
	
	if ( event.which == 13 ){
		
		event.preventDefault();	
		
		if ( $(element).val() ){
			var content = $(element).val();
			
			$.ajax({
				url: "api/comment",
				type: "POST",
				dataType: "JSON",
				data:JSON.stringify({
					post_id: $(element).data("stid"), 
					comment_content: content
					 }),
				success: function ( comment_id ){
					if ( comment_id ){
						$("<div class='comment' data-comId='"+comment_id+"'><img src='"+$("#topBarContent .profile-photo").attr('src')+"'>" +
								"<div id='comment-content'>" +
								"<span><a href='profile.php'>"+$('#topBarNav strong').html()+"</a></span><br>" +
								"<span>"+content+"</span><br>" +
								"<span>Just Now</span>" +
								"</div><div class='C-B'></div></div>").appendTo("#status-id_"+$(element).data('stid')+" #comments");
					};					
				}
			})
			$(element).val(null)
		}
	}	
	
	
}
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
			if ( response !== "0" && response !== "imageexists" && response !== "toobig" && response !== "notimage" ){
				$(".profile-photo").attr("src", "user-pics/" + response );
			}
			if (response == "imageexists"){
				$(".pic_field").html("Oops! This image already exists, please try again.");
			}
			if (response == "toobig"){
				$(".pic_field").html("Oops! This image is too big, please try again.");
			}
			if (response == "notimage"){
				$(".pic_field").html("Oops! This is not an image, please try again.");
			}
			if (response == "0")
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
			if ( response !== "0" && response !== "imageexists" && response !== "toobig" && response !== "notimage" ){
				$("#cover_photo img").attr("src", "cover-pics/" + response );
			}
			if (response == "imageexists"){
				$(".pic_field").html("Oops! This image already exists, please try again.");
			}
			if (response == "toobig"){
				$(".pic_field").html("Oops! This image is too big, please try again.");
			}
			if (response == "notimage"){
				$(".pic_field").html("Oops! This is not an image, please try again.");
			}
			if (response == "0")
				$(".pic_field").html("Oops! Something went wrong, try refreshing the page.");
		}
	})
}

/**
*	getAllMyFriends
*
*	sends ajax to get list of friends and appends into friends area of the wall
*
*	@param (type) (name) none
*	@return (type) (name) none
*/
function getAllMyFriends () {
	$.ajax({
		url:'api/friends/all',
		type:"GET",
		dataType: "JSON",
		success: function( response ) {
			
			$("#wall").html("");
			
			$.each( response, function ( key, friend ){
				$("<div class='friend-wrap box' data-id="+friend.user_friend_id+" id='friend-id_"+friend.user_friend_id+"'>" +
						"<img class='unfriend' src='pics/unfriend.PNG' title='Remove friend' class='unfriend'>"+
						"<img class='friend-pic' src='user-pics/"+friend.user_profile_picture+"'>" +
						"<div><a href='profile.php?id="+friend.user_friend_id+"'>"+friend.user_firstname+"&nbsp"+friend.user_lastname+"</a><br>" +
							"<span>We've been friends since  "+friend.friendship_time_ago +" </span></div>" +
						"</div>").appendTo("#wall")
			})
			$(".unfriend").on("click", function(){
				unFriend ( $(this).parent().attr("data-id") ); 
				$(this).parent().fadeOut();
			} );
		}
	})
	getAllMyFriendsRequest ();
}


/**
*	getAllMyFriendsRequest
*
*	sends ajax to get list of friend request and appends into friends area of the wall
*
*	@param (type) (name) none
*	@return (type) (name) none
*/
function getAllMyFriendsRequest () {
	$.ajax({
		url:'api/friends/allRequest',
		type:"GET",
		dataType: "JSON",
		success: function( response ) {
			$.each( response, function ( key, friend ){
				$("<div class='friend-wrap box' data-id="+friend.user_id+" id='friend-id_"+friend.user_id+"'>" +
						"<img class='addFriend' src='pics/addfriend.PNG' title='Add as a friend'>"+
						"<img class='rejectFriend' src='pics/unfriend.PNG' title='Reject request'>"+
						"<img class='friend-pic' src='user-pics/"+friend.user_profile_picture+"'>" +
						"<div><a href='profile.php?id="+friend.user_id+"'>"+friend.user_firstname+"&nbsp"+friend.user_lastname+"</a><br>" +
							"<span>Request was created "+friend.request_time_ago+" </span></div>" +
						"</div>").appendTo("#wall")
			})
			$(".addFriend").on("click", function(){
				acceptFriendRequest ( $(this).parent().attr("data-id") ); 
				$( this ).attr("src", "pics/unfriend.PNG" );
				$( this ).attr("title", "Remove friend" );
				$( this ).addClass(".unfriend");
				$( " #friend-id_"+$(this).parent().attr("data-id")+" .rejectFriend" ).remove();
				$( this ).removeClass(".addFriend");
			} );
			$(".rejectFriend").on("click", function(){
				rejectFriendRequest ( $(this).parent().attr("data-id") ); 
				$(this).parent().fadeOut();
			} );
		}
	})
	
	
}


//we are calling the logout function on each page when you press logout
//this is the only file in common with all pages so we put it here
$(document).ready(function(){
	$("#logout").on("click", function(){
		logout();
		
		
	})

});

	


	

