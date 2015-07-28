<?php

	class Post{
		
		private $_db;
		
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
	
		public function publishPost($details){
			$post = $this->_db->query("
					INSERT INTO socialityplus.posts (post_id, user_id, post_content, post_created) VALUES (NULL, '$details[user_id]', '$details[post_content]', CURRENT_TIME())
					");
			return $post;		
		}
		
		public function showAllPosts(){
			$post = $this->_db->query("
					SELECT * FROM posts
					");
			$posts = array();
			while ($row = mysqli_fetch_assoc ($post))
				$posts[] = $row;
			return $posts;		
		}
	}
