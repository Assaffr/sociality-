CREATE DATABASE socialityplus;
USE socialityplus;

/*
 *	This table represents the post
 *	of that has been written by users.
 */

CREATE TABLE IF NOT EXISTS posts (
	post_id bigint(11) NOT NULL AUTO_INCREMENT,
	user_id int(8) NOT NULL,
	post_content text COLLATE utf8_unicode_ci NOT NULL,
	post_created datetime NOT NULL,
	PRIMARY KEY (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9000;

/*
 *	If user posts a post on another user's wall
 *	we have to insert it to posts_relations
 */
CREATE TABLE IF NOT EXISTS posts_relations (
	post_id bigint(11) NOT NULL,
	user_id int(8) NOT NULL,
	post_to_friend_id int(8) NOT NULL,
	PRIMARY KEY (post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS users (
	user_id int(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	user_email varchar(50) UNIQUE COLLATE utf8_unicode_ci NOT NULL,
	user_password varchar(32) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB	DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=100001;


CREATE TABLE IF NOT EXISTS users_info (
	user_id int(8) NOT NULL,
	user_firstname varchar(30) COLLATE utf8_unicode_ci NOT NULL,
	user_lastname varchar(30) COLLATE utf8_unicode_ci NOT NULL,
	user_about text COLLATE utf8_unicode_ci,
	user_secret_about varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
	user_created datetime NOT NULL,
	user_birthdate date,
	user_profile_picture varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
	user_secret_picture varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
	PRIMARY KEY (user_id),
	KEY user_profile_picture (user_profile_picture),
	KEY user_secret_picture (user_secret_picture)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE IF NOT EXISTS friend_request (
	request_id bigint(11) NOT NULL AUTO_INCREMENT,
	user_id int(8) NOT NULL,
	user_friend_id int(8) NOT NULL,
	request_created datetime NOT NULL,
	PRIMARY KEY (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=500;


CREATE TABLE IF NOT EXISTS friends (
	friendship_id bigint(11) NOT NULL AUTO_INCREMENT,
	user_id int(8) NOT NULL,
	user_friend_id int(8) NOT NULL,
	friendship_created datetime NOT NULL,
	PRIMARY KEY (friendship_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=500;


CREATE TABLE IF NOT EXISTS blocks (
	block_id bigint(11) NOT NULL AUTO_INCREMENT,
	user_id int(8) NOT NULL,
	user_friend_id int(8) NOT NULL,
	block_created datetime NOT NULL,
	PRIMARY KEY (block_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=500;


CREATE TABLE IF NOT EXISTS likes (
	like_id bigint(14) PRIMARY KEY AUTO_INCREMENT,
	user_id int(8) NOT NULL,
	like_created datetime NOT NULL,
	post_id bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000;


CREATE TABLE IF NOT EXISTS comments (
	comment_id bigint(14) AUTO_INCREMENT PRIMARY KEY,
	comment_content text NOT NULL,
	comment_time datetime NOT NULL,
	user_id int(8) NOT NULL,
	post_id bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1000;


(SELECT user_friend_id FROM `friends` WHERE user_id = 3466) UNION (SELECT user_id FROM `friends` WHERE user_friend_id = 3466)