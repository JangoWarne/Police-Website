
// add bike to database of bikes
function bikedbAdd( callbackFn ) {
	
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
		url: '../../php/bikedb_io.php',
		data: {
			caller: 'bikedbAdd',
			
			// read properties from window
			brand: document.formDetails.txtBrand.value,
			model: document.formDetails.txtModel.value,
			bikeType: document.formDetails.txtType.value,
			gender: document.formDetails.txtGender.value,
			colour: document.formDetails.txtColour.value,
			frameMaterial: document.formDetails.txtFrameMaterial.value,
			frameSize: document.formDetails.txtFrameSize.value,
			numberGears: document.formDetails.numGears.value,
			suspension: document.formDetails.txtSuspension.value,
			brakeType: document.formDetails.txtBrakeType.value,
			handlebarType: document.formDetails.txtHandleType.value,
			frameNumber: document.formDetails.numSerial.value,
			tagBrand: document.formDetails.txtTagBrand.value,
			tagID: document.formDetails.numTagID.value,
			otherItems: document.formDetails.txtFeatures.value,
			distinctiveMarks: document.formDetails.txtDescription.value,
			imageList: JSON.stringify(urlList),
			caseID: 0,
			ownerID: cookieRead("login_uemail")
			
		},
		success: function(data){
			console.log(data);
			data = JSON.parse(data);  // parse JSON data into js object
			
			if(data.status == 'success'){
				callbackFn( data.bikeID );
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// read all parameters for one bike from database of bikes
function bikedbRead(bikeID, val, callbackFn) {
	
	// Read object from database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/bikedb_io.php',
		data: {
			caller: 'bikedbRead',
			
			// Bike to read
			bikeID: bikeID
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			data.imageList = JSON.parse(data.imageList);
			
			// Build investigation object from database
			var bike = {
				brand: data.brand,
				model: data.model,
				bikeType: data.bikeType,
				gender: data.gender,
				colour: data.colour,
				frameMaterial: data.frameMaterial,
				frameSize: data.frameSize,
				numberGears: data.numberGears,
				suspension: data.suspension,
				brakeType: data.brakeType,
				handlebarType: data.handlebarType,
				frameNumber: data.frameNumber,
				tagBrand: data.tagBrand,
				tagID: data.tagID,
				otherItems: data.otherItems,
				distinctiveMarks: data.distinctiveMarks,
				imageList: data.imageList,//.split(","),
				caseID: data.caseID,
				ownerID: data.ownerID,
				bikeID: data.bikeID
			};
			
			// run code that uses property
			if(data.status == 'success'){
				callbackFn(bikeID, val, bike);
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// read all bikes in the database
function bikedbReadStolen(val, callbackFn) {
	
	// Read object from database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/bikedb_io.php',
		data: {
			caller: 'bikedbReadStolen'
			
		},
		success: function(data){
			// parse data
			data = JSON.parse(data);  // parse JSON data into js object
			bikes = JSON.parse(data.bikes);  // parse JSON data into js object
			//console.log(bikes);
			
			// create bike array variable
			var bikeArray = [];
			var i = 0
			
			// create each bike object
			bikes.forEach(function(entry) {
				
				entry.imageList = JSON.parse(entry.imageList);
				
			    // Build investigation object from database
				var bike = {
					brand: entry.brand,
					model: entry.model,
					bikeType: entry.bikeType,
					gender: entry.gender,
					colour: entry.colour,
					frameMaterial: entry.frameMaterial,
					frameSize: entry.frameSize,
					numberGears: entry.numberGears,
					suspension: entry.suspension,
					brakeType: entry.brakeType,
					handlebarType: entry.handlebarType,
					frameNumber: entry.frameNumber,
					tagBrand: entry.tagBrand,
					tagID: entry.tagID,
					otherItems: entry.otherItems,
					distinctiveMarks: entry.distinctiveMarks,
					imageList: entry.imageList,//.split(","),
					caseID: entry.caseID,
					ownerID: entry.ownerID,
					bikeID: entry.bikeID
				};
				//console.log(bike);
				// add bike to bike array
				bikeArray[i] = bike;
			});
			
			
			// run code that uses property
			if(data.status == 'success'){
				callbackFn(val, bikeArray);
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// update single parameter for one bike from database of bikes
// oldval is only needed for imageList list (if there is no val for IDs set to "")
function bikedbUpdate(bikeID, property, newVal, oldVal, callbackFn) {
	
	
	// Update database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/bikedb_io.php',
		data: {
			caller: 'bikedbUpdate',
			
			// User to Update
			bikeID: bikeID,
			
			// read properties from window
			property: property,
			newVal: newVal,
			oldVal: oldVal
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			if(data.status == 'success'){
				callbackFn();
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}

