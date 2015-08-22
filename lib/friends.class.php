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
	
	public function getNumberOfFriends($id){
		$query = "(SELECT user_friend_id FROM friends WHERE user_id = $id) UNION (SELECT user_id FROM friends WHERE user_friend_id = $id)";
		$results = $this->_db->query($query);
		return $results->num_rows;
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
	//check if you are friends with user. IF NOT - checks for a friend request.
	public function checkIfFriends( $id ){
		$query = "
				(SELECT user_friend_id FROM friends WHERE user_id = $id AND user_friend_id = ". $_SESSION['user_id']. ") 
				UNION 
				(SELECT user_id FROM friends WHERE user_friend_id = $id AND user_id = ". $_SESSION['user_id']. ")";
		$results = $this->_db->query($query);
		if(!$results->num_rows){
			return $this->checkFriendRequest( $id );
		}
		return $results->num_rows;
	}
	
	//checks and responds whether they sent a request or i sent one or none
private function checkFriendRequest( $id ){
	$queryDidISend = "SELECT * FROM friend_request WHERE user_id = ". $_SESSION['user_id']. " AND user_friend_id = $id
	";
	$results = $this->_db->query($queryDidISend);
	if ($results->num_rows)
		return array('iSent' => '1');
	if ( !$results->num_rows ){
		$queryDidTheySend = "SELECT * FROM friend_request WHERE user_id = $id AND user_friend_id = ". $_SESSION['user_id']. "
		";
		$results = $this->_db->query($queryDidTheySend);
		if ($results->num_rows)
			return array('theySent' => '1');
		if (!$results->num_rows)
			return $this->checkFriendBlock( $id );
		}
	}
	
	
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

public function checkIfMe ( $id ){
	if ( $id == $_SESSION['user_id'] ){
		return array('isMe' => '1');
	}
	else
		return 0;
}

public function sendFriendRequest( $id ){
	$query = "
		INSERT INTO friend_request
		(user_id, user_friend_id, request_created) 
		VALUES ('". $_SESSION['user_id'] ."', '$id', CURRENT_TIME());
			";
	$results = $this->_db->query($query);
	return $results;
}	

public function acceptFriendRequest( $id ){
	$query = "
		INSERT INTO friends (user_id, user_friend_id, friendship_created) 
		VALUES ('". $_SESSION['user_id'] ."', '$id', CURRENT_TIME());
		DELETE FROM friend_request WHERE user_id = $id AND user_friend_id = '". $_SESSION['user_id'] ."';
		";
	$results = $this->_db->multi_query($query);
	return $results;
}

public function rejectFriendRequest( $id ){
	$query = "
		DELETE FROM friend_request WHERE user_id = $id AND user_friend_id = '". $_SESSION['user_id'] ."';
		INSERT INTO blocks (user_id, user_friend_id, block_created) VALUES ('". $_SESSION['user_id'] ."', '$id', CURRENT_TIME());
		";
	$results = $this->_db->multi_query($query);
	return $results;
}

public function unFriend( $id ){
	$query = "
		DELETE FROM friends WHERE user_id = $id AND user_friend_id = '". $_SESSION['user_id'] ."';
		DELETE FROM friends WHERE user_id = '". $_SESSION['user_id'] ."' AND user_friend_id = $id ;
		";
	$results = $this->_db->multi_query($query);
	return $results;
}
	
	
};