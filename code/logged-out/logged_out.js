
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
			userdbRead(email, "loginIDs", id, update);
		}
		
	}
	// else do nothing (no cookie -> stay on page))
	
}


// update login UUID
function update(email, id, dbid) {
	
	var index = dbid.indexOf(id);
	
	if ( index != -1 ) {
		
		// update cookie and userdb
		remember = cookieRead("login_uremember"); // retain remember-me status
		id = cookieCreate(email, remember);
		
		userdbUpdate(email, "loginIDs", id, dbid[index]);
		
		// redirect to my-bikes
		window.location.replace("../../public/my-bikes/index.shtml");
		
	} else {
		
		// delete invalid cookie
		cookieDelete();
		
	}
}

