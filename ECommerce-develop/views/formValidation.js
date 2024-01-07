
function formValidation(){
	var uemail = document.registration.emailId;
	var uname = document.registration.name;
	var passid = document.registration.password;
	var cpassid = document.registration.cpassword;
	
	if(uemail.value==''||uname.value==''||passid.value==''||cpassid.value==''){	
		alert("You have missed mandatory field(s)");
		return false;
	}
	
	if(allLetter(uname) && validateEmail(uemail) && passid_validation(passid,7,12) && cpassid_validation(cpassid, passid)){
		return true;
	}
	return false;
}



function passid_validation(passid,mx,my){
	var passid;
	if (passid == 'a') {
		passid = document.getElementById('password').value;	
	} else {
		passid = document.getElementById('cpassword').value;	
	}

	var passid_len = passid.length;
	if (passid_len == 0 ){
		alert("Password should not be empty");
		document.registration.passid.focus();
		return false;
	}
	else if(passid_len >= my || passid_len < mx){
		alert("Password Length should be between "+mx+" to "+my);
		document.registration.passid.focus();
		return false;
	}
	return true;
}

function allLetter(uname){ 
//	var uname = document.registration.name;

	//var uname = document.getElementById('name').value;
	console.log(uname);

	var letters = /^[a-zA-Z ]*$/;
	if(uname.value.match(letters)){
		return true;
	}
	alert('Username must have alphabet characters only');
	document.registration.name.focus();
	return false;
}


function validateEmail(uemail){
	var uemail = document.getElementById('emailId').value;
	console.log(uemail);
	
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if(uemail.match(mailformat)){
		return true;
	}
	alert("You have entered an invalid email address!");
	document.registration.uemail.focus();
	return false;
}


function cpassid_validation(cpassid, passid){
	var passid = document.getElementById('password').value;
	var cpassid = document.getElementById('cpassword').value;

	if (passid == cpassid){
		return true
	}
	alert("Password and Confirm Password do not match!");
	return false;
}


// Kunjan Edit: 04/02/2023


function crFormValidation(){
	var uemail = document.crregistration.emailId;
	var uname = document.crregistration.name;
	var passid = document.crregistration.password;
	var cpassid = document.crregistration.cpassword;
	var ssn = document.crregistration.ssn;
	var dob = document.crregistration.dateofbirth;
	
	alert('Fields found: '+uemail.value + uname.value+ passid.value+ cpassid.value+ ssn.value+ dob.value);
	
	if(uemail.value==''||uname.value==''||passid.value==''||cpassid.value==''||ssn.value==''||dob.value==''){	
		alert("You have missed mandatory field(s)");
		return false;
	}
	
	if(allLetter(uname) && validateEmail(uemail) && passid_validation(passid,7,12) && cpassid_validation(cpassid, passid) && ssnvalidator(ssn)){
		return true;
	}
	
	return false;
		
}

function ssnvalidator(ssn){
	var ssnformat = "^(?!666|000|9\\d{2})\\d{3}"
                       + "(?!00)\\d{2}"			// "-(?!00)\\d{2}-"
                       +"(?!0{4})\\d{4}$";
	if(ssn.value.match(ssnformat)){
		return true;
	}
	alert("SSN value seems incorrect. Please enter SSN value as per the following:\n1. It should have 9 digits.\n2. The first part should have 3 digits and should not be 000, 666, or between 900 and 999.\n3. The second part should have 2 digits and it should be from 01 to 99.\n4. The third part should have 4 digits and it should be from 0001 to 9999.");
	uemail.focus();
	return false;
}