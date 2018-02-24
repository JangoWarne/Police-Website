
// write email and random id number to local cookie returning id
function cookieCreate(email, remember) {
	// generate random id
	id = generateID();
	
	// if set to remeber add a expirery date
	if (remember != true) {
		var expires = "";
	} else {
		// else calculate expirery time of 1 year
		var d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString()+";";
	}
	
	// write email and random id number to local cookie #Josh
	document.cookie = "login_uemail=" + email + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uremember=" + remember + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uuid=" + id + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;" + expires;
	
	// write email and random id number to local cookie #Aaron
	document.cookie = "login_uemail=" + email + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uremember=" + remember + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uuid=" + id + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;" + expires;
	
	// write email and random id number to local cookie #Oliver
	document.cookie = "login_uemail=" + email + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uremember=" + remember + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uuid=" + id + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;" + expires;
	
	return id;
}

// read local cookie and return value for input key
function cookieRead(key) {
    var name = key + "=";
    var cookies = document.cookie.split(';');  // split into key=value cookies
    
    //iterate through key=value pairs
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        
        // remove leading white space if it exists
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        
        // return value for input key
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// delete cookie from local system
function cookieDelete() {
	// set cookie expirery to value before now #Josh
	document.cookie = "login_uemail=" + "0" + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uremember=" + false + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uuid=" + "0" + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	
	// set cookie expirery to value before now #Aaron
	document.cookie = "login_uemail=" + "0" + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uremember=" + false + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uuid=" + "0" + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	
	// set cookie expirery to value before now #Oliver
	document.cookie = "login_uemail=" + "0" + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uremember=" + false + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uuid=" + "0" + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}




// write email and random id number to local cookie returning id
function officerCookieCreate(email, remember) {
	// generate random id
	id = generateID();
	
	// if set to remeber add a expirery date
	if (remember != true) {
		var expires = "";
	} else {
		// else calculate expirery time of 1 year
		var d = new Date();
		d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
		var expires = "expires="+d.toUTCString()+";";
	}
	
	// write email and random id number to local cookie #Josh
	document.cookie = "login_uname=" + email + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uremember=" + remember + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uuid=" + id + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;" + expires;
	
	// write email and random id number to local cookie #Aaron
	document.cookie = "login_uname=" + email + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uremember=" + remember + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uuid=" + id + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;" + expires;
	
	// write email and random id number to local cookie #Oliver
	document.cookie = "login_uname=" + email + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uremember=" + remember + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;" + expires;
	document.cookie = "login_uuid=" + id + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;" + expires;
	
	return id;
}

// read local cookie and return value for input key
function officerCookieRead(key) {
    var name = key + "=";
    var cookies = document.cookie.split(';');  // split into key=value cookies
    
    //iterate through key=value pairs
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        
        // remove leading white space if it exists
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        
        // return value for input key
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// delete cookie from local system
function officerCookieDelete() {
<<<<<<< HEAD
	// set cookie expirery to value before now #Josh
	document.cookie = "login_uname=" + "0" + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uremember=" + false + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uuid=" + "0" + ";domain=ct4009-17bn.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	
	// set cookie expirery to value before now #Aaron
	document.cookie = "login_uname=" + "0" + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uremember=" + false + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uuid=" + "0" + ";domain=ct4009-17cc.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	
	// set cookie expirery to value before now #Oliver
	document.cookie = "login_uname=" + "0" + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uremember=" + false + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = "login_uuid=" + "0" + ";domain=ct4009-17cr.studentsites.glos.ac.uk;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}


// generate sudo random uuid (v4) for verifying login state
//  Jeff Ward. 2014. UUID generators. [ONLINE] Available at: https://jsperf.com/uuid-generator-opt/29. [Accessed 23 December 2017].
  var lut = new Array(256); // user lookup table for effeciency
  lut = [
          '00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f',
          '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f',
          '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f',
          '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f',
          '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f',
          '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f',
          '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f',
          '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f',
          '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f',
          '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f',
          'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af',
          'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf',
          'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf',
          'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df',
          'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef',
          'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'
      ];
function generateID() {
	// generate 4 random numbers to convert to uuid
    var buffer = [
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000,
      Math.random() * 0x100000000
    ];
  
  // map random numbers to uuid format using lookups for each char pair
    var d0 = buffer[0],
      d1 = buffer[1],
      d2 = buffer[2],
      d3 = buffer[3];
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
      lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
      lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
      lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  }
 
 