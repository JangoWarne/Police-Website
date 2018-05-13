<?php
	// include files
	require_once 'session_io.php';
	
	// Run different code based on caller
	// If caller value exists
	if(isset($_POST['caller']))
	{
		// switch function based on caller
		// unless logged out check for valid session before allowing database access
	    switch ($_POST['caller']) {
		    
		    case 'userdbAdd':
		        userdbAdd();
		        break;
		        
		    case 'userdbLogin':
		        userdbLogin();
		        break;
		        
		    case 'userdbExists':
		        userdbExists();
		        break;
		        
		    case 'userdbRead':
		    	if (checkSession()) {
		        	userdbRead();
		    	}
		        break;
		        
		    case 'userdbReadFull':
		    	if (checkSession()) {
		        	userdbReadFull();
		    	}
		        break;
		        
		    case 'userdbUpdate':
		    	if (checkSession()) {
		        	userdbUpdate();
		    	}
		        break;
		        
		    case 'userdbLogout':
		    	if (checkSession()) {
		        	userdbLogout();
		    	}
		        break;
		        
		    default:
		        // unknown caller - do nothing
		}
	}
	
	
	
	// add user to database of users
	function userdbAdd()
	{
		require_once 'config.php';
		
		// get password
		$password = $_POST['password'];
		$valid = false;
		$special_chars = '£|%|&|@|~|\+|,|!|=|_|-';
		
		// check password strength
		if (strlen($password) < 12) {
			$error = "Password must be at-least 12 characters long";
		} else if (preg_match_all("#[0-9]#", $password) < 2) {
			$error = "Password must  at least two numbers";
		} else if (preg_match_all("#[a-zA-Z]#", $password) < 2) {
			$error = "Password must have at least two letters";
		} else if (preg_match_all('/'.$special_chars.'/', $password) < 1) {
			$error = "Password must have at least one special character";
		} else {
			$valid = true;
			$error = "";
		}
		
		if ($valid) {
			// create verification code
			$verificationcode = substr(md5(uniqid(rand(), true)), 16,16);
	        		
			// read properties from $_POST
			$title			 = $_POST['title'];
			$firstName		 = $_POST['firstName'];
			$lastName		 = $_POST['lastName'];
			$email			 = $_POST['email'];
			$password		 = password_hash($password, PASSWORD_DEFAULT);
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
				
				$success = "success";
			} else {
				$success = "error";
				$error = mysqli_error($connection);
			}
		} else {
			$success = "invalid";
		}
		
		echo json_encode(array("status" => $success, "error" => $error));
		
		mysqli_close($connection);
	}
	
	
	// attempt to login user - verfy password, update hash, and start session as required
	function userdbLogin()
	{
		require_once 'config.php';
		
		// get login info
		$email			 = $_POST['email'];
		$password		 = $_POST['password'];
		
		// command to read password
		$sql = "SELECT password, isVerified ".
				"FROM `user` ".
				"WHERE email = '$email'";
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out values
			$hash = '';
			foreach ($result as $param => $val) {
				$hash = $val['password'];
				$verified = $val['isVerified'];
				if ($verified == 1) {$verified = true;} else {$verified = false;}
				break;
			}
			
			// Verify stored hash against plain-text password
			if (password_verify($password, $hash)) {
				
			    // Check if a newer hashing algorithm is available
			    // or the cost has changed
			    if (password_needs_rehash($hash, PASSWORD_DEFAULT)) {
				    
			        // If so, create a new hash, and replace the old one
			        $newHash = password_hash($password, PASSWORD_DEFAULT);
			        
			        // update database value
					$sql = "Update `user` ".
						   "SET password = '$newHash' ".
						   "WHERE email = '$email'";
					
				
					// return success status
					if(mysqli_query($connection, $sql)) {
						// do nothing
					} else {
						$error = mysqli_error($connection);
					}
			    }
			    
				// login only if account is verified
				if ($verified) {
					// Log user in
				    loginSessionPublic($email);
					$login = "success";
				} else {
					$login = "invalid";
					$error = "Account must be verified before logging in:\nCheck your email for the verification link";
				}
			    
			} else {
				$login = "invalid";
				$error = "Invalid Email or Password";
			}
			
		} else {
			$login = "error";
			$error = mysqli_error($connection);
		}
		
		echo json_encode(array("status" => $login, "error" => $error));
	}
	
	
	// check if user exists
	function userdbExists()
	{
		require_once 'config.php';
		
		// read properties from $_POST
		$email 	= $_POST['email'];
		
	    // command to read paramaters
		$sql = "SELECT 'email' ".
				"FROM `user` ".
				"WHERE email = '$email'";
		
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			$exists = false;
			
			// split out values
			foreach ($result as $param => $val) {
				$exists = true;
				break;
			}
			
			// return JSON array of values
			echo json_encode(array("status" => "success", "exists" => $exists));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// read one parameter for one user from database of users
	function userdbRead()
	{
		require_once 'config.php';
		
		// read properties from $_POST
		// limit public to only reading their own user
		if ($_SESSION['officer']) {
			$email 	= $_POST['email'];
		} else {
			$email 	= $_SESSION['user'];
		}
		$property 	= $_POST['property'];
		
		
		if ($property != "password") {
			
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
		} else {
			echo json_encode(array("status" => "error", "error" => "Invalid Request"));
		}
		
		mysqli_close($connection);
	}
	
	
	// read all parameters for one user from database of users
	function userdbReadFull()
	{
		require_once 'config.php';
		
		// read properties from $_POST
		// limit public to only reading their own user
		if ($_SESSION['officer']) {
			$email 	= $_POST['email'];
		} else {
			$email 	= $_SESSION['user'];
		}
		
		
	    // command to read paramaters
		$sql = "SELECT title, firstName, lastName, email, addressLine1, addressLine2, townCity, county, postcode, contactNumber, ".
				"emailMe, textMe, bikeIDs ".
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
		require_once 'config.php';
		
		// read properties from $_POST
		// limit public to only accessing their own user
		if ($_SESSION['officer']) {
			$email 	= $_POST['email'];
		} else {
			$email 	= $_SESSION['user'];
		}
		
		$property	 = $_POST['property'];
		$newVal		 = $_POST['newVal'];
		$oldVal		 = $_POST['oldVal'];
		
		$success = false;
		
		if ($newVal == "true") {$newVal = true;} elseif ($newVal == "false") {$newVal = false;}
		if ($oldVal == "true") {$oldVal = true;} elseif ($oldVal == "false") {$oldVal = false;}
		
		
		if ($property != 'password') {
			// Update list value?
			if ($property == "bikeIDs") {
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
					$success = false;
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
		} else {
			$success = false;
			$error = 'Invalid Request';
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
		// logout session
		logoutSession();
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