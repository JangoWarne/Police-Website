


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
  })
  
  $(select).click(function(e) {
    e.stopPropagation();
    $(this).find(".cusDD_options").slideToggle(200);
    $(this).find(".cusDD_arrow").toggleClass("active");
  })
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

/* Call the cusDD function on any select elements by ID or Class */
$(document).ready(function() {
  cusDD("#select1");
  cusDD("#select2");
  
  $(".cusDD_opt").on('click', function() {
    alert($(this).parent().find("[selected='selected']").text());
  });
});

