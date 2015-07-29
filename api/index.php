<?php
session_start();

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();
$app = new \Slim\Slim();

require_once dirname( __FILE__ ) . "/../lib/DB.class.php";
require_once dirname( __FILE__ ) . "/../lib/User.class.php";
require_once dirname( __FILE__ ) . "/../lib/Login.class.php";
require_once dirname( __FILE__ ) . "/../lib/Post.class.php";
require_once dirname( __FILE__ ) . "/../lib/friends.class.php";
$user = new User();
$login = new Login();
$post = new Post();
$friends = new Friends();

//UPLOAD PHOTO
$app->post( '/upload', function() {
	global $user, $app;
	$file = explode ( "/", $_FILES["pic"]["type"] );
	echo ( move_uploaded_file($_FILES["pic"]["tmp_name"], "..\uploads\ " . $_FILES["pic"]["name"] . "." . $file[1]) );
		 
});

//LOGIN
$app->post( '/login', function() {
	
	global $login, $app;
	$details = json_decode( $app->request->getBody(), true );
	$result = $login->match( $details['email'], $details['password'] ) ;
	//var_dump($result);
	if (empty($result)){
		$_SESSION['login'] = false;
		echo 0;
	}
	else {
		$_SESSION['login'] = true;
		$_SESSION['userID'] = $result [0]['user_id'];
		echo 1;
	}
	//okay so, if $result is empty it returns 0, otherwise it returns 1, NOT the userID
	//but that one is already in the session, we can change it if you want!!!
	//echo $result [0]['user_id'];
});


$app->get( '/login/', function() {
	global $login, $app;
	echo (json_encode ($_SESSION));
	});

$app->get( '/logout/', function() {
	global $login, $app;
	session_destroy();
	});	
	
$app->get( '/fullname/:id', function() {
	global $user, $app;
	$req = $app->request;
	$path = $req->getResourceUri();
	$id = explode("/", $path)[2];
	$fullName = $user->getUserFullName($id);
	echo ( $fullName );
	});		
	
$app->get( '/getemail/:id', function() {
	global $user, $app;
	$req = $app->request;
	$path = $req->getResourceUri();
	$id = explode("/", $path)[2];
	$fullname = $user->getUserFullName($id);
	echo $fullname;
	});		


//REGISTER PROCESS - check if email exists
$app->post( '/checkemail', function() {
	global $user, $app;
	//echo ($app->request->getBody());
	$result = $user->checkEmailExists( $app->request->getBody() ) ;
	echo $result [0]['COUNT(*)'];
	//var_dump ($us0r->getAllUsers());
});


// Register User
$app->post( '/user/', function() {
	global $user, $app;
	$jsonUser = json_decode( $app->request->getBody(), true );
	$add = $user->addUser($jsonUser);
	/*$boolString = ($add) ? 'true' : 'false'; 						 //wtf?!?!
	$id = $user->getID($jsonUser['email'], $jsonUser['password']);  //wtf?!?!
	$results = array( 												 //wtf?!?!
		"boolean" => $boolString,
		"id" => $id['0']['user_id'],
	);
	print_r(json_encode ($results));*/
	echo $add;
	
});

//Adding user info
$app->post( '/user/:id', function( $id ) {
	global $user, $app;
	$details = json_decode( $app->request->getBody(), true );
	//var_dump (json_decode( $app->request->getBody() ) );
	$add = $user->addUserInfo($details);
	$boolString = ($add) ? 'true' : 'false';
	echo $boolString;
});

//Display All Users:
$app->get( '/user/', function() {
	global $user, $app;
	echo ( json_encode( $user->getAllUsers() ) );
	//var_dump ($user->getAllUsers());
});

//Display specific user
$app->get( '/user/:id', function( $id ) {
	global $user, $app;
	$user = $user->getUser($id);
	echo $user[0]['user_email'];
	//echo ( json_encode($user->getUser($id)) );
});


//Delete User
$app->delete( '/user/:id', function( $id ) {
	global $user, $app;
	$user->deleteUser($id);
});

//Update User
$app->put( '/user/:id', function( $id ) {
	global $user, $app;
	//var_dump($app->request->getBody());
	$jsonUser = json_decode( $app->request->getBody(), true );
	var_dump ($jsonUser);
	$user->updateUser($jsonUser);
});

//publish post
$app->post( '/post/', function() {
	global $post, $app;
	//var_dump($app->request->getBody());
	$jsonDetails = json_decode( $app->request->getBody(), true );
	echo ( $post->publishPost( $jsonDetails ) );
	// $user->updateUser($jsonUser);
});

//show all posts
$app->get( '/post/', function() {
	global $post, $app;
	echo( json_encode ($post->showAllPosts()) );
});

//ASSAF'S FRIEND
$app->get('/friends/:myId/', function ($myId) use ( $friends ) {
    	$users = $friends->getAllfriends($myId);
    	echo json_encode($users);  // this is the response to the http:
    }
);

$app->run();