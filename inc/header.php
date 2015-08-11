<?php
session_start();
$url = $_SERVER['PHP_SELF'];
$key = count(explode("/", $url));
$page = explode("/", $url)[$key-1];

?>

<!DOCTYPE html>
<html>
	<head>
		<link rel="shortcut icon"href="data:image/png;base64,
		iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACEUlEQVR42o2S+0tTYRjH33/LlOiH
CEEogqIiBBEZZaEVCKbMG14oQk1n06asTVw4V25e52VGouG6DC3taqR4m7s5tx236c6+necth2dO
3AMvnPPlOd/3+X7Ow85cVyH5ZEpHY7QjKETg9Quoa7chVR8dlkpUVJggxuM4LCG8j8t3dekblD4Z
xtESxTjyy4zpG+QourDpCiQMPn/fxLlc9ckGlwq1eKx5g3v1FmTdUPFmem7rmUWzbhp3ql8j87/+
sHEEtepJZBd0/jO4WqznoA5L1/9BAjgHQrC86sHKho/ryqdWjM/+SPT9WfdxE6Z99V6W1+UNok66
IbmUzVZEogcyrbJlDKzpxbRMXHP6UVxrhmNpHeqX79DZZ8eCxKBQihESorLeBw0DYBfyn2NufhV7
kX14dgSUN43ybI3at9j2BLG25UeZlJu0Fv0MdoNhhPaisNgWcfbmM7D7EiyKQSPWtE1Ab/6IgnIj
YjExcVMgFMGVIj1M1gU+NvUahhzIK+0F2wmEZWPRDVWqcZlGQOmjI7vF69tvF5iYpNI7EXd5Qwnt
67KTR0out08Au1Vp4qDMk4voHZlHQ4eNL1KRBJLidJnsUCj7cPG2lptQjP6JLxxwbokh9SZ2Wz5x
Bku/nPi54kZMFPFIM5XeKp/P68CWO3BsXPqVGddaTzegVTYMOjgD4kGTbGzvorV7JuUEfwHUgQRx
V6VvIgAAAABJRU5ErkJggg==
		"/>
		<meta charset="utf-8">
		<title><?php echo $title;?></title>
		<link rel="stylesheet" type="text/css" href="css/main.css">
		<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
		<script src="functions.js"></script>
		<?php 
			$full_path = explode ("/", $_SERVER['PHP_SELF']);
			$path_with_php = explode (".", $full_path[2]);
			$file_name = $path_with_php[0];
			echo "<script src='script/".$file_name.".js'></script>";
			
		?>
		<link href='http://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>

	</head>
	<body id="<?php echo $bodyId;?>">
	
		
		
			<div id="topBar">
				<div id="topBarContent"> 
				<?php if($page != "index.php"):?>
					<div id="topBarNav">
						<a href="profile.php" title="My profile"><strong><?php echo @$_SESSION["user_firstname"] . "&nbsp" . @$_SESSION["user_lastname"]?></strong><img alt="" class="profile-photo"></a>
						<a href="home.php" title="Home"><img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABiSURBVFhH7dbRDcAgCIRh7GQdpaN0k47iKN0EWpPb4TfhvhfvkQQFo71RVZcyYhVQyohDJwYvYGTmo2w9rTswlRGeA/wc+DtwKhsCb4Gf4Rbr+FW2nvAvmefAFuv4VjZAxAeSWSwlc2ISXgAAAABJRU5ErkJggg=="></a>
						<a href="account.php" title="My account"><img src="data:image/png;base64, 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"></a>
						<a href="notification.php" title="Notification"><img src="data:image/png;base64, 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"></a>
						<a href="index.php" title="LogOut" onclick="logOut();"><img src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGMSURBVFhH7Ze/SsNQFIeT0MGhQ0cHhzopWNDRQSGdXFwc3Rwc9AF8CgcFH8BH8BHq6ObgoJuCBTs6OAhK4ndyzxWbXE3SGEG4H/w4J/fvr5dwmhsGFUnTdJmQiXxV88Moiq6IMzNlgIU7dqMwDAfkK5Lrc0fG5BjSfql5c5IkuWfTOsTMGWn+lb4uWUqkcWY4gV3CohWbj6W9Kr9hYIIerGh6Nz3VaGygKd6AN+AN/IkBipOrjGe0aoCNe5Tqc9IN01KkDQNHaMzmMbqmOu4Rt5DETGaYg7I/I/of0Ta60aZYp35CW5f+M9PtRodm1D2BFyT1XqIT1t8nHJinmpSdgIPCCQiss45udYyc3JOsbaXDikinzqlKwQBrXNDeQ3Pkx+jNNc7Sxku4hnq8fK98rskLuYkm0uGi9Tog34yYudPHAq0bKMMb8Aa8gf9vgFJ7gkZWNM2bnmrkL6d9NCCVC6lcTLOcStYluhgiuQfm74KnzHnW/EemDHwHv2yBYI0tIan3YmwHNbgdB8EHIPebFUJDmdIAAAAASUVORK5CYII="></a>
					</div>
					<?php endif ;?>
				</div>
			</div>
			
			
			
			
			
			
			