var casedb; // global database object

// add case to database of cases
function casedbAdd( callbackFn ) {
	
	// open database then run callback
	openCaseDatabase( function callback() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		
		// Build investigation object for object store
		var investigation = {
			// read properties from window
			timeLastSeen: document.formDetails.txtBrand.value,
			dateLastSeen: document.formDetails.txtModel.value,
			timeSeenMissing: document.formDetails.txtType.value,
			dateSeenMissing: document.formDetails.txtGender.value,
			latlngLastSeen: document.formDetails.txtColour.value,
			partsMissing: document.formDetails.txtFrameMaterial.value,
			peopleSeen: document.formDetails.txtFrameSize.value,
			bikeID: document.formDetails.numGears.value,
			caseStatus: document.formDetails.txtSuspension.value,
			userID: cookieRead("login_uemail"),
			officerID: document.formDetails.txtHandleType.value
		}
		
		// Add object to store
		var add = store.add(investigation);
		
		// report error to console if adding bike failed
		add.onerror = function(e) { console.log("Error",e.target.error.name) };
		
		// do nothing if succesfull
		add.onsuccess = function(e) {
			callbackFn(e.target.result);
		};
		
	} );
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
			callback(caseID, val, storedVal);
			
			return;
		};
	} );
}



// read all cases in the database
function casedbReadStolen(val, callback) {
	
	// open database then run callback
	openCaseDatabase( function openfun() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		
		// Getting all cases from store 
		var cases = store.getAll();
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error",e.target.error.name) };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			// run code that uses property
			callback(bikeID, val, cases);
			
			return;
		};
	} );
}



// update single parameter for one bike from database of cases
// oldval is only needed for login and case ID lists (if there is no val for IDs set to "")
function casedbUpdate(email, property, newVal, oldVal) {
	
	// open database then run callback
	openCaseDatabase( function openfun() {
		var transaction = casedb.transaction(["casedb"], "readwrite");
		var store = transaction.objectStore("casedb");
		
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
				if (property == "loginIDs" || property == "caseIDs") {
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


// open case database
function openCaseDatabase(callback) {
	
	// does the browser support indexedDB?
	if("indexedDB" in window) {
		// open website database
		var openRequest = indexedDB.open("casedb",1);
		
		// create database object stores if required
		openRequest.onupgradeneeded = function(e) { updateCaseDatabase(e) };
		
		// add bike if susscessfull
		openRequest.onsuccess = function(e) {
			// opening database succeded
			casedb = e.target.result;
	
			callback();
			
			// close open connection
			casedb.close();
			return;
		}
		
		// dump to console if error occured
		openRequest.onerror = function(e) {
			// dump list of object properties to console to aid in debugging
			console.log("Error");
			console.dir(e);
			// close open connection
			casedb = e.target.result;
			casedb.close();
			return;
		}
		
		// close open database connection if blocked
		openRequest.onblocked = function(e) {
			// close the database connection
			console.log('blocked');
			casedb = e.target.result;     
			// close open connection   
			casedb.close();
			return;
		}
	} else {
		// alert user that this website will not work
		alert("IndexedDB broswer support required: This browser cannot run this wesbise as it does not support IndexedDB");
		return;
	}
	
}


// update database required -> create database (can handle version upgrade if needed))
function updateDatabase(e) {
	console.log("Upgrading...");
	casedb = e.target.result;
	
	// create missing casedb
	if(!casedb.objectStoreNames.contains("casedb")) {
		// primary key is sequential unique number
		casedb.createObjectStore("casedb", {keyPath: "caseID", autoIncrement:true});
	}
}
