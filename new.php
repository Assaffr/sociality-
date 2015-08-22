<?php
$url = $_SERVER['PHP_SELF'];
$key = count(explode("/", $url));
$page = explode("/", $url)[$key-1];

echo $page;