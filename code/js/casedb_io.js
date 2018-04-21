

// add case to database of cases
function casedbAdd(bikeIDval, latlng, callbackFn) {
	
	// Add object to database (PHP)
	$.ajax({
	    type: "POST",
	    url: 'casedb_io.php',
	    data: {
		    caller: 'casedbAdd',
		    
		    // read properties from window
			timeLastSeen: document.formReport.timeLastSeen.value,
			dateLastSeen: document.formReport.dateLastSeen.value,
			timeSeenMissing: document.formReport.timeSpottedMissing.value,
			dateSeenMissing: document.formReport.dateSpottedMissing.value,
			latlngLastSeen: {lat: latlng.lat(), lng: latlng.lng()},
			partsMissing: document.formReport.txtPartsMissing.value,
			peopleSeen: document.formReport.txtPeopleSeen.value,
			bikeID: bikeIDval,
			caseStatus: "Open",
			userID: cookieRead("login_uemail"),
			officerID: "",
			found: false,
			foundStolen: false,
			timeFound: "",
			dateFound: "",
			latlngFound: {},
			imagesFound: []
		    
		},
	    success: function(caseID){
	        callbackFn( caseID );
	    }
	});
}


// read all parameters for one case from database of cases
function casedbRead(caseID, val, callback) {
	
	// Read object from database (PHP)
	$.ajax({
	    type: "POST",
	    url: 'casedb_io.php',
	    data: {
		    caller: 'casedbRead',
		    
		    // Case to read
			caseID: caseID
			
		},
	    success: function(encoded){
		    // Build investigation object from database
			var investigation = {
				timeLastSeen: encoded[0],
				dateLastSeen: encoded[1],
				timeSeenMissing: encoded[2],
				dateSeenMissing: encoded[3],
				latlngLastSeen: {lat: latlng.lat(), lng: latlng.lng()},
				partsMissing: encoded[5],
				peopleSeen: encoded[6],
				bikeID: encoded[7],
				caseStatus: encoded[8],
				userID: encoded[9],
				officerID: encoded[10],
				found: encoded[11],
				foundStolen: encoded[12],
				timeFound: encoded[13],
				dateFound: encoded[14],
				latlngFound: encoded[15],
				imagesFound: encoded[16]
			};
			
			// run code that uses property
			callback(caseID, val, storedVal);
	    }
	});
}



// add found information to case
function casedbFound(caseID, latlng, callback) {
	
	// get number of existing images
	var number = document.getElementsByClassName("images").length;
	
	// iterate through getting images to create list
	var imageID;
	var urlList = [];
	for (i = 0; i < number; i++ ) {
		
		imageID = "image-" + i + "-box";
		
		// get data url for image
		var img = document.getElementById(imageID);
		var style = img.currentStyle || window.getComputedStyle(img, false);
		var url = style.backgroundImage.slice(4, -1).replace(/"/g, "");
		
		// add url to list
		urlList.push(url);
	}
	
	// update value
	var storedVal;
	storedVal.found = true;
	storedVal.foundStolen = true;
	storedVal.timeFound = document.formFound.timeFound.value;
	storedVal.dateFound = document.formFound.dateFound.value;
	storedVal.latlngFound = {lat: latlng.lat(), lng: latlng.lng()};
	storedVal.imagesFound = urlList;
	
	// Add object to database
	// return bikeID
	
	// run callback if succesfull
	callback(bikeID);
}



// update single parameter for one case from database of cases
function casedbUpdate(caseID, property, newVal, oldVal, callback) {
	
	// copy read property to variable
	var storedVal;
	
	// update value
	storedVal[property] = newVal;
	
	// Add object to database
	// return bikeID
	
	// run callback if succesfull
	callback(bikeID);
}

