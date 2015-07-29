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
	
	
	
	
	
};