
// add user to database of users
function userdbAdd() {
	
	// Add object to database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/userdb_io.php',
		data: {
			caller: 'userdbAdd',
			
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
			textMe: document.formDetails.boolByText.checked
			
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


// read single parameter for one user from database of users
function userdbRead(email, property, val, callbackFn) {
	
	// Read object from database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/userdb_io.php',
		data: {
			caller: 'userdbRead',
			
			// user to read
			email: email,
			
			// property to read
			property: property
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			// get returned value
			if (property == "loginIDs" || property == "bikeIDs") {
				storedVal = JSONparse(data.value , "", {});
				storedVal = Object.values(storedVal);
			} else {
				storedVal = data.value;
			}
			
			// run code that uses property
			if(data.status == 'success'){
				callbackFn(email, val, storedVal);
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// read all parameters for one user from database of users
function userdbReadFull(email, val, callbackFn) {
	
	// Read object from database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/userdb_io.php',
		data: {
			caller: 'userdbReadFull',
			
			// user to read
			email: email
			
		},
		success: function(data){
			data = JSON.parse(data);  // parse JSON data into js object
			
			// Build investigation object from database
			var user = {
				title: data["title"],
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				password: data.password,
				addressLine1: data.addressLine1,
				addressLine2: data.addressLine2,
				townCity: data.townCity,
				county: data.county,
				postcode: data.postcode,
				contactNumber: data.contactNumber,
				emailMe: data.emailMe,
				textMe: data.textMe,
				loginIDs: JSONparse(data.loginIDs, "", {}),
				bikeIDs: JSONparse(data.bikeIDs, "", {})
				};
				
			
			// run code that uses property
			if(data.status == 'success'){
				callbackFn(email, val, user);
			}else if(data.status == 'error'){
				console.log(data.error);
			}
		}
	});
}


// update single parameter for one user from database of users
// oldval is only needed for loginIDs and bikeIDs lists (if there is no val for IDs set to "")
function userdbUpdate(email, property, newVal, oldVal, callbackFn) {
	
	// Update database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/userdb_io.php',
		data: {
			caller: 'userdbUpdate',
			
			// User to Update
			email: email,
			
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
function userdbLogout(email) {
	
	// Logout user in database (PHP)
	$.ajax({
		type: "POST",
		url: '../../php/userdb_io.php',
		data: {
			caller: 'userdbLogout',
			
			// user to logout
			email: email
			
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

