$(function(){
	loadcase();
});

// load bikes from database
function loadcase() {
	// check if email cookie exists and is non zero (not being deleted)
	email = cookieRead("login_uemail");
	
	// if cookie exists
	if (email != "" && email != "0") {
		
		// get bike ID for account
		userdbRead(email, "bikeID", "", function (a, b, bikeID) {
			
			displayBike(bikeID)
			
		});
	}
	
}


//show bike from database
function displayBike(bikeID) {
	
	// read bike from database
	bikedbRead(bikeID, "", function (a, b, bike) {
		
		// add new bike html
		var bikeRow = document.createElement('tr');
		bikeRow.className = "item";
		bikeRow.id = "bike-row-" + bikeID;
		bikeRow.innerHTML =
					
                        'Brand: jfkkvn <br><br>'+
                        'Model: jdjfdjfhvhjhfj <br> <br>'+
                        
                        'Type: jhfjdhfjkdjfj <br> <br>'+
                        
                        'Gender: dhfjdfjj <br> <br>'+
                       
                        'Colour: Red <br> <br>'+
                        
                        'Frame Material: kjkdfjkfjkjlf <br> <br>'+
                       
                        'Frame Size: kjkjkjflkjldkjkl <br> <br>'+
                        
                        'Number of Gears: jhjsdhjhfjhakj<br> <br>'+
                        
                        'Suspension:fihfdjddj<br> <br>'+
                       
                        'Brake Type: hjjfhjsdkjfj<br> <br>'+
                       
                        'Handle Type: jfjsdjf <br> <br>'+
                        
                        'Frame Number: hjdkfjkf <br> <br>'+
                        
                        'Tag Brand: jhdjkhjdk <br> <br>'+
                       
                        'Tag Id/Number: shdjkh skjh<br> <br>'+

                       
                        'Features: jjhsdjhkajshdjkhj <br> <br>'+
                        
                        'Distinctive Marks: hjdhajj<br> <br>'+;
		
		// add html to page
		$( ".cell" ).before( $( bikeRow ) );
		
		// add listeners for new buttons
		document.getElementById("remove-" + i).addEventListener('click', removeBike, false);
	});
