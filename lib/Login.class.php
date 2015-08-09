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
				
			//no empty result
			if (empty($result)){
				$_SESSION['login'] = false;
				echo 0;
			}
			else {
				$_SESSION['login'] = true;
				$_SESSION['userID'] = $result [0]['user_id'];
				$moreDetails = $login->addUserInfoToSession( $_SESSION['userID'] );
				$_SESSION['user_email'] = $moreDetails[0]['user_email'];
				$_SESSION['user_firstname'] = $moreDetails[0]['user_firstname'];
				$_SESSION['user_lastname'] = $moreDetails[0]['user_lastname'];
			
				echo 1;
			}
		}
		
		public function setSession($id){
			$results = $this->_db->query("
					SELECT user_email, user_password, user_firstname, user_lastname FROM users, users_info WHERE users_info.user_id = $id AND users.user_id = $id
					");
		
			$resultSet = array();
			while ($row = mysqli_fetch_assoc ($results))
				$resultSet[] = $row;
			return $resultSet;
			//PUT KEY VALUE IN SESSION FOR EACH RESULTSET
		}
		
		
		public function verifyLogin(){
			
		}
		
	
	}
