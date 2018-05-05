<?php


	$servername = "localhost";
	$username = "s1705124_user";
	$password = "N#erd;~KONdy"; // database password
	$dbname = "s1705124_PoliceWebsite";

	$connection = new mysqli($servername, $username, $password, $dbname);

	if($connection->connect_error) {
		echo $connection->connect_error;
	}
?>