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



//UPLOAD PROFILE PHOTO

$app->post( '/upload/profile', function() {
	global $user, $app;
	if ( $_FILES ){
		$type = pathinfo("../cover-pics/" . $_FILES["pic"]["name"],PATHINFO_EXTENSION);
		if( $type !== "jpg"  && $type !== "png" && $type !== "jpeg" && $type !== "gif")
			echo "notimage";
		else {
			$file = explode ( "/", $_FILES["pic"]["type"] );
				if ( file_exists( "../user-pics/" . $_FILES["pic"]["name"] ) )
					echo "imageexists";
				else{
					if ( $_FILES["pic"]["size"] > 500000 )
						echo "toobig";
					else {
						move_uploaded_file($_FILES["pic"]["tmp_name"], "../user-pics/" . $_FILES["pic"]["name"] );
						$_SESSION['user_profile_picture'] = $_FILES["pic"]["name"]; //refreshes session profile pic
						if ( $user->setProfileImage($_SESSION['user_id'] , $_FILES["pic"]["name"]) )
							echo $_FILES["pic"]["name"];
						else
							echo 0;
						}
					}
		}	
	}
	else 
		echo "notimage";
});

//UPLOAD COVER PHOTO
$app->post( '/upload/cover', function() {
	global $user, $app;
	if ( $_FILES ){
		$type = pathinfo("../cover-pics/" . $_FILES["cover"]["name"],PATHINFO_EXTENSION);
		if( $type !== "jpg"  && $type !== "png" && $type !== "jpeg" && $type !== "gif")
			echo "notimage";
		else {
			$file = explode ( "/", $_FILES["cover"]["type"] );
			if ( file_exists( "../cover-pics/" . $_FILES["cover"]["name"] ) )
				echo "imageexists";
			else{
				if ( $_FILES["cover"]["size"] > 500000 )
					echo "toobig";
				else {
					move_uploaded_file($_FILES["cover"]["tmp_name"], "../cover-pics/" . $_FILES["cover"]["name"] );
					$_SESSION['user_secret_picture'] = $_FILES["cover"]["name"]; //refreshes session profile pic
					if ( $user->setCoverImage($_SESSION['user_id'] , $_FILES["cover"]["name"]) )
						echo $_FILES["cover"]["name"];
					else
						echo 0;
				}
			}
		}
	}
	else
		echo 0;
});

//LOGIN
$app->post( '/login', function() {
	global $login, $app;
	$details = json_decode( $app->request->getBody(), true );
	$result = $login->match( $details['email'], $details['password'] ) ;
	echo $result;
});

//LOGOUT
$app->delete( '/logout', function() {
	echo session_destroy();
});


//VERIFY LOGIN BY ECHOING SESSION
$app->get( '/login/', function() use( $friends, $user ) {
	if ( isset( $_SESSION['user_id'] ) ){
		$_SESSION['num_friends'] = $friends->getNumberOfFriends( $_SESSION['user_id'] );
		$_SESSION['user_age'] = $user->getBirthday( $_SESSION['user_id'] );
	}
	else
		$_SESSION['login'] = false;
	echo ( json_encode ($_SESSION) );
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

//Update User
$app->put( '/user', function( ) {
	global $user, $app, $login;
	$jsonUser = json_decode( $app->request->getBody(), true );
	echo $user->updateUser( $_SESSION['user_id'] , $jsonUser );
	$login->setSession( $_SESSION['user_id'] );
	
});

//publish post
//includes server-side check that content isn't empty
$app->post( '/post', function() {
	global $post, $app;
	$jsonDetails = json_decode( $app->request->getBody(), true );
	if ( $jsonDetails['post_content'] )
		echo ( $post->publishPost( $jsonDetails ) );

});

//show posts
$app->get( '/post/:offset', function( $offset ) {
	global $post, $app;
	$posts = $post->showPosts($offset, $_SESSION['user_id']);
	echo ( json_encode ( $posts ) );

});

//show posts
$app->get( '/singlePost/:post_id', function( $post_id ) {
		global $post, $app;
		$posts = $post->getSinglePost( $post_id );
		echo ( json_encode ( $posts ) );
	
});

//show posts by id
$app->get( '/wall/:id/:offset', function( $id, $offset ) {
	global $post, $app;
	$posts = $post->getWallPosts($offset, $id);
	echo ( json_encode ( $posts ) );

});

$app->get( '/comments/:offset', function( $offset ) use( $post ){
	echo json_encode( $post->getMoreComments( $_GET['post_id'], $offset ) );
	
	
});

//set a new like by user_id and post_id
$app->post('/like/:post_id', function ( $post_id ) use ( $post ){
 echo $post->toggleLike( $post_id );
	
});

//set a new comment
$app->post('/comment', function ( ) use ( $post, $app){
	$details =  json_decode( $app->request->getBody(), true );
	
	echo $post->setComments( $details );
	
});

//GET SIX RANDOM FRIENDS
$app->get('/friends/rndSix', function () use ( $friends ) { 
    	$sixPack = $friends->getSixRndFriends($_SESSION["user_id"]);
    	echo json_encode($sixPack);
    });

//GET SIX RANDOM FRIENDS BY ID
$app->get('/friends/rndSix/:id', function ( $id ) use ( $friends ) {
	$sixPack = $friends->getSixRndFriends( $id );
	echo json_encode($sixPack);
});

$app->get('/friends/all', function ( ) use ( $friends, $post ) {
	$friend_list = $friends->getAllfriends( $_SESSION['user_id'] );
	foreach($friend_list as $key => $value){
		$friend_list[$key]['friendship_time_ago'] = $post->timeAgo ( $friend_list[$key]['friendship_created'] );
	}
	
	echo json_encode( $friend_list );
});

$app->get('/friends/allRequest', function ( ) use ( $friends, $post ) {
	$friend_list = $friends->getAllfriendsRequest( $_SESSION['user_id'] );
	foreach($friend_list as $key => $value){
		$friend_list[$key]['request_time_ago'] = $post->timeAgo ( $friend_list[$key]['request_created'] );
	}
	echo json_encode( $friend_list );
});

$app->get('/userInfo', function () use ($user) {
	echo $user->getUserInfo( $_SESSION['user_id'] );
});


//builds your own profile page
$app->get('/profile', function () {
	global $user, $friends;
	$users = $user->buildProfile( $_SESSION['user_id'] );
	$users[0]['user_num_friends'] = $friends->getNumberOfFriends( $_SESSION['user_id'] );
	echo json_encode( $users );
});

//builds someone else's profile page
$app->get('/profile/:id', function ( $id ) {
	global $user, $friends;
	$users = $user->buildProfile( $id );
	$users[0]['user_num_friends'] = $friends->getNumberOfFriends( $id );
	echo json_encode( $users );
});


//just for Testing

	$app->get('/12345', function() use ($app ,$post){
		var_dump($post->getComments("1"));
		
		
	});
		
$app->get('/friends/rndSix', function ( ) use ( $friends ) {
	$sixPack = $friends->getSixRndFriends( $_SESSION['user_id'] );
	echo json_encode($sixPack);  
});			


//checks if you're friends with user
$app->get( '/checkfriendstatus/:id', function( $id ) {
	global $friends;
	echo json_encode ( $friends->checkIfFriends( $id ) );
	});
	

$app->post( '/sendfriendrequest', function() {
	global $app, $friends;
	echo $friends->sendFriendRequest ( $app->request->getBody() );
	
});

$app->post( '/acceptfriendrequest', function() {
	global $app, $friends;
	echo $friends->acceptFriendRequest ( $app->request->getBody() );
});

$app->delete( '/rejecttfriendrequest', function() {
	global $app, $friends;
	echo $friends->rejectFriendRequest ( $app->request->getBody() );
});

$app->delete( '/unfriend', function() {
	global $app, $friends;
	echo $friends->unFriend( $app->request->getBody() );
});

$app->delete( '/comment/delete/:post_id',  function( $post_id ) use( $post ) {

	echo $post->deletePost ( $post_id );
});


$app->get( '/check/:id', function( $id ) use ( $post ) {
	
});
	


$app->run();