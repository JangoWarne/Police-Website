<?php
	
	// Run different code based on caller
	// If caller value exists
	if(isset($_POST['caller']))
	{
		// switch function based on caller
	    switch ($_POST['caller']) {
		    
		    case 'officerdbRead':
		        officerdbRead();
		        break;
		        
		    case 'officerdbUpdate':
		        officerdbUpdate();
		        break;
		        
		    case 'officerdbLogout':
		        officerdbLogout();
		        break;
		        
		    default:
		        // unknown caller - do nothing
		}
	}
	
	
	
	// read all parameters for one officer from database of officers
	function officerdbRead()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$username = $_POST['username'];
		$property = $_POST['property'];
		
		
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
		
		mysqli_close($connection);
	}
	
	
	// update single parameter for one officer from database of officers
	function officerdbUpdate()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$username	 = $_POST['username'];
		
		$property	 = $_POST['property'];
		$newVal		 = $_POST['newVal'];
		$oldVal		 = $_POST['oldVal'];
		
		$success = false;
		
		
		// Update list value?
		if ($property == "loginIDs" || $property == "caseIDs") {
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
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$username	 = $_POST['username'];
		
		// update database value
		$sql = "Update `officer` ".
			   "SET loginIDs = NULL ".
			   "WHERE username = '$username'";
		
		
		// return success status
		if( mysqli_query($connection, $sql) ) {
			echo json_encode(array("status" => "success"));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
?>