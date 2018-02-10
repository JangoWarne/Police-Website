
// Check if user is logged on: if yes -> redirect to my-bikes, if not -> stay on page
var email;
var id;
var dbid;

verify();


// check if user is logged in
function verify() {
	// check if email cookie exists and is non zero (not being deleted)
	email = cookieRead("login_uemail");
	
	// compare cookie if it exists
	if (email != "" && email != "0") {
		
		// check if id is valid (compare cookie and db) if it exists
		id = cookieRead("login_uuid");
		if (id != ""  && id != "0") {
			admindbRead(email, "loginIDs", id, update);
		}
		
	} else {
		
		// redirect to logged out main page
		window.location.replace("../../logged-out/login/index.shtml");
		
	}
	
}


// update login UUID
function update(email, id, dbid) {
	
	var index = dbid.indexOf(id);
	
	if ( index != -1 ) {
		
		// update cookie and userdb
		remember = cookieRead("login_uremember"); // retain remember-me status
		id = cookieCreate(email, remember);
		
		admindbUpdate(email, "loginIDs", id, dbid[index]);
		
	} else {
		
		// delete invalid cookie
		cookieDelete();
		
	}
}

