<?php

	
	if($_GET['phpfunction'] == 'verifyUser') {
		verifyUser();
	}

	// verfiy user registration 
	function verifyUser() {
		$email = $_GET['email'];
		$verificationcode = $_GET['verificationcode'];
		echo $Protocol.$_SERVER['HTTP_HOST'].str_replace($_SERVER['DOCUMENT_ROOT'], '', realpath('./RegisterDAO.php'));
		include_once "../../php/config.php"; //PROBLEM HERE 
		//Updating user table, column isVerfied if email and verfication match
		$sql = "UPDATE `user` ".
				"SET isVerified = 1 ".
				"WHERE email = '$email' AND verificationcode = '$verificationcode'";
    
       
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
 
?>