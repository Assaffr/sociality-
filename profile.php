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
				<div id="profilePhoto"><img alt="Profile Photo" src="pics/user.png"></div>
				<span class="profilePageFullName"></span>
				
			</div>
		
		</div>
	
			<div id="wall">
			
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img alt="Me" class="profile-photo">
						 <span id="writePostProfileTitle">
					</div>
					<div id="newStatus_content">
						<textarea placeholder="What's on your mind?" id="postContent" aria-expanded="true"></textarea>
					</div>
					<div id="newStatus_footer">
						<button type="button" name="finishPost">Post</button>
					</div>
				</div>
					<div id="posts">
			</div>
			</div>	
			
			<aside>
			
				<div id="myBar" class="box">
					<div id="myBar_head" class="divHead"><span>About</span></div>
					<div id="myBar_content">
						<section> <span>Location:</span> <span></span></section>
						<section> <span>Born:</span> <span></span></section>
						<section> <span>Homepage:</span><span></span></section>
						<section><span> Facebook:</span> <span></span></section>
						<section> <span>Bio:</span> <span></span></section>
					</div>
				</div>
				
				<div id="myDetails" class="box">
					<div id="myDetails_head" class="divHead"><span>Fliter Posts</span></div>
					<div id="myDetails_content">
						<section> <strong><span>Posts written by:</span> <span class="profilePageFullName"></span></strong></section>
						<section> <strong><span>All time</span></strong></section>
						<section> <span>Option 1</span></section>
						<section> <span>Option 2</span></section>
						<section> <span>Option 3</span></section>
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