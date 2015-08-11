<?php

	class Post{
		
		private $_db;
		
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
		//i can't get this to show the last post id :((
		public function publishPost($details){
			$post = $this->_db->query("
					INSERT INTO socialityplus.posts (post_id, user_id, post_content, post_created) VALUES (NULL, '$_SESSION[user_id]', '$details[post_content]', CURRENT_TIME());
					");
			return $post;		
		}
		
		//this functions selects all the post info PLUS joins the users_info table in order to also fetch the name of the user who made the post
		//note: this still isn't filtering by friends!!
		//LIMITING POSTS will be used via "LIMIT" and "OFFSET" (skips to next x number of posts)
		//ORDER BY puts latest posts on top
		public function showFirstPosts(){
			$post = $this->_db->query("
					SELECT posts.post_id, posts.post_content, posts.post_created, posts.user_id, users_info.user_firstname, users_info.user_lastname FROM users_info INNER JOIN posts WHERE posts.user_id = users_info.user_id ORDER BY posts.post_created DESC LIMIT 3;
					");
			$posts = array();
			while ($row = mysqli_fetch_assoc ($post))
				$posts[] = $row;
			return $posts;		
		}

		public function showMorePosts($offset){
			$post = $this->_db->query("
					SELECT posts.post_id, posts.post_content, posts.post_created, posts.user_id, users_info.user_firstname, users_info.user_lastname FROM users_info INNER JOIN posts WHERE posts.user_id = users_info.user_id ORDER BY posts.post_created DESC LIMIT 3 OFFSET " . $offset . ";
					");
			$posts = array();
			while ($row = mysqli_fetch_assoc ($post))
				$posts[] = $row;
			return $posts;
		}
		
		
		//sets timezone to israel, then takes the string of time in parm and turns it into epoch time
		//$diff = the difference between current epoch time to the param epoch one.
		//then it just figures out how long it's been and echoes the correct difference. (hopefully)
		public function timeAgo($postTimeinString){
			date_default_timezone_set('Israel');
			$epoch = strtotime($postTimeinString);
			$diff = time() - $epoch;
			$diffMin = $diff / 60;
			$diffHour = $diffMin / 60;
			$diffDay = $diffHour / 24;
			
			if ($diff <= 60)
				return (int) ($diff)." seconds ago";
			if ($diff <= 3600 && $diff >= 60)
				return (int) ($diffMin)." minutes ago";
			if ($diff <= 86400 && $diff >= 3600)
				return (int) ($diffHour)." hours ago";
			if ($diff < 604800 && $diff >= 86400)
				return (int) ($diffDay)." days ago";
		}
	}
