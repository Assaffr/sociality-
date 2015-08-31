<?php

class Post{
	
	private $_db;
	
	/**
	 *  __construct
	 *
	 * This function get single connection to a database and put it in $this->_db
	 *
	 * @no param needed
	 * @no return
	 */
	public function __construct () {
		$this->_db = DB::getResource ();
	}
	
	/**
	 *	publishPost
	 *
	 *	publishes a post
	 *
	 *	@param (array) ($details) details of the post being published
	 *	@return (boolean) ($this->_db->insert_id) whether the post was published or not
	 */
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
	
	/**
	 *	getSinglePost
	 *
	 *	gets a single post with all its correct info (comments, likes, time ago) for post permalink page
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (type) (name)
	 */
	public function getSinglePost( $post_id ) {
		$query = "SELECT users_info.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, posts.post_created, posts.post_content, posts.post_id
				FROM users_info 
				INNER JOIN posts
				ON users_info.user_id = posts.user_id
				WHERE posts.post_id = $post_id";
		
		$results = $this->_db->query( $query );
		$post = $results->fetch_assoc();
		$post['comments'] = $this->getAllComments($post["post_id"]);
		$post['likes'] = $this->getLikes($post["post_id"]);
		$post['post_time_ago'] = $this->timeAgo( $post['post_created'] );
		
		$wrap = array( $post );
		
		return $wrap;
	}
	

	/**
	 *	showPosts
	 *
	 *	shows all posts on someone's home page - theirs and their friends
	 *	
	 *	LIMITING POSTS will be used via "LIMIT" and "OFFSET" (skips to next x number of posts)
	 *	ORDER BY puts latest posts on top
	 *
	 *	@param (int) ($offset) sets the offset for the post
	 *	@param (int) ($id) id of user whose posts we're showing
	 *	@return (array) ($postsWithTimeAgo) the posts with time ago
	 *	@return (array) ($posts) posts without time ago
	 */
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
	
	/**
	 *	getWallPosts
	 *
	 *	gets all the posts that should be on someone's wall - theirs, and the ones posted on their wall by other people.
	 *
	 *	@param (int) ($offset) sets the offset for the post
	 *	@param (int) ($id) id of user whose posts we're showing
	 *	@return (array) ($postsWithTimeAgo) the posts with time ago
	 *	@return (array) ($posts) posts without time ago
	 */
	public function getWallPosts ( $offset, $id ){
		$post = $this->_db->query("
				(SELECT users_info.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, posts.post_created, posts.post_content, posts.post_id
				FROM users_info 
				INNER JOIN posts
				ON users_info.user_id = posts.user_id
				WHERE users_info.user_id = $id
				)
				UNION
				(SELECT users_info.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, posts.post_created, posts.post_content, posts.post_id
				FROM users_info 
				INNER JOIN posts
				ON users_info.user_id = posts.user_id
				INNER JOIN posts_relations
				ON posts.post_id = posts_relations.post_id
				WHERE posts_relations.post_to_friend_id = $id)
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

	
	/**
	 *	timeAgo
	 *
	 *	turns a timeestamp in string form into 'time ago' string.
	 *
	 *	@param (string) ($postTimeinString) the original timestamp
	 *	@return (string) (string for each possible time)
	 */
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
	
	
	/**
	 *	getFirstComments
	 *
	 *	IF there's five comments or less - bring all comments.
	 *	IF there's more than five comments - bring the first three.
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (array) ($comments) contains: num comments - number of comments,
	 *	and the_comments(array) - the comments themselves. 
	 */
	public function getFirstComments( $post_id ){
		$query = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
				FROM comments
				INNER JOIN users_info
				ON users_info.user_id = comments.user_id
				WHERE comments.post_id = $post_id
				ORDER BY comments.comment_time DESC";
		
		$results = $this->_db->query( $query );
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
			$query = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
			FROM comments
			INNER JOIN users_info
			ON users_info.user_id = comments.user_id
			WHERE comments.post_id = $post_id
			ORDER BY comments.comment_time DESC LIMIT 3";
			
			$results = $this->_db->query( $query );
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
	
	/**
	 *	getMoreComments
	 *
	 *	brings five comments each time by offset.
	 *
	 *	@param (int) ($post_id) post id
	 *	@param (int) ($offset) starts from three outside the function then jumps by five each time
	 *	@return (array) ($comments) the comments
	 */
	public function getMoreComments( $post_id, $offset ){
		$query = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
		FROM comments
		INNER JOIN users_info
		ON users_info.user_id = comments.user_id
		WHERE comments.post_id = $post_id
		ORDER BY comments.comment_time DESC LIMIT 5 OFFSET $offset";
		
		$results = $this->_db->query( $query );
		while ( $row = $results->fetch_assoc() ){
			$comments[] = $row;
		}
		
		foreach($comments as $key => $value){
			$value['comment_time_ago'] = $this->timeAgo( $value['comment_time'] );
			$comments[$key] = $value;
		}
		return $comments;
	}
	
	/**
	 *	getAllComments
	 *
	 *	brings all the comments without offset or limit and includes the number of comments
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (array) ($comments) the comments
	 */
	public function getAllComments( $post_id ){
		$query = "SELECT comments.comment_id, comments.comment_content, comments.comment_time, comments.user_id, users_info.user_firstname ,users_info.user_lastname, users_info.user_profile_picture
		FROM comments
		INNER JOIN users_info
		ON users_info.user_id = comments.user_id
		WHERE comments.post_id = $post_id
		ORDER BY comments.comment_time DESC";
		
		
		$results = $this->_db->query( $query );
		$comments = array ( );
		$comments = array ( "the_comments" => array ( ) );
		$comments['num_comments'] = $results->num_rows;
		
		
		while ( $row = $results->fetch_assoc() ){
			$comments["the_comments"][] = $row;
		}
		
		foreach( $comments["the_comments"] as $key => $value){
			$value['comment_time_ago'] = $this->timeAgo( $value['comment_time'] );
			$comments["the_comments"][$key] = $value;
		}
		return $comments;
		}

	/**
	 *	setComments
	 *
	 *	adds new comment
	 *
	 *	@param (array) ($details) content and post id
	 *	@return (int) ($this->_db->query( $query )) if success - comment id, if failed - 0
	 */
	public function setComments( $details ){
		$query = "INSERT INTO comments 
		( comment_content, comment_time, user_id, post_id ) VALUES 
		('$details[comment_content]', CURRENT_TIME(), '$_SESSION[user_id]', '$details[post_id]' );";
		
		$results = $this->_db->query( $query );
		
		if ( $results ){
			return  $this->_db->insert_id;
		}
	}
	
	/**
	 *	getLikes
	 *
	 *	returns likes
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (array) ($likes) the likes
	 */
	public function getLikes( $post_id ) {
		$query = "SELECT likes.like_id, likes.user_id, likes.like_created, likes.post_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture
					FROM likes
					INNER JOIN users_info
					ON likes.user_id = users_info.user_id
					WHERE likes.post_id = $post_id ORDER BY like_created DESC;";
		
		$results = $this->_db->query( $query );
		$likes = array ( );
			
		while ( $row = $results->fetch_assoc() ){
			$likes[] = $row;
		}
		return $likes;

	}
	
	
	/**
	 *	checkLike
	 *
	 *	checks if current session user has liked the post in the param
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (int) if there is a like - return like id, if not return 0.
	 */
	private function checkLike ( $post_id ){
	
		$query = "SELECT like_id FROM likes WHERE user_id = $_SESSION[user_id]  AND post_id = $post_id ;";
	
		$result = $this->_db->query( $query );
	
			
		return $result->fetch_assoc()['like_id'];
	
	
	}
	
	/**
	 *	toggleLike
	 *
	 *	when called - checks if there's a like using checkLike function, 
	 *	if there is - deletes the like, if there isn't - sets like.
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (boolean) ($this->_db->query( $query )) whether it worked or not
	 */
	public function toggleLike ( $post_id ){
		
		if ( !$this->checkLike ( $post_id ) ){
		
		$query = "INSERT INTO likes ( user_id, like_created, post_id )
				VALUES ( '".$_SESSION['user_id']."', CURRENT_TIME(), $post_id )";
		}else{
		$query = "DELETE FROM likes WHERE like_id = ".$this->checkLike ( $post_id );
		}
		return  $this->_db->query( $query );
	}
	

	/**
	 *	checkPostOwner
	 *
	 *	checks if current session user wrote the post OR someone wrote it on their wall.
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (boolean) (true) session user  wrote the post
	 *	@return (boolean) (true) someone wrote their post on session user's wall
	 *	@return (boolean) (false) neither options are true
	 */
	private function checkPostOwner ( $post_id ){
		
		$query = "SELECT user_id FROM posts WHERE post_id =".$post_id;
		
		$result = $this->_db->query( $query );
		
		if ( $result->fetch_assoc()['user_id'] == $_SESSION['user_id']){
			return true;
		}else{
			$query = "SELECT post_to_friend_id FROM posts_relations WHERE post_id = ".$post_id;
			
			$result = $this->_db->query( $query );
			
			if ( $result->fetch_assoc()['post_to_friend_id'] == $_SESSION['user_id']){
				return true;
			}
		}
		return false;
		
	}
	
	/**
	 *	deletePost
	 *
	 *	checks if current session user wrote the post OR it was written on their wall.
	 *	if so, deletes post
	 *	also deletes post id from post_relations in case it was written on someone's wall
	 *
	 *	@param (int) ($post_id) post id
	 *	@return (boolean) ($result = $this->_db->multi_query($query)) whether it worked or not
	 *	@return (boolean) (false) current session user didn't write post and it wasn't written on their wall - no permission to delete!
	 */ 
	public function deletePost ( $post_id ){
		if ( $this->checkPostOwner( $post_id ) ){
			$query = "
					DELETE FROM posts WHERE post_id = $post_id;
					DELETE FROM posts_relations WHERE post_id = $post_id;";
			return $result = $this->_db->multi_query($query);
		}
		return false;
		
	}
	
	
	
	
	
}
