<?php
$title = "Sociality+";
$bodyId = "profile";
require_once dirname(__FILE__).'/inc/header.php';

?>
	<main>
		<div id="coverWrapper">
			<div id="coverPhoto">
			 <img alt="Cover Photo" src="">
			</div>
				
			<div id="coverBottomLine">
				<div id="profilePhoto"><img alt="Profile Photo" class="profile-photo" src="pics/user.png"></div>
				<span id="fullName"><?php echo @$_SESSION["user_firstname"] . "&nbsp" . @$_SESSION["user_lastname"]?></span>
			</div>
		
		</div>
	
			<div id="wall">
			
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img alt="Me" class="profile-photo">
						 Update your status
					</div>
					<div id="newStatus_content">
						<textarea placeholder="What's on your mind?" autocomplete="off" aria-expanded="true"></textarea>
					</div>
					<div id="newStatus_footer">
						<button type="button">Post</button>
					</div>
				</div>
			</div>	
			
			<aside>
			
				<div id="myBar" class="box">
					<div id="myBar_head" class="divHead"><span>Welcome</span></div>
					<div id="myBar_content">
						<img src="pics/user.png" class="profile-photo" alt="Me">
						<div id="myBar_content_text">
							<span class="firstname"></span><br>
							<a href="account.php">Edit profile</a>
						</div>
					
					</div>
				</div>
				
				<div id="myDetails" class="box">
					<div id="myDetails_head" class="divHead"><span>My details</span></div>
					<div id="myDetails_content">
						<span class="fullName"></span><br>
					<!--  	<span id="dateOfBirth">01/01/1970</span> (<span id="age">40</span>)<br> -->
					<!--  	only to be added when user adds it -->
						<span id="email"></span>
						</div>
					
					
				</div>
				
				
				<div id="myFriends" class="box">
					<div id="myFriends_head" class="divHead"><span>My Friends</span> (<span id="numFriends"></span>)</div>
					<div id="myFriends_content" class="loading">
					</div>
				</div>
			
			</aside>
	</main>