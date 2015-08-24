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
		
		$query = "(SELECT friends.user_friend_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, friends.friendship_created
					FROM users_info 
					INNER JOIN friends 
					ON users_info.user_id = friends.user_friend_id
					WHERE friends.user_id = $id)
					UNION
					(SELECT friends.user_id, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture, friends.friendship_created
					FROM users_info 
					INNER JOIN friends 
					ON users_info.user_id = friends.user_id
					WHERE friends.user_friend_id = $id);";
		$results = $this->_db->query($query);
		
		$freinds = array();
		
		while ( $row = $results->fetch_assoc() ){
			$freinds[] = $row;
		}
		return $freinds;
	}
	
	/**
	 *  getAllfriendsRequest
	 *
	 * This function returns an array of all friends requests for the user.
	 *
	 * @param (int) ( $id ) The ID of the user asks his friend requests list.
	 * @return (array) ($freinds_req) nun array with friends requests
	 */
	public function getAllfriendsRequest( $id ){
	
		$query = "SELECT friend_request.request_id, friend_request.user_id, friend_request.request_created, users_info.user_firstname, users_info.user_lastname, users_info.user_profile_picture
				FROM friend_request
				INNER JOIN users_info
				ON  friend_request.user_id = users_info.user_id
				WHERE friend_request.user_friend_id = $id
				;";
		$results = $this->_db->query($query);
	
		$freinds_req = array();
	
		while ( $row = $results->fetch_assoc() ){
			$freinds_req[] = $row;
		}
		return $freinds_req;
	}
	
	/**
	 *  getNumberOfFriends
	 *
	 * Returns the number of friends a user has.
	 *
	 * @param (int) ( $id ) The ID of the user in question
	 * @return (int) ($results->num_rows) number of friends a user has.
	 */
	public function getNumberOfFriends( $id ){
		$query = "(SELECT user_friend_id FROM friends WHERE user_id = $id) UNION (SELECT user_id FROM friends WHERE user_friend_id = $id)";
		$results = $this->_db->query($query);
		return $results->num_rows;
	}
	
	/**
	 *  getSixRndFriends
	 *
	 * Returns an array of six random friends a user has.
	 *
	 * @param (int) ( $id ) The ID of the user in question
	 * @return (array) ($sixPack) array of six random friends.
	 */
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
	/**
	 *  checkIfFriends
	 *
	 * Check if you are friends with user. IF NOT - checks for a friend request.
	 *
	 * @param (int) ( $id ) The ID of the user in question
	 * @return ( boolean ) ( $this->checkFriendRequest( $id ) ) returns result from checking for friend request
	 * @return ( boolean ) ( $results->num_rows ) either 0 or 1 based on query checking for a match.
	 */
	public function checkIfFriends( $id ){
		$query = "
				(SELECT user_friend_id FROM friends WHERE user_id = $id AND user_friend_id = ". $_SESSION['user_id']. ") 
				UNION 
				(SELECT user_id FROM friends WHERE user_friend_id = $id AND user_id = ". $_SESSION['user_id']. ")";
		$results = $this->_db->query($query);
		if( !$results->num_rows ){
			return $this->checkFriendRequest( $id );
		}
		return $results->num_rows;
	}
	
	//checks and responds whether they sent a request or i sent one or none
	
	/**
	 *  checkFriendRequest
	 *
	 * Check if a friend request was sent between two people - id and session id.
	 *
	 * @param (int) ( $id ) The ID of the user we are testing (not current user)
	 * @return ( array ) ( array('iSent' => '1') ) - current user sent request
	 * @return ( array ) ( array('theySent' => '1') ) - id being tested sent request
	 * @return ( array ) ( $this->checkFriendBlock( $id ) ) - result of friend block function
	 */
	private function checkFriendRequest( $id ){
		$queryDidISend = "SELECT * FROM friend_request WHERE user_id = ". $_SESSION['user_id']. " AND user_friend_id = $id
		";
		$results = $this->_db->query($queryDidISend);
		if ( $results->num_rows )
			return array('iSent' => '1');
		if ( !$results->num_rows ){
			$queryDidTheySend = "SELECT * FROM friend_request WHERE user_id = $id AND user_friend_id = ". $_SESSION['user_id']. "
			";
			$results = $this->_db->query($queryDidTheySend);
			if ($results->num_rows)
				return array('theySent' => '1');
			if ( !$results->num_rows )
				return $this->checkFriendBlock( $id );
			}
		}
		
		
	/**
	 *  checkFriendBlock
	 *
	 * Check if a block occurred between two people - id and session id.
	 *
	 * @param (int) ( $id ) The ID of the user we are testing (not current user)
	 * @return ( array ) ( array('iBlocked' => '1') ) - current user blocked
	 * @return ( array ) ( array('theyBlocked' => '1') ) - id being tested blocked
	 * @return ( boolean ) ( $this->checkIfMe( $id ) ) - result of is id me function
	 */
	 private function checkFriendBlock ( $id ){
		$queryDidIBlcok = "SELECT * FROM blocks WHERE user_id = ". $_SESSION['user_id']. " AND user_friend_id = $id
		";
		$results = $this->_db->query($queryDidIBlcok);
		if ($results->num_rows)
			return array('iBlocked' => '1');
		if (!$results->num_rows){
			$queryDidTheyBlock = "SELECT * FROM blocks WHERE user_id = $id AND user_friend_id = ". $_SESSION['user_id']. "
			";
			$results = $this->_db->query($queryDidTheyBlock);
			if ($results->num_rows)
				return array('theyBlocked' => '1');
			if (!$results->num_rows)
				return $this->checkIfMe( $id );
		}
	}
	/**
	 *  checkIfMe
	 *
	 * Check if the id that was sent while checking for friend/block status was current user
	 *
	 * @param (int) ( $id ) The ID of the user we are testing
	 * @return ( array ) ( array('isMe' => '1') ) - yes
	 * @return ( boolean ) ( 0 ) - no, and also all other tests for friend/block status also resulted in no. 
	 * (meaning the current user CAN send a friend request because he is in a profile of someone
	 * who is not him, is not someone he is friends with, and no friend request or block was sent between either users.)
	 */	
	public function checkIfMe ( $id ){
		if ( $id == $_SESSION['user_id'] ){
			return array('isMe' => '1');
		}
		else
			return 0;
	}
	/**
	 *  sendFriendRequest
	 *
	 * Send a friend request to a user.
	 *
	 * @param (int) ( $id ) The ID of the user the request will be sent to
	 * @return ( boolean ) ( $results ) - whether the request worked or not (if not, shows error message)
	 */	
	public function sendFriendRequest( $id ){
		$query = "
			INSERT INTO friend_request
			(user_id, user_friend_id, request_created) 
			VALUES ('". $_SESSION['user_id'] ."', '$id', CURRENT_TIME());
				";
		$results = $this->_db->query($query);
		return $results;
	}	
	/**
	 *  acceptFriendRequest
	 *
	 * Accept a friend request from a user.
	 *
	 * @param (int) ( $id ) The ID of the user who sent the request.
	 * @return ( boolean ) ( $results ) - whether the request worked or not (if not, shows error message)
	 */
	public function acceptFriendRequest( $id ){
		$query = "
			INSERT INTO friends (user_id, user_friend_id, friendship_created) 
			VALUES ('". $_SESSION['user_id'] ."', '$id', CURRENT_TIME());
			DELETE FROM friend_request WHERE user_id = $id AND user_friend_id = '". $_SESSION['user_id'] ."';
			";
		$results = $this->_db->multi_query($query);
		return $results;
	}
	
	/**
	 *  rejectFriendRequest
	 *
	 * Reject a friend request from a user.
	 *
	 * @param (int) ( $id ) The ID of the user who sent the request.
	 * @return ( boolean ) ( $results ) - whether the request worked or not (if not, shows error message)
	 */
	 public function rejectFriendRequest( $id ){
		$query = "
			DELETE FROM friend_request WHERE user_id = $id AND user_friend_id = '". $_SESSION['user_id'] ."';
			INSERT INTO blocks (user_id, user_friend_id, block_created) VALUES ('". $_SESSION['user_id'] ."', '$id', CURRENT_TIME());
			";
		$results = $this->_db->multi_query($query);
		return $results;
	}
	/**
	 *  unFriend
	 *
	 * Unfriend a user you are in a friendship with.
	 *
	 * @param (int) ( $id ) The ID of the user the current user wants to unfriend.
	 * @return ( boolean ) ( $results ) - whether the unfriending worked or not (if not, shows error message)
	 */
	public function unFriend( $id ){
		$query = "
			DELETE FROM friends WHERE user_id = $id AND user_friend_id = '". $_SESSION['user_id'] ."';
			DELETE FROM friends WHERE user_id = '". $_SESSION['user_id'] ."' AND user_friend_id = $id ;
			";
		$results = $this->_db->multi_query($query);
		return $results;
	}
		
		
};