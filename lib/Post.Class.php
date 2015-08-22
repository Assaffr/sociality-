<?php

	class Post{
		
		private $_db;
		
		public function __construct () {
			$this->_db = DB::getResource ();
		}
		

		public function publishPost ( $details ) {
			
			if ( $details['post_to_friend_id'] == $_SESSION['user_id'] ) {
				$query = "INSERT INTO posts ( user_id, post_content, post_created) VALUES ('$_SESSION[user_id]', '$details[post_content]', CURRENT_TIME() );";
				$post = $this->_db->query( $query );
			}else{
				$query = "INSERT INTO posts ( user_id, post_content, post_created) VALUES ('$_SESSION[user_id]', '$details[post_content]', CURRENT_TIME() );
				INSERT INTO posts_relations (post_id, user_id, post_to_friend_id) VALUES (LAST_INSERT_ID(), '$_SESSION[user_id]', '$details[post_to_friend_id]');";
				
				$post = $this->_db->multi_query( $query );
			}
			
			
			

			
			if ( $post )
				return  $this->_db->insert_id;
			
		
		}
		
		//this functions selects all the post info PLUS joins the users_info table in order to also fetch the name of the user who made the post
		//LIMITING POSTS will be used via "LIMIT" and "OFFSET" (skips to next x number of posts)
		//ORDER BY puts latest posts on top
		public function showPosts($offset, $id){
			$post = $this->_db->query("
					(SELECT users_info.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, posts.post_created, posts.post_content, posts.post_id
					FROM users_info 
					INNER JOIN friends 
					ON users_info.user_id = friends.user_friend_id
					INNER JOIN posts
					ON users_info.user_id = posts.user_id
					WHERE friends.user_id = $id
					)
					UNION
					(SELECT users_info.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, posts.post_created, posts.post_content, posts.post_id
					FROM users_info 
					INNER JOIN friends 
					ON users_info.user_id = friends.user_id
					INNER JOIN posts
					ON users_info.user_id = posts.user_id
					WHERE friends.user_friend_id = $id)
					UNION
					(SELECT users_info.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, posts.post_created, posts.post_content, posts.post_id
					FROM users_info
					INNER JOIN posts
					ON users_info.user_id = posts.user_id
					WHERE posts.user_id = $id ) 
					ORDER BY post_created DESC LIMIT 3 OFFSET " . $offset . ";
										");
			$posts = array();
			while ($row = mysqli_fetch_assoc ($post)){
				$row['comments'] = $this->getFirstComments($row["post_id"]);
				$row['likes'] = $this->getLikes($row["post_id"]);
				$posts[] = $row;
			}
			
			if ( $posts ){
				foreach($posts as $value){
					$value['post_time_ago'] = $this->timeAgo( $value['post_created'] );
					$postsWithTimeAgo[] = $value;
				}
				return $postsWithTimeAgo;	
			}
			else return $posts;
			
			

		}

		
		//sets timezone to israel, then takes the string of time in parm and turns it into epoch time
		//$diff = the difference between current epoch time to the param epoch one.
		//then it just figures out how long it's been and echoes the correct difference. (hopefully)
		public function timeAgo( $postTimeinString ) {
			date_default_timezone_set( 'Israel' );
			$epoch = strtotime( $postTimeinString );
			$diff = time() - $epoch;
			$diffMin = $diff / 60;
			$diffHour = $diffMin / 60;
			$diffDay = $diffHour / 24;
			
			if ( $diff <= 60 )
				return (int)( $diff ) . " seconds ago";
			if ( $diff <= 3600 && $diff >= 60 )
				return (int) ($diffMin)." minutes ago";
			if ($diff <= 86400 && $diff >= 3600)
				return (int) ($diffHour)." hours ago";
			if ($diff < 604800 || $diff >= 86400)
				return (int) ($diffDay)." days ago";
		}
		
		// public function getFeed( $user_id ) {
			// $feed = array(
				// "comments" => $this->getFirstComments();
			// );
		// }
		
		
		public function getFirstComments( $post_id ){
			$qurey = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
					FROM comments
					INNER JOIN users_info
					ON users_info.user_id = comments.user_id
					WHERE comments.post_id = $post_id
					ORDER BY comments.comment_time DESC";
			
			$results = $this->_db->query( $qurey );
			$comments = array ( );
			$comments = array ( "the_comments" => array ( ) );
			$comments['num_comments'] = $results->num_rows;
			
			if( $comments['num_comments'] <= 5 ){
			
				while ( $row = $results->fetch_assoc() ){
					$comments["the_comments"][] = $row;
				}
				
				foreach($comments["the_comments"] as $key => $value){
					$value['comment_time_ago'] = $this->timeAgo( $value['comment_time'] );
					$comments["the_comments"][$key] = $value;
				}
				
			}else{
				$qurey = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
				FROM comments
				INNER JOIN users_info
				ON users_info.user_id = comments.user_id
				WHERE comments.post_id = $post_id
				ORDER BY comments.comment_time DESC LIMIT 3";
				
				$results = $this->_db->query( $qurey );
				while ( $row = $results->fetch_assoc() ){
					$comments["the_comments"][] = $row;
				}
				
				foreach($comments["the_comments"] as $key => $value){
					$value['comment_time_ago'] = $this->timeAgo( $value['comment_time'] );
					$comments["the_comments"][$key] = $value;
				}
			};
			return $comments;
		}
		
		public function getMoreComments( $post_id, $offset ){
			$qurey = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
			FROM comments
			INNER JOIN users_info
			ON users_info.user_id = comments.user_id
			WHERE comments.post_id = $post_id
			ORDER BY comments.comment_time DESC LIMIT 5 OFFSET $offset";
			
			$results = $this->_db->query( $qurey );
			while ( $row = $results->fetch_assoc() ){
				$comments[] = $row;
			}
			
			foreach($comments as $key => $value){
				$value['comment_time_ago'] = $this->timeAgo( $value['comment_time'] );
				$comments[$key] = $value;
			}
			return $comments;
		}
		
		
		public function setComments( $details ){
			$qurey = "INSERT INTO comments 
			( comment_content, comment_time, user_id, post_id ) VALUES 
			('$details[comment_content]', CURRENT_TIME(), '$_SESSION[user_id]', '$details[post_id]' );";
			
			$results = $this->_db->query( $qurey );
			
			if ( $results ){
				return  $this->_db->insert_id;
			}
		}
		
		
		public function getLikes( $post_id ) {
			$qurey = "SELECT likes.like_id, likes.user_id, likes.like_created, likes.post_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture
						FROM likes
						INNER JOIN users_info
						ON likes.user_id = users_info.user_id
						WHERE likes.post_id = $post_id ORDER BY like_created DESC;";
			
			$results = $this->_db->query( $qurey );
			$likes = array ( );
				
			while ( $row = $results->fetch_assoc() ){
				$likes[] = $row;
			}
			return $likes;

		}
		
		
		public function toggleLike ( $post_id ){
			
			if ( !$this->chackLike ( $post_id ) ){
			
			$qurey = "INSERT INTO likes ( user_id, like_created, post_id )
					VALUES ( '".$_SESSION['user_id']."', CURRENT_TIME(), $post_id )";
			}else{
			$qurey = "DELETE FROM likes WHERE like_id = ".$this->chackLike ( $post_id );
			}
			return  $this->_db->query( $qurey );
		}
		
		
		private function chackLike ( $post_id ){
			
			$qurey = "SELECT like_id FROM likes WHERE user_id = $_SESSION[user_id]  AND post_id = $post_id ;";
			
			$result = $this->_db->query( $qurey );
			
				
				return $result->fetch_assoc()['like_id'];
			

		}
		
		
		
		
		
	}
