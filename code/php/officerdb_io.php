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
		    
		    case 'officerdbLogin':
		        officerdbLogin();
		        break;
		    
		    case 'officerdbRead':
		    	if (checkSession()) {
		        	officerdbRead();
		        }
		        break;
		        
		    case 'officerdbUpdate':
		    	if (checkSession()) {
		        	officerdbUpdate();
		        }
		        break;
		        
		    case 'officerdbLogout':
		    	if (checkSession()) {
		        	officerdbLogout();
		        }
		        break;
		        
		    default:
		        // unknown caller - do nothing
		}
	}
	
	
	
	// read all parameters for one officer from database of officers
	function officerdbLogin()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$username = $_POST['username'];
		$password = $_POST['password'];
		
		
	    // command to read paramaters
		$sql = "SELECT password ".
				"FROM `officer` ".
				"WHERE username = '$username'";
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out values
			$hash = '';
			foreach ($result as $param => $val) {
				$hash = $val['password'];
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
					$sql = "Update `officer` ".
						   "SET password = '$newHash' ".
						   "WHERE username = '$username'";
					
				
					// return success status
					if(mysqli_query($connection, $sql)) {
						// do nothing
					} else {
						$error = mysqli_error($connection);
					}
			    }
				
			    // Log user in
			    loginSessionPolice($username);
				$login = "success";
			} else {
				$login = "invalid";
				$error = "Invalid Username or Password";
			}
			
		} else {
			$login = "error";
			$error = mysqli_error($connection);
		}
		
		echo json_encode(array("status" => $login, "error" => $error));
		
		
		mysqli_close($connection);
	}
	
	
	// read all parameters for one officer from database of officers
	function officerdbRead()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$username = $_SESSION['user'];
		$property = $_POST['property'];
		
		
		if ($property != "password") {
			
		    // command to read paramaters
			$sql = "SELECT $property ".
					"FROM `officer` ".
					"WHERE username = '$username'";
			
			
			// read from database
			if ($result = mysqli_query($connection, $sql)) {
				
				// split out values
				foreach ($result as $param => $val) {
					$value = $val[$property];
					break;
				}
				
				// convert NULL values
				if ($value == NULL) {$value = "";}
				
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
	
	
	// update single parameter for one officer from database of officers
	function officerdbUpdate()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$username	 = $_SESSION['user'];
		
		$property	 = $_POST['property'];
		$newVal		 = $_POST['newVal'];
		$oldVal		 = $_POST['oldVal'];
		
		$success = false;
		
		
		if ($property != "password") {
		
			// Update list value?
			if ($property == "caseIDs") {
				// update value containing list in database
				
				// read value from database
				$sql = "SELECT $property ".
					   "FROM `officer` ".
					   "WHERE username = '$username'";
				
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
				$sql = "Update `officer` ".
					   "SET $property = '$valSet' ".
					   "WHERE username = '$username'";
				
			
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
			$error = "Invalid Request";
		}
		
		// return success status
		if( $success ) {
			echo json_encode(array("status" => "success"));
		} else {
			echo json_encode(array("status" => "error", "error" => $error));
		}
		
		mysqli_close($connection);
	}
	
	
	// logout officer
	function officerdbLogout()
	{
		// logout session
		logoutSession();
	}
	
	
?>