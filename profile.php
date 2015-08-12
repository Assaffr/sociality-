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
				<span id="profilePageFullName"></span>
			</div>
		
		</div>
	
			<div id="wall">
			
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img alt="Me" class="profile-photo">
						 <span id="writePostProfileTitle">
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
					<div id="myBar_head" class="divHead"><span>About</span></div>
					<div id="myBar_content">
						Location: NotInSqlLand<br>
						Born:<br>
						Gender: Yes<br>
						Homepage: notinsql.com<br>
						Facebook: Notin Sql<br>
						About:<br>
					
					</div>
				</div>
				
				<div id="myDetails" class="box">
					<div id="myDetails_head" class="divHead"><span>Fliter Posts</span></div>
					<div id="myDetails_content">
						<span class="fullName"></span><br>
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