
// add case to database of cases
function casedbAdd(bikeIDval, latlng, callbackFn) {
	
	// Add object to database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/casedb_io.php',
		data: {
			caller: 'casedbAdd',
			
			// read properties from window
			timeLastSeen: document.formReport.timeLastSeen.value,
			dateLastSeen: document.formReport.dateLastSeen.value,
			timeSeenMissing: document.formReport.timeSpottedMissing.value,
			dateSeenMissing: document.formReport.dateSpottedMissing.value,
			latlngLastSeen: JSON.stringify({lat: latlng.lat(), lng: latlng.lng()}),
			partsMissing: document.formReport.txtPartsMissing.value,
			peopleSeen: document.formReport.txtPeopleSeen.value,
			bikeID: bikeIDval,
			caseStatus: "Open",
			userID: cookieRead("login_uemail"),
			officerID: "NULL",
			found: false,
			foundStolen: false,
			timeFound: "NULL",
			dateFound: "NULL",
			latlngFound: "NULL",//JSON.stringify({}),
			imagesFound: "NULL"//[].toString()
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			if(data.status == 'success'){
				callbackFn( data.caseID );
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// read all parameters for one case from database of cases
function casedbRead(caseID, val, callbackFn) {
	
	// Read object from database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/casedb_io.php',
		data: {
			caller: 'casedbRead',
			
			// Case to read
			caseID: caseID
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			data.imagesFound = JSON.parse(data.imagesFound);
			
			// Build investigation object from database
			var investigation = {
				timeLastSeen: data.timeLastSeen,
				dateLastSeen: data.dateLastSeen,
				timeSeenMissing: data.timeSeenMissing,
				dateSeenMissing: data.dateSeenMissing,
				latlngLastSeen: JSONparse(data.latlngLastSeen, "", {}),
				partsMissing: data.partsMissing,
				peopleSeen: data.peopleSeen,
				bikeID: data.bikeID,
				caseID: data.caseID,
				caseStatus: data.caseStatus,
				userID: data.userID,
				officerID: data.officerID,
				found: data.found,
				foundStolen: data.foundStolen,
				timeFound: data.timeFound,
				dateFound: data.dateFound,
				latlngFound: JSONparse(data.latlngFound, "", {}),
				imagesFound: data.imagesFound//.split(",")
			};
			
			// run code that uses property
			if(data.status == 'success'){
				callbackFn(caseID, val, investigation);
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}



// add found information to case
function casedbFound(caseID, latlng, callbackFn) {
	
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
	
	// Add object to database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/casedb_io.php',
		data: {
			caller: 'casedbFound',
			
			// Case Found
			caseID: caseID,
			
			// read properties from window
			found: true,
			foundStolen: true,
			timeFound: document.formFound.timeFound.value,
			dateFound: document.formFound.dateFound.value,
			latlngFound: JSON.stringify({lat: latlng.lat(), lng: latlng.lng()}),
			imagesFound: urlList
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			if(data.status == 'success'){
				callbackFn( data.bikeID );
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}



// update single parameter for one case from database of cases
function casedbUpdate(caseID, property, newVal, oldVal, callbackFn) {
	
	// Add object to database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/casedb_io.php',
		data: {
			caller: 'casedbUpdate',
			
			// Case to Update
			caseID: caseID,
			
			// read properties from window
			property: property,
			newVal: newVal,
			oldVal: oldVal //unused
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			if(data.status == 'success'){
				callbackFn( data.bikeID );
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}



// parse JSON stringified objects
function JSONparse(JSONstring, valName, defaultVal) {
	
	// if value does not exist gracefully use a default value
	try {
		var obj = JSON.parse(JSONstring); // this is how you parse a string into JSON
		
		// return single varaible or entire object
		if (valName !== "") {
			return obj[valName];
		} else {
			return obj;
		}
		
	} catch (e) {
		return defaultVal;
	}
}

