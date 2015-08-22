<?php
$title = "Change your images";
$bodyId = "account";
require_once dirname(__FILE__).'/inc/header.php';

?>


<main>
	<div id="wall">
		<div id="myAccount_pic" class="box">
		
			<div id="myAccount_head" class="divHead">
				<img src="pics/user.png" alt="Me" class="profile-photo">
				<span>Profile Settings</span>
			</div>
			<div class="subLine">
				<span>Change your account picture</span>
			</div>
			
			<section id="profile_pic">
				<div id="pic"><img alt="profile pic" src="" class="profile-photo"></div>
				<div class="pic_field">
					<form id="profilePhotoForm" action="" method="post" enctype="multipart/form-data">
     				   <input type="file" id="profileImageFile" name="upload"/><br>
     				   <input type="submit" value="Upload Photo" id='uploadPhotoButton'>
					</form>
				
				</div>
			</section>
			
			<section id="cover">
				<div class="subLine">
					<span>Change your cover picture</span>
				</div>
				<div id="cover_photo">
					<img alt="Cover Photo" src="">
				</div>
				<div class="pic_field">
					<form id="coverPhotoForm" action="" method="post" enctype="multipart/form-data">
     				   <input type="file" id="coverImageFile" name="upload"/><br>
     				   <input type="submit" value="Upload Photo" id='uploadPhotoButton'>
					</form>
				
				</div>
			
			</section>
			
		</div>
	</div>

	<aside>
	
		<div id="settings" class="box">
			<div id="" class="divHead"><span>Settings</span></div>
			<div id="settings_content">
				<section><a href="account.php"><span>General</span></a></section>
				<section><span><strong>Profile Picture</strong></span></section>
				<section><a href="notifications.php"><span>Notifications</span></a></section>
				<section><a href="password.php"><span>Password</span></a></section>
			</div>
		</div>
				
			
	</aside>

</main>
<?php 
require_once dirname(__FILE__).'/inc/footer.php';
?>