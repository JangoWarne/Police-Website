
// Shorthand for $( document ).ready() run on page load
$(function() {
	loadDetails();
});

function loadDetails() {
		
	userdbRead("", "title", "", function (a, b, val) {document.formDetails.txtTitle.value = val;});
	userdbRead("", "firstName", "", function (a, b, val) {document.formDetails.txtFirstName.value = val;});
	userdbRead("", "lastName", "", function (a, b, val) {document.formDetails.txtLastName.value = val;});
	userdbRead("", "email", "", function (a, b, val) {document.formDetails.txtEmail.value = val;});
	// do not fill password
	userdbRead("", "addressLine1", "", function (a, b, val) {document.formDetails.txtAddressLine1.value = val;});
	userdbRead("", "addressLine2", "", function (a, b, val) {document.formDetails.txtAddressLine2.value = val;});
	userdbRead("", "townCity", "", function (a, b, val) {document.formDetails.txtCity.value = val;});
	userdbRead("", "county", "", function (a, b, val) {document.formDetails.txtCounty.value = val;});
	userdbRead("", "postcode", "", function (a, b, val) {document.formDetails.txtPostcode.value = val;});
	userdbRead("", "contactNumber", "", function (a, b, val) {document.formDetails.telNumber.value = val;});
	userdbRead("", "emailMe", "", function (a, b, val) {document.getElementById("by-email").checked = val;});
	userdbRead("", "textMe", "", function (a, b, val) {document.getElementById("by-text").checked = val;});
	
	
}