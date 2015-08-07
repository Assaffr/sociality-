<?php
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
				
				</div>
			</div>