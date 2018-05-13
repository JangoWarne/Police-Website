<?php
	session_start();
	
	// Create session
	function loginSessionPublic($user) {
		
/*
		ini_set('session.save_handler', 'files');
		ini_set('session.use_cookies', 1);
		//ini_set('session.cookie_secure', 1);   // use if enforcing https
		ini_set('session.use_only_cookies', 1);
		ini_set('session.cookie_domain', "example.com");
		ini_set('session.cookie_httponly', 1);
		ini_set('session.entropy_length', 64);
		ini_set('session.entropy_file', '/dev/urandom');
		ini_set('session.hash_function', 'sha256');
		ini_set('session.hash_bits_per_character', 5);
*/
		
		// Store Session Data
		$_SESSION['loggedIn'] = true;
		$_SESSION['user'] = $user;  // Initializing Session with value of PHP Variable
		$_SESSION['officer'] = false;  // is user allowed to read other public user info
	}
	
	// Create session
	function loginSessionPolice($user) {
		
/*
		ini_set('session.save_handler', 'files');
		ini_set('session.use_cookies', 1);
		//ini_set('session.cookie_secure', 1);   // use if enforcing https
		ini_set('session.use_only_cookies', 1);
		ini_set('session.cookie_domain', "example.com");
		ini_set('session.cookie_httponly', 1);
		ini_set('session.entropy_length', 64);
		ini_set('session.entropy_file', '/dev/urandom');
		ini_set('session.hash_function', 'sha256');
		ini_set('session.hash_bits_per_character', 5);
*/
		
		// Store Session Data
		$_SESSION['loggedIn'] = true;
		$_SESSION['user'] = $user;  // Initializing Session with value of PHP Variable
		$_SESSION['officer'] = true;  // is user allowed to read other public user info
	}
	
	
	// Check Session
	function checkSession() {
		
		// check if user is logged in
		if ($_SESSION['loggedIn']) {
			// user is logged in
			session_regenerate_id(true); // change session ID
			
			return true;
		} else {
			return false;
		}
	}
	
	
	// Destroy Session
	function logoutSession() {
		
		// delete session
		session_destroy();
		
		// user is logged out
		echo json_encode(array("status" => "logout"));
	}
	
	
?>