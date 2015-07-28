<?php
	class DB{
		public static $mysqli = NULL;
		
		private function __construct(){}
		
		public static function getResource(){
			if (self::$mysqli == NULL){
				$mysqli = new mysqli('localhost', 'root', '');
				$mysqli->select_db("socialityplus");
				return $mysqli;
			}
		}
}