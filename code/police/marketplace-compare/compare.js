$(function(){
	loadcase();
});

// load bikes from database
function loadcase() {
	
	
	// if webaddress contains case id
    new URLSearchParams(document.location.search.substring(1));
    caseID = params.get("caseID");
	if (caseID != "") {
		
		// get bike ID for case
		casedbRead(caseID, "", function (a, b, investigation) {
			
			displayBike(investigation.bikeID)
			
		});
	}
	
}


//show bike from database
function displayBike(bikeID) {
	
	// read bike from database
	bikedbRead(bikeID, "", function (a, b, bike) {
		
		// add new bike html
		var bikedetails = document.createElement('div');
		bikedetails.className = "align_center";
		bikedetails.innerHTML =
					
                        'Brand: ' + bike.brand + ' <br><br>'+
            
                        'Model: '+ bike.model + ' <br> <br>'+
                        
                        'Type: '+ bike.bikeType + ' <br> <br>'+
                        
                        'Gender: '+ bike.gender + '<br> <br>'+
                       
                        'Colour: '+ bike.colour + ' <br> <br>'+
                        
                        'Frame Material: '+ bike.frameMaterial + ' <br> <br>'+
                       
                        'Frame Size: '+ bike.frameSize + ' <br> <br>'+
                        
                        'Number of Gears: '+ bike.numberGears + ' <br> <br>'+
                        
                        'Suspension: '+ bike.suspension + '<br> <br>'+
                       
                        'Brake Type: '+ bike.brakeType + '<br> <br>'+
                       
                        'Handle Type: '+ bike.handlebarType + ' <br> <br>'+
                        
                        'Frame Number: '+ bike.frameNumber + ' <br> <br>'+
                        
                        'Tag Brand: '+ bike.tagBrand + '<br> <br>'+
                       
                        'Tag Id/Number: '+ bike.tagID + '<br> <br>'+

                        'Features: '+ bike.features+ ' <br> <br>'+
                        
                        'Distinctive Marks: '+ bike.description+ '<br> <br>'+;
		
		// add html to page
		$( "#bike-details" ).after( $( bikedetails ) );
		
		// add listeners for new buttons
		document.getElementById("remove-" + i).addEventListener('click', removeBike, false);
	});
}

function insertImage(imageList) {
	
	
	//Loop through the imageList and render image files as thumbnails.
	for (var i = 0; i==imageList.length; i++) {
	            
        // Add image to page
        // number of existing images
        var number = document.getElementsByClassName("images").length;

        // ID for image on page
        var imageID = "image-" + number + "-box";

        // change column if even or odd will seperate photsos to l/r 1user/1ebay
        if (isEven(number)) {
            var imageColID = 'col1';
        } else {
            var imageColID = 'col2';	
        }

        // add new image html
        var imageArticle = document.createElement('article');
        imageArticle.className = "images";
        imageArticle.id = imageID;
        document.getElementById(imageColID).appendChild(imageArticle);

        // add new image as background
        document.getElementById(imageID).style.backgroundImage = "url(" + imageList[i] + ")";
	
	}
}