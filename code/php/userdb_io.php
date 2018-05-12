<?php
	
	// Run different code based on caller
	// If caller value exists
	if(isset($_POST['caller']))
	{
		// switch function based on caller
	    switch ($_POST['caller']) {
		    
		    case 'userdbAdd':
		        userdbAdd();
		        break;
		        
		    case 'userdbRead':
		        userdbRead();
		        break;
		        
		    case 'userdbReadFull':
		        userdbReadFull();
		        break;
		        
		    case 'userdbUpdate':
		        userdbUpdate();
		        break;
		        
		    case 'userdbLogout':
		        userdbLogout();
		        break;
		        
		    default:
		        // unknown caller - do nothing
		}
	}
	
	
	
	// add user to database of users
	function userdbAdd()
	{
		// database settings
		require_once 'config.php';
		
		// create verification code
		$verificationcode = substr(md5(uniqid(rand(), true)), 16,16);
        		
		// read properties from $_POST
		$title			 = $_POST['title'];
		$firstName		 = $_POST['firstName'];
		$lastName		 = $_POST['lastName'];
		$email			 = $_POST['email'];
		$password		 = $_POST['password'];
		$addressLine1	 = $_POST['addressLine1'];
		$addressLine2	 = $_POST['addressLine2'];
		$townCity		 = $_POST['townCity'];
		$county			 = $_POST['county'];
		$postcode		 = $_POST['postcode'];
		$contactNumber	 = $_POST['contactNumber'];
		$emailMe		 = json_decode( $_POST['emailMe'] );
		$textMe			 = json_decode( $_POST['textMe'] );
		
		
		// insert user into database (only add optional values if they are not empty)
		$sql = "INSERT INTO `user`".
				"(`title`, `firstName`, `lastName`, `email`, `password`, `addressLine1`, ";
		if ($addressLine2 !== '') {$sql .= "`addressLine2`, ";}
		$sql .= "`townCity`, ";
		if ($county !== '') {$sql .= "`county`, ";}
		$sql .= "`postcode`, ";
		if ($contactNumber !== '') {$sql .= "`contactNumber`, ";}
		$sql .= "`emailMe`, `textMe`, `verificationcode`, `isVerified`) VALUES ('$title', '$firstName', '$lastName', '$email', '$password', '$addressLine1', ";
		if ($addressLine2 !== '') {$sql .= "'$addressLine2', ";}
		$sql .= "'$townCity', ";
		if ($county !== '') {$sql .= "'$county', ";}
		$sql .= "'$postcode', ";
		if ($contactNumber !== '') {$sql .= "'$contactNumber', ";}
		$sql .= "'$emailMe', '$textMe', '$verificationcode', 0)";
		
		
		// return success status and error
		if(mysqli_query($connection, $sql)) {
			
			// get user to confirm registration
			sendEmail($email, $verificationcode);
			
			echo json_encode(array("status" => "success"));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		
		mysqli_close($connection);
	}
	
	
	// read one parameter for one user from database of users
	function userdbRead()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$email = $_POST['email'];
		$property = $_POST['property'];
		
		
	    // command to read paramaters
		$sql = "SELECT $property ".
				"FROM `user` ".
				"WHERE email = '$email'";
		
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out values
			foreach ($result as $param => $val) {
				$value = $val[$property];
				break;
			}
			
			// convert NULL and boolean values
			if ($value == NULL) {$value = "";}
			if ($property == 'emailMe' || $property == 'textMe') {
				if ($value == 1) {$value = true;} else {$value = false;}
			}
			
			// return JSON array of values
			echo json_encode(array("status" => "success", "value" => $value));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// read all parameters for one user from database of users
	function userdbReadFull()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$email = $_POST['email'];
		
		
	    // command to read paramaters
		$sql = "SELECT title, firstName, lastName, email, password, addressLine1, addressLine2, townCity, county, postcode, contactNumber, ".
				"emailMe, textMe, loginIDs, bikeIDs ".
				"FROM `user` ".
				"WHERE email = '$email'";
		
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out values
			foreach ($result as $params => $vals) {
				$arr = $vals;
				break;
			}
			
			// convert NULL and boolean values
			if ($arr['addressLine2'] == NULL) {$arr['addressLine2'] = "";}
			if ($arr['county'] == NULL) {$arr['county'] = "";}
			if ($arr['contactNumber'] == NULL) {$arr['contactNumber'] = "";}
			if ($arr['emailMe'] == 1) {$arr['emailMe'] = true;} else {$arr['emailMe'] = false;}
			if ($arr['textMe'] == 1) {$arr['textMe'] = true;} else {$arr['textMe'] = false;}
			if ($arr['loginIDs'] == NULL) {$arr['loginIDs'] = "";}
			if ($arr['bikeIDs'] == NULL) {$arr['bikeIDs'] = "";}
			
			// return JSON array of values
			echo json_encode(array("status" => "success") + $arr);
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// update single parameter for one user from database of users
	function userdbUpdate()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$email		 = $_POST['email'];
		
		$property	 = $_POST['property'];
		$newVal		 = $_POST['newVal'];
		$oldVal		 = $_POST['oldVal'];
		
		$success = false;
		
		if ($newVal == "true") {$newVal = true;} elseif ($newVal == "false") {$newVal = false;}
		if ($oldVal == "true") {$oldVal = true;} elseif ($oldVal == "false") {$oldVal = false;}
		
		
		// Update list value?
		if ($property == "loginIDs" || $property == "bikeIDs") {
			// update value containing list in database
			
			// read value from database
			$sql = "SELECT $property ".
				   "FROM `user` ".
				   "WHERE email = '$email'";
			
			$value = "";
			if ($result = mysqli_query($connection, $sql)) {
				foreach ($result as $params => $vals) {
					$value = $vals[$property];
					break;
				}
			} else {
				$error = mysqli_error($connection);
			}
			
			// convert json string to array
			$valList = json_decode($value, true);
			
			// check if an existing value needs replacing
			$index;
			if ($oldVal === "") {
				// set new location to end of array
				$index = count($valList);
			} else {
				// get old value location
				$index = array_search($oldVal, $valList);
			}
			
			// check if old value was found in array
			if ( $index !== false ) {
				// if value was found
				// update value
				if ($newVal === "") {
					array_splice($valList, $index, 1);
				} else {
					$valList[$index] = $newVal;
				}
				
				// ensure valList is an array
				if (is_array($valList)) {
					// Do nothing
				} else if (is_object($valList)) {
					// convert to array
					$valList = get_object_vars( $valList );
				} else {
					$valList = array($valList);
				}
				
				// list of values to return to database
				$valSet = json_encode($valList);
				$success = true;
			
			} else {
				$error = 'Old value not found in array';
			}
			
		} else {
			$valSet = $newVal;
			$success = true;
		}
		
		// update database if no errors have occured
		if ($success) {
			// update database value
			$sql = "Update `user` ".
				   "SET $property = '$valSet' ".
				   "WHERE email = '$email'";
			
		
			// return success status
			if(mysqli_query($connection, $sql)) {
				$success = true;
			} else {
				$success = false;
				$error = mysqli_error($connection);
			}
		}
		
		// return success status
		if( $success ) {
			echo json_encode(array("status" => "success"));
		} else {
			echo json_encode(array("status" => "error", "error" => $error));
		}
		
		mysqli_close($connection);
	}
	
	
	// logout user
	function userdbLogout()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$email		 = $_POST['email'];
		
		// update database value
		$sql = "Update `user` ".
			   "SET loginIDs = NULL ".
			   "WHERE email = '$email'";
		
		
		// return success status
		if( mysqli_query($connection, $sql) ) {
			echo json_encode(array("status" => "success"));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// send verfication email to user 
	function sendEmail($emailTo, $verificationcode) {
		$from="JAO@connect.glos.ac.uk";
		$headers = 'MIME-Version: 1.0' . "\r\n";
		$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	
		//Create email headers
	
		$headers .= 'From: '.$from. "\r\n".
			'Reply-To: '.$from."\r\n" .
			'X-Mailer: PHP/' . phpversion();
	
		// Compose the message of the email
		$body = 'Thank you for registering. <br>';
		$body = $body.'Please click the link below to activate your account. <br>';
		$path = $Protocol.$_SERVER['HTTP_HOST'].str_replace($_SERVER['DOCUMENT_ROOT'], '', realpath('../logged-out/register/RegisterDAO.php'));
		$link = $path.'?'.
				'phpfunction=verifyUser&email='.$emailTo.
				'&verificationcode='.$verificationcode;
		$link = '<a href="'.$link.'">Click here</a>';
		$body = $body.$link;
		$message = '<html><body>';
		$message .= $body;
		$message .= '</body></html>';
	
		if (mail($emailTo, $subject, $message, $headers)){
			//Do Nothing
		} else {
			//Do Nothing
		}
	}
	
	
?>