<?php

	class Login{
		
		private $_db;
		//private $friends;		
		
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
		
		/**
		 *  match
		 *
		 * Matches email and password to try and login.
		 *
		 * @param ( string ) ( $email ) email entered
		 * @param ( string ) ( $password ) password entered
		 * @return ( boolean ) ( 0 ) no match
		 * @return ( boolean ) ( 1 ) match
		 */
		public function match( $email, $password ){
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
		
		/**
		 *  setSession
		 *
		 * sets a session with the user details
		 *
		 * @param ( int ) ( $id ) the id of the user
		 */
		public function setSession( $id ){
			$_SESSION['user_id'] = $id;
			$resultSet = $this->_db->query("
					SELECT user_email, user_firstname, user_lastname, user_profile_picture, user_secret_picture, user_birthdate FROM users, users_info WHERE users_info.user_id = $id AND users.user_id = $id
					");
		
			$results = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$results[] = $row;
			
			foreach($results[0] as $key => $value){
				$_SESSION[$key] = $value;
			}
			
		}
		
		
		
	
	}
