<?php

	class User{
		
		private $_db;

		/**
		 *  __construct
		 *
		 * This function get single connection to a database and put it in $this->_db
		 *
		 * @no param needed
		 * @no return
		 */
		public function __construct(){
			$this->_db = DB::getResource();
		}
		
		/**
		 *	addUser
		 *
		 *	registers a user
		 *
		 *	@param (array) ($userDetails) the new user's details
		 *	@return (boolean) ($results) whether it worked or not
		 */
		public function addUser($userDetails){
			$query = "INSERT INTO users 
					(user_email , user_password)
					VALUES 
					('".$userDetails['user_email']."', '". md5 ( $userDetails['user_password'] ). "');
					INSERT INTO users_info ( user_id, user_firstname, user_lastname, user_profile_picture, user_secret_picture, user_created )
					VALUES (LAST_INSERT_ID(),'".$userDetails['user_firstname']."','".$userDetails['user_lastname']."', 'nopicture.png', 'nocover.jpg' , CURRENT_TIME());" ;
		
			$results = $this->_db->multi_query($query); 

		return $results;
		}

		
		/**
		 *	updateUser
		 *
		 *	updates a user's details
		 *
		 *	@param (int) ($userID) the  user's id
		 *	@param (array) ($newDetails) the  user's new details
		 *	@return (boolean) ($results) whether it worked or not
		 */
		public function updateUser ($userID , $newDetails){
			$query = "UPDATE users_info SET user_firstname = '$newDetails[user_firstname]',
					user_lastname = '$newDetails[user_lastname]', user_about = '$newDetails[user_about]',
					user_secret_about = '$newDetails[user_secret_about]', user_birthdate = '$newDetails[user_birthdate]' 
					WHERE user_id = $userID;";
			
			$results = $this->_db->query($query); 
			$this->updateSession( $userID );
			return $results	;
		}
		
		/**
		 *	updateSession
		 *
		 *	for when we're updatin user's info - update session so they see the change
		 *	without having to log out and back in.
		 *
		 *	@param (int) ($id) the  user's id
		 *	@return (-) (-) none
		 */
		private function updateSession( $id ){
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
		
		/**
		 *	setProfileImage
		 *
		 *	sets a new profile image
		 *
		 *	@param (int) ($userID) the  user's id
		 *	@param (string) ($imgPath) the image path
		 *	@return (boolean) ($results) whether it worked or not
		 */
		public function setProfileImage ($userID , $imgPath){
			$query = "UPDATE users_info SET user_profile_picture = '".$imgPath."'  WHERE user_id = $userID;";
			$results = $this->_db->query($query);
			return $results;
		}
		
		/**
		 *	setCoverImage
		 *
		 *	sets a new cover image
		 *
		 *	@param (int) ($userID) the  user's id
		 *	@param (string) ($imgPath) the image path
		 *	@return (boolean) ($results) whether it worked or not
		 */
		public function setCoverImage ($userID , $imgPath){
			$query = "UPDATE users_info SET user_secret_picture = '".$imgPath."' WHERE user_id = $userID;";
			$results = $this->_db->query($query);
			return $results;
		}
		
		
		/**
		 *	checkEmailExists
		 *
		 *	for registeration - make sure a user hasn't already used this email!
		 *
		 *	@param (string) ($email) the email
		 *	@return (boolean) ($result->num_rows) whether it's available or not
		 */
		public function checkEmailExists($email){
			$result = $this->_db->query("
						SELECT * FROM users WHERE user_email = '$email'
					");
			return $result->num_rows;
		}
		
		/**
		 *	getUserInfo
		 *
		 *	for account page - gets the info to fill the inputs with.
		 *
		 *	@param (int) ($id) the  user's id
		 *	@return (object) (json_encode( $result )) the user info
		 */
		public function getUserInfo( $id ){
			$query = "SELECT user_firstname, user_lastname, user_about, user_secret_about, user_birthdate FROM users_info WHERE user_id = $id";
			$result = $this->_db->query( $query );
			$result = $result->fetch_assoc();
			$result["user_email"] = $_SESSION["user_email"];
			return json_encode( $result );
		}
		
		
		/**
		 *	buildProfile
		 *
		 *	sends all the user info for a user, for building a profile page
		 *
		 *	@param (int) ($id) the  user's id
		 *	@return (array) ($users) the user info
		 */
		public function buildProfile( $id ){
			$result = $this->_db->query("
						SELECT * FROM users_info WHERE user_id = $id;
					");
			$users = array();
			while ($row = mysqli_fetch_assoc ($result) )
				$users[] = $row;
			return $users;
		}
		
		/**
		 *	getBirthday
		 *
		 *	gets the user's age by their birthday
		 *
		 *	@param (int) ($id) the  user's id
		 *	@return (int) ($users[0]['age']) the age
		 */
		public function getBirthday( $id ){
			$query = "SELECT user_birthdate, CURDATE(), TIMESTAMPDIFF(YEAR, user_birthdate, CURDATE()) as age FROM users_info WHERE user_id = $id";
			$result = $this->_db->query($query);
			$users = array();
			while ($row = mysqli_fetch_assoc ($result) )
				$users[] = $row;
			return $users[0]['age'];
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
