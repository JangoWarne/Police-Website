<?php


	$servername = "localhost";
	$username = "s1705124_user";
	$password = "ct4009ct4009";
	$dbname = "s1705124_PoliceWebsite";

	$connection = new mysqli($servername, $username, $password, $dbname);

	if($connection->connect_error) {
		echo $connection->connect_error;
	}
?>