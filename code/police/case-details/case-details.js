
 
var mapCenter = new google.maps.LatLng(51.884310, -2.164599);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();
var myMap;



// Shorthand for $( document ).ready() run on page load
$(function() {
	//initializeMap();
	//google.maps.event.addDomListener(window, 'load', initializeMap);
	
	loadCase();
});



// create google map after DOM loads
function initializeMap(){
	
	// configure map content
	var mapOptions = {
		zoom: 12,
		center: mapCenter
    };
	
	// create map
	myMap = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    
    
    // Hide points of interest markers (too similar to bike location markers)
    var mapStyles = [
		{
			"featureType": "poi",
			"stylers": [
				{ "visibility": "off" }
			]
		}
	];
	myMap.setOptions({styles: mapStyles});
	
	
	// update address shown above marker
	function showAddressInInfoWindow(results) {
		if (results[0]) {
			infowindow.setContent(results[0].formatted_address);
			infowindow.open(myMap, marker);
		}
	}        
}


// load bikes from database
function loadCase() {
		
	// if URL caseID parameter exists
	params = new URLSearchParams( document.location.search.substring(1) );
	caseID = params.get("caseID");
	
	if (caseID !== "") {
		// read case from database
		casedbRead(caseID, "", function (a, b, investigation) {
			//console.log(investigation);
			// read bike from database
			bikedbRead(investigation.bikeID, "", function (a, b, bike) {
				//console.log(bike);
				// read user from database
				userdbReadFull(bike.ownerID, "", function (a, b, user) {
					//console.log(user);
					// Display case, bike and user details on page
					displayCase(investigation, bike, user);
					
				});
			});
		});
	}
	
}


// Display case, bike and user details on page
function displayCase(investigation, bike, user) {
	
	var foundStolen = investigation.foundStolen;
	var locationFound = "";
	var dateTimeFound = "";
	var foundStatus = "";
	var bikeFoundImages = "";
	
	// Are bike images missing?
	var image;
	if (bike.imageList === undefined) {
		bike.imageList[0] = "../images/no-thumbnail.png";
	} else {
		if (bike.imageList[0] === undefined) {
			bike.imageList[0] = "../images/no-thumbnail.png";
		} else {
			// Do Nothing
		}
	}
	
	
	// If recovered
	var imagesFound;
	if (foundStolen) {
		// Are found images missing?
		if (investigation.imagesFound === undefined) {
			investigation.imagesFound[0] = "../images/no-thumbnail.png";
		} else {
			if (investigation.imagesFound[0] === undefined) {
				investigation.imagesFound[0] = "../images/no-thumbnail.png";
			} else {
				// do nothing
			}
		}
		
		// Create bike recovered HTML
		locationFound = 
			'<span class="map_heading"> Location Found: <div id="green-box"></div> </span> <span id="location-found" class="map_info">' + /*Temporary div is replaced with location*/'<div class="replace2"></div>' + '</span> <br>';
		
		dateTimeFound = 
			'<br>' +
			'<span class="case_heading"> Date Found: </span> <span id="case-date-found" class="case_info">' + investigation.dateFound + '</span> <br>' +
			'<span class="case_heading"> Time Found: </span> <span id="case-time-found" class="case_info">' + investigation.timeFound + '</span> <br>';
		
		bikeFoundImages = 
			'<br>' +
			'<span class="bike_heading"> Bike Found Images: </span> <br>' +
			'<section class="image_bounds" id="found-images">' +
				'<div class="column" id="col1_found-images">' +
				'</div>' +
				'<div class="column" id="col2_found-images">' +
				'</div>' +
			'</section> <br>';
	}
	
	// Stolen status
	if (investigation.found) {
		if (foundStolen) {
			foundStatus = 'Found Stolen';
		} else {
			foundStatus = 'Found Not Stolen';
		}
	} else {
		foundStatus = 'Not Found';
	}
	
	// add new not stolen bike html
	var caseSection = document.createElement('section');
	caseSection.className = "centered";
	caseSection.innerHTML =
			'<!-- IDs -->' +
			'<div class="align_center">' +
				'<h3>' +
				'<span class="heading_case">CaseID: </span> <span id="caseID">' + investigation.caseID + '</span>' +
				'<span class="heading_bike">BikeID: </span> <span id="bikeID">' + investigation.bikeID + '</span> <br>' +
				'</h3>' +
			'</div>' +
			'<br>' +
			
			'<!-- Compare button -->' +
			'<div class="align_center">' +
				'<button id="marketplace-button"> <a href="../marketplace-compare/index.shtml?caseID=' + investigation.caseID + '">Compare to Marketplace</a> </button> <br>' +
				'<br>' +
			'</div>' +
			
			'<!-- Location -->' +
			'<div class="box">' +
			'<div class="align_center">' +
					'<h1> Location of reported bike theft </h1>' +
				'</div>' +
				'<hr />  <br>' +
				
				'<div class="align_center">' +
				'<div id="googleMap"></div> <br> <br>' +
					
					'<span class="map_heading"> Location Stolen: <div id="red-box"></div> </span> <span id="location-stolen" class="map_info">' + /*Temporary div is replaced with location*/'<div class="replace1"></div>' + '</span> <br>' +
					locationFound +
					'</div>' +
					'</div>' +
			'<br>' +
			
			'<!-- Case Details -->' +
			'<div class="box">' +
				'<div class="align_center">' +
					'<h1> Case Details </h1>' +
				'</div>' +
				'<hr />  <br>' +
				
				'<div class="align_center">' +
					'<span class="case_heading"> Status: </span> <span id="case-status" class="case_info">' + investigation.caseStatus + '</span> <br>' +
					'<span class="case_heading"> Found?: </span> <span id="case-found" class="case_info">' + foundStatus + '</span> <br>' +
					'<br>' +
					'<span class="case_heading"> Date Last Seen: </span> <span id="case-date-last-seen" class="case_info">' + investigation.dateLastSeen + '</span> <br>' +
					'<span class="case_heading"> Time Last Seen: </span> <span id="case-time-last-seen" class="case_info">' + investigation.timeLastSeen + '</span> <br>' +
					'<br>' +
					'<span class="case_heading"> Date Spotted Missing: </span> <span id="case-date-spotted-missing" class="case_info">' + investigation.dateSeenMissing + '</span> <br>' +
					'<span class="case_heading"> Time Spotted Missing: </span> <span id="case-time-spotted-missing" class="case_info">' + investigation.timeSeenMissing + '</span> <br>' +
					dateTimeFound +
				'</div>' +
			'</div>' +
			'<br> <br>' +
			
			'<!-- Bike Details -->' +
			'<div class="box">' +
				'<div class="align_center">' +
					'<h1> Bike Details </h1> <button class="details_button" id="bike-button"> <a href="../bike-details/index.shtml?caseID=' + investigation.caseID + '">Details</a> </button>' +
				'</div>' +
				'<hr />  <br>' +
				
				'<div class="align_center">' +
					'<span class="bike_heading"> Colour: </span> <span id="bike-stolen" class="bike_info">' + bike.colour + '</span> <br>' +
					'<span class="bike_heading"> Brand: </span> <span id="bike-brand" class="bike_info">' + bike.brand + '</span> <br>' +
					'<span class="bike_heading"> Model: </span> <span id="bike-model" class="bike_info">' + bike.model + '</span> <br>' +
					'<span class="bike_heading"> Frame Number: </span> <span id="bike-frame-number" class="bike_info">' + bike.frameNumber + '</span> <br>' +
					'<span class="bike_heading"> Distinctive Marks: </span> <br>' +
					'<span id="bike-items" class="bike_items">' + bike.distinctiveMarks + '</span> <br>' +
					
					'<!-- Bike Images -->' +
					'<br>' +
					'<span class="bike_heading"> Bike Images: </span> <br>' +
					'<section class="image_bounds" id="bike-images">' +
						'<div class="column" id="col1_bike-images">' +
						'</div>' +
						'<div class="column" id="col2_bike-images">' +
						'</div>' +
					'</section> <br>' +
					
					'<!-- Bike Found Images -->' + bikeFoundImages +
				'</div>' +
			'</div>' +
			'<br> <br>' +
			
			'<!-- User Details -->' +
			'<div class="box">' +
				'<div class="align_center">' +
					'<h1> User Details </h1> <button class="details_button" id="user-button"> <a href="../user-details/index.shtml?userID=' + investigation.userID + '">Details</a> </button>' +
				'</div>' +
				'<hr />  <br>' +
				
				'<div class="align_center">' +
					'<span class="user_heading"> Name: </span> <span id="user-name" class="user_info">' + user.title + ' ' + user.firstName + ' ' + user.lastName + '</span> <br>' +
					'<span class="user_heading"> Address: </span> <span id="user-address" class="user_info">' + user.addressLine1 + ', ' + user.postcode + '</span> <br>' +
					'<br>' +
					
					'<button id="contact-button"> Contact User </button> <br>' +
					'<br>' +
					
					'<!-- Contact User Box -->' +
					'<form action="mailer.php" id="contact-form" name="contactForm">' +
						
						'<div for="message">Message: </div>' +
						'<textarea class="input" id="message" name="message" style="height:200px"></textarea> <br>' +
						'<br>' +
						
						'<input id="send-button" type="submit" value="Send">' +
				
					'</form>' +
				'</div>' +
			'</div>';
	
	// add html to page
	$( "main" ).html( caseSection );
	
	initializeMap();
	
	// update locations
	geocodeLocation(1, investigation.latlngLastSeen);
	createMarker("red", investigation.latlngLastSeen);
	if (foundStolen) {
		geocodeLocation(2, investigation.latlngFound);
		createMarker("green", investigation.latlngFound);
	}
	
	
	// add listeners for new buttons
	document.getElementById("bike-button").addEventListener('click', function bikeDetails(){
		window.location.href = '../bike-details/index.shtml?bikeID=' + investigation.bikeID;
	}, false);
	document.getElementById("user-button").addEventListener('click', function userDetails(){
		window.location.href = '../user-details/index.shtml?userID=' + investigation.userID;
	}, false);
	
	contactBtn = document.getElementById("contact-button");
	contactForm = document.getElementById("contact-form");
	document.getElementById("contact-button").addEventListener('click', function contact(){
		contactBtn.style.display = "none";
		contactForm.style.display = "block";
	}, false);
	
	
	// add listener for form
	$('#contact-form').on('submit', function(e) {
		e.preventDefault();  //prevent form from submitting
		
		contactBtn.style.display = "block";
		contactForm.style.display = "none";
        
        
        // run PHP function to contact user
        // check if email cookie exists and is non zero (not being deleted)
        username = cookieRead("login_uname");
        
        officerdbRead("firstName", "", function(username, a, firstName) {
            
            officerdbRead("lastName", "", function(username, a, lastName) {
	            
                // Submit the form using AJAX.
                $.ajax({
                    type: 'POST',
                    url: $('#contact-form').attr('action'),
                    data: {
                        name: firstName + " " + lastName,
                        email: user.email,
                        message: document.contactForm.message.value
                    },
                    success: function(response) {
                        // Clear the form.
                        $('#message').val('');
                        casedbUpdate(bike.caseID, "caseStatus", "Under Investigation: Contacting User", "", function(a){});
                    }
                });
            });
        });
	});
	
	
	// Insert images
	addImages( "bike-images", bike.imageList );
	if (foundStolen) {
		addImages( "found-images", investigation.imagesFound );
	}
}


// add marker to map
function createMarker(colour, latlng) {
	
	// get coloured icon
	var iconImage;
	if (colour == "green") { // Green Marker
		iconImage = './images/green-pin.png';
	} else { // Red marker (Default)
		iconImage = './images/red-pin.png';
	}
	
	var iconObj = {
		url: iconImage, // url
		scaledSize: new google.maps.Size(30, 50) // scaled size
	};
	
	// create map marker       
	marker = new google.maps.Marker({
		map: myMap,
		position: latlng,
		icon: iconObj,
		draggable: false
	}); 
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
				$( "div.replace" + locationTag ).replaceWith( results[0].formatted_address );
				
			} else {
				window.alert('Location Unknown');
			}
		} else {
			window.alert('Location Error');
		}
	});
}


// insert images into page
function addImages(locationID, imagesList) {
	//console.log(imagesList.length);
	// get locations to insert images
	var imageLocation = document.getElementById(locationID);
	var col1 = "col1_" + locationID;
	var col2 = "col2_" + locationID;
	
	
	//Loop through the FileList and render image files as thumbnails.
	for (var i = 0; i < imagesList.length; i++) {
		//console.log(1);
		// Add image to page
		
		// number of existing images
		var number = imageLocation.getElementsByClassName("images").length;
		
		// ID for image on page
		var imageID = "image-" + number + "-box";
		
		// change column if even or odd
		var imageCol;
		if (isEven(number)) {
			imageCol = col1;
		} else {
			imageCol = col2;
		}
		
		// add new image html
		var imageArticle = document.createElement('article');
		imageArticle.className = "images";
		imageArticle.id = imageID+"_"+locationID;
		document.getElementById(imageCol).appendChild(imageArticle);
		//console.log(imageCol);
		//console.log(document.getElementById(imageCol));
		// add new image as background
		document.getElementById(imageID+"_"+locationID).style.backgroundImage = "url(../" + imagesList[i] + ")";
		
	}
}


// check if a number is even (non numbers return undefined))
function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}


