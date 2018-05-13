
// Shorthand for $( document ).ready() run on page load
$(function() {
	// Check if user is logged on: and add correct page header
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
					// insert police user header into file
					$('#heading').load('../../police/header.html');
				} else {
					// insert public user header into file
					$('#heading').load('../../public/header.html');
				}
			}else{
				// insert logged out header into file
				$('#heading').load('../header.html');
			}
		}
	});
});

