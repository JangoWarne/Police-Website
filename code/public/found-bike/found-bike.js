
document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
document.getElementById('add-box').addEventListener('click', clickFileSelect, false);
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
	myMap = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
         
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



// click file selector when user clicks "add bike"
function clickFileSelect(evt) {
	$("#file-input").trigger("click");
}



// check user detail when bike found (stolen) is clicked and if valid update db & go to myBikes
$('#form-found').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	
	// if cookie exists
	email = cookieRead("login_uemail");
	if (email !== "" && email != "0") {
		// if URL bikeID parameter exists
		params = new URLSearchParams( document.location.search.substring(1) );
		caseID = params.get("caseID");
		
		if (caseID !== "") {
			
			// if marker has been moved on map (value has been recorded)
			if ( !jQuery.isEmptyObject(selectedPos) ) {
				
				// add content to database
				casedbFound(parseInt(caseID), selectedPos.latLng, function callback(bikeID) {
					
					// remove case id from bike
					bikedbUpdate(parseInt(bikeID), "caseID", 0, function callback() {
						
						// send user to bikes page
						window.location.href = "../my-bikes/index.shtml";
					});
				});
			}
		}
	}
});




// check user detail when bike found (not stolen) is clicked and if valid update db & go to myBikes
$('#form-not-stolen').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	
	// if cookie exists
	email = cookieRead("login_uemail");
	if (email !== "" && email != "0") {
		// if URL bikeID parameter exists
		params = new URLSearchParams( document.location.search.substring(1) );
		caseID = params.get("caseID");
		
		if (caseID !== "") {
			
			// set case bike-found status to true
			casedbUpdate(parseInt(caseID), "found", true, "", function callback() {
				
				// set case status to closed
				casedbUpdate(parseInt(caseID), "caseStatus", "closed", "", function callback(bikeID) {
					
					// remove case id from bike
					bikedbUpdate(parseInt(bikeID), "caseID", 0, function callback() {
						
						// send user to bikes page
						window.location.href = "../my-bikes/index.shtml";
					});
				});
			});
		}
	}
});



// show dialog to select file and render images on screen
function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
	
	//Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {
	
		// Only process image files.
		if (!f.type.match('image.*')) {
			continue;
		}
		
		var reader = new FileReader();
		
		// Closure to capture the file information.
		reader.onload = (function(theFile) {
			return function(e) {
				// Add image to page
				
				// number of existing images
				var number = document.getElementsByClassName("images").length;
				
				// ID for image on page
				var imageID = "image-" + number + "-box";
				
				// change column if even or odd
				var imageColID;
				var addColID;
				if (isEven(number)) {
					imageColID = 'col1';
					addColID = 'col2';
				} else {
					imageColID = 'col2';
					addColID = 'col1';
				}
				
				// remove "add bike" button
				var element = document.getElementById("add-box");
				element.parentNode.removeChild(element);
				
				// add new image html
				var imageArticle = document.createElement('article');
				imageArticle.className = "images";
				imageArticle.id = imageID;
				imageArticle.innerHTML =  '<div class="remove_image" id="remove-' + number + '"> <span>Remove</span> </div>';
				document.getElementById(imageColID).appendChild(imageArticle);
				
				// add new image as background
				document.getElementById(imageID).style.backgroundImage = "url(" + reader.result + ")";
				
				// add "add bike" button in new location
				var addArticle = document.createElement('article');
				addArticle.id = 'add-box';
				addArticle.innerHTML = '<div class="add_image"> <span><b>+ </b> Add Image</span> </div>';
				document.getElementById(addColID).appendChild(addArticle);
				
				// add listeners for new buttons
				document.getElementById('add-box').addEventListener('click', clickFileSelect, false);
				document.getElementById('remove-' + number).addEventListener('click', removeFileImage, false);
			};
		})(f);
	
	// Read in the image file as a data URL.
	reader.readAsDataURL(f);
	}
}


// remove image when user clicks "remove"
function removeFileImage(evt) {
	// get number for clicked div
	var parentID = evt.target.parentElement.id;
	var clicked = parseInt(parentID.split('-')[1]);
	
	// get number of existing images
	var number = document.getElementsByClassName("images").length;
	var lastImageID = "image-" + (number - 1) + "-box";
	
	// shuffle div images down the list
	var imageID;
	var previousImageID;
	for (i = clicked+1; i < number; i++ ) {
		
		previousImageID = "image-" + (i - 1) + "-box";
		imageID = "image-" + i + "-box";
		
		//set background as previous divs background
		document.getElementById(lastImageID).style.backgroundImage = document.getElementById(imageID).style.backgroundImage;
	}
	
	// remove last div
	var lastImage = document.getElementById(lastImageID);
	lastImage.parentNode.removeChild(lastImage);
	
	// remove "add bike" button
	var addButton = document.getElementById("add-box");
	addButton.parentNode.removeChild(addButton);
	
	// change column if even or odd
	if (isEven(number)) {
		addColID = 'col2';
	} else {
		addColID = 'col1';
	}
	
	// add "add bike" button in new location
	var addArticle = document.createElement('article');
	addArticle.id = 'add-box';
	addArticle.innerHTML = '<div class="add_image"> <span><b>+ </b> Add Image</span> </div>';
	document.getElementById(addColID).appendChild(addArticle);
	
	// add listener for new "add bike" button
	document.getElementById('add-box').addEventListener('click', clickFileSelect, false);
}


// check if a number is even (non numbers return undefined))
function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}

