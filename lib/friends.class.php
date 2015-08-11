<?php


class Friends {
	
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
		// changed from instance to resource because i called it resource, not instance (:
		$this->_db = DB::getResource();
	}
	
	
	/**
	 *  getAllfriends
	 *
	 * This function returns an array of all friends ID for the user.
	 *
	 * @param (int) ( $id ) The ID of the user asks his friend list.
	 * @return (array) ($friends) nun array with friends ID
	 */
	
	
	public function getAllfriends( $id ){
		
		$query = "(SELECT user_friend_id FROM friends WHERE user_id = $id) 
				UNION (SELECT user_id FROM friends WHERE user_friend_id = $id)";
		
		$results = $this->_db->query($query); 
		
		$friends = array();
		
		while ( $row = $results->fetch_assoc() ){
			$friends[] = $row;
		}
		return $friends;
	}
	
	public function getSixRndFriends ( $id ){
		
		$query = "(SELECT friends.user_friend_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture
					FROM users_info 
					INNER JOIN friends 
					ON users_info.user_id = friends.user_friend_id
					WHERE friends.user_id = $id)
					UNION
					(SELECT friends.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture
					FROM users_info 
					INNER JOIN friends 
					ON users_info.user_id = friends.user_id
					WHERE friends.user_friend_id = $id)
					ORDER BY RAND()
					LIMIT 6;";
		$results = $this->_db->query($query);
		
		$sixPack = array();
		
		while ( $row = $results->fetch_assoc() ){
			$sixPack[] = $row;
		}
		return $sixPack;
	}
	
	
	
	
	
};