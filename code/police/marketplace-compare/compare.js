// runs at page load
$(function(){
    bikeSearch();
    
	loadcase();
});


// load bikes from database
function loadcase() {
	
	// if webaddress contains case id
    params = new URLSearchParams(document.location.search.substring(1));
    caseID = params.get("caseID");
	if (caseID != "") {
        
        // update case-details link
        document.getElementById("link").href = "../case-details/index.shtml?caseID=" + caseID;
		
		// get bike ID for case
		casedbRead(caseID, "", function (a, b, investigation) {
			
			displayBike(investigation.bikeID)
			
		});
	}
}


//on search submit
$('#ebaysearch').on('submit', function(e){
    e.preventDefault();
    
    bikeSearch();
});


// return bike search results
function bikeSearch() {
    //
    $.ajax({
        url: "Marketcompare.php",
        method: "POST",
        data: {
            query: "(bicycle, bike) " + document.ebaysearch.query.value
        },
        success: function(data) {
            //console.log(data);
            // add html to page
            $( "#results" ).html( $( data ) );
        }
    });
}


//show bike from database
function displayBike(bikeID) {
	
	// read bike from database
	bikedbRead(bikeID, "", function (a, b, bike) {
        
		// add new bike html
		var bikedetails = document.createElement('div');
		bikedetails.className = "align_center";
		bikedetails.innerHTML =
					
                        '<span class="column">Brand:</span> <span class="column">-  ' + bike.brand + '</span> <hr><br>'+
            
                        '<span class="column">Model:</span> <span class="column">-  '+ bike.model + '</span> <hr><br>'+
                        
                        '<span class="column">Type:</span> <span class="column">-  '+ bike.bikeType + '</span> <hr><br>'+
                        
                        '<span class="column">Gender:</span> <span class="column">-  '+ bike.gender + '</span> <hr><br>'+
                       
                        '<span class="column">Colour:</span> <span class="column">-  '+ bike.colour + '</span> <hr><br>'+
                        
                        '<span class="column">Frame Material:</span> <span class="column">-  '+ bike.frameMaterial + '</span> <hr><br>'+
                       
                        '<span class="column">Frame Size:</span> <span class="column">-  '+ bike.frameSize + '</span> <hr><br>'+
                        
                        '<span class="column">Number of Gears:</span> <span class="column">-  '+ bike.numberGears + '</span> <hr><br>'+
                        
                        '<span class="column">Suspension:</span> <span class="column">-  '+ bike.suspension + '</span> <hr><br>'+
                       
                        '<span class="column">Brake Type:</span> <span class="column">-  '+ bike.brakeType + '</span> <hr><br>'+
                       
                        '<span class="column">Handle Type:</span> <span class="column">-  '+ bike.handlebarType + '</span> <hr><br>'+
                        
                        '<span class="column">Frame Number:</span> <span class="column">-  '+ bike.frameNumber + '</span> <hr><br>'+
                        
                        '<span class="column">Tag Brand:</span> <span class="column">-  '+ bike.tagBrand + '</span> <hr><br>'+
                       
                        '<span class="column">Tag Id/Number:</span> <span class="column">-  '+ bike.tagID + '</span> <hr><br>'+

                        '<span class="column">Features:</span> <span class="column">-  '+ bike.features+ '</span> <hr><br>'+
                        
                        '<span class="column">Distinctive Marks:</span> <span class="column">-  '+ bike.description+ '</span> <hr><br>';
		
		// add html to page
		$( "#bike-details" ).after( $( bikedetails ) );
        
        insertImage(bike.imageList);
	});
}



function insertImage(imageList) {
    console.log(imageList);
    
	//Loop through the imageList and render image files as thumbnails.
	for (var i = 0; i<imageList.length; i++) {
	            
        // Add image to page
        // number of existing images
        var number = document.getElementsByClassName("images").length;

        // ID for image on page
        var imageID = "image-" + number + "-box";

        // change column if even or odd will seperate photos to l/r 1user/1ebay
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
        document.getElementById(imageID).style.backgroundImage = "url(../" + imageList[i] + ")";
	
	}
}


// check if a number is even (non numbers return undefined))
function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}

