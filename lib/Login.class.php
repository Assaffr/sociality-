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
			$result = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$result[] = $row;
			return $result;
		}
		
		public function verifyLogin(){
			
		}
		
	
	}
