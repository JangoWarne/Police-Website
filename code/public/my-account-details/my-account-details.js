
// Shorthand for $( document ).ready() run on page load
$(function() {
	loadDetails();
});

function loadDetails() {
	// check if email cookie exists and is non zero (not being deleted)
	email = cookieRead("login_uemail");
	
	// if cookie exists
	if (email != "" && email != "0") {
		
		userdbRead(email, "title", "", function (a, b, val) {document.formDetails.txtTitle.value = val});
		userdbRead(email, "firstName", "", function (a, b, val) {document.formDetails.txtFirstName.value = val});
		userdbRead(email, "lastName", "", function (a, b, val) {document.formDetails.txtLastName.value = val});
		userdbRead(email, "email", "", function (a, b, val) {document.formDetails.txtEmail.value = val});
		// do not fill password
		userdbRead(email, "addressLine1", "", function (a, b, val) {document.formDetails.txtAddressLine1.value = val});
		userdbRead(email, "addressLine2", "", function (a, b, val) {document.formDetails.txtAddressLine2.value = val});
		userdbRead(email, "townCity", "", function (a, b, val) {document.formDetails.txtCity.value = val});
		userdbRead(email, "county", "", function (a, b, val) {document.formDetails.txtCounty.value = val});
		userdbRead(email, "postcode", "", function (a, b, val) {document.formDetails.txtPostcode.value = val});
		userdbRead(email, "contactNumber", "", function (a, b, val) {document.formDetails.telNumber.value = val});
		userdbRead(email, "emailMe", "", function (a, b, val) {document.getElementById("by-email").checked = val});
		userdbRead(email, "textMe", "", function (a, b, val) {document.getElementById("by-text").checked = val});
		
	}
	
}