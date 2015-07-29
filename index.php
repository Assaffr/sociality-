<?php
//just checking i can use this repository ((:
$title = "Welcome To Sociality+";
$bodyId = "index";
include_once dirname(__FILE__).'/inc/header.php';
?>


		<div id="main">
			
			<div id="mainContent">
			
				<div id="leftContent">
				 <h1>Welcome</h1>
				 <h3>To Sociality+, JohnBryce's social network.</h3>
				 <h3>Share your memories, connect with others,<br> make new friends.</h3>
				</div>
				
				<div id="rightContent">
				
					<div id="login">
						<input type="text" class="login" id="email" placeholder="Email">
						<input type="password" class="login" id="password" placeholder="Password">
						<button type="button" id="loginButton">LOGIN</button>
					
					</div>
					<div id="registration">
						<div id="errorBox"><h3>Error</h3><span id="x">x</span><br><span id="errorReg">This username already exists</span></div>
						<input type="text" id="email" placeholder="Email" class="register">
						<input type="password" id="password" placeholder="Password" class="register">
						<input type="password" id="re-password" placeholder="Re-enter password" class="register">
						<button type="button" id="registerButton">REGISTER</button>
					</div>
					
				</div>
			</div>
			
			
		</div>
	</body>
</html>





