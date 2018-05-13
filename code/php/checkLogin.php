<?php
	// include files
	require_once 'session_io.php';
	
	$loggedIn = checkSession();
	$officer = false;
	
	// logged in?
	if ($loggedIn) {
		//logged in
		$officer = $_SESSION['officer'];
	}
	
	echo json_encode(array("loggedIn" => $loggedIn, "officer" => $officer));
	
?>