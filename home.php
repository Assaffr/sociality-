<?php
$title = "Sociality+";
$bodyId = "home";
include_once dirname(__FILE__).'/inc/header.php';

?>
		<main>
			<div id="wall">
			
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img alt="Me">
						<span class="username">Omer</span>, Update your status
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
						<img alt="Me">
						<div id="myBar_content_text">
							<span class="username">Omerico</span><br>
							<a href="account.php">Edit profile</a>
						</div>
					
					</div>
				</div>
				
				<div id="myDetails" class="box">
					<div id="myDetails_head" class="divHead"><span>My details</span></div>
					<div id="myDetails_content">
						<span id="fullName">Omerico</span><br>
						<span id="dateOfBirth">01/01/1970</span> (<span id="age">40</span>)<br>
						<span id="email">Omer@morad.com</span>
						</div>
					
					
				</div>
				
				
				<div id="myFriends" class="box">
					<div id="myFriends_head" class="divHead"><span>My Friends</span> (<span id="numFriends">46</span>)</div>
				</div>
			
			</aside>
	




		</main>
	</body>
</html>
