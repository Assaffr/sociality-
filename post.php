<?php
$title = "Sociality+";
$bodyId = "home";
require_once dirname(__FILE__).'/inc/header.php';

?>
		<div id="loader"></div>
		<main>
			<div id="wall">
				<div id="posts">
				
				</div>
				
			</div>	
			<aside>
			
				<div id="myBar" class="box">
					<div id="myBar_head" class="divHead"><span>Welcome</span></div>
					<div id="myBar_content">
						<img src="pics/user.png" alt="Me" class="profile-photo">
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
						<span id="dateOfBirth"></span> <span id="age"></span> <br>
						<span id="email"></span>
						</div>
					
					
				</div>
				
				
				<div id="myFriends" class="box">
					<div id="myFriends_head" class="divHead"><span>My Friends</span> (<span id="numFriends"></span>)</div>
					<div id="myFriends_content" class="loading">
					</div>
				</div>
			
			</aside>
			<div class="C-B"></div>
		</main>
		<?php require_once dirname(__FILE__).'/inc/footer.php';?>