
google.maps.event.addDomListener(window, 'load', initialize);
 
var mapCenter = new google.maps.LatLng(51.884310, -2.164599);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var selectedPos = {};


// create google map after DOM loads
function initialize(){
	// configure map content
	var mapOptions = {
		zoom: 12,
		center: mapCenter
    };
	
	// create map
	myMap = new google.maps.Map( document.getElementById("googleMap"), mapOptions );
         
	// create map marker       
	marker = new google.maps.Marker({
		map: myMap,
		position: mapCenter,
		draggable: true 
	});     
	
	//add listener for when the marker finishes moving
	google.maps.event.addListener(marker, 'dragend', markerDragged);
	
	// update address when marker finishes moving
	function markerDragged() {
		selectedPos = {'latLng': marker.getPosition()};
		geocoder.geocode(selectedPos, showAddressInInfoWindow);
	}
	
	// update address shown above marker
	function showAddressInInfoWindow(results) {
		if (results[0]) {
			infowindow.setContent(results[0].formatted_address);
			infowindow.open(myMap, marker);
		}
	}
}


// check user detail when register is clicked and if valid go to myBikes
$('#form-report').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	
	// if cookie exists
	email = cookieRead("login_uemail");
	if (email !== "" && email != "0") {
		// if URL bikeID parameter exists
		params = new URLSearchParams( document.location.search.substring(1) );
		bikeID = params.get("bikeID");
		
		if (bikeID !== "") {
			
			// if marker has been moved on map (value has been recorded)
			if ( !jQuery.isEmptyObject(selectedPos) ) {
				
				// add content to database
				casedbAdd(bikeID, selectedPos.latLng, function callback(result) {
					
					// add case id to bike
					bikedbUpdate(parseInt(bikeID), "caseID", result, function callback() {
						
						// send user to bikes page
						window.location.href = "../my-bikes/index.shtml";
					});
				});
			}
		}
	}
});

