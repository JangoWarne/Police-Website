
// check user detail when register is clicked and if valid go to myBikes
$('#form-details').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	
	// load password values
	var password = document.formDetails.txtPassword.value;
	var confirm = document.formDetails.txtConfirm.value;
	
	// check confirmed password matches password values
	if (password == confirm) {
		
		// load email values
		var email = document.formDetails.txtEmail.value;
		
		// compare values to database
		dbid = userdbRead(email, "email", password, function update(email, password, dbEmail){
			
			// if user does not exist
			if (email != dbEmail) {
				
				// add content to database
				userdbAdd();
				
				// send user to login page
				window.location.href = "../login/index.shtml";
				
			} else {
				// else alert user that user exists
				alert("User exists");
			}
		});
		
	} else {
		// else alert user that password or email is invalid
		alert("Passwords do not match");
	}
});