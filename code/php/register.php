<?php

	if($_POST['phpfunction'] == 'createUser') {
		createUser();
	}
	if($_GET['phpfunction'] == 'verifyUser') {
		verifyUser();
	}

	function createUser() {
		
		$firstname = $_POST['firstName'];
		$lastname = $_POST['lastName'];
		$email = $_POST['email'];
		$pass = $_POST['password'];
		
		$verificationcode = substr(md5(uniqid(rand(), true)), 16,16);
		
		include "../include/config.php";
		
		$sql = "SELECT * FROM `user` WHERE email='$email'";
		$query = mysqli_query($connection, $sql);
		
		if (mysqli_num_rows($query) >0){
			echo"This email is already registered.";
			return;
		}
		
				
		$sql = "INSERT INTO `user`".
			   " values ".
			   "('$firstname', '$lastname', '$email', '$pass', NOW(), '$verificationcode', '0')";
		
		
		if(mysqli_query($connection, $sql)) {
			echo "True";
		} else {
			echo mysqli_error($connection);
		}
		
		sendEmail($email, $verificationcode);
		
		mysqli_close($connection);
	} 

	function verifyUser() {
		$email = $_GET['email'];
		$verificationcode = $_GET['verification code'];
		
		include "../include/config.php";
		
		$sql = "UPDATE `user` ".
				"SET IsVerified='1' ".
				" WHERE email = '$email' AND verification code ='$verificationcode'";
		
		if(mysqli_query($connection, $sql)) {
			echo 'Your account from '.$email. ' has been successfully verified.';
		}else {
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
		$body = 'Thank you for registering. <br>';
		$body = $body.'Please click the link below to activate your account. <br>';
		$link = 'http://ct4009-17cr.studentsites.glos.ac.uk/CT40092017-18001160941514Jan2018/logged-out/register/register.php'.
				'phpfunction=verifyUser&email='.$emailTo.
				'&verification code='.$verificationcode;
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