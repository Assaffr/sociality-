<?php

	class Login{
		
		private $_db;
		
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
		
		
		public function match($email, $password){
			$resultSet = $this->_db->query("
						SELECT * FROM users WHERE user_email = '$email' AND `user_password` = '" . md5( $password ) . "'
					");
					//Why use an array? you get only one row with 0 or 1.
					//explained on index.php line 35, we need to talk about what to do here
			$result = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$result[] = $row;
			return $result;
		}
		
		public function addUserInfoToSession($id){
			$results = $this->_db->query("
					SELECT user_email, user_password, user_firstname, user_lastname FROM users, users_info WHERE users_info.user_id = $id AND users.user_id = $id
					");
		
			$resultSet = array();
			while ($row = mysqli_fetch_assoc ($results))
				$resultSet[] = $row;
			return $resultSet;
		}
		
		
		public function verifyLogin(){
			
		}
		
	
	}
