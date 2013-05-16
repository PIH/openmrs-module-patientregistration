$j(document).ready(function(){				
	var submitRegistrationForm =false;
		
	var personDepartment='';
	var personCommune='';
	var personSectionCommune='';
	var personLocalitie='';	
	var personAddressLandmark='';
	var personPossibleLocality='';
	var country='';
	var patientIdentifier='';
	var maxCharsAlert=83;
	var exactPatientResults = null;
	var filteredExactPatients=null;
	var filteredSimilarPatients=null;
	var exactPatientResultsIds = new Array();
	var thresholdYear = 5;
	var filteringByGender=false;
	var scanedPatientIdentifier='';
	var cardPrinted = null;
	
	var UNKNOWN ='UNKNOWN';
	var UNKNOWN_ADULT_AGE = 999;
	var UNKNOWN_CHILD_AGE = 111;
	
	var divItems = new Array(
							 "encounterDateDiv",
						     "yearDiv",
							 "monthDiv",
							 "dayDiv", 
							 "lastNameDiv",
							 "firstNameDiv",
							 "genderDiv",
							 "birthdateDiv",
							 "ageEstimateDiv",
							 "addressLandmarkDiv",
							 "possibleLocalityDiv",
							 "addressDepartmentDiv",
							 "addressCommuneDiv",
							 "addressSectionCommuneDiv",
							 "addressLocalitieDiv",
							 "phoneNumberDiv",
							 "confirmDiv",							 
							 "contextualInfo"
	);
	
	var editDivItems = new Array(
							 "firstNameDiv",							 
							 "addressDepartmentDiv",
							 "addressCommuneDiv",
							 "addressSectionCommuneDiv",
							 "addressLocalitieDiv"							 
	);
	
	var leftMenuItems = new Array(
								  "encounterDateMenu",
								  "nameMenu", 
								  "genderMenu",
								  "ageMenu",
								  "addressMenu",
								  "cellPhoneMenu",
								  "confirmMenu",
								  "printIdCardMenu"
	);
	
	var navigationArrows = new Array("cross-red", 
									"left-arrow-white",
									"right-arrow-white",
									"right-arrow-yellow",
									"checkmark-yellow"
	);
	
	var prevDiv ='';
	var nextDiv='';
	
	
	var visitedLinks = new Array();
	var addressArray = new Array();
	
	$j.setUnknownValues = function(){
        firstNameVal= UNKNOWN;
        lastNameVal= UNKNOWN;
    };
			
	function monkeyPatchAutocomplete() {
	  var oldFn = $j.ui.autocomplete.prototype._renderItem;
	  $j.ui.autocomplete.prototype._renderItem = function( ul, item) {
		var searchTerm = this.term;
		var searchTermLength = searchTerm.length;
		if(searchTermLength>0){
			searchTerm = searchTerm + "+";
		}
		var re = new RegExp(searchTerm, "i") ;
		 
		var t = "";
		var index = -1;
		if (re.test(item.label)){			   
			index = item.label.toLowerCase().indexOf(this.term.toLowerCase());												
		}else if(re.test(normalize(item.label))){
			index = normalize(item.label).toLowerCase().indexOf(this.term.toLowerCase());					
		}
		//"<span style='font-weight:bold;color:Blue;'>"
		if(index == 0){					
			t = "<span style='font-weight:bold;font-size:1.3em;font-style:italic;color:Black;'>";
			t = t.concat(item.label.substring(0,searchTermLength), "</span>", item.label.substring(searchTermLength));
		}else if(index>0){
			t = t.concat(item.label.substring(0,index), "<span style='font-weight:bold;font-size:1.3em;font-style:italic;color:Black;'>", item.label.substring(index, index + searchTermLength), "</span>");
			//console.log("item.label=" + item.label + "; length=" + item.label.length + "; searchTem=" + searchTerm + "; index=" + index + "; searchTermLength=" + searchTermLength);
			if(parseInt(item.label.length,10) >= (parseInt(index,10) + parseInt(searchTermLength, 10))){
				t = t.concat(item.label.substring(parseInt(index,10) + parseInt(searchTermLength, 10)));
			}
		}
			
		return $j( "<li></li>" )
		  .data( "item.autocomplete", item )
		  .append( "<a>" + t + "</a>" )
		  .appendTo( ul );
	  };
    }
	
	$j('#right-arrow-white').show();
	$j('#cross-red').show();
	
	$j.hideOkButton = function() {
		var confirmError = $j("#confirmErrorMessage");			
		var val = confirmError.text();			
		if( (confirmError !== null) && (val!==null && typeof(val) !=='undefined' && val.length>0) ){
			$j("#okBtnConf").hide();
			$j("#cancelBtnConf").focus();
			cardPrinted=null;
		}else{
			cardPrinted=true;
			$j("#okBtnConf").show();
			$j("#okBtnConf").focus();
		}			
	};
	
	
	function getChildAddresses(addressField){
		var addressArray = new Array();
		console.log("search for children of: " + addressField);		
		$j.ajax({
			type: 'POST',
			async: false,
			url: pageContextAddress + '/module/addresshierarchy/ajax/getChildAddressHierarchyEntries.form',
			dataType: 'json',
			data: { 'searchString': addressField },
			success: function(addresses) {													
				$j.each(addresses, function(i,address) {
					addressArray.push(address.name);	
					console.log(address.name);					
				});	
			}
		});	
		return addressArray;
	}
	var addressResults =  getChildAddresses('');
	if (addressResults !== null){
		if(addressResults.length>0){
			country = addressResults[0];
		}
	}
	if(country.length>0){
		departmentsData = getChildAddresses(country);
	}
	
	$j.splitAddress= function(fullAddress){
		if(fullAddress.length>0){
			var addressTokens = fullAddress.split(',');
			if(addressTokens.length<5){
				alert(scriptMessages['invalidAddressFormat']);
				return false;
			}
			personAddressLandmark = $j.trim(addressTokens[0]);
			personLocalitie=$j.trim(addressTokens[1]);
			personPossibleLocality = personLocalitie;
			personSectionCommune=$j.trim(addressTokens[2]);
			personCommune=$j.trim(addressTokens[3]);
			personDepartment=$j.trim(addressTokens[4]);		
		}
		return true;
	}
	
	$j.populateConfirmForm = function() {				
			$j('#hiddenEncounterYear').val(encounterYear);
            $j('#hiddenEncounterMonth').val(encounterMonth);
            $j('#hiddenEncounterDay').val(encounterDay);
			$j('#confirmEncounterDate').text(encounterDay + "-" + encounterMonth + "-" + encounterYear);
			$j('#confirmFirstName').text(firstNameVal);
			$j('#hiddenConfirmFirstName').val(firstNameVal);				
			$j('#confirmLastName').text(lastNameVal);
			$j('#hiddenConfirmLastName').val(lastNameVal);
			$j('#confirmGender').text(genderVal);
			$j('#hiddenConfirmGender').val(genderVal);
			if(nextTask.length>0){
				$j('#hiddenNextTask').val(nextTask);
			}
			if(birthdateDay>0 && birthdateMonth.length>1){
				$j('#confirmBirthdateLabel').text(birthdateLabel);
				$j('#confirmBirthdate').text(birthdateDay + "-" + birthdateMonth + "-" + birthdateYear);
				$j('#hiddenConfirmDay').val(birthdateDay);
				$j('#hiddenConfirmMonth').val(birthdateMonthId);
				$j('#hiddenConfirmYear').val(birthdateYear);
				$j('#hiddenConfirmEstimateYears').val('');
				$j('#hiddenConfirmEstimateMonths').val('');
			}else if((parseInt(birthdateEstimateYears,10)>0) || 
					(parseInt(birthdateEstimateMonths,10)>0)){
				$j('#confirmBirthdateLabel').text(ageEstimateLabel);
				var estimateLabel = birthdateEstimateYears + " " + estimateYearsLabel;
				if(parseInt(birthdateEstimateMonths,10)>0){
					estimateLabel = estimateLabel + " " + birthdateEstimateMonths + " " + estimateMonthsLabel;
				}
				$j('#confirmBirthdate').text(estimateLabel);
				
				$j('#hiddenConfirmEstimateYears').val(birthdateEstimateYears);
				$j('#hiddenConfirmEstimateMonths').val(birthdateEstimateMonths);
				$j('#hiddenConfirmDay').val('');
				$j('#hiddenConfirmMonth').val('');
				$j('#hiddenConfirmYear').val('');
			}		
			personAddress =  personAddressLandmark + ',' +  personLocalitie + ',' + personSectionCommune + ',' + personCommune + ',' + personDepartment + ',' + country;
			console.log("populateConfirmForm(), personAddress=" + personAddress);
			$j('#hiddenPatientAddress').val(personAddress);		
			$j('#confirmAddress0').text(personAddressLandmark);
			$j('#confirmAddress1').text(personLocalitie);
			$j('#confirmAddress2').text(personSectionCommune);
			$j('#confirmAddress3').text(personCommune);	
			$j('#confirmAddress4').text(personDepartment);
			$j('#confirmAddress5').text(country);			
			$j('#confirmPhoneNumber').text(phoneNumber);
			$j('#hiddenConfirmPhoneNumber').val(phoneNumber);
	};
	
	
	$j.hideAllDiv = function() {			
		for(i=0; i<divItems.length; i++){				
			var divItem = "#"+divItems[i];			
			$j(divItem).hide();
		}
		
		$j("input#monthAutocomplete").autocomplete("close");
		$j("input#addressDepartmentAutocomplete").autocomplete("close");
		$j("input#addressCommuneAutocomplete").autocomplete("close");
		$j("input#addressSectionCommuneAutocomplete").autocomplete("close");	
		$j("input#addressLocalitieAutocomplete").autocomplete("close");		
	};
	
	$j.removeHighlightedMenu = function() {
		for(i=0; i<leftMenuItems.length; i++){				
			var menuItem = "#"+leftMenuItems[i];			
			$j(menuItem).removeClass('highlighted');					
		}
	};
	
	$j.hideNavigationArrows = function() {
		for(i=0; i<navigationArrows.length; i++){				
			var arrowItem = "#"+navigationArrows[i];			
			$j(arrowItem).hide();
		}
	};
	
	$j.setLastNameDiv = function() {				
		//lastNameVal = $j('#patientInputLastName').val();
		prevDiv="null";
		nextDiv="firstNameDiv";		
		$j("#nameMenu").addClass('highlighted');
		if(lastNameVal.length>0){			
			$j('#patientInputLastName').val(lastNameVal);
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();			
		}
		$j.searchExistingPatients();
		$j("[input[id^='patientInput']").focus();
	};
	
	$j.setFirstNameDiv = function() {				
		//firstNameVal = $j('#patientInputFirstName').val();
		prevDiv="lastNameDiv";
		nextDiv="genderDiv";
		$j('#left-arrow-white').show();		
		$j("#nameMenu").addClass('highlighted');
		if(firstNameVal.length>0){						
			$j('#patientInputFirstName').val(firstNameVal);
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();			
		}
		$j.searchExistingPatients();
		$j("[input[id^='patientInput']").focus();
	};
	
	$j.setGenderDiv = function() {			
		prevDiv="encounterDateDiv";
		nextDiv="ageEstimateDiv";
		$j('#left-arrow-white').show();				
		$j('#right-arrow-yellow').show();
		$j("#genderMenu").addClass('highlighted');		
		$j('.GenderClass').removeClass('SelectedButton');		
		if (genderVal == 'F'){							
			$j('#rdioF').attr('checked', 'checked');
			$j('#rdioTrF').addClass('highlighted');
			$j('#rdioF').focus();
		}else{	
			genderVal='M';			
			$j('#rdioM').attr('checked', 'checked');
			$j('#rdioTrM').addClass('highlighted');
			$j('#rdioM').focus();
		}		
	};
	
	$j.filterByGender = function(){
		filteringByGender = true;
		if(jqxhr || jqSoundXHR){
			//if any AJAX request is in progress wait
			console.log("filterByGender(), ajax is in progress");
			setTimeout("$j.filterByGender();", 1000);
			return false;
		}else{
			console.log("filterByGender() will execute");
		}
		var exactCounter=0;
		var similarCounter=0;
		var newArray=null;
		var exPatients = $j.filterPatientsByGender(genderVal, exactPatientResults);
		if(exPatients !==null ){
			exactCounter = exPatients.length;	
			filteredExactPatients = new Array();
			filteredExactPatients = $j.merge([], exPatients);
		}
		var simPatients = $j.filterPatientsByGender(genderVal, similarPatientResults);
		if(simPatients !== null){
			similarCounter = simPatients.length;
			filteredSimilarPatients = new Array();
			filteredSimilarPatients = $j.merge([], simPatients);
		}
		if(exPatients == null){
			newArray = simPatients;			
		}else if(simPatients == null){
			newArray = exPatients;		
		}else{			
			newArray = $j.merge(exPatients, simPatients);
		}
		$j.displaySimilarPatients(newArray, exactCounter, similarCounter);
		filteringByGender = false;
		return true;
	}
	
	$j.setBirthdateDiv = function() {			
		
		setTimeout("$j.filterByGender();", 100);
		if (birthdateEstimateYears>0 || birthdateEstimateMonths>0) {				
			$j.setupDiv("ageEstimateDiv");
			return;
		}
				
		prevDiv="genderDiv";
		nextDiv="addressLandmarkDiv";
		$j('#left-arrow-white').show();		
		
		if(birthdateDay>0 && birthdateMonth.length>1 && birthdateYear>0){			
			$j('#right-arrow-yellow').show();			
		}else{
			$j('#right-arrow-white').show();			
		}				
		$j("#ageMenu").addClass('highlighted');		
		if(birthdateDay==0){
			$j('#day').val('');
		}
		if(birthdateMonth==''){
			$j('#monthAutocomplete').val('');
		}else{
			$j('#monthAutocomplete').val(birthdateMonth);
		}
		if(birthdateYear==0){
			$j('#year').val('');			
		}	
		
		$j("input#monthAutocomplete").autocomplete({
				source:monthData, 	
				delay: 1,				
				autoFocus: true,					
				close: function(event, ui) {					
					if ($j('#birthdateDiv').is(':visible') ){						
						event.preventDefault();
					}					
				}, 
				focus: function(event, ui) {
					//do not replace the text fields value
					event.preventDefault();
				},	
				select: function(event, ui) {																
						event.stopPropagation();	
						event.preventDefault();	
						if(ui.item.value !== birthdateMonth ){	
							birthdateMonth= ui.item.value
							$j('#monthAutocomplete').val(birthdateMonth);
						}
						$j( "input#monthAutocomplete" ).autocomplete("search", "");
						$j('#birthdateDiv').find('#year').focus();													
				}
		});  
		$j( "input#monthAutocomplete" ).addClass('inputField');
		$j( "input#monthAutocomplete" ).autocomplete({ minLength: 0 });		
		$j( "input#monthAutocomplete" ).autocomplete({position: { my : "left top", at : "left bottom", offset : "1 1", collision: "fit", of : "#monthAutocomplete"} });		
		$j( "input#monthAutocomplete" ).autocomplete("search", "");
		
		$j('#birthdateDiv').find('#day').focus();
	};
	
	$j('#day').keypress(function(event) {		
		if(event.keyCode == 13){
			var tempDay= $j('#day').val();
			if(tempDay.length>0){			
				var tempIntDay = parseInt(tempDay,10);
				if(tempIntDay>0 && tempIntDay<32){
					$j('#birthdateDiv').find('#monthAutocomplete').focus();
					return true;
				}				
			}
			return false;
		}
	});
	
	$j("#unknownBirthdate").click(function(event) {				
		$j.setupDiv("ageEstimateDiv");
		event.stopPropagation();
		return false;
	});
	
	$j("#birthdateEnter").click(function(event) {		
		birthdateEstimateYears=0;
		birthdateEstimateMonths=0;
		$j.setupDiv("birthdateDiv");
		event.stopPropagation();		
		return false;
	});
	
	$j.setAgeEstimateDiv = function() {							
		prevDiv="genderDiv";
		nextDiv="addressLandmarkDiv";
		$j('#left-arrow-white').show();		
		
		$j("#ageMenu").addClass('highlighted');		
		
		if(birthdateEstimateYears==0){
			$j('#estimateYears').val('');
		}	
		if(birthdateEstimateMonths==0){
			$j('#estimateMonths').val('');
		}
		var estimateYears = $j('#estimateYears').val();
		var estimateMonths=$j('#estimateMonths').val();
		if((estimateYears!==null && estimateYears.length>0 ) || 
			(estimateMonths!==null && estimateMonths.length>0)){
			$j('#right-arrow-yellow').show();	
		}else{
			$j('#right-arrow-white').show();
		}
				
		$j('#ageEstimateDiv').find('#estimateYears').focus();
	};
	
	
	$j.setAddressLandmarkDiv = function() {					
		if(personAddressLandmark.length>0){
			$j('#addressLandmarkField').val(personAddressLandmark);
		}
		prevDiv="ageEstimateDiv";
		nextDiv="possibleLocalityDiv";
		$j('#left-arrow-white').show();		
		$j('#right-arrow-yellow').show();		
		$j("#addressMenu").addClass('highlighted');		
		
		$j('#addressLandmarkField').focus();
	};
	
	$j('#addressLandmarkField').keypress(function(event) {									
		if ($j('#addressLandmarkDiv').is(':visible') ){			
			if(event.keyCode == 13){
				event.stopPropagation();
				event.preventDefault();
				setTimeout("$j('#right-arrow-yellow').click();", 100);														
			}
		}
	});
	
	$j.setPossibleLocalityDiv = function() {			
		
		prevDiv="addressLandmarkDiv";
		nextDiv="addressDepartmentDiv";
		$j('#left-arrow-white').show();		
		$j('#right-arrow-yellow').show();
		
		if(personPossibleLocality.length>0){
			$j('#possibleLocalityField').val(personPossibleLocality);			
		}else{
			$j('#possibleLocalityField').val("");			
		}
		
		$j("#addressMenu").addClass('highlighted');				
		$j('#possibleLocalityField').focus();
	};
	
	var $autocompletePossibleLocality = $j('#possibleLocalityList').hide();
							
	var selectedPossibleLocalityItem = null;
	var setSelectedPossibleLocalityItem = function(item) {		
		selectedPossibleLocalityItem = item;

		if (selectedPossibleLocalityItem !== null) {
			if (selectedPossibleLocalityItem < 0) {
				selectedPossibleLocalityItem = 0;
			}
			if (selectedPossibleLocalityItem >= $autocompletePossibleLocality.find('tr').length) {
			  selectedPossibleLocalityItem = $autocompletePossibleLocality.find('tr').length - 1;
			}
			$autocompletePossibleLocality.find('tr').removeClass('highlighted').eq(selectedPossibleLocalityItem).addClass('highlighted');												
		}		  
		$autocompletePossibleLocality.show();
		$j('#possibleLocalityField').focus();
	};
	
	var populatePossibleLocalityField = function() {
		var populateVal = null;		
		if((selectedPossibleLocalityItem !== null) && (selectedPossibleLocalityItem >=0)){
			populateVal = $autocompletePossibleLocality.find('tr').eq(selectedPossibleLocalityItem).text();
			if(populateVal.length>0){
				$j('#possibleLocalityField').val(populateVal);				
			}
			$autocompletePossibleLocality.find('tr').removeClass('highlighted');
			setSelectedPossibleLocalityItem(null);
			$j('#possibleLocalityField').focus();
		}								
	 };
	var possibleLocalityTimer=null;
	var locxhr =null;
	$j('#possibleLocalityField').keyup(function(event) {
		
		var addressFieldValue = $j('#possibleLocalityField').val();		
		
		if (event.keyCode > 40 || event.keyCode ==8) {
			if(possibleLocalityTimer){
				clearTimeout(possibleLocalityTimer);
			}
			if(locxhr){
				locxhr.abort();
				locxhr = null;
			}
			$autocompletePossibleLocality = $j('#possibleLocalityList').hide();
			/*
				keys with codes 40 and below are special
				(enter, arrow keys, escape, etc...)
				key code 8 is backspace
			*/	
			if(addressFieldValue.length>2){
				$j("#possibleLocalityTableDiv").append($j("#loadingGraph"));
				$j("#loadingGraph").css("visibility", "visible");
				$j("#loadingGraph").show();
				possibleLocalityTimer = setTimeout(function() {				
				locxhr = $j.ajax({
					type: 'POST',
					url: pageContextAddress + '/module/addresshierarchy/ajax/getPossibleAddressHierarchyEntries.form',
					dataType: 'json',
					data: { 'searchString': addressFieldValue,  
							'addressField': 'address1'},
					success: function(addresses) {						
						// remove the existing rows
						$j('.addressFieldRow').remove();	
						if(addresses.length > 0 ){
							// now add a new row for each patient
							$j.each(addresses, function(i,address) {			
								// create the row element itself
								var row = $j(document.createElement('tr')).addClass('addressFieldRow');													
								if (i % 2 == 0) { 
									row.addClass('evenRow');
								} else {
									row.addClass('oddRow');
								}
								row.mousemove(function(){
									setSelectedPossibleLocalityItem(i);									
								});
								row.mouseout(function(){
									$j(this).removeClass('highlighted');
								});
								row.click(function(){
									$j('#possibleLocalityField').val(address.name);
								});
								// now add all the cells to the row
								row.append($j(document.createElement('td')).text(address.name));
								row.click(populatePossibleLocalityField);
								$j('#possibleLocalityList').append(row);
							});	
							setSelectedPossibleLocalityItem(0);
						}else{
							setSelectedPossibleLocalityItem(null);
						}
					}
				}).complete(function(){
					$j("#loadingGraph").hide();
					locxhr = null;
					console.log("getPossibleAddressHierarchyEntries.form completed successfully");
				}).error(function(){
					console.log("getPossibleAddressHierarchyEntries.form failed");
					locxhr = null;
				});}, 500);
			}
		}else if (event.keyCode ==38){
				//user pressed up arrow
				if(selectedPossibleLocalityItem === null){
					selectedPossibleLocalityItem=1;
				}
				setSelectedPossibleLocalityItem(selectedPossibleLocalityItem - 1);
				event.preventDefault();
		}else if (event.keyCode == 40){
			//user pressed down arrow						
			if(selectedPossibleLocalityItem === null){
					setSelectedPossibleLocalityItem(0);
			}else{
				setSelectedPossibleLocalityItem(selectedPossibleLocalityItem + 1);
			}
			event.preventDefault();
		}
	}).keypress(function(event) {	
		if (event.keyCode == 13 ) {
		  // User pressed enter key.
		  event.stopPropagation();
		  event.preventDefault();
		  if((selectedPossibleLocalityItem!==null)){
			populatePossibleLocalityField();
		  }else{
			$j('#right-arrow-yellow').click();
		  }		  
		}					
	});
	
	$j( "#confirmPossibleLocalityModalDiv" ).dialog({
			autoOpen: false,
			height: 600,
			width: 900,
			modal: true,
			closeOnEscape: true,	
			buttons: [
				{
					text: "",
					label: "Cancel",
					id: "cancelFirstBtn",
					click: function() {						
						$j(this).dialog("close");
					}
				},				
				{
					text: addressNotKnownLabel,
					label: "ok",
					id: "addressNotFoundBtn",
					click: function() {						
						$j.setupDiv("addressDepartmentDiv");						
						$j(this).dialog("close");
						$j("#addressDepartmentAutocomplete").focus();
					}
				}							
			]		
			, 
			open: function(event, ui){		
				$j(".ui-dialog").css("padding", "0");	
				$j(".ui-dialog-buttonpane").css("background", "gray");					
				$j(this).parent().children(".ui-widget-header").css("background", "#009384");
				$j(".ui-dialog-buttonset").css("width", "100%");	
				var cssObj = {
					'border' : "0",					
					'height' : "35", 
					'width' : "35"
				}								
				$j("#cancelFirstBtn").css(cssObj);
				$j("#cancelFirstBtn").css("float", "left");
				$j("#cancelFirstBtn").css("margin-left", "20px");
				$j("#cancelFirstBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/cross-red.png')");
				$j("#addressNotFoundBtn").css("width", "200px");
				$j("#addressNotFoundBtn").css("height", "40px");
				$j("#addressNotFoundBtn").css("float", "right");
				$j("#addressNotFoundBtn").focus();			
			}
	});		
		
	
	$j("#patientAddressUnknown").click(function(event) {		
		$j.setupDiv("addressDepartmentDiv");
		event.stopPropagation();
		return false;
	});
	
	var disableAutocompleteEnter=false;
	$j.setAddressDepartmentDiv = function() {			
		
		prevDiv="possibleLocalityDiv";
		nextDiv="addressCommuneDiv";
		$j('#left-arrow-white').show();				
		$j('#right-arrow-white').show();
		$j("#addressMenu").addClass('highlighted');		
		
		$j("input#addressDepartmentAutocomplete").autocomplete({
				source: function( request, response ) {
							var re  = $j.ui.autocomplete.escapeRegex(request.term);
							if(re.length>0){
								re = re + "+";
							}
							var matcher = new RegExp( re, "i" );
							
							response( $j.grep( departmentsData, function( value ) {
								value =  value.value || value;
								return matcher.test( value ) || matcher.test( normalize( value ) );
						}) );
				}, 	 	
				delay: 1,										
				close: function(event, ui) {					
					if ($j('#addressDepartmentDiv').is(':visible') ){						
						event.preventDefault();
					}					
				}, 
				focus: function(event, ui) {
					$j("#addressDepartmentAutocomplete").focus();
					//do not replace the text fields value					
					disableAutocompleteEnter = true;
					event.preventDefault();
				},					
				select: function(event, ui) {																
						event.stopPropagation();												
						if(ui.item.value !== personDepartment ){
							personDepartment = ui.item.value;
							$j("#addressDepartmentAutocomplete").val(personDepartment);
							$j('#right-arrow-white').hide();
							$j('#right-arrow-yellow').show();
							personCommune='';
							personSectionCommune='';							
						}else{														
							$j('#right-arrow-yellow').click();																
						}
				}
		});  
		$j( "input#addressDepartmentAutocomplete" ).val('');
		$j( "input#addressDepartmentAutocomplete" ).autocomplete({ minLength: 0 });
		$j( "input#addressDepartmentAutocomplete" ).autocomplete("search", "");	
		if(personDepartment.length>0){
			$j('#addressDepartmentAutocomplete').val(personDepartment);
			$j( "input#addressDepartmentAutocomplete" ).autocomplete("option", "autoFocus", false);
			disableAutocompleteEnter = false;
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j( "input#addressDepartmentAutocomplete" ).autocomplete("option", "autoFocus", true);
			disableAutocompleteEnter = true;
		}					
		$j('#addressDepartmentAutocomplete').focus();
	};
	
	$j('#addressDepartmentAutocomplete').keydown(function(event){ 
		if(event.keyCode ==13 && !disableAutocompleteEnter){
			event.stopPropagation();
			event.preventDefault();
			$j('#right-arrow-yellow').click();	
		}
		
	});
	
	
	
	$j.setAddressCommuneDiv = function() {			
		prevDiv="addressDepartmentDiv";
		nextDiv="addressSectionCommuneDiv";
		$j('#left-arrow-white').show();				
		$j('#right-arrow-white').show();
		$j("#addressMenu").addClass('highlighted');		
		monkeyPatchAutocomplete();
		$j("input#addressCommuneAutocomplete").autocomplete({
				source: function( request, response ) {
							var re  = $j.ui.autocomplete.escapeRegex(request.term);
							if(re.length>0){
								re = re + "+";
							}
							var matcher = new RegExp( re, "i" );							
							response( $j.grep( communeData, function( value ) {
								value =  value.value || value;								
								return matcher.test( value ) || matcher.test( normalize( value ) );
						}));							
				}, 	
				delay: 1,											
				close: function(event, ui) {					
					if ($j('#addressCommuneDiv').is(':visible') ){						
						event.preventDefault();
					}					
				}, 
				open: function(event, ui) {					
					var cssObj = {
						'height' : "300px",
						'overflow-y' : "scroll",
						'overflow-x' : "hidden"
					}
					$j(".ui-autocomplete").css(cssObj);
					
					
				},
				focus: function(event, ui) {
					$j("#addressCommuneAutocomplete").focus();
					//do not replace the text fields value
					disableAutocompleteEnter = true;
					event.preventDefault();
				},	
				select: function(event, ui) {																
						event.stopPropagation();	
						if(ui.item.value !== personCommune ){
							personCommune = ui.item.value;		
							$j("#addressCommuneAutocomplete").val(personCommune);	
							$j('#right-arrow-white').hide();
							$j('#right-arrow-yellow').show();							
							personSectionCommune='';
						}else{														
							$j('#right-arrow-yellow').click();							
						}
				}
		});  
		$j( "input#addressCommuneAutocomplete" ).val('');
		$j( "input#addressCommuneAutocomplete" ).autocomplete({ minLength: 0 });
		$j( "input#addressCommuneAutocomplete" ).autocomplete("search", "");
		$j( "input#addressCommuneAutocomplete" ).addClass('inputField');
		
		if(personCommune.length>0){
			$j('#addressCommuneAutocomplete').val(personCommune);
			$j( "input#addressCommuneAutocomplete" ).autocomplete("option", "autoFocus", false);
			disableAutocompleteEnter = false;
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j( "input#addressCommuneAutocomplete" ).autocomplete("option", "autoFocus", true);
			disableAutocompleteEnter = true;
		}		
		$j('#addressCommuneAutocomplete').focus();
	};
	
	$j('#addressCommuneAutocomplete').keydown(function(event){ 
		if(event.keyCode ==13 && !disableAutocompleteEnter){
			event.stopPropagation();
			event.preventDefault();
			$j('#right-arrow-yellow').click();	
		}
		
	});
	
	$j.setAddressSectionCommuneDiv = function() {			
		prevDiv="addressCommuneDiv";
		nextDiv="addressLocalitieDiv";
		$j('#left-arrow-white').show();				
		$j('#right-arrow-white').show();
		$j("#addressMenu").addClass('highlighted');		
		monkeyPatchAutocomplete();
		$j("input#addressSectionCommuneAutocomplete").autocomplete({
				source: function( request, response ) {
							var re  = $j.ui.autocomplete.escapeRegex(request.term);
							if(re.length>0){
								re = re + "+";
							}
							var matcher = new RegExp( re, "i" );							
							response( $j.grep( sectionCommuneData, function( value ) {
								value =  value.value || value;								
								return matcher.test( value ) || matcher.test( normalize( value ) );
						}));
				}, 	 	
				delay: 1,											
				close: function(event, ui) {					
					if ($j('#addressSectionCommuneDiv').is(':visible') ){						
						event.preventDefault();
					}					
				}, 
				open: function(event, ui) {					
					var cssObj = {
						'height' : "300px",
						'overflow-y' : "scroll",
						'overflow-x' : "hidden"
					}
					$j(".ui-autocomplete").css(cssObj);										
				},
				focus: function(event, ui) {
					$j("#addressSectionCommuneAutocomplete").focus();
					//do not replace the text fields value
					disableAutocompleteEnter = true;
					event.preventDefault();
				},	
				select: function(event, ui) {																						
						event.stopPropagation();	
						event.preventDefault();		
						if(ui.item.value !== personSectionCommune ){	
							personSectionCommune = ui.item.value;
							$j("#addressSectionCommuneAutocomplete").val(personSectionCommune);
							$j('#right-arrow-white').hide();
							$j('#right-arrow-yellow').show();	
							personLocalitie='';
						}else{
							setTimeout("$j('#right-arrow-yellow').click();	", 100);															
						}												
				}
		});  
		$j( "input#addressSectionCommuneAutocomplete" ).val('');
		$j( "input#addressSectionCommuneAutocomplete" ).autocomplete({ minLength: 0 });
		$j( "input#addressSectionCommuneAutocomplete" ).autocomplete("search", "");
		$j( "input#addressSectionCommuneAutocomplete" ).addClass('inputField');		
		// set focus to first input field	
		if(personSectionCommune.length>0){
			$j('#addressSectionCommuneAutocomplete').val(personSectionCommune);
			$j( "input#addressSectionCommuneAutocomplete" ).autocomplete("option", "autoFocus", false);
			disableAutocompleteEnter = false;
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j( "input#addressSectionCommuneAutocomplete" ).autocomplete("option", "autoFocus", true);
			disableAutocompleteEnter = true;
		}				
		$j('#addressSectionCommuneAutocomplete').focus();		
	};
	
	$j('#addressSectionCommuneAutocomplete').keydown(function(event){ 
		if(event.keyCode ==13 && !disableAutocompleteEnter){
			event.stopPropagation();
			event.preventDefault();
			$j('#right-arrow-yellow').click();	
		}		
	});
	
	
	$j.setAddressLocalitieDiv = function() {			
		prevDiv="addressSectionCommuneDiv";
		nextDiv="phoneNumberDiv";
		$j('#left-arrow-white').show();				
		$j('#right-arrow-white').show();
		$j("#addressMenu").addClass('highlighted');		
		monkeyPatchAutocomplete();
		$j("input#addressLocalitieAutocomplete").autocomplete({
				source: function( request, response ) {
							var re  = $j.ui.autocomplete.escapeRegex(request.term);
							if(re.length>0){
								re = re + "+";
							}
							var matcher = new RegExp( re, "i" );							
							response( $j.grep( localitieData, function( value ) {
								value =  value.value || value;								
								return matcher.test( value ) || matcher.test( normalize( value ) );
						}) );
				}, 	 	
				delay: 1,											
				close: function(event, ui) {					
					if ($j('#addressLocalitieDiv').is(':visible') ){						
						event.preventDefault();
					}					
				}, 
				open: function(event, ui) {					
					var cssObj = {
						'height' : "300px",
						'overflow-y' : "scroll",
						'overflow-x' : "hidden"
					}
					$j(".ui-autocomplete").css(cssObj);										
				},
				focus: function(event, ui) {
					$j("#addressLocalitieAutocomplete").focus();
					//do not replace the text fields value
					disableAutocompleteEnter = true;
					event.preventDefault();
				},	
				select: function(event, ui) {																						
						event.stopPropagation();	
						event.preventDefault();		
						if(ui.item.value !== personLocalitie ){	
							personLocalitie = ui.item.value;
							$j("#addressLocalitieAutocomplete").val(personLocalitie);
							$j('#right-arrow-white').hide();
							$j('#right-arrow-yellow').show();								
						}else{
							setTimeout("$j('#right-arrow-yellow').click();	", 100);															
						}												
				}
		});  
		$j( "input#addressLocalitieAutocomplete" ).val('');
		$j( "input#addressLocalitieAutocomplete" ).autocomplete({ minLength: 0 });
		$j( "input#addressLocalitieAutocomplete" ).autocomplete("search", "");
		$j( "input#addressLocalitieAutocomplete" ).addClass('inputField');		
		// set focus to first input field	
		if(personPossibleLocality.length>0){
			$j('#addressLocalitieAutocomplete').val(personPossibleLocality);
			$j( "input#addressLocalitieAutocomplete" ).autocomplete("option", "autoFocus", false);
			disableAutocompleteEnter = false;
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j( "input#addressLocalitieAutocomplete" ).autocomplete("option", "autoFocus", true);
			disableAutocompleteEnter = true;
		}					
		$j('#addressLocalitieAutocomplete').focus();		
	};
	
	$j('#addressLocalitieAutocomplete').keydown(function(event){ 
		if(event.keyCode ==13 && !disableAutocompleteEnter){
			event.stopPropagation();
			event.preventDefault();
			$j('#right-arrow-yellow').click();	
		}
		
	});
	
	$j.setPhoneNumberDiv = function() {					
		if(phoneNumber.length>1){
			$j('#patientInputPhoneNumber').val(phoneNumber);
		}
		prevDiv="possibleLocalityDiv";
		nextDiv="confirmDiv";
		$j('#left-arrow-white').show();				
		$j('#right-arrow-yellow').show();
		$j("#cellPhoneMenu").addClass('highlighted');				
		$j("#patientInputPhoneNumber").focus();
	};
	
	$j.setConfirmDiv = function() {			
		prevDiv="phoneNumberDiv";
		nextDiv="null";
		$j('#left-arrow-white').show();				
		$j('#checkmark-yellow').show();		
		$j("#confirmMenu").addClass('highlighted');		
		
		if( ((personDepartment === null) || 
			(personDepartment!==null && personDepartment.length<1)) && 
			(personAddress.length>0)){
			console.log("setConfirmDiv(), personAddress=" + personAddress);
			var addressTokens = personAddress.split(',');
			if(addressTokens.length<5){
				alert(scriptMessages['invalidAddressFormat']);
				return false;
			}
			personAddressLandmark = $j.trim(addressTokens[0]);
			personLocalitie=$j.trim(addressTokens[1]);
			personSectionCommune=$j.trim(addressTokens[2]);
			personCommune=$j.trim(addressTokens[3]);
			personDepartment=$j.trim(addressTokens[4]);
		}
		
		$j.populateConfirmForm();		
		$j('#checkmark-yellow').css('border', '5px solid #EFB420');			
		$j('#checkmark-yellow').focus();
	};
	
	// send data to EnterPatientDemoControler
	$j.registerPatient= function(isPrinting){
		if(submitRegistrationForm){
			return;
		}else{
			submitRegistrationForm =true;
		}
		alertUserAboutLeaving = false;
		if(isPrinting == "yes"){
			$j.hideAllDiv();											
			$j("#"+nextDiv).css("visibility", "visible");
			$j("#"+nextDiv).show();				
			$j.setupDiv(nextDiv);							
			window.setTimeout(function() {					
					$j('#confirmPatientInfoForm').submit();
				}, 
			2000);
		}else{
			$j('#confirmPatientInfoForm').submit();
		}
	}
	
	
	$j.setConfirmPrintDiv = function() {				
		prevDiv="confirmDiv";
		nextDiv="printIdCardDiv";
		$j('.yesNoList').find('tr').removeClass('highlighted');
		$j("#yesRow").addClass('highlighted');	
		$j("#yesRow").focus();
		$j('#left-arrow-white').show();	
		$j("#printIdCardMenu").addClass('highlighted');		
				
	};
	
	
	$j(document).keydown(function(event) {		
		if ($j('#confirmPrintDiv').is(':visible') ){
			if (event.keyCode ==38){
				//user pressed up arrow
				console.log("up arrow");
				//user pressed up arrow						
				if(selectedYesNo === null){
					selectedYesNo=1;
				}
				setSelectedYesNo(selectedYesNo - 1);				
				event.preventDefault();
			}else if (event.keyCode ==40){
				//user pressed down arrow
				console.log("down arrow");
				//user pressed down arrow						
				if(selectedYesNo === null){
					setSelectedYesNo(0);
				}else{
					setSelectedYesNo(selectedYesNo + 1);
				}				
				event.preventDefault();
			}else if (event.keyCode == 13 ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();			  
			  if((selectedYesNo!==null)){			
				var selectedRow = $yesNoPrintList.find('tr').eq(selectedYesNo);								
				var selectedRowId = selectedRow.attr('id');				
				$j("#"+selectedRowId).click();
			  }				  		  		  
			}	
		}
	});
	
	$j.setPrintIdCardDiv = function() {	
		console.log("execute setPrintIdCardDiv");
		prevDiv="confirmDiv";		
		$j('#left-arrow-white').show();
		$j("#printIdCardMenu").addClass('highlighted');						
	};
	
	$j.setScanIdCardDiv = function() {	
		console.log("execute setScanIdCardDiv");
		$j("#loadingSimilarPatients").hide();	
		prevDiv="printIdCardDiv";		
		$j('#left-arrow-white').show();
		$j("#printIdCardMenu").addClass('highlighted');	
		$j("#scanPatientIdentifier").focus();
	};
	
	$j('#scanPatientIdentifier').keypress(function(event) {			
		if (event.keyCode == 13 ) {
		  // User pressed enter key.			 			 
		  event.stopPropagation();
		  scanedPatientIdentifier = $j('#scanPatientIdentifier').val();
		  if( scanedPatientIdentifier.length>1){
			console.log("patientIdentifier.keypress 13: " + scanedPatientIdentifier);		
			console.log("editPatientIdentifier=" + editPatientIdentifier);	
			if(scanedPatientIdentifier !== editPatientIdentifier){				
				alert(scriptMessages['invalidIdentifier']);		
				$j('#scanPatientIdentifier').val("");				
			}else{
				$j("#confirmPatientModalDiv").dialog("open");
				$j('#confirmPatientModalDiv').load(pageContextAddress + '/module/patientregistration/workflow/confirmPatient.form?patientIdentifier=' + scanedPatientIdentifier + ' #modalTable', 
					function(){				
						$j.hideOkButton();	
						$j('#scanPatientIdentifier').val("");
				});
				$j('#messageArea').show();		
				$j('#matchedPatientDiv').css("visibility", "visible");
				$j('#matchedPatientDiv').show();
				$j('#confirmExistingPatientDiv').show();
			}
		  }else{
			console.log("patientIdentifier is empty")
		  }
		}
			
	});
	
	$j.setupDiv = function(devId) {
		$j.hideAllDiv();	
		$j.removeHighlightedMenu();	
		$j.hideNavigationArrows();
		$j('#cross-red').show();
		$j("#"+devId).css("visibility", "visible");
		$j("#"+devId).show();
		if(devId=='encounterDateDiv'){
            $j.setEncounterDateDiv();
        }else if(devId=='yearDiv'){
            $j.setYearDiv();
        }else if(devId=='monthDiv'){
            $j.setMonthDiv();
        }else if(devId=='dayDiv'){
            $j.setDayDiv();
        }else if(devId=='firstNameDiv'){
			$j.setFirstNameDiv();
		}else if(devId=='lastNameDiv'){
			$j.setLastNameDiv();
		}else if(devId=='genderDiv'){
			$j.setGenderDiv();
		}else if(devId=='birthdateDiv'){
			$j.setBirthdateDiv();
		}else if(devId=='ageEstimateDiv'){
			$j.setAgeEstimateDiv();
		}else if(devId=='addressLandmarkDiv'){
			$j.setAddressLandmarkDiv();
		}else if(devId=='possibleLocalityDiv'){
			$j.setPossibleLocalityDiv();
		}else if(devId=='addressSearchDiv'){
			$j.setAddressSearchDiv();
		}else if(devId=='addressDepartmentDiv'){
			$j.setAddressDepartmentDiv();
		}else if(devId=='addressCommuneDiv'){
			$j.setAddressCommuneDiv();
		}else if(devId=='addressSectionCommuneDiv'){
			$j.setAddressSectionCommuneDiv();
		}else if(devId=='addressLocalitieDiv'){
			$j.setAddressLocalitieDiv();
		}else if(devId=='phoneNumberDiv'){
			$j.setPhoneNumberDiv();
		}else if(devId=='confirmDiv'){
			$j.setConfirmDiv();
		}else if(devId=='confirmPrintDiv'){
			$j.setConfirmPrintDiv();
		}else if(devId=='printIdCardDiv'){
			$j.setPrintIdCardDiv();
		}else if(devId=='scanIdCardDiv'){
			$j.setScanIdCardDiv();
		} 
	};
	
	$j.validateFirstNameDivData = function() {
		firstNameVal = $j('#patientInputFirstName').val();
		firstNameVal= $j.trim(firstNameVal);
		if(firstNameVal.length<1){
			alert(scriptMessages['invalidFirstName']);			
			$j('#right-arrow-yellow').hide();
			$j.setFirstNameDiv();
			return false;
		}	
		patientsFound=false;
		return true;
	};
	
	$j.validateLastNameDivData = function() {
		lastNameVal = $j('#patientInputLastName').val();
		lastNameVal= $j.trim(lastNameVal);
		if(lastNameVal.length<1){
			alert(scriptMessages['invalidLastName']);
			return false;
		}
		patientsFound=false;
		return true;
	};
	
	$j.filterPatientsByGender = function(selectedGender, patientArray) {
		var filteredArray = null;
		if(patientArray!==null && patientArray.length>0){
			var lowerGenderVal = selectedGender.toLowerCase();
			filteredArray = $j.grep(patientArray, function(el, i){
				return el.gender.toLowerCase() === lowerGenderVal;
			});
			console.log("genderFilterPatients.length=" + filteredArray.length);			
		}
		return filteredArray;
	
	};
	
	$j.filterPatientsByAge = function(inputYear, patientArray) {
		var filteredArray = null;
		if(patientArray!=null && patientArray.length>0){
			if(birthdateYear>=0){
				filteredArray = $j.grep(patientArray, function(el, i){		
					if (el.birthdate == null){
						return true;
					}
					var patientYear = getYearFromBirthdate(el.birthdate);										
					if(Math.abs(patientYear-inputYear)<= thresholdYear){
						return true;
					}else{
						return false;
					}										
				});
				console.log("genderFilterPatients.length=" + filteredArray.length);	
			}
		}
		return filteredArray;
	};
	
	$j.validateGenderDivData = function() {				
		return true;
	};
	
	$j.validateBirthdateDivData = function() {
		birthdateDay= $j('#day').val();
		if(birthdateDay.length<1){			
			alert(scriptMessages['invalidBirthDay']);
			return false;
		}
		
		birthdateMonth = $j('#monthAutocomplete').val();
		if (birthdateMonth.length<1 ){			
			alert(scriptMessages['invalidBirthMonth']);
			return false;
		}else{
			birthdateMonthId = $j.inArray(birthdateMonth, monthData);
			if (birthdateMonthId.length<1){
				//this should 'never' happen
				alert("invalid month selection");
				return false;
			}
		}
		birthdateYear = $j('#year').val();			
		if(birthdateYear.length!=4){			
			alert(scriptMessages['invalidBirthYear']);
			return false;
		}
		
		var $newDate = (parseInt(birthdateMonthId,10) + parseInt(1,10)) + "/" + (parseInt(birthdateDay,10)) + "/" + birthdateYear;
		try{
			var parsedDate =$j.datepicker.parseDate("m/d/yy", $newDate);			
			var today=new Date();
			if(parsedDate>today){				
				alert(scriptMessages['invalidBirthFuture']);
				return false;
			}else{
				if((parseInt(today.getFullYear(),10) - parseInt(parsedDate.getFullYear(), 10)) >120){					
					alert(scriptMessages['invalidBirthPast']);
					return false;
				}
			}
		}catch(e){
			console.log(e + "newDate=" + $newDate);
			alert(scriptMessages['invalidBirthDate']);			
			return false;
		}	
		birthdateEstimateYears=0;
		birthdateEstimateMonths=0;	
		return true;
	};
	
	$j.validateAgeEstimateDivData = function() {		
		console.log("birthdateEstimateYears=" + birthdateEstimateYears);
		console.log("UNKNOWN_ADULT_AGE=" + UNKNOWN_ADULT_AGE);
		if((parseInt(birthdateEstimateYears,10) !== parseInt(UNKNOWN_ADULT_AGE, 10)) && 
			(parseInt(birthdateEstimateYears, 10) !== parseInt(UNKNOWN_CHILD_AGE, 10))){
			
			birthdateEstimateYears= $j('#estimateYears').val();			
			if(!IsNumeric(birthdateEstimateYears)){			
				alert(scriptMessages['invalidNumericYear']);				
				return false;
			}
					
			if(birthdateEstimateYears.length>1 &&
				( (parseInt(birthdateEstimateYears, 10)< parseInt(0,10)) || 
				(birthdateEstimateYears>130) )){			
				alert(scriptMessages['invalidAgeEstimate']);				
				return false;
			}
			
			birthdateEstimateMonths = $j('#estimateMonths').val();
			if((birthdateEstimateMonths.length>1) &&  !IsNumeric(birthdateEstimateMonths)){					
				alert(scriptMessages['invalidNumericMonth']);	
				return false;
			}
			if (birthdateEstimateMonths.length>1 && 
				(birthdateEstimateMonths<0 || birthdateEstimateMonths>12)){						
				alert(scriptMessages['invalidMonthNumber']);	
				return false;
			}
		}else{
			console.log("do not validate");
		}
		birthdateDay=0;
		birthdateMonth='';
		birthdateMonthId=0;
		birthdateYear=0;
		return true;
	};
	
	$j.validateAddressLandmarkDivData = function() {
		personAddressLandmark = $j('#addressLandmarkField').val();
		personAddressLandmark = $j.trim(personAddressLandmark);	
		return true;
	};

	$j.setAddressFromLocality = function(){		
		$j.splitAddress(personAddress);
		console.log("searchAddressByLocality(), personAddress=" + personAddress);
		if(editDivId.length>0){
			$j.populateConfirmForm();	
			window.setTimeout(function() {
				alertUserAboutLeaving = false;
				$j('#confirmPatientInfoForm').submit();
			}, 500);					
		}else{
			window.setTimeout(function() {
				$j.setupDiv("phoneNumberDiv");
				$j("#confirmPossibleLocalityModalDiv").dialog("close");
				$j("#patientInputPhoneNumber").focus();	
			}, 200);				
		}			
	
	};	
	var $confirmLocalityList = $j('#confirmPossibleLocalityModalList');
	var selectedLocalityItem = 0;
	var setSelectedLocalityItem = function(item) {		
		//$confirmLocalityList = $j('.confirmPossibleLocalityModalList');
		selectedLocalityItem = item;
		if (selectedLocalityItem !== null) {
			if (selectedLocalityItem < 0) {
				selectedLocalityItem = 0;
			}
			if (selectedLocalityItem >= $confirmLocalityList.find('tr').length) {
			  selectedLocalityItem = $confirmLocalityList.find('tr').length - 1;
			}
			$confirmLocalityList.find('tr').removeClass('highlighted').eq(selectedLocalityItem).addClass('highlighted');												
		}		  		
	};
	
	$j(document).keydown(function(event) {		
		if ($j('#confirmPossibleLocalityModalDiv').is(':visible') ){
			if (event.keyCode ==38){
				//user pressed up arrow				
				if(selectedLocalityItem === null){
					selectedLocalityItem=1;
				}
				setSelectedLocalityItem(selectedLocalityItem - 1);				
				event.preventDefault();
			}else if (event.keyCode ==40){
				//user pressed down arrow							
				if(selectedLocalityItem === null){
					setSelectedLocalityItem(0);
				}else{
					setSelectedLocalityItem(selectedLocalityItem + 1);
				}				
				event.preventDefault();
			}else if (event.keyCode == 13 ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();			  
			  if((selectedLocalityItem!==null)){		
				alertUserAboutLeaving = false;			  
				var selectedRowTd = $confirmLocalityList.find('tr').eq(selectedLocalityItem).find("td").text();				
				console.log("selectedRowTd=" + selectedRowTd);
				if(selectedRowTd.length>0){
					personAddress = personAddressLandmark + "," + selectedRowTd;
					$j.setAddressFromLocality();		
				}else{
					$j.setupDiv("addressDepartmentDiv");						
					$j("#confirmPossibleLocalityModalDiv").dialog("close");
					$j("#addressDepartmentAutocomplete").focus();
				}
			  }				  		  		  
			}	
		}
	});
	
	/*
	getPossibleFullAddressesForAddressHierarchyEntry.form takes an entryName, addressField(address1 which is mapped to the Locality/Habitation), and a separator and generates all the full addresses for than contain the specified entry name at the specified level.  This would be used for full address search after a Locality had been selected.  (Note that this search, unlike the former, does an exact match on entryName and does NOT use Name Phonetics�because at this point we are only looking for exact matches).
	*/
	$j.searchAddressByLocality = function(localityValue){		
		$j('#possibleLocalityEntered').text(localityValue);	
		$j.ajax({
			type: 'POST',
			async: false,
			url: pageContextAddress + '/module/addresshierarchy/ajax/getPossibleFullAddressesForAddressHierarchyEntry.form',
			dataType: 'json',
			data: { 'entryName': localityValue,  
					'addressField': 'address1',
					'separator' : ',' },
			error: function(request, status, error){
					console.log(request.responseText);
				   },
			success: function(addresses) {
				
				// remove the existing rows
				$j('.addressRow').remove();								
				// now add a new row for each patient
				$j.each(addresses, function(i,address) {
					// create the row element itself
					var row = $j(document.createElement('tr')).addClass('addressRow');											
					if (i % 2 == 0) { 
						row.addClass('evenRow');
					} else {
						row.addClass('oddRow');
					}
					row.mouseover(function(){						
						$confirmLocalityList.find('tr').removeClass('highlighted');
						$j(this).addClass('highlighted');
					});
					row.mouseout(function(){
						$j(this).removeClass('highlighted');
					});					
					var reverseAddress = reverseDelimiterList(address['address'], ',');
					// now add all the cells to the row
					row.append($j(document.createElement('td')).text(reverseAddress));
					row.click(function(){						
						personAddress = personAddressLandmark + "," + reverseAddress;
						$j.setAddressFromLocality();																	
					});
					$j('#confirmPossibleLocalityModalList').append(row);
				});	
				if(addresses.length>0){
					$confirmLocalityList.find('tr').removeClass('highlighted').eq(0).addClass('highlighted');
				}
			}
		});
		
	};
	
	$j.validatePossibleLocalityDivData = function() {
		personPossibleLocality = $j('#possibleLocalityField').val();
		personPossibleLocality = $j.trim(personPossibleLocality);	
		if(personPossibleLocality.length>0){
			$j('#confirmPossibleLocalityModalDiv').css("visibility", "visible");
			$j('#confirmPossibleLocalityModalDiv').show();
			$j.searchAddressByLocality(personPossibleLocality);
			$j("#confirmPossibleLocalityModalDiv").dialog("open");		
			return false;
		}else{
			nexDiv="addressDepartmentDiv";			
			return true;
		}
		
	};
	
	$j.validateAddressDepartmentDivData = function() {
		personDepartment = $j('#addressDepartmentAutocomplete').val();
		if(personDepartment.length<1){
			alert("please select a valid department");
			return false;
		}			
		communeData = getChildAddresses(country + "|" + personDepartment);		
		return true;
	};
	
	$j.validateAddressCommuneDivData = function() {
		personCommune = $j('#addressCommuneAutocomplete').val();
		if(personCommune.length<1){
			alert("please select a valid commune");
			return false;
		}			
		sectionCommuneData = getChildAddresses(country + "|" + personDepartment + "|" + personCommune);						
		return true;
	};
	
	$j.validateAddressSectionCommuneDivData = function() {
		personSectionCommune = $j('#addressSectionCommuneAutocomplete').val();
		if(personSectionCommune.length<1){
			alert("please select a valid section commune");
			return false;
		}	
		localitieData = getChildAddresses(country + "|" + personDepartment + "|" + personCommune + "|" + personSectionCommune);	
		return true;
	};
	
	$j.validateAddressLocalitieDivData = function() {
		personLocalitie = $j('#addressLocalitieAutocomplete').val();
		if(personLocalitie.length<1){
			alert("please select a valid localitie habitation");
			return false;
		}				
		return true;
	};
	
	$j.validatePhoneNumberDivData = function() {
		phoneNumber = $j('#patientInputPhoneNumber').val();
		return true;
	};
	
	$j.validateDivData = function() {		
		if ($j('#yearDiv').is(':visible') ){
            return $j.validateYearDivData();
        }else if ($j('#monthDiv').is(':visible') ){
            return $j.validateMonthDivData();
        }else if ($j('#dayDiv').is(':visible') ){
            return $j.validateDayDivData();
        }else if ($j('#firstNameDiv').is(':visible') ){						
			return $j.validateFirstNameDivData();			
		}else if ($j('#lastNameDiv').is(':visible') ){						
			return $j.validateLastNameDivData();			
		}else if ($j('#genderDiv').is(':visible') ){						
			return $j.validateGenderDivData();			
		}else if ($j('#birthdateDiv').is(':visible') ){						
			return $j.validateBirthdateDivData();			
		}else if ($j('#ageEstimateDiv').is(':visible') ){						
			return $j.validateAgeEstimateDivData();			
		}else if ($j('#addressLandmarkDiv').is(':visible') ){						
			return $j.validateAddressLandmarkDivData();			
		}else if ($j('#possibleLocalityDiv').is(':visible') ){						
			return $j.validatePossibleLocalityDivData();			
		}else if ($j('#addressSearchDiv').is(':visible') ){						
			return $j.validateAddressSearchDivData();			
		}else if ($j('#addressDepartmentDiv').is(':visible') ){						
			return $j.validateAddressDepartmentDivData();			
		}else if ($j('#addressCommuneDiv').is(':visible') ){						
			return $j.validateAddressCommuneDivData();			
		}else if ($j('#addressSectionCommuneDiv').is(':visible') ){						
			return $j.validateAddressSectionCommuneDivData();			
		}else if ($j('#addressLocalitieDiv').is(':visible') ){						
			return $j.validateAddressLocalitieDivData();			
		}else if ($j('#phoneNumberDiv').is(':visible') ){						
			return $j.validatePhoneNumberDivData();			
		} 				
		return true;
	};
	
	$j('.cross-black').click(function(event){		
		if ($j('#firstNameDiv').is(':visible') ){						
			 $j('#patientInputFirstName').val("");	
			 $j('.patientFirstNameList').hide();	
			  $j('#patientInputFirstName').focus();
		}else if ($j('#lastNameDiv').is(':visible') ){						
			 $j('#patientInputLastName').val("");	
			 $j('.patientLastNameList').hide();		
			 $j('#patientInputLastName').focus();			 
		}else if ($j('#addressLandmarkDiv').is(':visible') ){						
			 $j('#addressLandmarkField').val("");			
			 $j('#addressLandmarkField').focus();			 
		}else if ($j('#possibleLocalityDiv').is(':visible') ){						
			 $j('#possibleLocalityField').val("");	
			 $j('.addressFieldRow').remove();
			 $j('#possibleLocalityList').hide();			 
			 $j('#possibleLocalityField').focus();			 
		}else if ($j('#addressSearchDiv').is(':visible') ){						
			 $j('#patientInputSearchAddress').val("");
			 $j('#existingAddressesList').hide();		
			 $j('#patientInputSearchAddress').focus();			 
		}else if ($j('#addressDepartmentDiv').is(':visible') ){						
			 $j('#addressDepartmentAutocomplete').val("");
			 $j( "input#addressDepartmentAutocomplete" ).autocomplete("search", "");	 
			  $j('#addressDepartmentAutocomplete').focus();
		}else if ($j('#addressCommuneDiv').is(':visible') ){						
			 $j('#addressCommuneAutocomplete').val("");
			 $j( "input#addressCommuneAutocomplete" ).autocomplete("search", "");	 
			  $j('#addressCommuneAutocomplete').focus();
		}else if ($j('#addressSectionCommuneDiv').is(':visible') ){						
			 $j('#addressSectionCommuneAutocomplete').val("");
			 $j( "input#addressSectionCommuneAutocomplete" ).autocomplete("search", "");	
			 $j('#addressSectionCommuneAutocomplete').focus();			 
		}else if ($j('#addressLocalitieDiv').is(':visible') ){						
			 $j('#addressLocalitieAutocomplete').val("");
			 $j( "input#addressLocalitieAutocomplete" ).autocomplete("search", "");	 
			  $j('#addressLocalitieAutocomplete').focus();
		}else if ($j('#phoneNumberDiv').is(':visible') ){						
			 $j('#patientInputPhoneNumber').val("");	
			 $j('#patientInputPhoneNumber').focus();		
		}
	});
	
	$j('#cross-red').click(function(event){
		window.location.href=pageContextAddress + '/module/patientregistration/workflow/patientRegistrationTask.form';
	});
	
	// handle right-arrow-yellow clicks
	$j('#right-arrow-yellow').click(function(event){				
		if($j.validateDivData()){										
			if(nextDiv !== null){	
				var editableDivId = $j.inArray(nextDiv, editDivItems);
				if(editDivId.length>0 && editableDivId<0){
					$j.populateConfirmForm();	
					window.setTimeout(function() {
						alertUserAboutLeaving = false;
						$j('#confirmPatientInfoForm').submit();
					}, 500);					
				}else{
					event.stopPropagation();
					event.preventDefault();
					$j.setupDiv(nextDiv);				
				}
			}	
		}		
	});
	
	// handle checkmark-yellow clicks
	$j('#checkmark-yellow').click(function(event) {													
		event.stopPropagation();	
		event.preventDefault();
		$j.registerPatient("no");
		return false;
	});
	
	// handle left-arrow-white clicks
	$j('#left-arrow-white').click(function(event){											
		if(prevDiv !== null){			
			$j.setupDiv(prevDiv);					
		}													
	});
	
	$j.handleGenderChange = function(){
		if ($j("input[name^='rdio']:checked").val() == 'M'){	
			$j('#rdioF').attr('checked', 'checked');
			genderVal='F';
			$j('#rdioF').focus();			
			$j('#rdioTrM').removeClass('highlighted');
			$j('#rdioTrF').addClass('highlighted');								
		}else{							
			$j('#rdioM').attr('checked', 'checked');
			$j('#rdioM').focus();
			genderVal='M';			
			$j('#rdioTrF').removeClass('highlighted');
			$j('#rdioTrM').addClass('highlighted');			
		}
	
	};
	
	$j("input[name^='rdio']").change(function(){						
			if ($j("input[name^='rdio']:checked").val() == 'M'){				
				$j('#rdioTrF').removeClass('highlighted');
				$j('#rdioTrM').addClass('highlighted');
				$j('#rdioM').focus();
				genderVal='M';
			}else{				
				$j('#rdioTrM').removeClass('highlighted');
				$j('#rdioTrF').addClass('highlighted');
				$j('#rdioF').focus();
				genderVal='F';
			}
	});
	
	$j(document).keydown(function(event) {		
		if ($j('#genderDiv').is(':visible') ){			
			event.stopPropagation();
			event.preventDefault();	
			if (event.keyCode ==38){
				//user pressed up arrow				
				$j.handleGenderChange();
			}else if (event.keyCode ==40){
				//user pressed down arrow				
				$j.handleGenderChange();
			}else if (event.keyCode == 13 ) {
			  //User pressed enter key.			 				 	
			  $j.setupDiv(nextDiv);
			}	
		}
	});
	
	var $confirmMatchesList = $j('.confirmExistingPatientModalList');
	var selectedMatchItem = 0;
	var setSelectedMatchItem = function(item) {		
		selectedMatchItem = item;
		if (selectedMatchItem !== null) {
			if (selectedMatchItem < 0) {
				selectedMatchItem = 0;
			}
			if (selectedMatchItem >= $confirmMatchesList.find('tr').length) {
			  selectedMatchItem = $confirmMatchesList.find('tr').length - 1;
			}
			$confirmMatchesList.find('tr').removeClass('highlighted').eq(selectedMatchItem).addClass('highlighted');												
		}		  		
	};
	
	$j(document).keydown(function(event) {		
		if ($j('#confirmExistingPatientModalDiv').is(':visible') ){
			if (event.keyCode ==38){
				//user pressed up arrow
				console.log("up arrow");
				//user pressed up arrow						
				if(selectedMatchItem === null){
					selectedMatchItem=1;
				}
				setSelectedMatchItem(selectedMatchItem - 1);				
				event.preventDefault();
			}else if (event.keyCode ==40){
				//user pressed down arrow
				console.log("down arrow");
				//user pressed down arrow						
				if(selectedMatchItem === null){
					setSelectedMatchItem(0);
				}else{
					setSelectedMatchItem(selectedMatchItem + 1);
				}				
				event.preventDefault();
			}else if (event.keyCode == 13 ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();			  
			  if((selectedMatchItem!==null)){		
				alertUserAboutLeaving = false;			  
				var selectedRowId = $confirmMatchesList.find('tr').eq(selectedMatchItem).find("input").val();				
				$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + selectedRowId );
				setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);
			  }				  		  		  
			}	
		}
	});

	$j.displaySimilarPatients = function(patientArray, exactCounter, similarCounter) {
		var similarAlertText ='';
		patientIdentifier= "";
		if(patientArray !==null && patientArray.length>0){
			var patientsLength = patientArray.length;											
			$j('.existingPatientListRow').remove(); 
			$j('.existingPatientModalListRow').remove();
			//change the background color
			$j('#confirmExistingPatientDiv').css("background-color", "#FF732F"); 				
			//add to the modal dialog the following info:
			/*
				FirstName LastName
				Gender, Birthdate
			*/
			$j('#modalPatientName').text(firstNameVal+ ' ' + lastNameVal);
			var extraInfo = genderVal;
			if(birthdateDay>0){
				extraInfo = extraInfo +  ', ' 
					+ birthdateDay + '-' 
					+ birthdateMonth + '-'
					+ birthdateYear;
			}
			$j('#modalPatientGenderDOB').text(extraInfo);	
										
			// now add a new row for each patient
			$j.each(patientArray, function(i,patient) {
				patientIdentifier= patient.id;
				if(patientId.length>0 && patient.id==patientId){
					//skip the patient we are currently editing
					patientsLength = patientsLength -1;
				}else{
					var existingPatientName ='';	
					$j.each(nameFields, function(i, field) {					
						existingPatientName = existingPatientName + patient[field] + ' ';						
					});	
					var appendText = '| ' + patient.preferredIdentifier + ' ' + '| ' + patient.gender + ' ' + '| Born ' + patient.birthdate;	
					var existingPatientAddress = '';
					$j.each(addressLevels, function(i, addressLevel) {
						existingPatientAddress = existingPatientAddress + patient[addressLevel] + ', ';
					});								
									
					var rowModal = $j(document.createElement('tr')).addClass('existingPatientModalListRow');										
					rowModal.mouseover(function(){
						$confirmMatchesList.find('tr').removeClass('highlighted');
						$j(this).addClass('highlighted');
					});				
					rowModal.mouseout(function(){
						$j(this).removeClass('highlighted');
					});				
					var columnModal = $j(document.createElement('td')).addClass('patientListItem');	
					columnModal.append($j(document.createElement('span')).css("font-weight", "bold").text(existingPatientName));				
					columnModal.append(appendText);	
					columnModal.append('| ' + existingPatientAddress);	
					var hiddenPatientId = document.createElement("input");
					hiddenPatientId.type = "hidden";
					hiddenPatientId.value= patient.id;
					columnModal.append(hiddenPatientId);
					rowModal.append(columnModal); 
					rowModal.click(function(){																				
							alertUserAboutLeaving = false;
							$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patient.id );										
							setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);			
					});
					$j('.confirmExistingPatientModalList').append(rowModal);	
				}				
			});
			if(similarCounter == 0){
				similarAlertText=$j.sprintf(similarExactAlert, exactCounter);	
			}else{
				similarAlertText=$j.sprintf(similarSoundexAlert, exactCounter, similarCounter);	
			}
			// remove existing rows					
			var row = $j(document.createElement('tr')).addClass('existingPatientListRow');				
			var column = $j(document.createElement('td')).addClass('patientListItem');
			var cssObj = {'font-weight' : 'bold'};										
			column.append($j(document.createElement('span')).css(cssObj).text( similarAlertText));			  						
			row.append(column);		
			$j('.confirmExistingPatientList').append(row);	
			$j('#confirmExistingPatientDiv').unbind('click');
			$j('#confirmExistingPatientDiv').click(function(){											
				if (patientsLength>1){
					$j("#confirmExistingPatientModalDiv").dialog("open");
					$confirmMatchesList.find('tr').removeClass('highlighted').eq(0).addClass('highlighted');		
				}
				else if(patientsLength ==1){
					$j("#confirmPatientModalDiv").dialog("open");
					$j('#confirmPatientModalDiv').load(pageContextAddress + '/module/patientregistration/workflow/confirmPatient.form?patientId=' + patientIdentifier + ' #modalTable');
				}				
			});					
			$j('#messageArea').show();		
			$j('#matchedPatientDiv').css("visibility", "visible");
			$j('#matchedPatientDiv').show();
			$j('#confirmExistingPatientDiv').show();
		}
		else{				
			$j('#messageArea').hide();		
		}
	};
	
	var similarPatientResults=null;
	var patientsFound=false;
	var patientsMatchCounter=0;
	var jqxhr =null;
	$j.searchExistingPatients = function() {
		if(patientsFound){
			$j('#messageArea').show();		
			$j('#matchedPatientDiv').css("visibility", "visible");
			$j('#matchedPatientDiv').show();
			return;
		}
		
		if(firstNameVal.length<1 || lastNameVal.length<1){
			return;
		}
		$j('#givenName').val(firstNameVal);
		$j('#familyName').val(lastNameVal);		
		if(jqxhr){
			jqxhr.abort();
			jqxhr = null;
		}
		
		$j('.existingPatientListRow').remove();
		$j('#confirmExistingPatientDiv').hide();	
		var patientsLength = 0;
		jqxhr = $j.getJSON(pageContextAddress + '/module/patientregistration/ajax/patientSearch.form'
					, $j('#patientSearch').serialize()
					, function(patients) {
		
			patientsLength = patients.length;
			$j('.existingPatientListRow').remove(); 
			$j('.existingPatientModalListRow').remove();
			var similarAlertText ='';
			patientIdentifier= "";
			if(patientsLength>0){
				exactPatientResults = patients;
				//change the background color
				$j('#confirmExistingPatientDiv').css("background-color", "#FF732F"); 				
				//add to the modal dialog the following info:
				/*
					FirstName LastName
					Gender, Birthdate
				*/
				$j('#modalPatientName').text(firstNameVal+ ' ' + lastNameVal);
				var extraInfo = genderVal;
				if(birthdateDay>0){
					extraInfo = extraInfo +  ', ' 
						+ birthdateDay + '-' 
						+ birthdateMonth + '-'
						+ birthdateYear;
				}
				$j('#modalPatientGenderDOB').text(extraInfo);					
			}else{
				exactPatientResults = null;
			}	
				
			// now add a new row for each patient
			$j.each(patients, function(i,patient) {
				patientIdentifier= patient.id;
				if(patientId.length>0 && patient.id==patientId){
					//skip the patient we are currently editing
					patientsLength = patientsLength -1;
				}else{
					exactPatientResultsIds.push(patient.id);
					var existingPatientName ='';	
					$j.each(nameFields, function(i, field) {					
						existingPatientName = existingPatientName + patient[field] + ' ';						
					});						
					var appendText = '| ' + patient.preferredIdentifier + ' ' + '| ' + patient.gender + ' ' + '| Born ' + patient.birthdate;	
					var existingPatientAddress = '';
					$j.each(addressLevels, function(i, addressLevel) {
						existingPatientAddress = existingPatientAddress + patient[addressLevel] + ', ';
					});	
									
					var rowModal = $j(document.createElement('tr')).addClass('existingPatientModalListRow');										
					rowModal.mouseover(function(){
						$confirmMatchesList.find('tr').removeClass('highlighted');
						$j(this).addClass('highlighted');
					});				
					rowModal.mouseout(function(){
						$j(this).removeClass('highlighted');
					});				
					var columnModal = $j(document.createElement('td')).addClass('patientListItem');	
					columnModal.append($j(document.createElement('span')).css("font-weight", "bold").text(existingPatientName));				
					columnModal.append(appendText);	
					columnModal.append('| ' + existingPatientAddress);	
					var hiddenPatientId = document.createElement("input");
					hiddenPatientId.type = "hidden";
					hiddenPatientId.value= patient.id;
					columnModal.append(hiddenPatientId);
					rowModal.append(columnModal); 
					rowModal.click(function(){																				
							alertUserAboutLeaving = false;
							$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patient.id );										
							setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);			
					});
					$j('.confirmExistingPatientModalList').append(rowModal);	
				}				
			});
			if(patientsLength>0){
				patientsMatchCounter = patientsLength;
				if(patientsLength>20){
					similarAlertText=$j.sprintf(similarExactAlert, patientsLength);	
				}else{
					similarAlertText=$j.sprintf(similarAlert, patientsLength);	
				}
				// remove existing rows					
				var row = $j(document.createElement('tr')).addClass('existingPatientListRow');				
				var column = $j(document.createElement('td')).addClass('patientListItem');
				var cssObj = {'font-weight' : 'bold'};														
				column.append($j(document.createElement('span')).css(cssObj).text( similarAlertText));
				if(patientsLength<21){
					var loaderImg =$j(document.createElement('img')).attr(
							{src: pageContextAddress  + "/moduleResources/patientregistration/images/smallwhiteloader.gif", 
							 id: 'smallerLoaderId'
							});
					column.append(loaderImg);
				}
				row.append(column);		
				$j('.confirmExistingPatientList').append(row);	
				$j('#confirmExistingPatientDiv').unbind('click');
				$j('#confirmExistingPatientDiv').click(function(){											
					if (patientsLength>1){
						$j("#confirmExistingPatientModalDiv").dialog("open");
						$confirmMatchesList.find('tr').removeClass('highlighted').eq(0).addClass('highlighted');		
					}
					else if(patientsLength ==1){
						$j("#confirmPatientModalDiv").dialog("open");
						$j('#confirmPatientModalDiv').load(pageContextAddress + '/module/patientregistration/workflow/confirmPatient.form?patientId=' + patientIdentifier + ' #modalTable');
					}
					
				});	
				patientsFound=true;
				$j('#messageArea').show();		
				$j('#matchedPatientDiv').css("visibility", "visible");
				$j('#matchedPatientDiv').show();
				$j('#confirmExistingPatientDiv').show();
			}
			else{
				patientsFound=false;
				$j('#messageArea').hide();		
			};
		}).success(function(){ console.log("patientName search success"); } )
		.error(function() {console.log("patientName search error"); } )
		.complete(function() { 
			jqxhr = null;
			$j("#loadingSimilarPatients").hide();			
			console.log("patientName search complete");
			if (patientsLength<21){
				patientsSoundexFound=false;
				$j.searchSoundexPatients(patientsMatchCounter); 
			}
		});
	};
	
	$j( "#confirmPatientModalDiv" ).dialog({
		autoOpen: false,
		height: 600,
		width: 900,
		modal: true,
		closeOnEscape: true,			
		open: function(event, ui){		
			$j(".ui-dialog").css("padding", "0");	
			$j(".ui-dialog-buttonpane").css("background", "gray");					
			$j(this).parent().children(".ui-widget-header").css("background", "#009384");
			$j(".ui-dialog-buttonset").css("width", "100%");	
			var cssObj = {
				'border' : "0",					
				'height' : "57", 
				'width' : "70"
			}
			$j("#cancelBtnConf").css(cssObj);
			$j("#cancelBtnConf").css("float", "left");
			$j("#cancelBtnConf").css("margin-left", "20px");
			$j("#cancelBtnConf").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/left-arrow-white.png') center center no-repeat");	
			
			$j("#okBtnConf").css(cssObj);
			$j("#okBtnConf").css("float", "right");
			$j("#okBtnConf").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png') center center no-repeat");
			$j('#okBtnConf').css('border', '5px solid #EFB420');
			$j("#okBtnConf").focus();							
		}
		, 
		buttons: [
			{
				text: "",
				label: "Cancel",
				id: "cancelBtnConf",
				click: function() {						
					cardPrinted=false;
					$j(this).dialog("close");
				}
			},
			{
				text: "",
				label: "ok",
				id: "okBtnConf",
				click: function() {						
					alertUserAboutLeaving = false;
					$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patientIdentifier + "&patientIdentifier="+ scanedPatientIdentifier + "&cardPrinted=" + cardPrinted);					
					setTimeout('$j("#confirmPatientModalDiv").dialog("close"); ', 1000);	
				}
			}					
		]			
	});	
		
	$j( "#confirmExistingPatientModalDiv" ).dialog({
			autoOpen: false,
			height: 600,
			width: 900,
			modal: true,
			closeOnEscape: true,	
			buttons: [
				{
					text: "",
					label: "Cancel",
					id: "cancelBtn",
					click: function() {						
						$j(this).dialog("close");
					}
				}					
			]		
			, 
			open: function(event, ui){		
				$j(".ui-dialog").css("padding", "0");	
				$j(".ui-dialog-buttonpane").css("background", "gray");					
				$j(this).parent().children(".ui-widget-header").css("background", "#009384");
				$j(".ui-dialog-buttonset").css("width", "100%");	
				var cssObj = {
					'border' : "0",					
					'height' : "35", 
					'width' : "35"
				}								
				$j("#cancelBtn").css(cssObj);
				$j("#cancelBtn").css("float", "left");
				$j("#cancelBtn").css("margin-left", "20px");
				$j("#cancelBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/cross-red.png')");
			}
	});		
	
	
	var patientsSoundexFound=false;
	var jqSoundXHR =null;
	$j.searchSoundexPatients = function(exactMatchNo) {
		if(patientsSoundexFound){
			$j('#messageArea').show();		
			$j('#matchedPatientDiv').css("visibility", "visible");
			$j('#matchedPatientDiv').show();
			return;
		}
		
		if(firstNameVal.length<1 || lastNameVal.length<1){
			return;
		}
		$j('#givenName').val(firstNameVal);
		$j('#familyName').val(lastNameVal);
		
		if(jqSoundXHR){
			jqSoundXHR.abort()
			jqSoundXHR = null;
		}
		
		jqSoundXHR = $j.getJSON(pageContextAddress + '/module/patientregistration/ajax/patientSoundexSearch.form'
					, $j('#patientSearch').serialize()
					, function(jsonResponse) {
		
			var patients = eval(jsonResponse);
			var patientsLength = patients.length;
			
			var similarAlertText ='';
			patientIdentifier= "";
			if(patientsLength>0){
				similarPatientResults = new Array();
				$j('.existingPatientListRow').remove(); 
				$j('.existingPatientModalListRow').remove();
				//change the background color
				$j('#confirmExistingPatientDiv').css("background-color", "#FF732F"); 				
				//add to the modal dialog the following info:
				/*
					FirstName LastName
					Gender, Birthdate
				*/
				$j('#modalPatientName').text(firstNameVal+ ' ' + lastNameVal);
				var extraInfo = genderVal;
				if(birthdateDay>0){
					extraInfo = extraInfo +  ', ' 
						+ birthdateDay + '-' 
						+ birthdateMonth + '-'
						+ birthdateYear;
				}
				$j('#modalPatientGenderDOB').text(extraInfo);	
				
			}else{
				similarPatientResults = null;
			}		
				
			// now add a new row for each patient
			$j.each(patients, function(i,patient) {
				patientIdentifier= patient.id;
				if(patientId.length>0 && patient.id==patientId){
					//skip the patient we are currently editing
					patientsLength = patientsLength -1;
				}else{
					if($j.inArray(patient.id, exactPatientResultsIds) <0){
						similarPatientResults.push(patient);
					}
					var existingPatientName ='';	
					$j.each(nameFields, function(i, field) {					
						existingPatientName = existingPatientName + patient[field] + ' ';						
					});	
					var appendText = '| ' + patient.preferredIdentifier + ' ' + '| ' + patient.gender + ' ' + '| Born ' + patient.birthdate;	
					var existingPatientAddress = '';
					$j.each(addressLevels, function(i, addressLevel) {
						existingPatientAddress = existingPatientAddress + patient[addressLevel] + ', ';
					});								
									
					var rowModal = $j(document.createElement('tr')).addClass('existingPatientModalListRow');										
					rowModal.mouseover(function(){
						$confirmMatchesList.find('tr').removeClass('highlighted');
						$j(this).addClass('highlighted');
					});				
					rowModal.mouseout(function(){
						$j(this).removeClass('highlighted');
					});				
					var columnModal = $j(document.createElement('td')).addClass('patientListItem');	
					columnModal.append($j(document.createElement('span')).css("font-weight", "bold").text(existingPatientName));				
					columnModal.append(appendText);	
					columnModal.append('| ' + existingPatientAddress);	
					var hiddenPatientId = document.createElement("input");
					hiddenPatientId.type = "hidden";
					hiddenPatientId.value= patient.id;
					columnModal.append(hiddenPatientId);
					rowModal.append(columnModal); 
					rowModal.click(function(){																				
							alertUserAboutLeaving = false;
							$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patient.id );										
							setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);			
					});
					$j('.confirmExistingPatientModalList').append(rowModal);	
				}				
			});
			if(patientsLength>0){
				var extraPatients = 0;
				if(patientsLength >= exactMatchNo){
					extraPatients = patientsLength - exactMatchNo;
				}else{
					extraPatients = patientsLength;
				}
				similarAlertText=$j.sprintf(similarSoundexAlert + similarAlertText, exactMatchNo,extraPatients);	
				// remove existing rows					
				var row = $j(document.createElement('tr')).addClass('existingPatientListRow');				
				var column = $j(document.createElement('td')).addClass('patientListItem');
				var cssObj = {'font-weight' : 'bold'};										
				column.append($j(document.createElement('span')).css(cssObj).text( similarAlertText));			  						
				row.append(column);		
				$j('.confirmExistingPatientList').append(row);	
				$j('#confirmExistingPatientDiv').unbind('click');
				$j('#confirmExistingPatientDiv').click(function(){											
					if (patientsLength>1){
						$j("#confirmExistingPatientModalDiv").dialog("open");
						$confirmMatchesList.find('tr').removeClass('highlighted').eq(0).addClass('highlighted');		
					}
					else if(patientsLength ==1){
						$j("#confirmPatientModalDiv").dialog("open");
						$j('#confirmPatientModalDiv').load(pageContextAddress + '/module/patientregistration/workflow/confirmPatient.form?patientId=' + patientIdentifier + ' #modalTable');
					}
					
				});	
				patientsSoundexFound=true;
				$j('#messageArea').show();		
				$j('#matchedPatientDiv').css("visibility", "visible");
				$j('#matchedPatientDiv').show();
				$j('#confirmExistingPatientDiv').show();
			}
			else{
				patientsSoundexFound=false;
				$j('#smallerLoaderId').remove();		
			};
		}).success(function(){ console.log("patientName SOUNDEX search success"); } )
		.error(function() {console.log("patientName SOUNDEX search error"); } )
		.complete(function() { 
			if(jqxhr){
				jqxhr.abort()
				jqxhr = null;
			}
			jqSoundXHR = null;
			$j("#loadingSimilarPatients").hide();			
			console.log("patientName SOUNDEX search complete"); 
		});
	};	
	
	$j('#year').keyup(function(event) {
		birthdateYear = $j('#year').val();
		if (birthdateYear.length<4 ){
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}else{
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}
	}).keypress(function(event) {		
		if(event.keyCode == 13){
			birthdateYear = $j('#year').val();
			if (birthdateYear.length!=4 ){
				return false;
			}else{
				$j('#right-arrow-yellow').click();
			}
		}
	});
	
	$j('#estimateYears').keyup(function(event) {
		birthdateEstimateYears= $j('#estimateYears').val();
		if(((birthdateEstimateYears !== null) && 
				(birthdateEstimateYears.length>0)) || 
				((birthdateEstimateMonths !== null) && 
				(birthdateEstimateMonths.length>0))){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}
	}).keypress(function(event) {		
		if(event.keyCode == 13){
			birthdateEstimateYears= $j('#estimateYears').val();
			if(((birthdateEstimateYears !== null) && 
				(birthdateEstimateYears.length>0)) || 
				((birthdateEstimateMonths !== null) && 
			(birthdateEstimateMonths.length>0))){
				$j('#right-arrow-white').hide();
				$j('#right-arrow-yellow').show();
				$j('#right-arrow-yellow').click();
			}else{
				$j('#right-arrow-white').show();
				$j('#right-arrow-yellow').hide();
			}
		}
	});
	
	$j('#estimateMonths').keyup(function(event) {
		birthdateEstimateMonths= $j('#estimateMonths').val();
		if(((birthdateEstimateMonths !== null) && 
			(birthdateEstimateMonths.length>0)) || 
			((birthdateEstimateYears !== null) && 
				(birthdateEstimateYears.length>0))){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}
	}).keypress(function(event) {		
		if(event.keyCode == 13){
			birthdateEstimateYears= $j('#estimateYears').val();
			if(((birthdateEstimateMonths !== null) && 
			(birthdateEstimateMonths.length>0)) || 
			((birthdateEstimateYears !== null) && 
				(birthdateEstimateYears.length>0))){
				$j('#right-arrow-white').hide();
				$j('#right-arrow-yellow').show();
				$j('#right-arrow-yellow').click();
			}else{
				$j('#right-arrow-white').show();
				$j('#right-arrow-yellow').hide();
			}
		}
	});
	
	
	$j('#addressSectionCommuneAutocomplete').keyup(function(event) {		
		personSectionCommune = $j('#addressSectionCommuneAutocomplete').val();
		if( (personSectionCommune !==null) &&
			(personSectionCommune.length>0)){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}
	});
	
	$j('#addressLocalitieAutocomplete').keyup(function(event) {		
		personLocalitie = $j('#addressLocalitieAutocomplete').val();
		if( (personLocalitie !==null) &&
			(personLocalitie.length>0)){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}
	});
	
	$j('#patientInputPhoneNumber').keypress(function(event) {						
		event.stopPropagation();
		if ($j('#phoneNumberDiv').is(':visible') ){			
			if(event.keyCode == 13){			
				$j('#right-arrow-yellow').click();	
				event.preventDefault();
			}
		}
	});
	var inputId = null;
	var $autocomplete = $j('.patientFirstNameList').hide();
							
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
		if($j('#patientInputFirstName').is(':visible') ){
			$j("#patientInputFirstName").focus();
		}else if($j('#patientInputLastName').is(':visible') ){
			$j("#patientInputLastName").focus();
		}
		
	};
	
	var populateSearchField = function() {
		var populateVal =null;
		if((selectedItem !== null) && (selectedItem >= 0)){
			populateVal = $autocomplete.find('tr').eq(selectedItem).text();	
			if(populateVal.length>0){
				$j("#"+inputId).val(populateVal);
			}
			$autocomplete.find('tr').removeClass('highlighted');
			setSelectedItem(null);		
			$j("#"+inputId).focus();
		}								
	 };
	var patientNameTimerId=null;	
	var namexhr =null;
	// handle the real-time patient search
	$j('input:text').keyup(function(event) {											
		inputId = this.id;
		if( (inputId != 'patientInputFirstName') &&
			(inputId != 'patientInputLastName')
			){
			return false;
		}		
		var inputValue = $j("#"+inputId).val();
		if(inputValue.length>0){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
			if(inputId =='patientInputFirstName'){					
				prevDiv="lastNameDiv";												
				nextDiv="genderDiv";				
			}else if(inputId =='patientInputLastName'){
				nextDiv="firstNameDiv";
				prevDiv="lastNameDiv";				
			}
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
			
			if(patientNameTimerId){
				clearTimeout(patientNameTimerId);
			}
			if(namexhr){
				namexhr.abort()
				namexhr = null;
			}
			var formSer=$j('#patientNameSearch').serialize();
			var searchName ='';			
			if(inputId =='patientInputFirstName'){
				searchName =  $j('#patientInputFirstName').val();		
				$autocomplete = $j('.patientFirstNameList').hide();					
				$j("#firstNameTableDiv").append($j("#loadingGraph"));
				$j("#loadingGraph").css("visibility", "visible");
				$j("#loadingGraph").show();
			}else if(inputId =='patientInputLastName'){
				searchName =  $j('#patientInputLastName').val();	
				$autocomplete = $j('.patientLastNameList').hide();
				$j("#lastNameTableDiv").append($j("#loadingGraph"));
				$j("#loadingGraph").css("visibility", "visible");
				$j("#loadingGraph").show();
			}			
			if(searchName.length>1){
				$j('#searchFieldName').val(searchName);
				formSer=$j('#patientNameSearch').serialize();
				patientNameTimerId= setTimeout(function() {  
					namexhr = $j.getJSON(pageContextAddress + '/module/patientregistration/ajax/patientNameOccurrencesSearch.form'
						, $j('#patientNameSearch').serialize()
						, function(patients) {

					// remove the existing rows
					$j('.patientListRow').remove();
					// do not show the header				
					$j('.patientListHeader').hide();		
					if (patients.length > 0) {
						// now add a new row for each patient
						$j.each(patients, function(i,patient) {
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
							row.append($j(document.createElement('td')).addClass('patientListItem').text(foundPatient));
							row.click(populateSearchField);	
							if(inputId =='patientInputFirstName'){
									$j('.patientFirstNameList').append(row);
							}else if(inputId =='patientInputLastName'){
									$j('.patientLastNameList').append(row);
							}												
						});	
						setSelectedItem(null);
					}else{
						setSelectedItem(null);
					}	
				}).complete(function(){
					$j("#loadingGraph").hide();
					namexhr = null;
					console.log("patientNameOccurrencesSearch.form completed successfully");
				}).error(function(){
					console.log("patientNameOccurrencesSearch.form failed");
					namexhr = null;
				});}, 500);
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
		if(inputId =='patientInputFirstName' || inputId =='patientInputLastName'){
			if (event.keyCode == 13 ) {
			  // User pressed enter key.			 			 
			  event.stopPropagation();
			  if((selectedItem==null) && 
				$j("#"+inputId).val().length>0){
				 setTimeout('$j("#right-arrow-yellow").click();', 100);
			  }else{
				populateSearchField();			  
			  }
			}
		}			
	});
	
	var $autocompleteAddress = $j('#existingAddressesList').hide();
							
	var selectedAddressItem = null;
	var setSelectedAddressItem = function(item) {		
		selectedAddressItem = item;

		if (selectedAddressItem !== null) {
			if (selectedAddressItem < 0) {
				selectedAddressItem = 0;
			}
			if (selectedAddressItem >= $autocompleteAddress.find('tr').length) {
			  selectedAddressItem = $autocompleteAddress.find('tr').length - 1;
			}
			$autocompleteAddress.find('tr').removeClass('highlighted').eq(selectedAddressItem).addClass('highlighted');												
		}		  
		$autocompleteAddress.show();
	};
	
	var populateAddressSearchField = function() {
		var populateVal = null;		
		if((selectedAddressItem !== null) && (selectedAddressItem >=0)){
			populateVal = $autocompleteAddress.find('tr').eq(selectedAddressItem).text();
			if(populateVal.length>0){
				$j('#patientInputSearchAddress').val(populateVal);				
			}
			$autocompleteAddress.find('tr').removeClass('highlighted');
			setSelectedAddressItem(null);
		}								
	 };
	
	var addressSearchTimer = null;
	// handle the real-time patient address search
	$j('#patientInputSearchAddress').keyup(function(event) {
		if(addressSearchTimer){
				clearTimeout(addressSearchTimer);
		}
		var matchAddress = $j('#patientInputSearchAddress').val();
		if(matchAddress.length>0){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-white').show();
			$j('#right-arrow-yellow').hide();
		}
		
		if (event.keyCode > 40 || event.keyCode ==8) {
			$autocompleteAddress = $j('#existingAddressesList').hide();
			
			if(matchAddress.length>2){			
				addressSearchTimer = setTimeout(function() { $j.ajax({
					type: 'POST',
					url: pageContextAddress + '/module/addresshierarchy/ajax/getPossibleFullAddresses.form',
					dataType: 'json',
					data: { 'searchString': matchAddress, 'separator' : ',' },
					success: function(addressesReturned) {
												
						$j('.addressRow').remove();
						if(addressesReturned.length > 0) {
							// now add a new row for each address
							$j.each(addressesReturned, function(i,returnedAddress) {
				
								// create the row element itself
								var row = $j(document.createElement('tr')).addClass('addressRow');						
								
								if (i % 2 == 0) { 
									row.addClass('evenRow');
								} else {
									row.addClass('oddRow');
								}
								row.mouseover(function(){								
									setSelectedAddressItem(i);
								});
								var reverseAddress = reverseDelimiterList(returnedAddress['address'], ',');
								// now add all the cells to the row
								row.append($j(document.createElement('td')).text(reverseAddress));
								row.click(populateAddressSearchField);
								$j('#existingAddressesList').append(row);
							});	
							setSelectedAddressItem(0);
						}else{
							setSelectedAddressItem(null);
						}
					}
				});}, 500);
			}
		}else if (event.keyCode ==38){
				//user pressed up arrow
				if(selectedAddressItem === null){
					selectedAddressItem=1;
				}
				setSelectedAddressItem(selectedAddressItem - 1);
				event.preventDefault();
		}else if (event.keyCode == 40){
			//user pressed down arrow						
			if(selectedAddressItem === null){
					setSelectedAddressItem(0);
			}else{
				setSelectedAddressItem(selectedAddressItem + 1);
			}
			event.preventDefault();
		}
	}).keypress(function(event) {	
		if (event.keyCode == 13 ) {
		  // User pressed enter key.
		  event.stopPropagation();
		  event.preventDefault();
		  if((selectedAddressItem==null) && 
			($j('#patientInputSearchAddress').val().length>0)){
			$j('#right-arrow-yellow').click();
		  }else{
			populateAddressSearchField();		  
		  }
		}					
	});
	
	$j("#brokenPrinterBtn").click(function(event) {
		$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?cardPrinted=false&createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patientId);
	});
	
	$j("#reprintIDCardBtn").click(function(event) {
		$j.goToNextPage(nextTask, '/module/patientregistration/workflow/enterPatientDemo.form?hiddenPrintIdCard=yes&patientId=' + patientId);
	});
	
	

    $j.setEncounterDateDiv = function() {
        prevDiv=null;
        nextDiv="genderDiv";
        $j('.encounterDateList').find('tr').removeClass('highlighted');
        $j("#todayDateRow").addClass('highlighted');
        var dateLabel = encounterDay + "-" +
            encounterMonthLabel + "-" +
            encounterYear;
        if(isToday(encounterDay, encounterMonth, encounterYear)){
            dateLabel = dateLabel + " (" + todayLabel +")";
        }
        $j("#todayEncounterDate").text(dateLabel);

        $j("#todayDateRow").focus();
        $j("#encounterDateMenu").addClass('highlighted');
        $j('#right-arrow-yellow').show();

    };

    // today/past date mouseovers
    $j('.dateListRow').mouseover(function(){
        $j(this).addClass('highlighted');
    });
    $j('.dateListRow').mouseout(function(){
        $j(this).removeClass('highlighted');
    });

    $j("#todayDateRow").click(function(event){       
        $j.setupDiv('genderDiv');
    });
    $j("#pastDateRow").click(function(event){
        $j.setupDiv('yearDiv');
    });


    $j.setYearDiv = function() {
        prevDiv="encounterDateDiv";
        nextDiv="monthDiv";
        $j("#encounterDateMenu").addClass('highlighted');
        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();

        var tempYear =  parseInt(encounterYear, 10);
        console.log("encounterYear=" + tempYear);
        if(tempYear<1){
            var today=new Date();
            tempYear = parseInt(today.getFullYear(),10);
        }
        $j("#encounterYear").val(tempYear);

        $j('#encounterYear').focus();

    };

    $j('#encounterYear').keyup(function(event) {
        var tempYear = $j('#encounterYear').val();
        if (tempYear.length<4 ){
            $j('#right-arrow-white').show();
            $j('#right-arrow-yellow').hide();
        }else{
            $j('#right-arrow-white').hide();
            $j('#right-arrow-yellow').show();
        }
    }).keypress(function(event) {
            if(event.keyCode == 13){
                tempYear = $j('#encounterYear').val();
                if (tempYear.length!=4 ){
                    return false;
                }else{
                    $j('#right-arrow-yellow').click();
                }
            }
        });


    function selectRadioButton(element) {
        if(element !== null && element !=='undefined' && element.length>0){
            // make sure the proper button is highlighted
            $j('.radioItem').removeClass('highlighted');
            $j('.radioItem').find('.radioClass').attr('checked',false);
            $j(element).addClass('highlighted');
            $j(element).find('.radioClass').attr('checked',true);

            console.log("radioClass val=" + $j(element).find('.radioClass').val());
            console.log("radioLabel text=" + $j(element).find('.radioLabel').text());
        }else{
            console.log("selectradiobutton null");
        }
    }

    $j('.radioItem').click(function(event) {
        var monthValue = $j(this).find('.radioClass').val();
        $j('.radioItem').removeClass('highlighted');
        $j('.radioItem').find('.radioClass').attr('checked',false);
        var radioButton = $j('input[value="' + monthValue + '"]');
        if(radioButton.length>0){
            radioButton.attr('checked',true);
            var closestTr = radioButton.closest('tr');
            closestTr.addClass('highlighted');
        }
    });

    $j.setMonthDiv = function() {
        prevDiv="yearDiv";
        nextDiv="dayDiv";
        $j("#encounterDateMenu").addClass('highlighted');
        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();
        $j('.radioItem').removeClass('highlighted');
        $j('.radioItem').find('.radioClass').attr('checked',false);
        $j('.dateSpan').text(encounterYear);
        var tempMonth =  parseInt(encounterMonth, 10);
        console.log("encounterMonth=" + tempMonth);
        var radioButton = $j('input[value="' + tempMonth + '"]');
        if(radioButton.length>0){
            radioButton.attr('checked',true);
            var closestTr = radioButton.closest('tr');
            closestTr.addClass('highlighted');
        }
    };
    $j(document).keydown(function(event) {
        if ($j('#monthDiv').is(':visible') ){
            console.log("monthDiv is visible");
            var checkedRadioButton = $j("input[type='radio']:checked");
            var monthValue = 1;
            if(checkedRadioButton.length>0){
                monthValue = parseInt(checkedRadioButton.val(), 10);
            }
            if (event.keyCode == KEYCODE_ARROW_UP){
                event.preventDefault();
                selectRadioButton($j('input[value=' + (monthValue - 4) + ']').closest('.radioItem'));
            }else if (event.keyCode == KEYCODE_ARROW_DOWN){
                event.preventDefault();
                selectRadioButton($j('input[value=' + (monthValue + 4) + ']').closest('.radioItem'));
            }else if (event.keyCode == KEYCODE_ARROW_LEFT){
                event.preventDefault();
                selectRadioButton($j('input[value=' + (monthValue - 1) + ']').closest('.radioItem'));
            }else if (event.keyCode == KEYCODE_ARROW_RIGHT){
                event.preventDefault();
                selectRadioButton($j('input[value=' + (monthValue + 1) + ']').closest('.radioItem'));
            }else if (event.keyCode == KEYCODE_ENTER ) {
                //User pressed enter key.
                event.stopPropagation();
                event.preventDefault();
                window.setTimeout('$j("#right-arrow-yellow").click();', '100');
            }
        }
    });

    $j.setDayDiv = function() {
        prevDiv="monthDiv";
        nextDiv="genderDiv";
        $j("#encounterDateMenu").addClass('highlighted');
        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();
        $j('.dateSpan').text( encounterMonthLabel + "-" + encounterYear);
        var tempDay =  parseInt(encounterDay, 10);
        console.log("encounterDay=" + tempDay);
        if(tempDay<1){
            tempDay = 1;
        }
        $j("#encounterDay").val(tempDay);
        $j("#encounterDay").focus();
    };

    $j('#encounterDay').keyup(function(event) {
        var tempDay = $j('#encounterDay').val();
        if (tempDay.length<1 ){
            $j('#right-arrow-white').show();
            $j('#right-arrow-yellow').hide();
        }else{
            $j('#right-arrow-white').hide();
            $j('#right-arrow-yellow').show();
        }
    }).keypress(function(event) {
            if(event.keyCode == 13){
                var tempDay = $j('#encounterDay').val();
                if (tempDay.length<1 ){
                    return false;
                }else{
                    $j('#right-arrow-yellow').click();
                }
            }
        });

    var $dateList = $j('.encounterDateList');
    var selectedDate = 0;
    var setSelectedDate = function(item) {
        selectedDate = item;
        if (selectedDate !== null) {
            if (selectedDate < 0) {
                selectedDate = 0;
            }
            if (selectedDate >= $dateList.find('tr').length) {
                selectedDate = $dateList.find('tr').length - 1;
            }
            $dateList.find('tr').removeClass('highlighted').eq(selectedDate).addClass('highlighted');
        }
    };
	
	 $j(document).keydown(function(event) {
       if ($j('#encounterDateDiv').is(':visible') ){
            if (event.keyCode == KEYCODE_ARROW_UP){
                //user pressed up arrow
                console.log("up arrow");
                //user pressed up arrow
                if(selectedDate === null){
                    selectedDate=1;
                }
                setSelectedDate(selectedDate - 1);
                event.preventDefault();
            }else if (event.keyCode == KEYCODE_ARROW_DOWN){
                //user pressed down arrow
                console.log("down arrow");
                //user pressed down arrow
                if(selectedDate === null){
                    setSelectedDate(0);
                }else{
                    setSelectedDate(selectedDate + 1);
                }
                event.preventDefault();
            }else if (event.keyCode == KEYCODE_ENTER ) {
                //User pressed enter key.
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                if((selectedDate!==null)){
                    window.setTimeout(function(event){
                        var selectedRow = $dateList.find('tr').eq(selectedDate);
                        var selectedRowId = selectedRow.attr('id');
                        $j("#"+selectedRowId).click();
                    }, 100);

                }
            }
        }
    });

    $j.validateYearDivData = function() {

        var inputYear = parseInt($j('#encounterYear').val(),10);

        var $newDate = (1) + "/" + (1) + "/" + inputYear;
        try{
            var parsedDate =$j.datepicker.parseDate("m/d/yy", $newDate);
            var today=new Date();
            if(parsedDate>today){
                alert(scriptMessages['invalidBirthFuture']);
                return false;
            }else{
                if((parseInt(today.getFullYear(),10) - parseInt(parsedDate.getFullYear(), 10)) >120){
                    alert(scriptMessages['invalidBirthPast']);
                    return false;
                }
            }
        }catch(e){
            console.log(e + "newDate=" + $newDate);
            alert(scriptMessages['invalidBirthDate']);
            return false;
        }
        encounterYear = inputYear;
        return true;
    };

    $j.validateMonthDivData = function() {
        var checkedRadioButton = $j("input[type='radio']:checked");
        var monthValue = 1;
        var closestTr = null;
        if(checkedRadioButton.length>0){
            monthValue = parseInt(checkedRadioButton.val(), 10);
            var monthLabel = checkedRadioButton.closest('.radioItem').find('.radioLabel').text();
            if(monthLabel.length>0){
                console.log("monthLabel=" + monthLabel);
                encounterMonthLabel = monthLabel;
            }
        }
        if(monthValue<1){
            monthValue = 1;
        }
        encounterMonth = monthValue;
        return true;
    };

    $j.validateDayDivData = function() {
        var inputDay = parseInt($j('#encounterDay').val(),10);
        var $newDate = parseInt(encounterMonth, 10) + "/" + inputDay + "/" + encounterYear;
        try{
            var parsedDate =$j.datepicker.parseDate("m/d/yy", $newDate);
            var today=new Date();
            if(parsedDate>today){
                alert(scriptMessages['invalidBirthFuture']);
                return false;
            }else{
                if((parseInt(today.getFullYear(),10) - parseInt(parsedDate.getFullYear(), 10)) >120){
                    alert(scriptMessages['invalidBirthPast']);
                    return false;
                }
            }
        }catch(e){
            console.log(e + "newDate=" + $newDate);
            alert(scriptMessages['invalidBirthDate']);
            return false;
        }
        encounterDay = inputDay;
               
        return true;
    };

	$j("#unknownAdultAge").click(function(event){
		birthdateEstimateYears = UNKNOWN_ADULT_AGE;
		console.log("unknownAdultAge click");
		$j('#right-arrow-yellow').click()
	});
	
	$j("#unknownChildAge").click(function(event){
		birthdateEstimateYears = UNKNOWN_CHILD_AGE;
		console.log("unknownChildAge click");
		$j('#right-arrow-yellow').click()
	});

	
	if(personAddress.length>0){
		$j.splitAddress(personAddress);
	}
	if(patientId.length>0){
		if(editDivId.length>0){
			$j.setupDiv(editDivId);
		}else{
			$j.setupDiv("confirmDiv");
		}
	}else{
		//setup UNKNOWN values
        $j.setUnknownValues();
        $j.setupDiv("encounterDateDiv");
	}
	
	var alertUserAboutLeaving = false;
	
	$j("input").change(function(event) {
		alertUserAboutLeaving = true;
	});
	
	$j(window).bind('beforeunload', function(e) {
		if (alertUserAboutLeaving) {
			return leavePageAlert;
		}
		else {
			return;
		}
	});
});