
// Check if user is logged on: if yes -> redirect to my-bikes, if not -> stay on page
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
				// redirect to my-cases
				window.location.replace("../../police/my-cases/index.shtml");
			} else {
				// redirect to my-bikes
				window.location.replace("../../public/my-bikes/index.shtml");
			}
		}else{
			// do nothing
		}
	}
});

