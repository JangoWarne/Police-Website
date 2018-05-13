<?php
	// include files
	require_once 'session_io.php';
	
	// Run different code based on caller
	// If caller value exists
	if(isset($_POST['caller']))
	{
		// if logged in
		if (checkSession()) {
			// switch function based on caller
		    switch ($_POST['caller']) {
			    
			    case 'casedbAdd':
			        casedbAdd();
			        break;
			        
			    case 'casedbRead':
			        casedbRead();
			        break;
			        
			    case 'casedbFound':
			        casedbFound();
			        break;
			        
			    case 'casedbUpdate':
			        casedbUpdate();
			        break;
			        
			    default:
			        // unknown caller - do nothing
			}
		}
	}
	
	
	
	// add case to database of cases
	function casedbAdd()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$timeLastSeen	 = $_POST['timeLastSeen'];
		$dateLastSeen	 = $_POST['dateLastSeen'];
		$timeSeenMissing = $_POST['timeSeenMissing'];
		$dateSeenMissing = $_POST['dateSeenMissing'];
		$latlngLastSeen	 = $_POST['latlngLastSeen'];
		$partsMissing	 = $_POST['partsMissing'];
		$peopleSeen		 = $_POST['peopleSeen'];
		$bikeID			 = $_POST['bikeID'];
		$caseStatus		 = $_POST['caseStatus'];
		$userID			 = $_POST['userID'];
		/*$officerID		 = json_decode( $_POST['officerID'] );
		$found			 = json_decode( $_POST['found'] );
		$foundStolen	 = json_decode( $_POST['foundStolen'] );
		$timeFound		 = json_decode( $_POST['timeFound'] );
		$dateFound		 = json_decode( $_POST['dateFound'] );
		$latlngFound	 = json_decode( $_POST['latlngFound'] );
		$imagesFound	 = json_decode( $_POST['imagesFound'] );*/
		
		
		// insert case into database
		$sql = "INSERT INTO `case`".
				"(`timeLastSeen`, `dateLastSeen`, `timeSeenMissing`, `dateSeenMissing`, `latlngLastSeen`, `partsMissing`, `peopleSeen`, ".
				"`bikeID`, `caseStatus`, `userID`)".
				" VALUES ('$timeLastSeen', '$dateLastSeen', '$timeSeenMissing', '$dateSeenMissing', '$latlngLastSeen', '$partsMissing', '$peopleSeen', ".
				"'$bikeID', '$caseStatus', '$userID')";
		
		
		// return success status and id of case / error
		if(mysqli_query($connection, $sql)) {
			echo json_encode(array("status" => "success", "caseID" => $connection->insert_id));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		
		mysqli_close($connection);
	}
	
	
	// read all parameters for one case from database of cases
	function casedbRead()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$caseID = $_POST['caseID'];
		
		
	    // command to read paramaters
		$sql = "SELECT timeLastSeen, dateLastSeen, timeSeenMissing, dateSeenMissing, latlngLastSeen, partsMissing, peopleSeen, bikeID, caseID, ".
				"caseStatus, userID, officerID, found, foundStolen, timeFound, dateFound, latlngFound, imagesFound ".
				"FROM `case` ".
				"WHERE caseID = '$caseID'";
		
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out values
			foreach ($result as $params => $vals) {
				$arr = $vals;
				break;
			}
			
			// convert NULL and boolean values
			if ($arr['officerID'] == NULL) {$arr['officerID'] = "";}
			if ($arr['found'] == 1) {$arr['found'] = true;} else {$arr['found'] = false;}
			if ($arr['foundStolen'] == 1) {$arr['foundStolen'] = true;} else {$arr['foundStolen'] = false;}
			if ($arr['timeFound'] == NULL) {$arr['timeFound'] = "";}
			if ($arr['dateFound'] == NULL) {$arr['dateFound'] = "";}
			if ($arr['latlngFound'] == NULL) {$arr['latlngFound'] = "";}
			if ($arr['imagesFound'] == NULL) {$arr['imagesFound'] = "[]";}
			
			// return JSON array of values
			echo json_encode(array("status" => "success") + $arr);
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// add found information to case
	function casedbFound()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$caseID			 = $_POST['caseID'];
		
		$found			 = json_decode( $_POST['found'] );
		$foundStolen	 = json_decode( $_POST['foundStolen'] );
		$timeFound		 = $_POST['timeFound'];
		$dateFound		 = $_POST['dateFound'];
		$latlngFound	 = $_POST['latlngFound'];
		$imagesFound	 = $_POST['imagesFound'];
		
		// save images to files and replace array
		$imgArray = json_decode($imagesFound);
		foreach($imgArray as &$data) {
			// attempt to save file
			try {
				// add database entry to get unique name without collisons
				// create database entry for new image
				$sql = "INSERT INTO `image`(`bikeID`) VALUES (NULL)";
				
				// read from database
				if (mysqli_query($connection, $sql)) {
				
					// set file location and name based on unique db entry
					$filepath = "../images/bikes/". $connection->insert_id .".png";
					
					// convert js URL image to format that php can save
					$urlImage = substr($data,strpos($data,",")+1);
					$urlImage = str_replace(' ','+',$urlImage);
					$fileImage = base64_decode($urlImage);
					
					// save sile
					file_put_contents($filepath, $fileImage);
					
					// update array
					$data = $filepath;
				}
			} catch(Exception $e) {
				// DO Nothing
				// use existing binary representation
			}
		}
		$imagesFound = json_encode($imgArray);
		
		
		// insert case into database
		$sql = "Update `case` ".
			   "SET found = '$found', foundStolen = '$foundStolen', timeFound = '$timeFound', ".
			   "dateFound = '$dateFound', latlngFound = '$latlngFound', imagesFound = '$imagesFound' ".
			   "WHERE caseID = '$caseID'";
		
		echo $sql;
		// return success status and id of case / error
		if(mysqli_query($connection, $sql)) {
			
			// read bikeID from database
			$sql = "SELECT bikeID ".
				   "FROM `case` ".
				   "WHERE caseID = $caseID";
			
			// get returned bikeID
			$bikeID = 0;
			if ($result = mysqli_query($connection, $sql)) {
				foreach ($result as $params => $vals) {
					$bikeID = $vals['bikeID'];
					break;
				}
			}
			
			echo json_encode(array("status" => "success", "bikeID" => $bikeID));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// update single parameter for one case from database of cases
	function casedbUpdate()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$caseID		 = $_POST['caseID'];
		
		$property	 = $_POST['property'];
		$newVal		 = $_POST['newVal'];
		//$oldVal		 = $_POST['oldVal'];  //unused
		
		if ($newVal == "true") {$newVal = true;} elseif ($newVal == "false") {$newVal = false;}
		
		
		// insert case into database
		$sql = "Update `case` ".
			   "SET $property = '$newVal' ".
			   "WHERE caseID = '$caseID'";
		
		
		// return success status and id of case / error
		if(mysqli_query($connection, $sql)) {
			
			// read bikeID from database
			$sql = "SELECT bikeID ".
				   "FROM `case` ".
				   "WHERE caseID = '$caseID'";
			
			// get returned bikeID
			$bikeID = 0;
			if ($result = mysqli_query($connection, $sql)) {
				foreach ($result as $params => $vals) {
					$bikeID = $vals['bikeID'];
					break;
				}
			}
			
			echo json_encode(array("status" => "success", "bikeID" => $bikeID));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	    
	}


?>
