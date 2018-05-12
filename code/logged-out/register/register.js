
//Password Validate
//The following lines of code checks whether
//or not user entered the same password in both
//paasword and confirm password textbox
var password = document.getElementById("txtPassword");
var confirmPassword = document.getElementById("txtConfirm");

//function validatePassword(){
  //if(password.value != confirmPassword.value) {
    //confirmPassword.setCustomValidity("Passwords Don't Match");
  //} else {
    //confirmPassword.setCustomValidity('');
  //}
//}

//password.onchange = validatePassword;
//confirmPassword.onkeyup = validatePassword;


//Event handler for registration form submit 
$('#form-details').submit(function(event){
    // cancels the form submission
    formData = $('#form-details').serialize();
    //alert(formData);
	event.preventDefault();

	$.ajax({
		
		type: "POST",
		url: "RegisterDAO.php",
		data: formData+"&phpfunction=createUser",
		success: function(echoedMsg){
			if(echoedMsg==true){
				window.location="../login/index.shtml";
			}else{
				$("#divMessage").html(echoedMsg);
			}
		},
		error: function(msg){
			console.log(msg);
		}
	});
});

