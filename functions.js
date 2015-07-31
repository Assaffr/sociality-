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
				if (response == 0){
					//error message - add later
					}
				else {
					window.location.href = "home.php";
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
					window.location.href = "index.php";
				}
	});
}


/**
*	publishPost
*
*	publishes a post
*
*	@param (string) (postContent) post content
*	@return (type) (name) none
*/
function publishPost($postContent){
	console.log(login.user_id);
	$.ajax({
			url: "api/post",
			type: "POST",
			dataType: "TEXT",
			data: JSON.stringify({
				user_id: $("#myDetails").attr("data-id"),
				post_content:$postContent}),
			success: function( response ) {
				$("#post").val("");
			}
		});
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
					// we are manually appending html with the right data for each post
					//this uses the dumb html i wrote just as an example, when you have the html+css for proper post
					// i will of course switch to that ;)
					// "posted at" currently presents full datetime, will change to "time ago" when we have that function
					$("#wall").append(
							"<div id='newStatus' class='box'><div id='newStatus_head' class='divHead'><img src='pics/user.png' alt='Me'><span class='fullName'>"+ value.user_firstname + " " + value.user_lastname + " posted at " + value.post_created +"</span></div><div id='newStatus_content'>"+ value.post_content +"</div></div>"
					);
				} )
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
	$.ajax({
		url: "api/postmore",
		type: "GET",
		dataType: "JSON",
		success: function( response ) {
			$.each( response, function(key, value){
				$( "#loadMorePosts" ).remove();
				$("#wall").append(
						"<div id='newStatus' class='box'><div id='newStatus_head' class='divHead'><img src='pics/user.png' alt='Me'><span class='fullName'>"+ value.user_firstname + " " + value.user_lastname + " posted at " + value.post_created +"</span></div><div id='newStatus_content'>"+ value.post_content +"</div></div>"
				);
			} )
			$("#wall").append(
						" <br> <input type='button' value='Load More Posts' id='loadMorePosts'>"
				);
			$("#loadMorePosts").on("click", loadMorePosts);
		}
	});
}