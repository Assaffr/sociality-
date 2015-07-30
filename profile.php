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
				<div id="profilePhoto"><img alt="Profile Photo" src=""></div>
				<span id="fullName">Omer Morad</span>
			</div>
		
		</div>
	
			<div id="wall">
			
				<div id="newStatus" class="box">
					<div id="newStatus_head" class="divHead">
						<img alt="Me">
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
					<div id="myBar_head" class="divHead"><span>About <a href="account.php">(Edit)</a></span></div>
					<div id="myBar_content">
						<div id="myBar_content_text">
							My Friends (<span id="numFriends">46</span>)<br>
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