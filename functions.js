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
					//error message TODO
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
				delete response['slim.flash'];
				if (!response.login)
					window.location.href = "index.php";
				$("span[class=firstname]").html(response.user_firstname);
				$("span[id=email]").html(response.user_email);
				$("span[class=fullName]").html(response.user_firstname + " " + response.user_lastname);
				$("#myDetails").attr("data-id", response.userID);
			}
		});
}
/**
 *	logOut()
 *
 *	sends an ajax request that destroys the session and kicks the user to the index page
 *
 *	@param (type) (name) about this param - none
 *	@return (type) (name) - none
 */
function logOut(){
	$.ajax({
			url: "api/logout/",
			type: "GET",
			complete: function(response) {
					
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
					user_id: $("#myDetails").attr("data-id"),
					post_content:$postContent}),
				success: function( response ) {
					if( response ){
						$("<div id='status' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer'><div><a href='profile/id'>"+ $("span[class=fullName]").text() +"</a><br><span class='postSince'>Just Now</span></div></div><div id='status_content'><p>"+ $postContent +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me'><textarea placeholder='Leave a comment...'></textarea></div></div>").prependTo("#posts").hide().fadeIn();
						$("#postContent").val("");
						$("#status img").attr("src", "pics/user.png");
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
					$("<div id='"+value.post_id+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer'><div><a href='profile/id'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_created +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me'><textarea placeholder='Leave a comment...'></textarea></div></div>").appendTo("#posts").hide().fadeIn();
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
					$("<div id='"+value.post_id+"' class='box status'><div id='Status_head'><strong>x</strong><img alt='S.writer'><div><a href='profile/id'>"+ value.user_firstname + " " + value.user_lastname +"</a><br><span class='postSince'>"+ value.post_created +"</span></div></div><div id='status_content'><p>"+ value.post_content +"</p></div><div id='status_footer'><div id='comment'></div><img alt='me'><textarea placeholder='Leave a comment...'></textarea></div></div>").appendTo("#posts").hide().fadeIn();
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

function getSixPack($userId) {
	
	$.ajax({
		url: "api/friends/rndSix/"+$userId,
		type: "GET",
		dataType: "JSON",
		success: function ( sixPack ){
			$.each( sixPack, function(key, v){
				//console.log( v );
			$('<div class="friendPic"><a href="profile.php?id='+v.user_friend_id+'"><img alt="" src="'+v.user_profile_picture+'"><span class="friendlabel">'+v.user_firstname + v.user_lastname+'</span></a></div>').appendTo("#myFriends_content");
			});
		}
		
	});
	
	

}