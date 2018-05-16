
// function to limit results to matches based on search criteria
// takes in a bike and runs callback if bike matches search parameters
function bikeSearch(bike, investigation, frameNumStr, modelStr, brandStr, colourStr, showAssigned, showUnassigned, callbackFn) {
	add = true;
	
	// show based on frame number string
	if (frameNumStr !== "") {
		// if string cannot be found
		framenumber = bike.frameNumber.toLowerCase();
		if (!framenumber.includes(frameNumStr.toLowerCase())) {
			add = false;
		}
	}
	
	// show based on model string
	if (modelStr !== "") {
		// if string cannot be found
		model = bike.model.toLowerCase();
		if (!model.includes(modelStr.toLowerCase())) {
			add = false;
		}
	}
	
	// show based on make string
	if (brandStr !== "") {
		// if string cannot be found
		brand = bike.brand.toLowerCase();
		if (!brand.includes(brandStr.toLowerCase())) {
			add = false;
		}
	}
	
	// show based on colour string
	if (colourStr !== "") {
		// if string cannot be found
		colour = bike.colour.toLowerCase();
		if (!colour.includes(colourStr.toLowerCase())) {
			add = false;
		}
	}
	
	// show based on if cases assigned to an officer should be shown
	if (showAssigned !== "") {
		// if there is an officer assigned
		if (investigation.officerID != 0) {
			// if you were not asked to show assigned bikes
			if (showAssigned != true) {
				add = false;
			}
		}
	}
	
	// show based on if cases NOT assigned to an officer should be shown
	if (showUnassigned !== "") {
		// if there is no officer assigned
		if (investigation.officerID == 0) {
			// if you were not asked to show unassigned bikes
			if (showUnassigned != true) {
				add = false;
			}
		}
	}
	
	// if bike can be output
	if (add) {
		callbackFn(bike, investigation);
	}
}