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
	
	//The test here is incorrect try to use this -> http://php.net/manual/en/mysqli-result.num-rows.php
	//ok we need to talk about this cause the REASON i did it like this was because
	//i wanted to get back the userID or nothing, i need to have the id here also
	//do you want me to use another function to fetch the id and have this be with numrows
	//and only return 0 or 1??
	
	if (empty($result)){
		$_SESSION['login'] = false;
		echo 0;
	}
	else {
		$_SESSION['login'] = true;
		$_SESSION['userID'] = $result [0]['user_id'];
		$moreDetails = $login->addUserInfoToSession( $_SESSION['userID'] );
		$_SESSION['user_email'] = $moreDetails[0]['user_email'];
		$_SESSION['user_firstname'] = $moreDetails[0]['user_firstname'];
		$_SESSION['user_lastname'] = $moreDetails[0]['user_lastname'];
		
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
	header('Location: index.php');
	});	
	



//REGISTER PROCESS - check if email exists
$app->post( '/checkemail', function() {
	global $user, $app;
	//echo ($app->request->getBody());
	$result = $user->checkEmailExists( $app->request->getBody() ) ;
	echo $result;
	//var_dump ($us0r->getAllUsers());
});


// Register User
$app->post( '/user/', function() {
	global $user, $app;
	$jsonUser = json_decode( $app->request->getBody(), true );
	$add = $user->addUser($jsonUser);
	echo $add;
	
});

//Adding user info
$app->post( '/user/:id', function( $id ) {
	global $user, $app;
	$details = json_decode( $app->request->getBody(), true );
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
	$jsonDetails = json_decode( $app->request->getBody(), true );
	echo ( $post->publishPost( $jsonDetails ) );
	// $user->updateUser($jsonUser);
});

//show first posts
$app->get( '/post/', function() {
	global $post, $app;
	$posts = $post->showFirstPosts();

	foreach($posts as $value){
		$value['post_created'] = $post->timeAgo($value['post_created']);
		$postsWithTimeAgo[] = $value;
	}
	
	echo ( json_encode ( $postsWithTimeAgo ) );
});

//show more posts
	$app->get( '/postmore/:offset', function($offset) {
		global $post, $app;
		$posts = $post->showMorePosts($offset);
		foreach($posts as $value){
			$value['post_created'] = $post->timeAgo($value['post_created']);
			$postsWithTimeAgo[] = $value;
		}
		
		echo ( json_encode ( $postsWithTimeAgo ) );
});

//ASSAF'S FRIEND
$app->get('/friends/:myId/', function ($myId) use ( $friends ) {
    	$users = $friends->getAllfriends($myId);
    	echo json_encode($users);  // this is the response to the http:
    }
);

$app->run();