
// Check if user is logged on: if yes -> stay on page, if not -> redirect to login
// Get php session information
$.ajax({
	type: "POST",
	url: '../../php/checkLogin.php',
	data: {},
	success: function(data){
		data = JSON.parse(data);  // parse JSON data into js object
		
		// check login status
		if(data.loggedIn){
			
			// redirect to correct logged in page
			if(data.officer){
				// Do nothing
			} else {
				// redirect to my-bikes
				window.location.replace("../../public/my-bikes/index.shtml");
			}
		}else{
			// redirect to login page
			window.location.replace("../../logged-out/login/index.shtml");
		}
	}
});

