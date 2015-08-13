//explains function//
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
					alert("WRONG!");
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
					console.log(response);
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
				$("span[class=fullName]").html(response.user_firstname + " " + response.user_lastname);
				$(".profile-photo").attr("src", "user-pics/"+response.user_profile_picture );
				$("#myDetails").attr("data-id", response.userID);
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
function logOut(){
	$.ajax({
			url: "api/logout",
			type: "GET"
				
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
function publishPost($postContent){
	if ( $postContent ) {
		$.ajax({
				url: "api/post",
				type: "POST",
				dataType: "TEXT",
				data: JSON.stringify({
					post_content:$postContent}),
				success: function( response ) {
					if( response ){
						$("<div id='status' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='"+$("#myBar_content img").attr("src")+"'><div><a href='profile/id'>"+ $("span[class=fullName]").text() +"</a><br><span class='postSince'>Just Now</span></div></div><div id='status_content'><p>"+ $postContent +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me' src='"+$("#myBar_content img").attr("src")+"'><textarea placeholder='Leave a comment...'></textarea></div></div>").prependTo("#posts").hide().fadeIn();
						$("#postContent").val("");
					}
					
				}
		});
	}
}
/**
*	showFirstPosts
*
*	shows the first posts that will be on the page without clicking load more
*
*	@param
*	@return (type) (name) none
*/
function showFirstPosts(){
	$.ajax({
			url: "api/post",
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				$.each( response, function(key, value){
					$("<div id='"+value.post_id+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='user-pics/"+ value.user_profile_picture +"'><div><a href='profile.php?id="+ value.user_id +"'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_created +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me' class='profile-photo'><textarea placeholder='Leave a comment...'></textarea></div></div>").appendTo("#posts").hide().fadeIn();
				} );
				$("#wall").append(
							" <br> <input type='button' value='Load More Posts' id='loadMorePosts'>"
					);
				$("#loadMorePosts").on("click", loadMorePosts);
			}
		});
}

/**
*	loadMorePosts
*
*	inserts more posts into page
*
*	@param
*	@return (type) (name) none
*/
function loadMorePosts(){ 
	$offset+= 3;
	$.ajax({
		url: "api/postmore/" + $offset,
		type: "GET",
		dataType: "JSON",
		success: function( response ) {
			if ( response ){
				$.each( response, function(key, value){
					$( "#loadMorePosts" ).remove();
					$("<div id='"+value.post_id+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='user-pics/"+ value.user_profile_picture +"'><div><a href='profile.php?id="+ value.user_id +"'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_created +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me' class='profile-photo' src='"+ $("#status_footer img").attr("src") +"'><textarea placeholder='Leave a comment...'></textarea></div></div>").appendTo("#posts").hide().fadeIn();
				} );
				if( response.length < 3 ){
					$( "#loadMorePosts" ).remove();
					$("#wall").append("<br> No more posts!");
					
				}
				else{
					$("#wall").append(" <br> <input type='button' value='Load More Posts' id='loadMorePosts'>");
				}
				$("#loadMorePosts").on("click", loadMorePosts);
			}
			else{
				$( "#loadMorePosts" ).remove();
				$("#wall").append("<br> No more posts!");
			}
		}
	});
}

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
			console.log(R.user_email)
		}
		
	});
	
}


//Checks if you are on your profile or someone else's
//by splitting the current href and returns it
function checkIfMyProfile(){
	$path = window.location.href;
	$pathSplit = $path.split("=");
	$url = $pathSplit[1];
	return $url;
	
}

//gets url from checkIfMyProfile() and builds profile based on that answer
function buildMyProfileOrOther( $url ){
	if ( typeof($url) == 'string' ){
		buildProfilebyId( $url );
		showFirstPostsById( $url );
		getSixPackbyId( $url );
		amIFriendsWithUser( $url );
	}
	if ( typeof($url) == 'undefined' ){
		buildMyProfile();
		showFirstPosts();
		getSixPack();
	}
}

//builds your own profile
function buildMyProfile(){
	$.ajax({
		url: "api/profile",
		type:"GET",
		dataType: "JSON",
		success: function ( response ){
			$("span[id=profilePageFullName]").html(response[0].user_firstname + " " + response[0].user_lastname);
			$("#profilePhoto img").attr("src", "user-pics/"+response[0].user_profile_picture );
			$("#coverPhoto img").attr("src", "cover-pics/"+response[0].user_secret_picture );
			$("#writePostProfileTitle").html("Update your status");
			$("#numFriends").html(response[0].user_num_friends);
		}
		
	});
	
}

//builds someone else's profile
function buildProfilebyId( $id ){
	$.ajax({
		url: "api/profile/" + $id,
		type:"GET",
		dataType: "JSON",
		success: function ( response ){
			$("span[id=profilePageFullName]").html(response[0].user_firstname + " " + response[0].user_lastname);
			$("#profilePhoto img").attr("src", "user-pics/"+response[0].user_profile_picture );
			$("#coverPhoto img").attr("src", "cover-pics/"+response[0].user_secret_picture );
			$("#writePostProfileTitle").html("Write on " + response[0].user_firstname + "'s wall!");
			$("#numFriends").html(response[0].user_num_friends);
		}
		
	});
	
}


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
		success: function ( ){}
		
	
	});
}

/**
*	showFirstPosts
*
*	shows the first posts that will be on the page without clicking load more
*	based on user id and not that of current user
*
*	@param
*	@return (type) (name) none
*/
function showFirstPostsById( $id ){
	$.ajax({
			url: "api/post/" + $id,
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				$.each( response, function(key, value){
					$("<div id='"+value.post_id+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='user-pics/"+ value.user_profile_picture +"'><div><a href='profile.php?id="+ value.user_id +"'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_created +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me' class='profile-photo'><textarea placeholder='Leave a comment...'></textarea></div></div>").appendTo("#posts").hide().fadeIn();
				} );
				$("#wall").append(
							" <br> <input type='button' value='Load More Posts' id='loadMorePosts'>"
					);
				$("#loadMorePosts").on("click", function(){
					loadMorePostsbyId( $id );
				});
			}
		});
}

/**
*	loadMorePostsbyId
*
*	inserts more posts into page, based on user id and not that of current user
*
*	@param
*	@return (type) (name) none
*/
function loadMorePostsbyId( $id ){ 
	$offset+= 3;
	$.ajax({
		url: "api/postmore/" + $id + "/" + $offset,
		type: "GET",
		dataType: "JSON",
		success: function( response ) {
			if ( response ){
				$.each( response, function(key, value){
					$( "#loadMorePosts" ).remove();
					$("<div id='"+value.post_id+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer' src='user-pics/"+ value.user_profile_picture +"'><div><a href='profile.php?id="+ value.user_id +"'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_created +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me' src='"+ $("#status_footer img").attr("src") +"'><textarea placeholder='Leave a comment...'></textarea></div></div>").appendTo("#posts").hide().fadeIn();
				} );
				if( response.length < 3 ){
					$( "#loadMorePosts" ).remove();
					$("#wall").append("<br> No more posts!");
					
				}
				else{
					$("#wall").append(" <br> <input type='button' value='Load More Posts' id='loadMorePosts'>");
				}
				$("#loadMorePosts").on("click", function(){
					loadMorePostsbyId( $id );
				});
			}
			else{
				$( "#loadMorePosts" ).remove();
				$("#wall").append("<br> No more posts!");
			}
		}
	});
}


//builds six random friends BY ID
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

//checks whether you're friends with a user - creates add/delete friend button according to answer
function amIFriendsWithUser( $id ){
	$.ajax({
		url: "api/checkfriendstatus/" + $id,
		type:"GET",
		dataType: "JSON",
		success: function ( response ){
			console.log(response);
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
		}
		
	});
}

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

//delete the friendship you have with a friend
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

//send a friend request to a user you are not friends with already
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
