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
	echo $result;
});


$app->get( '/login/', function() {
	global $login, $app;
	echo (json_encode ($_SESSION));
	});

$app->get( '/logout', function() {
	session_destroy();
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
//includes server-side check that content isn't empty
$app->post( '/post', function() {
	global $post, $app;
	$jsonDetails = json_decode( $app->request->getBody(), true );
	if ( $jsonDetails['post_content'] )
		echo ( $post->publishPost( $jsonDetails ) );

});

//show first posts
$app->get( '/post/', function() {
	global $post, $app;
	$posts = $post->showFirstPosts();
	$postsWithTimeAgo = false;

	foreach($posts as $value){
		$value['post_created'] = $post->timeAgo($value['post_created']);
		$postsWithTimeAgo[] = $value;
	}
	
	if ($postsWithTimeAgo)
		echo ( json_encode ( $postsWithTimeAgo ) );

});

//show more posts
	$app->get( '/postmore/:offset', function($offset) {
		global $post, $app;
		$posts = $post->showMorePosts($offset);
		$postsWithTimeAgo = false;
		
		foreach($posts as $value){
			$value['post_created'] = $post->timeAgo($value['post_created']);
			$postsWithTimeAgo[] = $value;
		}
		
		echo ( json_encode ( $postsWithTimeAgo ) );
});

//ASSAF'S FRIEND
$app->get('/friends/rndSix', function () use ( $friends ) { 
    	$sixPack = $friends->getSixRndFriends($_SESSION["user_id"]); // I dont know what is the SESSION["key"] for user ID
    	echo json_encode($sixPack);  // this is the response to the http:
    }
);

$app->get('/userInfo', function () use ($user) {
	echo $user->getUserInfo( $_SESSION['user_id'] );
	
	
});














$app->run();