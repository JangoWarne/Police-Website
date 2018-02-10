


google.maps.event.addDomListener(window, 'load', initialize);
document.getElementById("googleMap").addEventListener('click', mapRedirect, false);
 
 var mapCenter = new google.maps.LatLng(51.884310, -2.164599);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();



// create google map after DOM loads
function initialize(){
	// configure map content
	var mapOptions = {
		zoom: 12,
		center: mapCenter,
		draggableCursor: 'pointer'
    };
	
	// create map
	myMap = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
     
}




// redirect click on map to send user to registered bikes page
function mapRedirect() {
	
	// send user to registered bikes page
	window.location.href = "../login/index.shtml";
}
