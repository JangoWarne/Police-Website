
var geocoder = new google.maps.Geocoder();
var place;

// Shorthand for $( document ).ready() run on page load
$(function() {
	loadBikes();
});


// load bikes from database
function loadBikes() {
	// check if email cookie exists and is non zero (not being deleted)
	email = cookieRead("login_uemail");
	
	// if cookie exists
	if (email !== "" && email != "0") {
		
		// get bike ID for account
		userdbRead(email, "bikeIDs", "", function (a, b, bikeIDs) {
			
			// iterate through bikeIDs
			var number = bikeIDs.length;
			var bikeID;
			
			for (i = 0; i < number; i++ ) {
				// get bike ID
				bikeID = bikeIDs[i];
				
				displayBike(bikeID);
			}
		});
	}
	
}


//show bike from database
function displayBike(bikeID) {
	
	// read bike from database
	bikedbRead(bikeID, "", function (a, b, bike) {
		
		if (bike.caseID === 0) {
			// Is image missing?
			var image;
			if (bike.imageList[0] === undefined) {
				image = "../../images/no-thumbnail.png";
			} else {
				image = bike.imageList[0];
			}
			
			// add new not stolen bike html
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
													'<img src="' + image + '" alt="bike' + bikeID + '">'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</td>'+
									'<td class="registered_bike_heading">Brand:</td>'+
									'<td class="registered_bike_values">' + bike.brand + '</td>'+
									'<td rowspan="3" class="registered_bike_buttons">'+
										'<button class="edit_bike"> <a href="../report-stolen/index.shtml?bikeID=' + bikeID + '">Report Stolen</a></button>'+
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
			
			
		} else {
			// read case from database
			casedbRead(bike.caseID, "", function (a, b, investigation) {
				// Is image missing?
				var image;
				if (bike.imageList[0] === undefined) {
					image = "../../images/no-thumbnail.png";
				} else {
					image = bike.imageList[0];
				}
				
				// add new stolen bike html
				var bikeRow = document.createElement('tr');
				bikeRow.className = "item";
				bikeRow.id = "bike-row-" + bikeID;
				bikeRow.innerHTML =
						'<td>' +
							'<table class = "registered_bike">' +
								'<tr class="missing_bike_row_img">' +
									'<td rowspan="7">' +
										'<div class="bike_Image">' +
											'<div class="outer_constraint">' +
												'<div class="inner_constraint">' +
													'<img src="' + image + '" alt="bike' + bikeID + '">' +
												'</div>' +
											'</div>' +
										'</div>' +
									'</td>' +
									'<td class="missing_bike_heading">Last Seen:</td>' +
									'<td class="missing_bike_values">' + /*Temporary div to be replaced with location*/'<div class="replace' + bikeID + '"></div>' + '<div>' + investigation.dateLastSeen + '</div></td>' +
									'<td rowspan="7" class="registered_bike_buttons">' +
										'<button class="edit_bike"> <a href="../found-bike/index.shtml?caseID=' + investigation.caseID + '">Report Found</a></button>' +
									'</td>' +
								'</tr>' +
								'<tr class="missing_bike_row">' +
									'<td class="registered_bike_heading">Brand:</td>' +
									'<td class="registered_bike_values">' + bike.brand + '</td>' +
								'</tr>' +
								'<tr class="missing_bike_row">' +
									'<td class="registered_bike_heading">Model:</td>' +
									'<td>' + bike.model + '</td>' +
								'</tr>' +
								'<tr class="missing_bike_row">' +
									'<td class="registered_bike_heading">Type:</td>' +
									'<td>' + bike.bikeType + '</td>' +
								'</tr>' +
								'<tr class="missing_bike_row">' +
									'<td class="registered_bike_heading">Colour:</td>' +
									'<td>' + bike.colour + '</td>' +
								'</tr>' +
								'<tr class="missing_bike_row">' +
									'<td class="registered_bike_heading">S/N: </td>' +
									'<td>' + bike.frameNumber + '</td>' +
								'</tr>' +
								'<tr class="missing_bike_row">' +
									'<td class="registered_bike_heading">Tag:	</td>' +
									'<td>' + bike.tagBrand + ' - ID: ' + bike.tagID + '</td>' +
								'</tr>' +
								'<tr class="missing_status_row">' +
									'<td colspan="2" class="missing_status_heading">Investigation Status:	</td>' +
									'<td>' + investigation.caseStatus + '</td>' +
									'<td class="missing_status_explain"> <a href="../explain-investigation-status/index.shtml">Explain Status?</a> </td>' +
								'</tr>' +
							'</table>' +
						'</td>';
						
				
				// add html to page
				$( ".cell" ).before( $( bikeRow ) );
				
				// update location
				geocodeLocation(bikeID, investigation.latlngLastSeen);
			});
		}
		
		
		// add listeners for new buttons
		document.getElementById("remove-" + i).addEventListener('click', removeBike, false);
	});
}


// remove bike when user clicks "Remove Bike -"
function removeBike(evt) {
	
	// get user email
	email = cookieRead("login_uemail");
	
	// if cookie exists
	if (email !== "" && email != "0") {
		// get id for bike row
		var parentID = evt.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.id;
		var bikeID = parseInt(parentID.split('-')[2]);
		
		// remove bike row
		var bikeRow = document.getElementById(parentID);
		bikeRow.parentNode.removeChild(bikeRow);
		
		// remove bike from user
		userdbUpdate(email, "bikeIDs", "", bikeID, function callback() {});
	}
}


// get first line of address
function geocodeLocation(bikeID, latlng) {
	
	// get address from latlng
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				
				// get first line of address
				var address = results[0].formatted_address.split(',', 2);
				
				// replace temporary div with location
				$( "div.replace" + bikeID ).replaceWith( address[0] );
				
			} else {
				window.alert('Location Unknown');
			}
		} else {
			window.alert('Location Error');
		}
	});
}

