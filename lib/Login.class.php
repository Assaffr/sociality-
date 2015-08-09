<?php

	class Login{
		
		private $_db;
		
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
		
		
		public function match($email, $password){
			$resultSet = $this->_db->query("
						SELECT user_id FROM users WHERE user_email = '$email' AND `user_password` = '" . md5( $password ) . "'
					");
			$result = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$result[] = $row;
				

			if (empty($result)){
				$_SESSION['login'] = false;
				return 0;

			}
			else {
				$_SESSION['login'] = true;
				$this->setSession($result[0]['user_id']);
				return 1;
			}
		}
		
		public function setSession($id){
			$_SESSION['user_id'] = $id;
			$resultSet = $this->_db->query("
					SELECT user_email, user_firstname, user_lastname FROM users, users_info WHERE users_info.user_id = $id AND users.user_id = $id
					");
		
			$results = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$results[] = $row;
			
			foreach($results[0] as $key => $value){
				$_SESSION[$key] = $value;
			}
		}
		
		
		public function verifyLogin(){
			
		}
		
	
	}
