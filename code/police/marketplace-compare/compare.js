var page = 0;
var bikeStrings = [];

// runs at page load
$(function(){
	
	loadcase();
	
	// when croll bar hits bottom of list
    $('#scroll').scroll(chk_scroll);
    
	// on back button click
	$('#back-button').on('click', function(e) {
		
		document.getElementById('bikes-results').style.display = "block";
		document.getElementById('bikes-search').style.display = "block";
		document.getElementById('bike-info').style.display = "none";
		document.getElementById('bike-back').style.display = "none";
	});
});


// load bikes from database
function loadcase() {
	
	// if webaddress contains case id
    params = new URLSearchParams(document.location.search.substring(1));
    caseID = params.get("caseID");
	if (caseID !== "") {
        
        // update case-details link
        document.getElementById("link").href = "../case-details/index.shtml?caseID=" + caseID;
		
		// get bike ID for case
		casedbRead(caseID, "", function (a, b, investigation) {
			
			displaydbBike(investigation.bikeID);
			
		});
	}
}


//on search submit
$('#ebaysearch').on('submit', function(e){
    e.preventDefault();
    
    // load new search results
    bikeSearch(true);
});


// when user scrolles to end of results
function chk_scroll(e) {
    var elem = $(e.currentTarget);
    var scrollPosition = elem[0].scrollHeight - elem.scrollTop();
    
    // when user reaches bottom of scroll bar (+/- 1 px for float vs int comparison)
    if ( (scrollPosition <= elem.outerHeight() + 1) && (scrollPosition >= elem.outerHeight() - 1) ) {
		
        // add to existing search results
		bikeSearch(false);
    }
}


// return bike search results
function bikeSearch(reset) {
	
	// load next page of results or load from scratch
	if (reset) {
		page = 1;
	} else {
		// load next page
		page = page + 1;
	}
	
    // load ebay results
    $.ajax({
        url: "Marketcompare.php",
        method: "POST",
        data: {
			page: page,
			dbArray: bikeStrings,
			query: "(bicycle, bike) " + document.ebaysearch.query.value
        },
        success: function(data) {
			data = JSON.parse(data);  // parse JSON data into js object
			
            // If successful
            if(data.status == 'success') {
				
				// load next page of results or load from scratch
				if (reset) {
					// replace html on page
					$( "#results" ).html( $( data.list ) );
				} else {
					// append html to page
					$( "#results" ).append( $( data.list ) );
				}
				
				// Switch to single bike view if user clicks on bike
				var bikeid = 0;
				bikesData = bikeDecode(data.bikes);
				for (var i = 0; i < data.bikes.length; i++) {
					
					bikeInfo = bikesData[i];
					bikeid = bikeInfo.bikeid[0];
					row = '#ebay-row-' + bikeid;
					
					// bike row click
					$(row).click({bikeInfo: bikeInfo}, function(event) {
						
						displayeBayBike(event.data.bikeInfo);
						document.getElementById('bikes-results').style.display = "none";
						document.getElementById('bikes-search').style.display = "none";
						document.getElementById('bike-info').style.display = "block";
						document.getElementById('bike-back').style.display = "block";
					});
				}
				
            } else if(data.status == 'success') {
				console.log(data.error);
            }
        }
    });
}



//show bike from database
function displaydbBike(bikeID) {
	
	// read bike from database
	bikedbRead(bikeID, "", function (a, b, bike) {
		
		// build bikeStrings array of values for matches comparison
		bikeStrings = [
			bike.brand,
			bike.model,
			bike.bikeType,
			bike.gender,
			bike.colour,
			bike.frameMaterial,
			bike.frameSize,
			bike.numberGears,
			bike.suspension,
			bike.brakeType,
			bike.handlebarType,
			bike.frameNumber,
			bike.tagBrand,
			bike.tagID
		];
		bikeStrings = bikeStrings.concat( bike.otherItems.split(" ") );
        
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

                        '<span class="column">Features:</span> <span class="column">-  '+ bike.otherItems+ '</span> <hr><br>'+
                        
                        '<span class="column">Distinctive Marks:</span> <span class="column">-  '+ bike.distinctiveMarks+ '</span> <hr><br>';
		
		// add html to page
		$( "#bike-details" ).after( $( bikedetails ) );
        
        insertImage(bike.imageList);
        
        bikeSearch(true);
	});
}


//show bike from eBay
function displayeBayBike(bike) {
	
	// turn features into a list
	// map features object to array
	var array = $.map(bike.features, function(value, index) {
		return [value];
	});
	// append strings
	features = '';
	for (var i = 0; i < array.length; i++) {
		features = features + array[i] + ",<br>";
	}
	
	// add new bike html
	var bikedetails = document.createElement('div');
	bikedetails.className = "ebay_center";
	bikedetails.innerHTML =
					
                    '<div class="line"><b>' + bike.title[0] + '</b></div> <br>'+
	
					'<a href="'+ bike.ebayURL[0] +'"><input id="item-button" class="ebay_button" type="button" value="View eBay listing"></a> <br> <br>' +
        
                    '<div class="line"><img src="' + bike.pic[0] + '"></div> <br> <br>' +
                    
                    '<hr><center>Bike Information</center><hr><br>'+
                   
                    '<span class="column">Location:</span> <span class="column">-  '+ bike.itemLocation[0] + ", " + bike.itemPost[0] + '</span> <hr><br>'+
					
                    '<span class="column">Brand:</span> <span class="column">-  ' + bike.brand[0] + '</span> <hr><br>'+
        
                    '<span class="column">Model:</span> <span class="column">-  '+ bike.model[0] + '</span> <hr><br>'+
                    
                    '<span class="column">Type:</span> <span class="column">-  '+ bike.type[0] + '</span> <hr><br>'+
                    
                    '<span class="column">Gender:</span> <span class="column">-  '+ bike.gender[0] + '</span> <hr><br>'+
                   
                    '<span class="column">Colour:</span> <span class="column">-  '+ bike.colour[0] + '</span> <hr><br>'+
                    
                    '<span class="column">Frame Material:</span> <span class="column">-  '+ bike.material[0] + '</span> <hr><br>'+
                    
                    '<span class="column">Number of Gears:</span> <span class="column">-  '+ bike.gearNum[0] + '</span> <hr><br>'+
                    
                    '<span class="column">Suspension:</span> <span class="column">-  '+ bike.suspension[0] + '</span> <hr><br>'+
                   
                    '<span class="column">Brake Type:</span> <span class="column">-  '+ bike.brake[0] + '</span> <hr><br>'+
                   
                    '<span class="column">Handle Type:</span> <span class="column">-  '+ bike.handlebar[0] + '</span> <hr><br>'+
                    
                    '<span class="column">Frame Number:</span> <span class="column">-  '+ bike.mpn[0] + '</span> <hr><br>'+

                    '<span class="column">Features:</span> <span class="column">-  '+ features + '</span><br><br><br><br><br><br><br>' +
                    
                    
                    
                    
                    '<hr><center>Seller Information</center><hr><br>'+
                   
                    '<span class="column">Seller Name:</span> <span class="column">-  '+ bike.sellerAddress.FirstName + " " + bike.sellerAddress.LastName + '</span> <hr><br>'+
                    
                    '<span class="column">Seller Company:</span> <span class="column">-  '+ bike.sellerAddress.CompanyName + '</span> <hr><br>'+
                   
                    '<span class="column">Seller Address:</span> <span class="column">-  '+ bike.sellerAddress.Street1 + ",<br>" + bike.sellerAddress.PostalCode + '</span> <hr><br>'+
                    
                    '<span class="column">Seller Number:</span> <span class="column">-  '+ bike.sellerAddress.Phone + '</span> <br> <br> <br>';
	
	// add html to page
	$( "#eBay-details" ).html( $( bikedetails ) );
    
}


// decode json array
function bikeDecode(jsonArray) {
	
	// variable to return
	var objArray = [];
	
	// decode element by element
	for(var i = 0; i < jsonArray.length; i++) {
		
		//decode string
		objArray[i] = JSON.parse(jsonArray[i]);
	}
	
	return objArray;
}


// add images to page
function insertImage(imageList) {
    
	//Loop through the imageList and render image files as thumbnails.
	for (var i = 0; i<imageList.length; i++) {
		
        // Add image to page
        // number of existing images
        var number = document.getElementsByClassName("images").length;

        // ID for image on page
        var imageID = "image-" + number + "-box";

        // change column if even or odd will seperate photos to l/r 1user/1ebay
        var imageColID;
        if (isEven(number)) {
            imageColID = 'col1';
        } else {
			imageColID = 'col2';	
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

