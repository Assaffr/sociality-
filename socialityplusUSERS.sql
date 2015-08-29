-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2015 at 08:05 PM
-- Server version: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `socialityplus`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE IF NOT EXISTS `blocks` (
  `block_id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) NOT NULL,
  `user_friend_id` int(8) NOT NULL,
  `block_created` datetime NOT NULL,
  PRIMARY KEY (`block_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=502 ;

--
-- Dumping data for table `blocks`
--

INSERT INTO `blocks` (`block_id`, `user_id`, `user_friend_id`, `block_created`) VALUES
(500, 100008, 100001, '2015-08-28 19:52:55'),
(501, 100007, 100002, '2015-08-28 20:43:11');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE IF NOT EXISTS `comments` (
  `comment_id` bigint(14) NOT NULL AUTO_INCREMENT,
  `comment_content` text COLLATE utf8_unicode_ci NOT NULL,
  `comment_time` datetime NOT NULL,
  `user_id` int(8) NOT NULL,
  `post_id` bigint(11) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1021 ;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `comment_content`, `comment_time`, `user_id`, `post_id`) VALUES
(1000, 'For sure!', '2015-08-28 19:55:40', 100008, 9003),
(1001, 'What is up?', '2015-08-28 19:55:45', 100008, 9002),
(1002, 'Heck ya!', '2015-08-28 20:05:35', 100006, 9003),
(1003, 'How great life is!', '2015-08-28 20:06:34', 100001, 9005),
(1004, 'Yes!', '2015-08-28 20:28:32', 100005, 9005),
(1005, 'Dave!', '2015-08-28 20:28:38', 100005, 9004),
(1006, 'Youre a riot!', '2015-08-28 20:42:42', 100007, 9018),
(1007, 'Hello!', '2015-08-28 20:42:46', 100007, 9017),
(1008, 'Can I join?', '2015-08-28 20:44:03', 100006, 9020),
(1009, 'Hello!', '2015-08-28 20:44:07', 100006, 9019),
(1010, 'Agreed! This site is a winner!', '2015-08-28 20:45:16', 100004, 9021),
(1011, 'So many options!', '2015-08-28 20:45:46', 100008, 9021),
(1012, 'I love it!', '2015-08-28 20:49:11', 100004, 9021),
(1013, 'It is the best!', '2015-08-28 20:49:16', 100004, 9005),
(1014, 'Daisy!', '2015-08-28 20:49:23', 100004, 9004),
(1015, 'Hey!', '2015-08-28 20:53:02', 100004, 9002),
(1016, 'Enjoy :D', '2015-08-28 20:55:49', 100002, 9022),
(1017, 'You bet!', '2015-08-28 20:56:54', 100005, 9023),
(1018, 'I guess...', '2015-08-28 20:57:16', 100007, 9020),
(1019, 'Great!', '2015-08-28 21:01:20', 100001, 9024),
(1020, 'Dont spend too much!', '2015-08-28 21:01:54', 100006, 9025);

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE IF NOT EXISTS `friends` (
  `friendship_id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) NOT NULL,
  `user_friend_id` int(8) NOT NULL,
  `friendship_created` datetime NOT NULL,
  PRIMARY KEY (`friendship_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=532 ;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`friendship_id`, `user_id`, `user_friend_id`, `friendship_created`) VALUES
(500, 100002, 100001, '2015-08-28 19:40:07'),
(501, 100002, 100006, '2015-08-28 19:40:33'),
(502, 100001, 100006, '2015-08-28 19:41:22'),
(503, 100004, 100002, '2015-08-28 19:46:12'),
(504, 100004, 100006, '2015-08-28 19:46:12'),
(505, 100004, 100001, '2015-08-28 19:46:13'),
(506, 100008, 100002, '2015-08-28 19:52:58'),
(507, 100008, 100004, '2015-08-28 19:55:12'),
(521, 100005, 100002, '2015-08-28 20:27:24'),
(522, 100005, 100003, '2015-08-28 20:28:00'),
(523, 100005, 100001, '2015-08-28 20:28:11'),
(524, 100005, 100006, '2015-08-28 20:28:13'),
(525, 100005, 100008, '2015-08-28 20:28:14'),
(526, 100005, 100007, '2015-08-28 20:28:14'),
(527, 100007, 100006, '2015-08-28 20:43:09'),
(528, 100007, 100001, '2015-08-28 20:43:12'),
(529, 100003, 100002, '2015-08-28 20:44:49'),
(530, 100003, 100001, '2015-08-28 20:44:54'),
(531, 100008, 100006, '2015-08-28 20:45:34');

-- --------------------------------------------------------

--
-- Table structure for table `friend_request`
--

CREATE TABLE IF NOT EXISTS `friend_request` (
  `request_id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) NOT NULL,
  `user_friend_id` int(8) NOT NULL,
  `request_created` datetime NOT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=536 ;

--
-- Dumping data for table `friend_request`
--

INSERT INTO `friend_request` (`request_id`, `user_id`, `user_friend_id`, `request_created`) VALUES
(534, 100003, 100006, '2015-08-28 20:44:45'),
(535, 100003, 100007, '2015-08-28 20:44:58');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE IF NOT EXISTS `likes` (
  `like_id` bigint(14) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) NOT NULL,
  `like_created` datetime NOT NULL,
  `post_id` bigint(11) NOT NULL,
  PRIMARY KEY (`like_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1018 ;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`like_id`, `user_id`, `like_created`, `post_id`) VALUES
(1000, 100008, '2015-08-28 19:55:36', 9003),
(1001, 100006, '2015-08-28 20:05:37', 9003),
(1002, 100006, '2015-08-28 20:05:40', 9002),
(1003, 100006, '2015-08-28 20:05:41', 9001),
(1004, 100001, '2015-08-28 20:06:28', 9005),
(1005, 100005, '2015-08-28 20:28:34', 9005),
(1006, 100005, '2015-08-28 20:28:36', 9004),
(1007, 100007, '2015-08-28 20:42:39', 9018),
(1008, 100007, '2015-08-28 20:42:44', 9017),
(1009, 100007, '2015-08-28 20:42:50', 9015),
(1010, 100004, '2015-08-28 20:45:08', 9021),
(1011, 100008, '2015-08-28 20:45:41', 9021),
(1012, 100004, '2015-08-28 20:49:19', 9004),
(1013, 100004, '2015-08-28 20:52:59', 9002),
(1014, 100002, '2015-08-28 20:55:41', 9022),
(1015, 100005, '2015-08-28 20:56:55', 9023),
(1016, 100006, '2015-08-28 21:01:56', 9025),
(1017, 100006, '2015-08-28 21:02:04', 9024);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(8) NOT NULL,
  `post_content` text COLLATE utf8_unicode_ci NOT NULL,
  `post_created` datetime NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=9026 ;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `post_content`, `post_created`) VALUES
(9000, 100001, 'I had such a nice day!', '2015-08-28 19:42:26'),
(9001, 100001, 'Hows it going, Jack?', '2015-08-28 19:42:37'),
(9002, 100002, 'Hey!', '2015-08-28 19:44:32'),
(9003, 100004, 'Great times', '2015-08-28 19:45:24'),
(9004, 100008, 'My name is Phil, what is yours?', '2015-08-28 19:55:34'),
(9005, 100006, 'What are you guys talking about?', '2015-08-28 20:06:17'),
(9006, 100005, 'Hey Cheryl!', '2015-08-28 20:28:52'),
(9007, 100005, 'How are you today?', '2015-08-28 20:29:27'),
(9008, 100005, 'Good!', '2015-08-28 20:30:33'),
(9009, 100005, 'Good stuff!', '2015-08-28 20:30:45'),
(9010, 100005, 'Hey!', '2015-08-28 20:31:39'),
(9011, 100005, 'Hey everyone!', '2015-08-28 20:31:49'),
(9012, 100005, 'Hey', '2015-08-28 20:32:49'),
(9013, 100005, 'Ya', '2015-08-28 20:33:08'),
(9014, 100005, 'Hey', '2015-08-28 20:34:03'),
(9015, 100005, 'Phil! Good talking to you!', '2015-08-28 20:34:33'),
(9016, 100005, 'Yes!', '2015-08-28 20:35:08'),
(9017, 100005, 'Hey!', '2015-08-28 20:40:23'),
(9018, 100005, 'Dave time!', '2015-08-28 20:40:30'),
(9019, 100007, 'Its me, cheryl!', '2015-08-28 20:42:36'),
(9020, 100007, 'Lets meet up for drinks!', '2015-08-28 20:43:27'),
(9021, 100006, 'What a cool, well built site ;)', '2015-08-28 20:44:20'),
(9022, 100004, 'Having fun!', '2015-08-28 20:53:19'),
(9023, 100002, 'Drinks this friday?', '2015-08-28 20:56:30'),
(9024, 100007, 'Had fun last night!', '2015-08-28 20:58:56'),
(9025, 100001, 'Going shopping!', '2015-08-28 21:01:02');

-- --------------------------------------------------------

--
-- Table structure for table `posts_relations`
--

CREATE TABLE IF NOT EXISTS `posts_relations` (
  `post_id` bigint(11) NOT NULL,
  `user_id` int(8) NOT NULL,
  `post_to_friend_id` int(8) NOT NULL,
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `posts_relations`
--

INSERT INTO `posts_relations` (`post_id`, `user_id`, `post_to_friend_id`) VALUES
(9001, 100001, 100002),
(9006, 100005, 100007),
(9007, 100005, 100007),
(9008, 100005, 100007),
(9009, 100005, 100007),
(9010, 100005, 100001),
(9012, 100005, 100008),
(9013, 100005, 100004),
(9014, 100005, 100004),
(9015, 100005, 100008),
(9017, 100005, 100007),
(9020, 100007, 100001),
(9023, 100002, 100005),
(9024, 100007, 100008);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(8) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `user_password` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=100009 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_password`) VALUES
(100001, 'lauren@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b'),
(100002, 'jack@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b'),
(100003, 'harry@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b'),
(100004, 'daisy@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b'),
(100005, 'dave@gmail.com', '81dc9bdb52d04dc20036dbd8313ed055'),
(100006, 'emily@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b'),
(100007, 'cheryl@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b'),
(100008, 'phil@gmail.com', '827ccb0eea8a706c4c34a16891f84e7b');

-- --------------------------------------------------------

--
-- Table structure for table `users_info`
--

CREATE TABLE IF NOT EXISTS `users_info` (
  `user_id` int(8) NOT NULL,
  `user_firstname` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `user_lastname` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `user_about` text COLLATE utf8_unicode_ci,
  `user_secret_about` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_created` datetime NOT NULL,
  `user_birthdate` date DEFAULT NULL,
  `user_profile_picture` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_secret_picture` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `user_profile_picture` (`user_profile_picture`),
  KEY `user_secret_picture` (`user_secret_picture`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users_info`
--

INSERT INTO `users_info` (`user_id`, `user_firstname`, `user_lastname`, `user_about`, `user_secret_about`, `user_created`, `user_birthdate`, `user_profile_picture`, `user_secret_picture`) VALUES
(100001, 'Lauren', 'Collins', 'I like stuff!', '', '2015-08-28 19:30:31', '1989-05-04', 'lauren.jpg', 'coverz.jpg'),
(100002, 'Jack', 'Walker', 'Hey whats up', '', '2015-08-28 19:31:31', '1984-05-10', 'jack.jpg', 'its_easy_if_you_try-5332.jpg'),
(100003, 'Harry', 'Daniels', 'Sup!', 'Ya!', '2015-08-28 19:32:31', '1987-06-19', 'harry.jpg', 'city.jpg'),
(100004, 'Daisy', 'Goodwin', 'Hey', '', '2015-08-28 19:30:10', '1985-10-15', 'daisy.jpg', 'hearts.jpg'),
(100005, 'Dave', 'Frank', 'My name is Dave and I like stuff', '', '2015-08-28 19:29:11', '1989-07-28', 'dave.jpg', 'awesome.jpg'),
(100006, 'Emily', 'Sinclair', 'I am so happy!!', 'Or am I?', '2015-08-28 19:34:31', '1990-07-07', 'emily.jpg', 'pweedie-cover-photo-1606.jpg'),
(100007, 'Cheryl', 'Martin', NULL, NULL, '2015-08-28 19:33:31', NULL, 'cheryl.jpg', 'dream.png'),
(100008, 'Phil', 'Tyler', 'Living life to the fullest', 'Shhh secret', '2015-08-28 19:36:37', '1989-05-17', 'phil.jpg', 'life.jpg');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
