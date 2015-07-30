<?php
$title = "Sociality+";
$bodyId = "home";
require_once dirname(__FILE__).'/inc/header.php';

?>
		<main>
			<div id="wall">
			
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img src="pics/user.png" alt="Me">
						<span class="firstname"></span>, update your status
					</div>
					<div id="newStatus_content">
						<textarea id="postContent" placeholder="What's on your mind?" autocomplete="off" aria-expanded="true"></textarea>
					</div>

					<div id="newStatus_footer">
						<button type="button" name="finishPost">Post</button>
					</div>
				</div>
				<!--  just checking how a regular post would look don't freak out -->
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img src="pics/user.png" alt="Me">
						<span class="fullName"></span>
					</div>
					<div id="newStatus_content">
						blah blah blah this is a post
					</div>

				</div>
				
			</div>	
			<aside>
			
				<div id="myBar" class="box">
					<div id="myBar_head" class="divHead"><span>Welcome</span></div>
					<div id="myBar_content">
						<img src="pics/user.png" alt="Me">
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
						<span id="dateOfBirth">01/01/1970</span> (<span id="age">40</span>)<br>
						<span id="email"></span>
						</div>
					
					
				</div>
				
				
				<div id="myFriends" class="box">
					<div id="myFriends_head" class="divHead"><span>My Friends</span> (<span id="numFriends"></span>)</div>
				</div>
			
			</aside>
		</main>
		<?php require_once dirname(__FILE__).'/inc/footer.php';?>