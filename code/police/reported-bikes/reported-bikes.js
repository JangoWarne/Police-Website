
google.maps.event.addDomListener(window, 'load', initialize);
 
 var mapCenter = new google.maps.LatLng(51.884310, -2.164599);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();



// create google map after DOM loads
function initialize(){
	// configure map content
	var mapOptions = {
		zoom: 12,
		center: mapCenter
    };
	
	// create map
	myMap = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
         
   // create map marker       
	marker = new google.maps.Marker({
		map: myMap,
		position: mapCenter,
		draggable: true 
	});     
	

	
	// update address shown above marker
	function showAddressInInfoWindow(results) {
		if (results[0]) {
			infowindow.setContent(results[0].formatted_address);
			infowindow.open(myMap, marker);
		}
	}         
}

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
		
		// get list of all stolen bikes
        bikedbReadStolen("", function (a, b, bikeIDs) {
		
			
			// iterate through bikeIDs
			var number = bikeIDs.length;
			var bikeID;
			
			for (i = 0; i < number; i++ ) {
				// get bike ID
				bikeID = bikeIDs[i];
                
				
                displayBike(investigation, bikeID);
               
			}
		});
	}
	
}


//show bike from database
function displayBike(investigation, bikeID) {
	
	// read bike from database
	bikedbRead(bikeID, "", function (bikeID, b, bike) {
        
		// read case from database
        casedbRead(bike.caseID, "", function (a, b, investigation) {
            
            // Is image missing?
            var image;
            if (bike.imageList[0] === undefined) {
                image = "../../images/no-thumbnail.png";
            } else {
                image = bike.imageList[0];
            }

            // add new bike html
            var bikeRow = document.createElement('tr');
            bikeRow.className = "item";
            bikeRow.id = "bike-row-" + bikeID;
            bikeRow.innerHTML =
                        '<td>' +
                            '<table class = "case">' +
                                '<tr class="case_bike_img">' + // add the string
                                    '<td rowspan="6">' +
                                        '<div class="bike_Image">' +
                                            '<div class="outer_constraint">' +
                                                '<div class="inner_constraint">' +
                                                    '<img src="' + image + '" alt="bike' + bikeID + '">' +
                                                '</div>' +
                                            '</div>' +
                                        '</div>' +
                                    '</td>' +
                                    '<td class="case_heading">When Last Seen:</td>' +
                                    '<td class="case_values">' + investigation.dateLastSeen  + '     ' + investigation.timeLastSeen  + '</td>' +
                                    '<td rowspan="3" class="case_buttons">' +
                                        '<button class="edit_case"> <a href="../bike-details/index.shtml?caseID=' + bike.caseID + '">Bike Details</a></button>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr class="case_row">' +
                                    '<td class="case_heading">Where Last Seen:</td>' +
                                    '<td>' + /*Temporary div is replaced with location*/'<div class="replace' + bikeID + '"></div>'  + '</td>' +
                                '</tr>' +
                                '<tr class="case_row">' +
                                    '<td class="case_heading">Model:</td>' +
                                    '<td>' + bike.model  + '</td>' +
                                '</tr>' +
                                '<tr class="case_row">' +
                                    '<td class="case_heading">Frame Number:</td>' +
                                    '<td>' + bike.frameNumber + '</td>' +
                                    '<td rowspan="3" class="case_buttons">' +
                                        '<button class="edit_case">Create Case</button>' +
                                    '</td>' +
                                '</tr>' +
                                '<tr class="case_row">' +
                                    '<td class="case_heading">Colour:</td>' +
                                    '<td>' + bike.colour  + '</td>' +
                                '</tr>' +
                                '<tr class="case_row">' +
                                    '<td class="case_heading">Status:	</td>' +
                                    '<td>' + investigation.caseStatus  + '</td>' +
                                '</tr>' +
                            '</table>' +
                        '</td>';

            // add html to page
            $( "#biketable" ).appendChild(bikeRow);//. define class each bike we add will be added end of list

           // update locations
	       geocodeLocation(bikeID, investigation.latlngLastSeen);
            
            // add listeners for new buttons
		document.getElementById("remove-" + i).addEventListener('click', removeBike, false);//this and function below needs renamed
        });
        
    });
    
    
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
}

// insert location address text into HTML
function geocodeLocation(locationTag, latlng) {
	
	// get address from latlng
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				
				// get first line of address
				var address = results[0].formatted_address.split(',', 2);
				
				// replace temporary div with location
				$( "div.replace" + locationTag ).replaceWith( address[0] );
				
			} else {
				window.alert('Location Unknown');
			}
		} else {
			window.alert('Location Error');
		}
	});
}