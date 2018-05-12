
// read single parameter for one officer from database of officers
function officerdbRead(username, property, val, callbackFn) {
	
	// Read object from database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/officerdb_io.php',
		data: {
			caller: 'officerdbRead',
			
			// officer to read
			username: username,
			
			// property to read
			property: property
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			// get returned value
			if (property == "loginIDs" || property == "caseIDs") {
				storedVal = JSONparse(data.value , "", {});
				storedVal = Object.values(storedVal);
			} else {
				storedVal = data.value;
			}
			
			// run code that uses property
			if(data.status == 'success'){
				callbackFn(username, val, storedVal);
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// update single parameter for one officer from database of officers
// oldval is only needed for loginID and caseID lists (if there is no val for IDs set to "")
function officerdbUpdate(username, property, newVal, oldVal, callbackFn) {
	
	// Update database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/officerdb_io.php',
		data: {
			caller: 'officerdbUpdate',
			
			// officer to Update
			username: username,
			
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


// deletes all login IDs
function officerdbLogout(username) {
	
	// Logout officer in database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/officerdb_io.php',
		data: {
			caller: 'officerdbLogout',
			
			// officer to logout
			username: username
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			if(data.status == 'success'){
				// Do Nothing
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
