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
					$("span[id=loginFail]").html("Incorrect email or password.");
					}
				else {
					window.location.href = "/socialityplus/home.html";
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
$("input[name=email].register").removeClass("validated");
$("span[id=emailExplain]").html("");
if ( !$("input[name=email].register").hasClass("validated") && !$email == ""){
		if ( emailRegex( $email ) ){
			$.ajax({
				url: "api/checkemail",
				type: "POST",
				dataType: "TEXT",
				data: $email,
				complete: function( response ){
					if (response.responseText == 0){
						$("input[name=email].register").addClass("validated");
						
						//$("span[id=emailExplain]").html("This email is available");
					}
					if (response.responseText == 1){
						$("#errorReg").html("This email is unavailable.");
						$("#errorBox").fadeIn();
						//$("span[id=emailExplain]").html("This email is unavailable, please try again.");
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
	if ( $("input[name=password].register").val() == $("input[name=re-password]").val() ){
		$("span[id=passExplain]").html("");
		return true; }
	else {
		$("span[id=passExplain]").html("Please make sure both password fields match.");
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
	if ( $("input[class=register]").val() === "" ){
		$("#failure").text("Please fill in a valid email and password");
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
	if ( checkNoEmpty() && matchBothPasswords() && $("input[name=email].register").hasClass("validated") ) {
		$.ajax({
			url: "api/user",
			type: "POST",
			dataType: "JSON",
			data: JSON.stringify({
				firstName:$("input[name=first_name].register").val(),
				lastName:$("input[name=last_name].register").val(),
				email:$("input[name=email].register").val(),
				password:$("input[name=password].register").val()}),
			success: function( response ) {
				if (response.boolean){
					login( $("input[name=email].register").val(), $("input[name=password].register").val() );
				}
				else 
					$("#failure").text("Oops! We couldn't register you. Try again with new details.");
			}
		});
	}
	else {
		
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
 *	it also activates the getUserEmail function using the user id.
 *	@param (type) (name) about this param - none
 *	@return (type) (name)- none
 */
function verifyLogin(){
	$.ajax({
		url: "api/login/",
		type: "GET",
		dataType: "JSON",
		success: function(response) {
				login = response;
				delete login['slim.flash'];
				if (!login.login)
					window.location.href = "/socialityplus/index.html";
				getUserFullName(login.userID);
					//$("span[id=loggedEmail]").html(	getUserFullName(login.userID) );
					$("#loader").fadeOut();
					$("#topBar").fadeIn();
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
					window.location.href = "/socialityplus/";
				}
	});
}

/**
*	getUserFullName
*
*	creates a string of the user's full name
*
*	@param (string) (id) the user's id
*	@return (string) (their full name)
*/
function getUserFullName($id){
	
	$.ajax({
			url: "api/fullname/" + $id,
			type: "GET",
			success: function(response) {
					console.log(login);
					$("span[id=full_name]").html(response);
					$("#loader").fadeOut();
					$("#topBar").fadeIn();
				}
			});	
}

/**
 *	getUserEmail
 *
 *	sends an ajax request that gets the user's email using its id
 *	when it has that it fades the loader out and fades in the top bar with the email it got
 *
 *	@param (string) (id) the user id - it gets it from the verifyLogin function 
 *	@return (type) (name)
 */
function getUserEmail($id){
	$.ajax({
			url: "api/getemail/" + $id,
			type: "GET",
			success: function(response) {
					$("span[id=loggedEmail]").html(response);
					$("#loader").fadeOut();
					$("#topBar").fadeIn();
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
function publishPost(postContent){
	$.ajax({
			url: "api/post",
			type: "POST",
			dataType: "TEXT",
			data: JSON.stringify({
				user_id: login.userID,
				post_content: postContent}),
			success: function( response ) {
				$("#post").val("");
			}
		});
}
/**
*	showPosts
*
*	shows all posts
*
*	@param
*	@return (type) (name) none
*/
function showPosts(){
	$.ajax({
			url: "api/post",
			type: "GET",
			dataType: "JSON",
			success: function( response ) {
				console.log( response );
			}
		});
}
