
// Check if user is logged on: if yes -> redirect to my-bikes, if not -> stay on page
var username;
var id;
var dbid;

verify();


// check if user is logged in
function verify() {
	// check if email cookie exists and is non zero (not being deleted)
	username = officerCookieRead("login_uname");
	
	// compare cookie if it exists
	if (username !== "" && username != "0") {
		
		// check if id is valid (compare cookie and db) if it exists
		id = officerCookieRead("login_uuid");
		if (id !== ""  && id != "0") {
			officerdbRead(username, "loginIDs", id, update);
		}
		
	} else {
		
		// redirect to logged out main page
		window.location.replace("../../logged-out/login/index.shtml");
		
	}
	
}


// update login UUID
function update(username, id, dbid) {
	
	var index = dbid.indexOf(id);
	
	if ( index != -1 ) {
		
		// update cookie and userdb
		remember = officerCookieRead("login_uremember"); // retain remember-me status
		id = officerCookieCreate(username, remember);
		
		officerdbUpdate(username, "loginIDs", id, dbid[index], function callback() {});
		
	} else {
		
		// delete invalid cookie
		officerCookieDelete();
		
	}
}

