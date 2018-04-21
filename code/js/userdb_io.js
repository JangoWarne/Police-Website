var db; // global database object

// add user to database of users
function userdbAdd() {
	
	// open database then run callback
	openDatabase( function callback() {
		var transaction = db.transaction(["userdb"], "readwrite");
		var store = transaction.objectStore("userdb");
		
		// Build user object for object store
		var user = {
			// read properties from window
			title: document.formDetails.txtTitle.value,
			firstName: document.formDetails.txtFirstName.value,
			lastName: document.formDetails.txtLastName.value,
			email: document.formDetails.txtEmail.value,
			password: document.formDetails.txtPassword.value,
			addressLine1: document.formDetails.txtAddressLine1.value,
			addressLine2: document.formDetails.txtAddressLine2.value,
			townCity: document.formDetails.txtCity.value,
			county: document.formDetails.txtCounty.value,
			postcode: document.formDetails.txtPostcode.value,
			contactNumber: document.formDetails.telNumber.value,
			emailMe: document.formDetails.boolByEmail.checked,
			textMe: document.formDetails.boolByText.checked,
			loginIDs: [],
			bikeIDs: []
		};
		
		// Add object to store
		var add = store.add(user);
		
		// report error to console if adding user failed
		add.onerror = function(e) { console.log("Error",e.target.error.name); };
		
		// do nothing if succesfull
		add.onsuccess = function(e) { };
	} );
}


// read single parameter for one user from database of users
function userdbRead(email, property, val, callback) {
	
	// open database then run callback
	openDatabase( function openfun() {
		var transaction = db.transaction(["userdb"], "readwrite");
		var store = transaction.objectStore("userdb");
		
		// Read object from store
		var index = store.get(email);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error",e.target.error.name); };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			var storedVal;
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				storedVal = index.result[property];
			} else {
				storedVal = "";
			}
			// run code that uses property
			callback(email, val, storedVal);
			
			return;
		};
	} );
}


// update single parameter for one user from database of users
// oldval is only needed for login and bike ID lists (if there is no val for IDs set to "")
function userdbUpdate(email, property, newVal, oldVal, callback) {
	
	// open database then run callback
	openDatabase( function openfun() {
		var transaction = db.transaction(["userdb"], "readwrite");
		var store = transaction.objectStore("userdb");
		
		// Read object from store
		var index = store.get(email);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error", e.target.error.name); };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				var storedVal = index.result;
				var put;
				
				// update differently if list
				if (property == "loginIDs" || property == "bikeIDs") {
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
						
						// report error to console if adding user failed
						put.onerror = function(e) { console.log("Error",e.target.error.name); };
						
						// run callback if succesfull
						put.onsuccess = function(e) { callback(); };
						
					} else {
						console.log("old value does not exist");
					}
					
				} else {
					// update value
					storedVal[property] = newVal;
					
					// Add object to store
					put = store.put(storedVal);
					
					// report error to console if adding user failed
					put.onerror = function(e) { console.log("Error",e.target.error.name); };
					
					// run callback if succesfull
					put.onsuccess = function(e) { callback(); };
				}
				
			} else {
				console.log("Property does not exist");
			}
			
			return;
		};
	} );
}


// deletes all login IDs
function userdbLogout(email) {
	
	// open database then run callback
	openDatabase( function openfun() {
		var transaction = db.transaction(["userdb"], "readwrite");
		var store = transaction.objectStore("userdb");
		
		// Read object from store
		var index = store.get(email);
		
		// report error to console if reading failed
		index.onerror = function(e) { console.log("Error", e.target.error.name); };
		
		// read property from object if succesfull
		index.onsuccess = function(e) {
			
			if (typeof index.result !== 'undefined') {
				// copy read property to variable
				var storedVal = index.result;
				
				// delete value list
				storedVal["loginIDs"] = [];
				
				// Add object to store
				var put = store.put(storedVal);
				
				// report error to console if adding user failed
				put.onerror = function(e) { console.log("Error",e.target.error.name); };
				
				// do nothing if succesfull
				put.onsuccess = function(e) { };
				
			} else {
				console.log("Property does not exist");
			}
			
			return;
		};
	} );
}


// add user to database of users
function openDatabase(callback) {
	
	// does the browser support indexedDB?
	if("indexedDB" in window) {
		// open website database
		var openRequest = indexedDB.open("userdb",1);
		
		// create database object stores if required
		openRequest.onupgradeneeded = function(e) { updateDatabase(e); };
		
		// add user if susscessfull
		openRequest.onsuccess = function(e) {
			// opening database succeded
			db = e.target.result;
	
			callback();
			
			// close open connection
			db.close();
			return;
		};
		
		// dump to console if error occured
		openRequest.onerror = function(e) {
			// dump list of object properties to console to aid in debugging
			console.log("Error");
			console.dir(e);
			// close open connection
			db = e.target.result;
			db.close();
			return;
		};
		
		// close open database connection if blocked
		openRequest.onblocked = function(e) {
			// close the database connection
			console.log('blocked');
			db = e.target.result;     
			// close open connection   
			db.close();
			return;
		};
	} else {
		// alert user that this website will not work
		alert("IndexedDB broswer support required: This browser cannot run this wesbise as it does not support IndexedDB");
		return;
	}
	
}


// update database required -> create database (can handle version upgrade if needed))
function updateDatabase(e) {
	console.log("Upgrading...");
	db = e.target.result;
	
	// create missing userdb
	if(!db.objectStoreNames.contains("userdb")) {
		// primary key is email address
		db.createObjectStore("userdb", { keyPath: "email" });
	}
}
