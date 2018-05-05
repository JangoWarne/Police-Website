<?php

	if($_POST['phpfunction'] == 'createUser') {
        $email = $_POST['txtEmail'];
        $verificationcode = substr(md5(uniqid(rand(), true)), 16,16);
        
        sendEmail($email, $verificationcode);
		
	}
	if($_GET['phpfunction'] == 'verifyUser') {
		verifyUser();
	}

// verfiying user registration 
	function verifyUser() {
		$email = $_GET['email'];
		$verificationcode = $_GET['verificationcode'];
		
		include "../../php/config.php"; //PROBLEM HERE 
//Updating user table, column isVerfied if email and verfication match
		$sql = "UPDATE `user` ".
				"SET IsVerified='1' ".
				" WHERE email = '$email' AND verificationcode ='$verificationcode'";
    
       

		
		if(mysqli_query($connection, $sql)) {
            
            //read isVerified to check user email has verified  
            $sql = "SELECT IsVerified FROM user WHERE email = '$email' ";
            $result = $connection->query($sql);
            
            $value=0;
            foreach($result as $row){
                
                
                $value=$row['IsVerified'];
                break;
            }
            
            
            if($value == 1){
			     echo 'Your account from '.$email. ' has been successfully verified.';
            
            } else {
                echo ' There was an error, you are not verified';
            }
            
		}else {
			echo mysqli_error($connection);			
		}
	} 
 // sending verfication email user 
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
		$link = 'http://ct4009-17cr.studentsites.glos.ac.uk/Police-Website-master/code/logged-out/register/RegisterDAO.php?'.
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