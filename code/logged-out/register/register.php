<?php

	if($_POST['phpfunction'] == 'createUser') {
		createUser();
	}
	if($_GET['phpfunction'] == 'verifyUser') {
		verifyUser();
	}
// post vs get???
// vars must match what you are using in the database 
	function createUser() {
		
		$firstname = $_POST['First_Name'];
		$lastname = $_POST['Last_Name'];
		$email = $_POST['email'];
		$password = $_POST['password'];
		
		// making a variable for verification code, created a string/unique identifier restricted to 16 characters
		$verificationcode = substr(md5(uniqid(rand(),true)), 16,16); // hashing unique ID
		
		include "../include/config.php";
		
		$sql = "SELECT * FROM `tbl_user` WHERE email='$email'";  // reading values from database, check whether user has alrady registered 
		$query = mysqli_query($connection, $sql); 
		
		if(Mysqli_num_rows($query) >0){
			echo "This email is already registered.";
			return;
		}
		
		$sql = "INSERT INTO `tbl_user`".
			   " values ".
			   "('$firstname', '$lastname', '$email', '$password',NOW(),'$verificationcode', '0' )";   
		//NOW fucntion provides date, time stamp
	
		
		
		if(mysqli_query($connection, $sql)) {
			echo "True";
		} else {
			echo mysqli_error($connection);
		}
		
		sendEmail($email, $verificationcode);
		
		mysqli_close($connection);
	} 
    // If email and verfication code match verified is changed from 0 to 1
	function verifyUser() {
		$email = $_GET['email'];
		$verificationcode = $_GET['verificationcode'];
		
		include "../include/config.php";
		
		$sql = "UPDATE `tbl_user` ".					// write verification to the database 
				"SET isVerified='1'".
				" WHERE email = '$email' AND verificationcode='$verificationcode'";
		
		//echo $sql;
		if(mysqli_query($connection, $sql)){
			echo "Your account has been successfully verified.";
		}else{
			echo mysqli_error($connection);
		}
	} 

	function sendEmail($emailTo, $verificationcode) {
		$from="aarancoates@connect.glos.ac.uk";
		$headers = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

		//Create email headers

		$headers .= 'From: '.$from. "\r\n".
			'Reply-To: '.$from."\r\n" .
			'X-Mailer: PHP/' . phpversion();

		// Compose the message of the email
		$body = 'Thank you for registering with Flogger. <br>';
		$body = $body.'Please click the link below to activate your account. <br>';
		$link = 'http://ct4009-17cr.studentsites.glos.ac.uk/CT40092017-18001160941514Jan2018/logged-out/register/register.php?'.
				'phpfunction=verifyUser&email='.$emailTo.
				'&verificationcode='.$verificationcode;
		$link = '<a href="'.$link.'">Click here</a>';
		$body = $body.$link;
		$message = '<html><body>';
		$message .= $body;
		$message .= '</body></html>';

		if (mail($emailTo, $subject, $message, $headers)){
			//Do Something
		} else {
			//Do Something
		}
	}
?>

