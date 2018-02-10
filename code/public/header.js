var dropList;
var headerbar;
var header;
var sticky;

// Shorthand for $( document ).ready() run on page load
$(function() {
	dropList = document.getElementById("dropdown-area");
	
	// When the user scrolls the page, execute scrollFun 
	window.onscroll = function() {scrollFun()};
	
	// Create variables for the header and the header offset
	headerbar = document.getElementsByClassName("heading_text")[0];
	header = document.getElementById("logged-out-header");
	sticky = header.offsetTop;
});


// When hoving over account header button show drop down
$("#account-button").mouseenter(function(){
	dropList.style.display = "block";
});
// When leaving account dropdown list hide it
$("#header-account").mouseleave(function(){
	dropList.style.display = "none";
});
// When clicking on button in account dropdown list hide it (fixes going back a page)
$("#header-account").click(function(){
	dropList.style.display = "none";
});
// When account header button is clicked go-to myBikes page
$("#account-button").click(function(){
	window.location.href = "../../public/my-bikes/index.shtml";
});


// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function scrollFun() {
	if (typeof headerbar !== 'undefined') {
		var className = "stickybar";
	} else {
		var className = "sticky";
	}
	
	if (typeof header !== 'undefined') {
		if (window.pageYOffset >= sticky) {
			header.classList.add(className);
		} else {
			header.classList.remove(className);
		}
	}
}


// When logout button is clicked logout and to to main page
$("#logout").click(function(){
	
	// delete userdb IDs
	email = cookieRead("login_uemail");
	userdbLogout(email);
	
	// delete cookie
	cookieDelete();
	
	// redirect to my-bikes
	window.location.href = "../../logged-out/main/index.shtml";
	
});

