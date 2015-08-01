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
<<<<<<< HEAD

=======
				
				<div id="status" class="box">
					<div id="Status_head">
						<strong>x</strong>
						<img alt="S.writer">
						<div>
						<a href="profile/id">Assaf Farhan</a><br>
						<span class="postSince">49 mins</span>
						</div>
					</div>
					
					<div id="status_content">
						<p>Dramatic Bodycam Footage Shows Knife Wielding Man Attack Police Officers</p>
					</div>

					<div id="status_footer">
						<div id="comment">
						</div>
						<img alt="me">
						<textarea placeholder="Leave a comment..."></textarea>
						
					</div>
				</div>

				
>>>>>>> origin/master
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
					<!--  	<span id="dateOfBirth">01/01/1970</span> (<span id="age">40</span>)<br> -->
					<!--  	only to be added when user adds it -->
						<span id="email"></span>
						</div>
					
					
				</div>
				
				
				<div id="myFriends" class="box">
					<div id="myFriends_head" class="divHead"><span>My Friends</span> (<span id="numFriends"></span>)</div>
				</div>
			
			</aside>
		</main>
		<?php require_once dirname(__FILE__).'/inc/footer.php';?>