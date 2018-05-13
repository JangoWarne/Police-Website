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
			    
			    case 'bikedbAdd':
			        bikedbAdd();
			        break;
			        
			    case 'bikedbRead':
			        bikedbRead();
			        break;
			        
			    case 'bikedbReadStolen':
			        bikedbReadStolen();
			        break;
			        
			    case 'bikedbUpdate':
			        bikedbUpdate();
			        break;
			        
			    default:
			        // unknown caller - do nothing
			}
		};
	}
	
	
	
	// add bike to database of bikes
	function bikedbAdd()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$brand			  = $_POST['brand'];
		$model			  = $_POST['model'];
		$bikeType		  = $_POST['bikeType'];
		$gender			  = $_POST['gender'];
		$colour			  = $_POST['colour'];
		$frameMaterial	  = $_POST['frameMaterial'];
		$frameSize		  = $_POST['frameSize'];
		$numberGears	  = $_POST['numberGears'];
		$suspension		  = $_POST['suspension'];
		$brakeType		  = $_POST['brakeType'];
		$handlebarType	  = $_POST['handlebarType'];
		$frameNumber	  = $_POST['frameNumber'];
		$tagBrand		  = $_POST['tagBrand'];
		$tagID			  = $_POST['tagID'];
		$otherItems		  = $_POST['otherItems'];
		$distinctiveMarks = $_POST['distinctiveMarks'];
		$imageList		  = $_POST['imageList'];
		$caseID			  = $_POST['caseID'];
		$ownerID		  = $_SESSION['user'];
		
		// save images to files and replace array
		$imgArray = json_decode($imageList);
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
		$imageList = json_encode($imgArray);
		
		// insert bike into database
		$sql = "INSERT INTO `bike`(";
		if ($brand !== '') 			{$sql .= "`brand`, ";}
		if ($model !== '') 			{$sql .= "`model`, ";}
		if ($bikeType !== '') 		{$sql .= "`bikeType`, ";}
		if ($gender !== '') 		{$sql .= "`gender`, ";}
		if ($colour !== '') 		{$sql .= "`colour`, ";}
		if ($frameMaterial !== '') 	{$sql .= "`frameMaterial`, ";}
		if ($frameSize !== '') 		{$sql .= "`frameSize`, ";}
		if ($numberGears !== '') 	{$sql .= "`numberGears`, ";}
		if ($suspension !== '') 	{$sql .= "`suspension`, ";}
		if ($brakeType !== '') 		{$sql .= "`brakeType`, ";}
		if ($handlebarType !== '') 	{$sql .= "`handlebarType`, ";}
		if ($frameNumber !== '') 	{$sql .= "`frameNumber`, ";}
		if ($tagBrand !== '') 		{$sql .= "`tagBrand`, ";}
		if ($tagID !== '') 			{$sql .= "`tagID`, ";}
		if ($otherItems !== '') 	{$sql .= "`otherItems`, ";}
		if ($distinctiveMarks !== '') {$sql .= "`distinctiveMarks`, ";}
		if ($imageList !== '') 		{$sql .= "`imageList`, ";}
		if ($caseID !== '') 		{$sql .= "`caseID`, ";}
		if ($ownerID !== '') 		{$sql .= "`ownerID`";}
		$sql .=  ") VALUES (";
		if ($brand !== '') 			{$sql .= "'$brand', ";}
		if ($model !== '') 			{$sql .= "'$model', ";}
		if ($bikeType !== '') 		{$sql .= "'$bikeType', ";}
		if ($gender !== '') 		{$sql .= "'$gender', ";}
		if ($colour !== '') 		{$sql .= "'$colour', ";}
		if ($frameMaterial !== '') 	{$sql .= "'$frameMaterial', ";}
		if ($frameSize !== '') 		{$sql .= "'$frameSize', ";}
		if ($numberGears !== '') 	{$sql .= "'$numberGears', ";}
		if ($suspension !== '') 	{$sql .= "'$suspension', ";}
		if ($brakeType !== '') 		{$sql .= "'$brakeType', ";}
		if ($handlebarType !== '') 	{$sql .= "'$handlebarType', ";}
		if ($frameNumber !== '') 	{$sql .= "'$frameNumber', ";}
		if ($tagBrand !== '') 		{$sql .= "'$tagBrand', ";}
		if ($tagID !== '') 			{$sql .= "'$tagID', ";}
		if ($otherItems !== '') 	{$sql .= "'$otherItems', ";}
		if ($distinctiveMarks !== '') {$sql .= "'$distinctiveMarks', ";}
		if ($imageList !== '') 		{$sql .= "'$imageList', ";}
		if ($caseID !== '') 		{$sql .= "'$caseID', ";}
		if ($ownerID !== '') 		{$sql .= "'$ownerID'";}
		$sql .=  ")";
		
		// return success status and id of bike / error
		if(mysqli_query($connection, $sql)) {
			echo json_encode(array("status" => "success", "bikeID" => $connection->insert_id,));
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		
		mysqli_close($connection);
	}
	
	
	// read all parameters for one bike from database of bikes
	function bikedbRead()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$bikeID = $_POST['bikeID'];
		
		
	    // command to read paramaters
		$sql = "SELECT brand, model, bikeType, gender, colour, frameMaterial, frameSize, numberGears, suspension, ".
				"brakeType, handlebarType, frameNumber, tagBrand, tagID, otherItems, distinctiveMarks, imageList, caseID, ownerID, bikeID ".
				"FROM `bike` ".
				"WHERE bikeID = '$bikeID'";
		
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out values
			foreach ($result as $params => $vals) {
				$arr = $vals;
				break;
			}
			
			//if ($arr['imageList'] !== NULL) {$arr['imageList'] = json_decode($arr['imageList']);}
			
			// convert NULL values
			foreach ($arr as &$value) {
			    if ($value == NULL) {
			    	$value = "";
			    }
			}
			unset($value); // break the reference with the last element
			
			// return JSON array of values
			echo json_encode(array("status" => "success") + $arr);
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// add found information to bike
	function bikedbReadStolen()
	{
		// database settings
		require_once 'config.php';
		
		
	    // command to read paramaters
		$sql = "SELECT brand, model, bikeType, gender, colour, frameMaterial, frameSize, numberGears, suspension, ".
				"brakeType, handlebarType, frameNumber, tagBrand, tagID, otherItems, distinctiveMarks, imageList, caseID, ownerID, bikeID ".
				"FROM `bike` ".
				"WHERE NOT caseID = 0";
		
		// read from database
		if ($result = mysqli_query($connection, $sql)) {
			
			// split out bikes
			$i = 0;
			$bikes = array();
			foreach ($result as $name => $bike) {
				$i = $i + 1;
// 				print_r($bike);
				// convert NULL values
				foreach ($bike as $params => $vals) {
				    if ($value == NULL) {
				    	$value = "";
				    }
				}
// 				print_r($bike);
				array_push($bikes, $bike);
// 				print_r($bikes);
			}
			
/*
			print_r(count( $result ));
			print_r($result);
			
			print_r(count( $bikes ));
			print_r($bikes);
*/
			// return JSON array of values
			echo json_encode(array("status" => "success", "bikes" => json_encode($bikes))); // + $arr
		} else {
			echo json_encode(array("status" => "error", "error" => mysqli_error($connection)));
		}
		
		mysqli_close($connection);
	}
	
	
	// update single parameter for one bike from database of bikes
	function bikedbUpdate()
	{
		// database settings
		require_once 'config.php';
		
		// read properties from $_POST
		$bikeID		 = $_POST['bikeID'];
		
		$property	 = $_POST['property'];
		$newVal		 = $_POST['newVal'];
		$oldVal		 = $_POST['oldVal'];  //unused
		
		if ($newVal == "") {$newVal = NULL;}
		
		
		$success = false;
		
		
		// Update list value?
		if ($property == "imageList") {
			// update value containing list in database
			
			// read value from database
			$sql = "SELECT $property ".
				   "FROM `bike` ".
				   "WHERE bikeID = '$bikeID'";
			
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
				if ($newVal === NULL) {
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
			$sql = "Update `bike` ".
				   "SET $property = '$valSet' ".
				   "WHERE bikeID = '$bikeID'";
			
		
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


?>
