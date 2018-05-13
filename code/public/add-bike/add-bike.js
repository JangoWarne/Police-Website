

document.getElementById('file-input').addEventListener('change', handleFileSelect, false);
document.getElementById('add-box').addEventListener('click', clickFileSelect, false);


// click file selector when user clicks "add bike"
function clickFileSelect(evt) {
	$("#file-input").trigger("click");
}

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
	var addColID;
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


// check user detail when register is clicked and if valid go to myBikes
$('#form-details').on('submit', function(e) {
	e.preventDefault();  //prevent form from submitting
	
	// add content to database
	bikedbAdd(function (result) {
		
		// add bike id to user
		userdbUpdate("", "bikeIDs", result, "", function callback() {
			
			// send user to login page
			window.location.href = "../my-bikes/index.shtml";
		});
	});
});

