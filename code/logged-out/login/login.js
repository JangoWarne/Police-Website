
// go to register page if register is clicked
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
		userdbLogin(user, password, function(){
			
			// send user to myBikes page
			window.location.href = "../../public/my-bikes/index.shtml";
		});
		
		
	} else {
		
		// if username was entered
		// compare values to police user database
		dbid = officerdbRead(user, password, function(){
			
			// send user to myCases page
			window.location.href = "../../police/my-cases/index.shtml";
		});
	}
});
