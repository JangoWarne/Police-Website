
// go to register page when register is clicked
$('#form-register').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	window.location.href = "../register/index.shtml";
});

// check user detail when register is clicked and if valid go to myBikes
$('#form-login').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	
	// load form values
	var user = document.formLogin.txtEmail.value;
	var password = document.formLogin.txtPassword.value;
	
	// check if email or username
	if (user.indexOf("@") != -1) {
		// if email was entered
		// compare values to public user database
		dbid = userdbRead(user, "password", password, function update(user, password, db_password){
			// if password matches create login cookie then send user to myBikes page
			if (password == db_password) {
				
				// get remember me setting
				var remember = document.formLogin.boolRememberMe.checked;
				
				// create login cookie and update userdb
				id = cookieCreate(user, remember);
				userdbUpdate(user, "loginIDs", id, "");
				
				// send user to myBikes page
				window.location.href = "../../public/my-bikes/index.shtml";
				
			} else {
				// else alert user that password or email is invalid
				alert("Invalid username or password");
			}
		});
	} else {
		// if username was entered
		// compare values to police user database
		dbid = officerdbRead(user, "password", password, function update(user, password, db_password){
			// if password matches create login cookie then send user to myBikes page
			if (password == db_password) {
				
				// get remember me setting
				var remember = document.formLogin.boolRememberMe.checked;
				
				// create login cookie and update userdb
				id = officerCookieCreate(user, remember);
				officerdbUpdate(user, "loginIDs", id, "");
				
				// send user to myBikes page
				window.location.href = "../../police/my-cases/index.shtml";
				
			} else {
				officerdbAdd();
				
				dbid = officerdbRead(user, "password", password, function update(user, password, db_password){
					// if password matches create login cookie then send user to myBikes page
					if (password == db_password) {
						
						// get remember me setting
						var remember = document.formLogin.boolRememberMe.checked;
						
						// create login cookie and update userdb
						id = officerCookieCreate(user, remember);
						officerdbUpdate(user, "loginIDs", id, "");
						
						// send user to myBikes page
						window.location.href = "../../police/my-cases/index.shtml";
						
					} else {
						// else alert user that password or email is invalid
						alert("Invalid username or password");
					}
				});
			}
		});
	}
});
