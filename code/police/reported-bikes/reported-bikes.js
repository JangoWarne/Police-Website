
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
	// check if username cookie exists and is non zero (not being deleted)
	username = cookieRead("login_uname");
	
	// if cookie exists
	if (username !== "" && username != "0") {
		
		// get list of all stolen bikes
        bikedbReadStolen("", function (b, bikes) {
		
			// iterate through bikeIDs
			var number = bikes.length;
			var bike;
			
			for (i = 0; i < number; i++ ) {
				// get bike ID
				bike = bikes[i];
				
                displayBike(bike);
               
			}
		});
	}
	
}


//show bike from database
function displayBike(bike) {
    
    // read case from database
    casedbRead(bike.caseID, "", function (a, b, investigation) {
        bikeID = bike.bikeID;

        // Is image missing?
        var image;
        if (bike.imageList[0] === undefined) {
            image = "../images/no-thumbnail.png";
        } else {
            image = bike.imageList[0];
        }
        
        // Is case "Open"? then add button to assign
        var createCaseBtn = '';
        var isOpen = (investigation.caseStatus.toLowerCase().indexOf("open") != -1);
        if  (isOpen) {
			createCaseBtn = '<button class="edit_case" id="create-' + bike.caseID + '">Create Case</button>';
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
                                                '<img src="../' + image + '" alt="bike' + bikeID + '">' +
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
                                    createCaseBtn +
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
        document.getElementById("biketable").appendChild(bikeRow);//. define class each bike we add will be added end of list

       // update locations
       geocodeLocation(bikeID, investigation.latlngLastSeen);

        // add listeners for new buttons
        if (isOpen) {
			document.getElementById("create-" + bike.caseID).addEventListener('click', createCase, false);
        }
    });
}
    
    
// remove bike when user clicks "Create Case"
function createCase(evt) {
	// check if username cookie exists and is non zero (not being deleted)
	username = cookieRead("login_uname");
	
	// if cookie exists
	if (username !== "" && username != "0") {
        
        // get case id
        var buttonID = evt.target.id;
        //takes string and turns into actual no.
        var caseID = parseInt(buttonID.split('-')[1]);
        
        //assign case to officer
        officerdbUpdate(username, "caseIDs", caseID, "", function (){
        
            //assign officer to case
            casedbUpdate(caseID, "officerID", username, "", function (bikeID){

                //change case status
                casedbUpdate(caseID, "caseStatus", "Under Investigation", "", function (bikeID){
                    
                    //send users to my-cases page
                    window.location.href = "../my-cases/index.shtml";
                });
            });
        });
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