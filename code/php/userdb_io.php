<?php
	
	// Run different code based on caller
	// If caller value exists
	if(isset($_POST['caller']))
	{
		// switch function based on caller
	    switch ($_POST['caller']) {
		    
		    case 'userdbAdd':
		        userdbAdd();
		        break;
		        
		    case 'userdbRead':
		        userdbRead();
		        break;
		        
		    case 'userdbReadFull':
		        userdbReadFull();
		        break;
		        
		    case 'userdbUpdate':
		        userdbUpdate();
		        break;
		        
		    case 'userdbLogout':
		        userdbLogout();
		        break;
		        
		    default:
		        // unknown caller - do nothing
		}
	}
	
	
	
	
	
	
	
	
	
?>