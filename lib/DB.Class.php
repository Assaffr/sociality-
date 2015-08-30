<?php
	class DB{
		public static $mysqli = NULL;
		
		/**
		 *	__construct
		 *
		 *	ensures theres only one instance of sql
		 *
		 *	@param (type) (name) about this param
		 *	@return (type) (name)
		 */
		
		private function __construct(){}
		
		/**
		 *	getResource
		 *
		 *	holds the sql resource in it
		 *
		 *	@return (object) ($mysqli)
		 */
		public static function getResource(){
			if (self::$mysqli == NULL){
				$mysqli = new mysqli('localhost', 'root', '');
				$mysqli->select_db("socialityplus");
				return $mysqli;
			}
		}
}