var KEYCODE_ENTER = 13;
var KEYCODE_ESC = 27;
var KEYCODE_ARROW_LEFT = 37;
var KEYCODE_ARROW_UP = 38;
var KEYCODE_ARROW_RIGHT = 39;
var KEYCODE_ARROW_DOWN = 40;
var UNKNOWN ='UNKNOWN';

var accentMap = {
    192: "A",
    193: "A",
    194: "A",
    196: "A",
    199: "C",
    200: "E",
    201: "E",
    202: "E",
    203: "E",
    206: "I",
    207: "I",
    210: "O",
    211: "O",
    212: "O",
    217: "U",
    218: "U",
    219: "U",
    224: "a",
    225: "a",
    226: "a",
    228: "a",
    231: "c",
    232: "e",
    233: "e",
    234: "e",
    238: "i",
    239: "i",
    242: "o",
    242: "o",
    244: "o",
    249: "u",
    250: "u",
    251: "u",
};

var normalize = function( term ) {
    var ret = "";
    for ( var i = 0; i < term.length; i++ ) {
        var temoChar = term.charAt(i).toLowerCase();
        ret += accentMap[ temoChar.charCodeAt(0) ] || term.charAt(i);
    }
    return ret;
};

function formatPhoneNumber(str){
    if (str.length > 0){
        return str.replace(/[^a-z0-9_-\s]/gi, '');
    } else {
        return false;
    }
}

function ucfirst(str) {
    if(str.length>0){
    	var firstLetter = str.substr(0, 1);
    	return firstLetter.toUpperCase() + str.substr(1);
    }else{
    	return false;
    }
}
function allucfirst(str) {
    if(str.length>0){
    	var firstAll='';
		var words = str.split(' ');				
		for(i = 0; i < words.length; i++){
			if(firstAll.length>0){
				firstAll = firstAll + " ";
			}
			firstAll = firstAll + ucfirst(words[i]);			
		}							
    	return firstAll;
    }else{
    	return false;
    }
}
function reverseDelimiterList(list, delimiter){
	if(list.length>0){
		if(delimiter.length>0){
			var reverseList='';
			var elements = list.split(delimiter);
			if(elements.length>0){
				for(i=elements.length-1; i>=0; i--){
					if(reverseList.length>0){
						reverseList = reverseList + delimiter + elements[i];
					}else{
						reverseList = elements[i];
					}
				}
				return reverseList;
			}
		}
	}
	return false;
}
function IsNumeric(input){
    return (input - 0) == input && input.length > 0;
}

function getYearFromBirthdate(birthdate){
	try{								
		if(birthdate !== null && birthdate.length>0){
			var yearIndex = birthdate.lastIndexOf("/");
			if(yearIndex>=0){
				var patientYear = birthdate.substring(yearIndex+1);
				return patientYear;				
			}
		}
	}catch(e){
		console.log(e);
	}
}

function isToday(day, month, year){
	try{
		var $newDate = parseInt(month, 10) + "/" + parseInt(day, 10) + "/" + year;
		var parsedDate =$j.datepicker.parseDate("m/d/yy", $newDate);			
		var today=new Date();
		if( (today.getFullYear() == parsedDate.getFullYear()) && 
			(today.getMonth() == parsedDate.getMonth()) && 
			(today.getDate() == parsedDate.getDate())){
			return true;
		}else{
			return false;
		}
		
	}catch(e){
		console.log(e);
		return false;
	}
	
}

function recordUserActivity(pageContextAddress, activity) {
	$j.ajax({
		type: 'POST',
		url: pageContextAddress + '/module/patientregistration/ajax/logActivity.form',
		data: { 'activity': activity }
	});
}