


google.maps.event.addDomListener(window, 'load', initialize);
document.getElementById("googleMap").addEventListener('click', mapRedirect, false);
document.getElementById("googleMapTitle").addEventListener('click', mapRedirect, false);
 
var mapCenter = new google.maps.LatLng(51.884310, -2.164599);
var geocoder = new google.maps.Geocoder();
var infowindow = new google.maps.InfoWindow();



// create google map after DOM loads
function initialize(){
	// configure map content
	var mapOptions = {
		zoom: 12,
		center: mapCenter,
		draggableCursor: 'pointer',
		disableDefaultUI: true,
		gestureHandling: 'none'
    };
	
	// create map
	myMap = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
     
}


// redirect click on map to send user to registered bikes page
function mapRedirect() {
	
	// send user to registered bikes page
	window.location.href = "../reported-bikes/index.shtml";
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
		
		// get case IDs for account
		officerdbRead(username, "caseIDs", "", function (a, b, caseIDs) {
			
			// iterate through caseIDs
			for (i = 0; i < caseIDs.length; i++ ) {
				
				// get case ID
				caseID = parseInt(caseIDs[i]);
		
				// read case from database
				casedbRead(caseID, "", function (a, b, investigation) {
					
					// read bike from database
					bikedbRead(investigation.bikeID, "", function (a, b, bike) {
					
						displayBike(investigation, bike);
					
					});
				});
			}
		});
	}
}


//show bike from database
function displayBike(investigation, bike) {

    bikeID = bike.bikeID;

    // Is image missing?
    var image;
    if (bike.imageList[0] === undefined) {
        image = "../images/no-thumbnail.png";
    } else {
        image = bike.imageList[0];
    }
    
    // set dropdown box
    var ddOpen = "";
    var ddClosed = "";
    var ddUnderInv = "";
    var ddUIContact = "";
    switch (investigation.caseStatus.toLowerCase()) {
	    case "open":
	    	ddOpen = ' selected="selected"';
	    	break;
	    case "closed":
	    	ddClosed = ' selected="selected"';
	    	break;
	    case "under investigation":
	    	ddUnderInv = ' selected="selected"';
	    	break;
	    case "under investigation: contacting user":
	    	ddUIContact = ' selected="selected"';
	    	break;
	    default:
	    	ddUnderInv = ' selected="selected"';
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
                                '<button class="edit_case"><a href="../case-details/index.shtml?caseID=' + bike.caseID + '">Case Details</a></button>' +
                            '</td>' +
                        '</tr>' +
                        '<tr class="case_row">' +
                            '<td class="case_heading">Colour:</td>' +
                            '<td>' + bike.colour  + '</td>' +
                        '</tr>' +
                        '<tr class="case_row">' +
                            '<td class="case_heading">Status:	</td>' +
							'<td><select id="select-' + bikeID + '" class="dropdown">' +
							  '<option value="Open"' + ddOpen + '>Open</option>' +
							  '<option value="Closed"' + ddClosed + '>Closed</option>' +
							  '<option value="Under Investigation"' + ddUnderInv + '>Under Investigation</option>' +
							  '<option value="Under Investigation: Contacting User"' + ddUIContact + '>Contacting User</option>' +
							'</select></td>' +
                        '</tr>' +
                    '</table>' +
                '</td>';
				
    // add html to page
    document.getElementById("biketable").appendChild(bikeRow);//. define class each bike we add will be added end of list
	
	
	// update locations
	geocodeLocation(bikeID, investigation.latlngLastSeen);
	
	
	// update dropdown style
	cusDD("#select-" + bikeID);
	
	
    // add listener for dropdown
    //
    /*
	    $(".cusDD_opt").on('click', function() {
			alert($(this).parent().find("[selected='selected']").text());
		});
	*/
    //
    //
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



function cusDD(select, style) {
  /*Style Switcher*/
  var ddstyle = "";
  
   ddstyle = "cusDD_default";

  for (var i = 0; i < $(select).length; i++) {
    var curr = $($(select)[i]);
    
    //Replace select with div
    curr.addClass(ddstyle+" cusDD").changeElementType("div");
    
    //put drop downs in a container
    //Replace options with divs
    curr = $($(select)[i]);
    curr.find("option").wrapAll("<div class='cusDD_options' />");
    curr.find("option").addClass("cusDD_opt").each(function() {
      $(this).changeElementType("div");
    });
    
    //Add selector and drop down
    curr.prepend("<div class='cusDD_select'><div class='cusDD_arrow'></div></div>");
    
    //Add default option
    var def = (curr.find("div[selected='selected']").length >= 1) ? $(curr.find("div[selected='selected']")) : $(curr.find(".cusDD_opt")[0]);
    curr.find(".cusDD_select").prepend(def.text());
    
  } //End for loop

  $(document).click(function() {
    $(".cusDD_options").slideUp(200);
    $(".cusDD_arrow").removeClass("active");
  });
  
  $(select).click(function(e) {
    e.stopPropagation();
    $(this).find(".cusDD_options").slideToggle(200);
    $(this).find(".cusDD_arrow").toggleClass("active");
  });
  
  $(".cusDD_opt").click(function() {
    $($(this).parent()).siblings(".cusDD_select").contents()[0].nodeValue = $(this).text();
    $(this).parent().find(".cusDD_opt").removeAttr("selected");
    $(this).attr("selected", "selected");
  });

  } // End function)

(function($) {
    $.fn.changeElementType = function(newType) {
        var attrs = {};

        $.each(this[0].attributes, function(idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function() {
            return $("<" + newType + "/>", attrs).append($(this).contents());
        });
    };
})(jQuery);


