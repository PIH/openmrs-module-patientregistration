$j(document).ready(function(){
	
	var searchString='';
	var patientId='';
	var exactIdentifierRecords = 0;
	var exactIdentifierResults = new Array();
	var partialIdentifierResults = new Array();
	var nameResults = new Array();
	var totalPatientsTimer = null;
	var requestCounter = 0;
     
	
	// show the white right arrow
	$j('#right-arrow-white').show();		
	// set focus to the input field so that we can automatically do bar code scanning
	$j('#inputPatient').focus();
	
	var patientNameTimerId=null;
	var jqxhr =null;
	
	$j.lookupPatients = function(searchString, resultsArray, ajaxAddress) {
		$j("#loadingGraph").css("visibility", "visible");
		$j("#loadingGraph").show();
		var lookupResults = new Array();
		patientNameTimerId= setTimeout(function() {  
			requestCounter++;
			jqxhr  = $j.getJSON(
				pageContextAddress + '/module/patientregistration/ajax/' + ajaxAddress
				, "lookupInfo=" + searchString
				, function(patients) {
			
			if (patients.length > 0) {
				console.log(patients.length + " patients found");				
				// now add a new row for each patient
				$j.each(patients, function(i,patient) {
					resultsArray.push(patient);	 																	
				});					
			}else{
				console.log("no patients found");
			}			
		}).success(function(){ 
			console.log("patientLookup search success"); 
		}).error(function(){
			console.log("patientLookup.form failed");
			//$j("#messageSpan").text("failed to find patients");
		}).complete(function(){
			
			jqxhr = null;
			requestCounter--;
			console.log("patientLookup.form has completed");				
		});}, 1000);
		
	}
	
	$j.displayPatients =  function(patientArray){
		// remove the existing rows
		$j('.patientListRow').remove();
		// do not show the header		
		$j('#loadingGraph').hide();		
		$j('.patientListHeader').hide();	
		$j.each(patientArray, function(i,patient) {
			// create the row element itself
			var row = $j(document.createElement('tr')).addClass('patientListRow');
			if (i % 2 == 0) { 
				row.addClass('evenRow');
			} else {
				row.addClass('oddRow');
			}
			
			row.mousemove(function(){
				setSelectedItem(i);
			});							
			var foundPatient = '';
			$j.each(nameFields, function(i, field) {															
				if (patient[field]){
					if(foundPatient.length>0){
						foundPatient = foundPatient + " ";
					}
					foundPatient = foundPatient + patient[field] ;
				}								
			});		
			foundPatient = foundPatient + ", " + patient.gender + ', ' + patient.birthdate;	
			foundPatient = foundPatient + ", " + patient.preferredIdentifier;
			
			var otherIds = '';
			var returnedIdentifiers = eval(patient.identifiers.identifier);
			var j = 0;
			for(j=0; j<returnedIdentifiers.length; j++){																		
				otherIds= otherIds +  returnedIdentifiers[j].identifierValue + ", "; 
			}
			foundPatient = foundPatient + ", " + otherIds;
			
			row.append($j(document.createElement('td')).addClass('patientListItem').text(foundPatient));
			
			row.append($j(document.createElement('input')).attr("type", "hidden").addClass('hiddenPatientId').text(patient.id));
			row.click(function(){
				populateSearchField();
				setSelectedItem(null);				
			});								
			$j('.patientList').append(row);
															
		});	
		setSelectedItem(null);
	}
	
	$j.totalPatients = function(){
		var totalPatientsArray =  new Array();
		var patientIdArray = new Array();
		var exactIdentifierResultsLength = exactIdentifierResults.length;
		var similarAlertText="";
		if(exactIdentifierResultsLength > 0){
			for(var i=0; i < exactIdentifierResultsLength; i++){
				totalPatientsArray.push(exactIdentifierResults[i]);
				patientIdArray.push(exactIdentifierResults[i].id);
			}
			
			if(parseInt(exactIdentifierResultsLength,10)>0){						
				similarAlertText = $j.sprintf(similarExactAlert, exactIdentifierResultsLength);							
			}else{
				similarAlertText = $j.sprintf(similarExactAlert, 0);
			}
		}else{
			exactIdentifierResultsLength = 0;
		}
		var partialIdentifierResultsLength = partialIdentifierResults.length;
		if( partialIdentifierResultsLength > 0){
			for(var i=0; i < partialIdentifierResults.length; i++){
				if($j.inArray(partialIdentifierResults[i].id, patientIdArray) <0){
					totalPatientsArray.push(partialIdentifierResults[i]);	
					patientIdArray.push(partialIdentifierResults[i].id);
				}else{
					partialIdentifierResultsLength = partialIdentifierResultsLength -1;
				}
			}		
			similarAlertText = $j.sprintf(similarSoundexAlert, exactIdentifierResultsLength, partialIdentifierResultsLength);
			
		}else{
			partialIdentifierResultsLength = 0;
		}
		var nameResultsLength = nameResults.length;
		if( nameResultsLength > 0){
			for(var i=0; i < nameResults.length; i++){
				if($j.inArray(nameResults[i].id, patientIdArray) <0){
					totalPatientsArray.push(nameResults[i]);	
				}else{
					nameResultsLength = nameResultsLength -1;
				}
			}		
			similarAlertText = $j.sprintf(similarSoundexAlert, exactIdentifierResultsLength, parseInt(nameResultsLength + partialIdentifierResultsLength,10));
		}
		if(totalPatientsArray.length > 0){
			$j.displayPatients(totalPatientsArray);
		}
		
		if(totalPatientsTimer){
			clearTimeout(totalPatientsTimer);
		}else{
			console.log("totalPatientsTime is null");
		}
		if(requestCounter>0){			
			totalPatientsTimer = setTimeout('$j.totalPatients();', 2000);
		}else{
			$j("#loadingImage").hide();
		}
	}
	
	var inputId = null;
	var $autocomplete = $j('.patientList').hide();
							
	var selectedItem = null;
	
	var setSelectedItem = function(item) {				
		selectedItem = item;
		if (selectedItem !== null) {		
			if (selectedItem < 0) {
			  selectedItem = 0;
			}
			if (selectedItem >= $autocomplete.find('tr').length) {
			  selectedItem = $autocomplete.find('tr').length - 1;
			}
			
			$autocomplete.find('tr').removeClass('highlighted')
			  .eq(selectedItem).addClass('highlighted');			
		}
		$autocomplete.show();
		$j("#inputPatient").focus();
	};
	
	$j('#right-arrow-yellow').click(function(event){				
		if(patientId.length>0){
			console.log("patient has been selected, patientId=" + patientId);
			window.location.href=pageContextAddress + '/module/patientregistration/workflow/patientDashboard.form?patientId=' + patientId;
		}
	});
	
	$j('.cross-black').click(function(event){				
		$j("#inputPatient").val("");
		$j("#messageSpan").text(messageAreaSpan);
		$j('#messageArea').hide();	
		$j("#inputPatient").focus();
	});
	
	var populateSearchField = function() {
		var populateVal =null;
		if((selectedItem !== null) && (selectedItem >= 0)){
			var htmlVal =  $autocomplete.find('tr').eq(selectedItem).html();
			var rowElement = $autocomplete.find('tr').eq(selectedItem).find(".hiddenPatientId");
			if(rowElement){				
				patientId = rowElement.text();				
			}
			if(htmlVal.length>0){
				console.log("htmlVal=" + htmlVal);
			}
			populateVal = $autocomplete.find('tr').eq(selectedItem).text();	
			if(populateVal.length>0){
				$j("#inputPatient").val(populateVal);
			}
			$autocomplete.find('tr').removeClass('highlighted');
			setSelectedItem(null);		
			$j("#inputPatient").focus();
		}								
	 };

	// handle the real-time patient search
	$j("#inputPatient").keyup(function(event) {									
		if(patientNameTimerId){
			clearTimeout(patientNameTimerId);
		}
		if(jqxhr){
			jqxhr.abort()
			jqxhr = null;
		}

		var inputValue = $j("#inputPatient").val();		
		if(inputValue.length>0){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();			
		}else{
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}
		if (event.keyCode > 40 || event.keyCode ==8) {
		/*
			keys with codes 40 and below are special
			(enter, arrow keys, escape, etc...)
			key code 8 is backspace
		*/														
			$autocomplete = $j('.patientList').hide();	
			$j("#lookupInfo").val(inputValue);		
			
			if(inputValue.length>2){	
				$j("#loadingImage").show();
				exactIdentifierResults =  new Array();
				$j.lookupPatients(inputValue, exactIdentifierResults, "identifierExactLookup.form");
				partialIdentifierResults = new Array();
				$j.lookupPatients(inputValue, partialIdentifierResults, "identifierPartialLookup.form");
				nameResults = new Array();
				$j.lookupPatients(inputValue, nameResults, "patientNameLookup.form");
				totalPatientsTimer = setTimeout('$j.totalPatients();', 3000);
			}
		}else if (event.keyCode ==38 ){
				//user pressed up arrow
				if(selectedItem ===null){
					selectedItem=1;
				}
				setSelectedItem(selectedItem - 1);
				event.preventDefault();
		}else if (event.keyCode == 40 ){
			//user pressed down arrow			
			if(selectedItem ===null){
				setSelectedItem(0);
			}else{			
				setSelectedItem(selectedItem + 1);
			}
			event.preventDefault();
		} else if (event.keyCode == 27 && selectedItem !== null) {
		  // User pressed escape key.
		  setSelectedItem(null);
		}
	}).keypress(function(event) {		
		if (event.keyCode == 13 ) {
		  // User pressed enter key.			 			 
		  event.stopPropagation();
		  if((selectedItem==null) && 
			$j("#inputPatient").val().length>0 && 
			patientId.length>0){			
			$j('#right-arrow-yellow').click();
		  }else{
			populateSearchField();			  
		  }
		}					
	});
	
	$j( "#confirmPatientModalDiv" ).dialog({
		autoOpen: false,
		height: 600,
		width: 900,
		modal: true,
		closeOnEscape: true,	
		close: function(event, ui) {							
			patientId='';
			setTimeout("$j('#inputPatient').focus(); ", 100);			
		},
		open: function(event, ui){		
			$j('.modalRow').remove();
			$j(".ui-dialog").css("padding", "0");	
			$j(".ui-dialog-buttonpane").css("background", "gray");					
			$j(this).parent().children(".ui-widget-header").css("background", "#501d3d");
			$j(".ui-dialog-buttonset").css("width", "100%");	
			var cssObj = {
				'border' : "0",					
				'height' : "40", 
				'width' : "50"
			}
			$j("#cancelBtn").css(cssObj);
			$j("#cancelBtn").css("float", "left");
			$j("#cancelBtn").css("margin-left", "20px");			
			$j("#cancelBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/left-arrow-white.png')");			
			$j("#okBtn").css(cssObj);
			$j("#okBtn").css("float", "right");			
			$j("#okBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png')");			
			$j("#okBtn").focus();								
		}, 
		buttons: [
			{
				text: "",
				label: "Cancel",
				id: "cancelBtn",
				click: function() {												
					$j(this).dialog("close");
				}
			},
			{
				text: "",
				label: "ok",
				id: "okBtn",
				click: function() {											
					window.location.href=pageContextAddress + '/module/patientregistration/workflow/patientDashboard.form?patientId=' + patientId;					
					setTimeout('$j("#confirmPatientModalDiv").dialog("close"); ', 3000);
				}
			}					
		]			
	});
	
	
});