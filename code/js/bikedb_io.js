var bikedb; // global database object

// add bike to database of bikes
function bikedbAdd( callbackFn ) {
	
	// open database then run callback
	openBikeDatabase( function callback() {
		var transaction = bikedb.transaction(["bikedb"], "readwrite");
		var store = transaction.objectStore("bikedb");
		
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
		
		
		// Build bike object for object store
		var bike = {
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
			imageList: urlList,
			caseID: 0,
			ownerID: cookieRead("login_uemail"),
		}
		
		// Add object to store
		var add = store.add(bike);
		
		// report error to console if adding bike failed
		add.onerror = function(e) { console.log("Error",e.target.error.name) };
		
		// do nothing if succesfull
		add.onsuccess = function(e) {
			callbackFn(e.target.result);
		};
		
	} );
}


// read all parameters for one bike from database of bikes
function bikedbRead(bikeID, val, callback) {
	
	// open database then run callback
	openBikeDatabase( function openfun() {
		var transaction = bikedb.transaction(["bikedb"], "readwrite");
		var store = transaction.objectStore("bikedb");
		
		// Read object from store
		var index = store.get(bikeID);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error",e.target.error.name) };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				var storedVal = index.result;
			} else {
				storedVal = "";
			}
			// run code that uses property
			callback(bikeID, val, storedVal);
			
			return;
		};
	} );
}

// read all bikes in the database
function bikedbReadStolen(val, callback) {
	
	// open database then run callback
	openBikeDatabase( function openfun() {
		var transaction = bikedb.transaction(["bikedb"], "readwrite");
		var store = transaction.objectStore("bikedb");
		
		// Getting all bikes from store 
		var bikes = store.getAll();
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error",e.target.error.name) };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
            
            //creating a var called storedVal to store the bikes reported stolen / that have a caseID
            var storedVal = [];
            //iterating for each element in the array
            for (var i = 0; 1 < bikes.length; i++) {
                
                if(bikes[i].caseID != 0) {
                    storedVal.push(bikes[i]); 
                }
            }
			// run code that uses property
			callback(bikeID, val, storedVal);
			
			return;
		};
	} );
}


// update single parameter for one bike from database of bikes
// oldval is only needed for login and bike ID lists (if there is no val for IDs set to "")
function bikedbUpdate(email, property, newVal, oldVal) {
	
	// open database then run callback
	openBikeDatabase( function openfun() {
		var transaction = bikedb.transaction(["bikedb"], "readwrite");
		var store = transaction.objectStore("bikedb");
		
		// Read object from store
		var index = store.get(email);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error", e.target.error.name) };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				var storedVal = index.result;
				
				// update differently if list
				if (property == "loginIDs" || property == "bikeIDs") {
					// get value list
					var valList = storedVal[property];
					
					// check if there was an old value
					if (oldVal == "") {
						// set new location to end of array
						var i = valList.length;
					} else {
						// get old value location
						var i = valList.indexOf(oldVal);
					}
					
					// check if old value was found in array
					if (i  != -1 ) { // if value was found
						// update value
						if (newVal == "") {
    						valList.splice(index, 1);
						} else {
							valList[i] = newVal;
						}
						storedVal[property] = valList;
					
						// Add object to store
						var put = store.put(storedVal);
						
						// report error to console if adding bike failed
						put.onerror = function(e) { console.log("Error",e.target.error.name) };
						
						// do nothing if succesfull
						put.onsuccess = function(e) { };
						
					} else {
						console.log("old value does not exist")
					}
					
				} else {
					// update value
					storedVal[property] = newVal;
					
					// Add object to store
					var put = store.put(storedVal);
					
					// report error to console if adding bike failed
					put.onerror = function(e) { console.log("Error",e.target.error.name) };
					
					// do nothing if succesfull
					put.onsuccess = function(e) { };
				}
				
			} else {
				console.log("Property does not exist");
			}
			
			return;
		};
	} );
}


// add bike to database of bikes
function openBikeDatabase(callback) {
	
	// does the browser support indexedDB?
	if("indexedDB" in window) {
		// open website database
		var openRequest = indexedDB.open("bikedb",1);
		
		// create database object stores if required
		openRequest.onupgradeneeded = function(e) { updateBikeDatabase(e) };
		
		// add bike if susscessfull
		openRequest.onsuccess = function(e) {
			// opening database succeded
			bikedb = e.target.result;
	
			callback();
			
			// close open connection
			bikedb.close();
			return;
		}
		
		// dump to console if error occured
		openRequest.onerror = function(e) {
			// dump list of object properties to console to aid in debugging
			console.log("Error");
			console.dir(e);
			// close open connection
			bikedb = e.target.result;
			bikedb.close();
			return;
		}
		
		// close open database connection if blocked
		openRequest.onblocked = function(e) {
			// close the database connection
			console.log('blocked');
			bikedb = e.target.result;     
			// close open connection   
			bikedb.close();
			return;
		}
	} else {
		// alert bike that this website will not work
		alert("IndexedDB broswer support required: This browser cannot run this wesbise as it does not support IndexedDB");
		return;
	}
	
}


// update database required -> create database (can handle version upgrade if needed))
function updateBikeDatabase(e) {
	console.log("Upgrading...");
	bikedb = e.target.result;
	
	// create missing bikedb
	if(!bikedb.objectStoreNames.contains("bikedb")) {
		// primary key is sequential unique number
		bikedb.createObjectStore("bikedb", {keyPath: "bikeID", autoIncrement:true});
	}
}
