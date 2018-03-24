var casedb; // global database object


// add case to database of cases
function casedbAdd(bikeIDval, latlng, callbackFn) {
	
	// open database then run callback
	openCaseDatabase( function callback() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		
		// Build investigation object for object store
		var investigation = {
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
		};
		
		// Add object to store
		var add = store.add(investigation);
		
		// report error to console if adding bike failed
		add.onerror = function(e) { console.log("Error",e.target.error.name); };
		
		// do nothing if succesfull
		add.onsuccess = function(e) {
			callbackFn(e.target.result);
		};
		
	});
}


// read all parameters for one case from database of cases
function casedbRead(caseID, val, callback) {
	
	// open database then run callback
	openCaseDatabase( function openfun() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		
		// Read object from store
		var index = store.get(caseID);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error",e.target.error.name); };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			var storedVal;
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				storedVal = index.result;
			} else {
				storedVal = "";
			}
			// run code that uses property
			callback(caseID, val, storedVal);
			
			return;
		};
	});
}



// update single parameter for one bike from database of cases
// oldval is only needed for login and case ID lists (if there is no val for IDs set to "")
function casedbFound(caseID, latlng, callback) {
	
	// open database then run callback
	openCaseDatabase( function openfun() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		console.log(caseID);
		// Read object from store
		var index = store.get(caseID);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error", e.target.error.name); };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
		console.log(index);
			
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				var storedVal = index.result;
				
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
				storedVal.found = true;
				storedVal.foundStolen = true;
				storedVal.timeFound = document.formFound.timeFound.value;
				storedVal.dateFound = document.formFound.dateFound.value;
				storedVal.latlngFound = {lat: latlng.lat(), lng: latlng.lng()};
				storedVal.imagesFound = urlList;
				
				// Add object to store
				put = store.put(storedVal);
				
				// report error to console if adding bike failed
				put.onerror = function(e) { console.log("Error",e.target.error.name); };
				
				// run callback if succesfull
				put.onsuccess = function(e) { callback(storedVal.bikeID); };
				
			} else {
				console.log("Property does not exist");
			}
			
			return;
		};
	});
}



// update single parameter for one bike from database of cases
// oldval is only needed for login and case ID lists (if there is no val for IDs set to "")
function casedbUpdate(caseID, property, newVal, oldVal, callback) {
	
	// open database then run callback
	openCaseDatabase( function openfun() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		
		// Read object from store
		var index = store.get(caseID);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error", e.target.error.name); };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				var storedVal = index.result;
				var put;
				
				// update differently if list
				if (property == "loginIDs" || property == "caseIDs") {
					// get value list
					var valList = storedVal[property];
					
					// check if there was an old value
					var i;
					if (oldVal === "") {
						// set new location to end of array
						i = valList.length;
					} else {
						// get old value location
						i = valList.indexOf(oldVal);
					}
					
					// check if old value was found in array
					if (i  != -1 ) { // if value was found
						// update value
						if (newVal === "") {
							valList.splice(index, 1);
						} else {
							valList[i] = newVal;
						}
						storedVal[property] = valList;
					
						// Add object to store
						put = store.put(storedVal);
						
						// report error to console if adding bike failed
						put.onerror = function(e) { console.log("Error",e.target.error.name); };
						
						// do nothing if succesfull
						put.onsuccess = function(e) { callback(storedVal.bikeID); };
						
					} else {
						console.log("old value does not exist");
					}
					
				} else {
					// update value
					storedVal[property] = newVal;
					
					// Add object to store
					put = store.put(storedVal);
					
					// report error to console if adding bike failed
					put.onerror = function(e) { console.log("Error",e.target.error.name); };
					
					// do nothing if succesfull
					put.onsuccess = function(e) { callback(storedVal.bikeID); };
				}
				
			} else {
				console.log("Property does not exist");
			}
			
			return;
		};
	});
}


// open case database
function openCaseDatabase(callback) {
	
	// does the browser support indexedDB?
	if("indexedDB" in window) {
		// open website database
		var openRequest = indexedDB.open("casedb",2);
		
		// create database object stores if required
		openRequest.onupgradeneeded = function(e) { updateCaseDatabase(e); };
		
		// add bike if susscessfull
		openRequest.onsuccess = function(e) {
			// opening database succeded
			casedb = e.target.result;
	
			callback();
			
			// close open connection
			casedb.close();
			return;
		};
		
		// dump to console if error occured
		openRequest.onerror = function(e) {
			// dump list of object properties to console to aid in debugging
			console.log("Error");
			console.dir(e);
			// close open connection
			casedb = e.target.result;
			casedb.close();
			return;
		};
		
		// close open database connection if blocked
		openRequest.onblocked = function(e) {
			// close the database connection
			console.log('blocked');
			casedb = e.target.result;     
			// close open connection   
			casedb.close();
			return;
		};
	} else {
		// alert user that this website will not work
		alert("IndexedDB broswer support required: This browser cannot run this wesbise as it does not support IndexedDB");
		return;
	}
	
}


// update database required -> create database (can handle version upgrade if needed))
function updateCaseDatabase(e) {
	console.log("Upgrading...");
	casedb = e.target.result;
	
	// create missing casedb
	if(!casedb.objectStoreNames.contains("casedb")) {
		// primary key is sequential unique number
		casedb.createObjectStore("casedb", {keyPath: "caseID", autoIncrement:true});
	}
}
