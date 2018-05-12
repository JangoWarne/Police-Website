<?php

	$servername = "localhost:3306";
	$username = "s1609415_user";
	$password = "BTG=G~).#xKg";
	$dbname = "s1609415_police-website";

	$connection = new mysqli($servername, $username, $password, $dbname);

	if($connection->connect_error) {
		echo $connection->connect_error;
	}
?>