<?php
$title = "user_name";
$bodyId = "account";
require_once dirname(__FILE__).'/inc/header.php';

?>


<main>
	<div id="wall">
		<div id="myAccount" class="box">
		
			<div id="myAccount_head" class="divHead">
				<img src="pics/user.png" alt="Me">
				<span>General Settings</span>
			</div>
			<div id="subLine">
				<span>Edit your profile information</span>
			</div>
			<div id=field>
				<p> <label class="line" for="firstName">First Name &nbsp </label> <input type="text" name="firstName" id="firstName"><br><span>Enter your first name</span></p>
				<p> <label class="line" for="lastName">Last Name &nbsp </label> <input type="text" name="lastName" id="lastName"><br><span>Enter your last name</span></p>
				<p> <label class="line" for="email">Email &nbsp </label> <input type="text" name="email" id="email"><br><span>E-mail will not be displayed</span></p>
				<p> <label class="line" for="bornDate">Born Date &nbsp </label> <input type="date" name="bornDate" id="bornDate"><br><span>Select the date you were born</span></p>
				<p> <label class="line" for="gender">Gender &nbsp </label>
					 <select id="gender">
					 	<option value="null">No Gender</option>
					 	<option value="male">Male</option>
					 	<option value="female">Female</option>
					 </select>
					 <br><span>Select your gender (male orfemale)</span>
				</p>
				<p> <label class="line" for="aboutMe">About me &nbsp </label><textarea id="aboutMe"></textarea><br><span>About you (160 characters or less)</span></p>
				<p> <label class="line" for="secretAbout">Secret about &nbsp </label><textarea id="secretAbout"></textarea></textarea><br><span>About you (160 characters or less)</span></p>
			</div>
		</div>
	</div>

	<aside>
	
	
	</aside>


</main>