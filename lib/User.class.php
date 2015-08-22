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
		
		public function addUser($userDetails){
			$query = "INSERT INTO users 
					(user_email , user_password)
					VALUES 
					('".$userDetails['user_email']."', '". md5 ( $userDetails['user_password'] ). "');
					INSERT INTO users_info ( user_id, user_firstname, user_lastname, user_profile_picture, user_secret_picture )
					VALUES (LAST_INSERT_ID(),'".$userDetails['user_firstname']."','".$userDetails['user_lastname']."', 'nopicture.png', 'nocover.jpg');" ;
		
			$results = $this->_db->multi_query($query); 

		return $results;
		}

		
		
			public function updateUser ($userID , $newDetails){
			
			$query = "UPDATE users_info SET user_firstname = '$newDetails[user_firstname]',
					user_lastname = '$newDetails[user_lastname]', user_about = '$newDetails[user_about]',
					user_secret_about = '$newDetails[user_secret_about]', user_birthdate = '$newDetails[user_birthdate]' 
					WHERE user_id = $userID;";
			
			$results = $this->_db->query($query); 
			// need to add ( updatethesessionfunction() )
			return $results	;
		}
		
		//split these in two - what if someone just wants to change ONE of these things? ;)
		public function setProfileImage ($userID , $imgPath){
			$query = "UPDATE users_info SET user_profile_picture = '".$imgPath."'  WHERE user_id = $userID;";
			$results = $this->_db->query($query);
			return $results;
		}
		
		public function setCoverImage ($userID , $imgPath){
			$query = "UPDATE users_info SET user_secret_picture = '".$imgPath."' WHERE user_id = $userID;";
			$results = $this->_db->query($query);
			return $results;
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
		
		
		public function checkEmailExists($email){
			$result = $this->_db->query("
						SELECT * FROM users WHERE user_email = '$email'
					");
			return $result->num_rows;
		}
		
			public function getUserInfo( $id ){
			
			$query = "SELECT user_firstname, user_lastname, user_about, user_secret_about, user_birthdate FROM users_info WHERE user_id = $id";
			$result = $this->_db->query( $query );
			$result = $result->fetch_assoc();
			$result["user_email"] = $_SESSION["user_email"];
			return json_encode( $result );
		}
		
		//sends all the user info for a user, for building a profile page
		public function buildProfile( $id ){
			$result = $this->_db->query("
						SELECT * FROM users_info WHERE user_id = $id;
					");
			$users = array();
			while ($row = mysqli_fetch_assoc ($result) )
				$users[] = $row;
			return $users;
		}
		
		
		public function getBirthday( $id ){
			$query = "SELECT user_birthdate, CURDATE(), TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) as age FROM users_info WHERE user_id = $id";
			$result = $this->_db->query($query);
			$users = array();
			while ($row = mysqli_fetch_assoc ($result) )
				$users[] = $row;
			return $users[0]['age'];
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
