<?php

	class User{
		
		private $_db;
		
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
	
		public function getAllUsers(){
			$result = $this->_db->query("
						SELECT users.user_id, users.user_email,users.user_password,users_info.user_nickname, users_info.user_firstname, users_info.user_lastname, users_info.user_about, users_info.user_secret_about, users_info.user_created, users_info.user_birthdate FROM users INNER JOIN users_info ON users.user_id=users_info.user_id
					");
			$users = array();
			while ($row = mysqli_fetch_assoc ($result))
				$users[] = $row;
			return $users;
		}
		//ASSAF FIX THIS !!!!!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!~!
		public function addUser($userDetails){
			$query = "INSERT INTO users 
					(user_email , user_password)
					VALUES 
					('".$userDetails['user_email']."', '".$userDetails['user_password']."');
					INSERT INTO users_info ( user_id, user_firstname, user_lastname)
					VALUES (LAST_INSERT_ID(),'".$userDetails['user_firstname']."','".$userDetails['user_lastname']."');" ;		 
		
			$results = $this->_db->query($query); 
		
		return $results;
		}
		
		
		//ASSAF'S - NEEDS FIXING
			public function updateUser ($userID , $newDetails){
			
			$query = "UPDATE users_info SET user_nickname = '".$newDetails['user_nickname']."', user_firstname = '".$newDetails['user_firstname']."',
					user_lastname = '".$newDetails['user_lastname']."', user_about = '".$newDetails['user_about']."',
					user_secret_about = '".$newDetails['user_secret_about']."', user_birthdate = '".$newDetails['user_birthdate']."' 
					WHERE user_id = $userID;";
			
			$results = $this->_db->query($query); 
			
			return $results;
		}
		
		
		public function setimages ($userID , $imgPath){
			
		
			$query = "UPDATE users_info SET user_profile_picture = '".$imgPath['user_profile_picture']."' , 
					user_secret_picture = '".$imgPath['user_secret_picture']."' WHERE user_id = $userID;";
			
			return $query;
		}
		
	
		//END OF ASSAF'S
		
		public function getID($email, $password){
			$id = $this->_db->query("
						SELECT user_id FROM users WHERE user_email = '$email' AND user_password = '" . md5( $password ) . "';
					");	
					
			$users = array();
			while ($row = mysqli_fetch_assoc ($id))
				$users[] = $row;
			return $users;
		}
		
		public function addUserInfo($details){

			$insert = $this->_db->query("
						INSERT INTO socialityplus.users_info 
						(user_id, user_nickname, user_firstname, user_lastname, user_about, user_secret_about, user_birthdate, user_created)
						VALUES ('$details[id]', '$details[nickname]', '$details[firstName]', '$details[lastName]', '$details[about]', '$details[secretAbout]', '$details[birthday]', CURRENT_TIMESTAMP);
					");
				return $insert;	
			
		}
		
		////allready have "updateUser()" on line 37
		
	/*	public function updateUser($details){
			$this->_db->query("
					
					UPDATE socialityplus.users_info SET user_nickname = '$details[nickname]', user_firstname = '$details[firstName]', 
					user_lastname = '$details[lastName]', user_about = '$details[about]', user_secret_about = '$details[secretAbout]', user_created = '$details[created]', user_birthdate = '$details[birthday]' WHERE users_info.user_id = $details[id];
					");
			$this->_db->query("
					
					UPDATE socialityplus.users SET user_email = '$details[email]', user_password = '$details[password]' WHERE users.user_id = $details[id];
					");		
		}*/
		
		public function deleteUser($id){
			$this->_db->query("
						DELETE FROM users WHERE user_id = $id;
					");
		}
		
		public function getUserForList($ID){
			$result = $this->_db->query("
						SELECT users.user_id, users.user_email,users.user_password,users_info.user_nickname, users_info.user_firstname, users_info.user_lastname, users_info.user_about, users_info.user_secret_about, users_info.user_created, users_info.user_birthdate FROM users INNER JOIN users_info ON users.user_id=users_info.user_id AND users_info.user_id = $ID
					");
			$users = array();
			while ($row = mysqli_fetch_assoc ($result))
				$users[] = $row;
			return $users;
		}
		
		public function getUserEmail($ID){
			$result = $this->_db->query("
						SELECT user_email FROM users WHERE user_id = $ID
					");
			$users = array();
			while ($row = mysqli_fetch_assoc ($result))
				$users[] = $row;
			return $users;
		}
		
		public function getUserFullName($ID){
			$resultSet = $this->_db->query("
						SELECT user_firstname, user_lastname FROM users_info WHERE user_id = $ID
					");
			$result = array();
			while ($row = mysqli_fetch_assoc ($resultSet))
				$result[] = $row;
			
			$fullName = $result[0]['user_firstname'] . " " . $result[0]['user_lastname'];
			return $fullName;
		}
		
		public function checkEmailExists($email){
			$result = $this->_db->query("
						SELECT COUNT(*) FROM users WHERE user_email = '$email'
					");
			$users = array();
			while ($row = mysqli_fetch_assoc ($result))
				$users[] = $row;		
			return $users;
		}
		
	
	}
