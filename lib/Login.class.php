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
					//Why use an array?! you get only one row!!! with 0 or 1.
			$result = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$result[] = $row;
			return $result;
		}
		
		///what is this? 
		
		public function verifyLogin(){
			
		}
		
	
	}
