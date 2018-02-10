
// Shorthand for $( document ).ready() run on page load
$(function() {
	loadBikes();
});

// load bikes from database
function loadBikes() {
	// check if email cookie exists and is non zero (not being deleted)
	email = cookieRead("login_uemail");
	
	// if cookie exists
	if (email != "" && email != "0") {
		
		// get bike ID for account
		userdbRead(email, "bikeIDs", "", function (a, b, bikeIDs) {
			
			// iterate through bikeIDs
			var number = bikeIDs.length;
			var bikeID;
			
			for (i = 0; i < number; i++ ) {
				// get bike ID
				bikeID = bikeIDs[i];
				
				displayBike(bikeID);
			};
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
					'<td>'+
						'<table class = "registered_bike">'+
							'<tr class="registered_bike_row_img">'+
								'<td rowspan="6">'+
									'<div class="bike_Image">'+
										'<div class="outer_constraint">'+
											'<div class="inner_constraint">'+
												'<img src="' + bike.imageList[0] + '" alt="bike' + bikeID + '">'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</td>'+
								'<td class="registered_bike_heading">Brand:</td>'+
								'<td class="registered_bike_values">' + bike.brand + '</td>'+
								'<td rowspan="3" class="registered_bike_buttons">'+
									'<button class="edit_bike"> <a href="../report-stolen/index.shtml">Report Stolen</a></button>'+
								'</td>'+
							'</tr>'+
							'<tr class="registered_bike_row">'+
								'<td class="registered_bike_heading">Model:</td>'+
								'<td>' + bike.model + '</td>'+
							'</tr>'+
							'<tr class="registered_bike_row">'+
								'<td class="registered_bike_heading">Type:</td>'+
								'<td>' + bike.bikeType + '</td>'+
							'</tr>'+
							'<tr class="registered_bike_row">'+
								'<td class="registered_bike_heading">Colour:</td>'+
								'<td>' + bike.colour + '</td>'+
								'<td rowspan="3">'+
									'<button class="edit_bike" id="remove-' + i + '">Remove Bike  <div class="rotate">&#10073</div></button>'+
								'</td>'+
							'</tr>'+
							'<tr class="registered_bike_row">'+
								'<td class="registered_bike_heading">S/N: </td>'+
								'<td>' + bike.frameNumber + '</td>'+
							'</tr>'+
							'<tr class="registered_bike_row">'+
								'<td class="registered_bike_heading">Tag:	</td>'+
								'<td>' + bike.tagBrand + ' - ID: ' + bike.tagID + '</td>'+
							'</tr>'+
						'</table>'+
					'</td>';
		
		// add html to page
		$( ".cell" ).before( $( bikeRow ) );
		
		// add listeners for new buttons
		document.getElementById("remove-" + i).addEventListener('click', removeBike, false);
	});
}

// remove bike when user clicks "Remove Bike -"
function removeBike(evt) {
	
	// get user email
	email = cookieRead("login_uemail");
	
	// if cookie exists
	if (email != "" && email != "0") {
		// get id for bike row
		var parentID = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
		var bikeID = parseInt(parentID.split('-')[2]);
		
		// remove bike row
		var bikeRow = document.getElementById(parentID);
		bikeRow.parentNode.removeChild(bikeRow);
		
		// remove bike from user
		userdbUpdate(email, "bikeIDs", "", bikeID);
	}
}

