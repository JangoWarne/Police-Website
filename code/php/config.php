<?php

	$servername = "localhost:3306";
	$username = "s1711500_user";
	$password = "?]c}pz&zT}v+";
	$dbname = "s1711500_police-website";

	$connection = new mysqli($servername, $username, $password, $dbname);

	if($connection->connect_error) {
		echo $connection->connect_error;
	}
?>