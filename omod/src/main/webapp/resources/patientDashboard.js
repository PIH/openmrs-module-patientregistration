$j(document).ready(function(){	

	// hide the white right arrow
	$j('#right-arrow-white').hide();
	$j('#cross-red').hide();	
	$j('#checkmark-yellow').show();	
	$j('#checkmark-yellow').css('border', '5px solid #EFB420');
	$j('#checkmark-yellow').focus();
	
	
	if(birthdateYear == UNKNOWN_ADULT_YEAR){		
		$j("#tdAge").text(adultUnknownAgeLabel);
	}else if(birthdateYear == UNKNOWN_CHILD_YEAR){		
		$j("#tdAge").text(childUnknownAgeLabel);
	}
	
	if(cardPrintedLastDate.length>0){
		$j("#lastStatusLabel").text(statusLabel);
		$j("#lastStatusDate").text(statusDateValue);	
	}
	if(cardPrintedStatus == 'true'){			
		$j("#printedIdCard").attr('src', pageContextAddress + '/moduleResources/patientregistration/images/card-printed-icon.png');
	}else{
		$j("#printedIdCard").attr('src', pageContextAddress + '/moduleResources/patientregistration/images/no-card-icon.png');
	}
	
	if(parseInt(cardPrintedCounter,10) >0){
		var labelMessage = $j.sprintf( cardCounterMessage, parseInt(cardPrintedCounter,10));
		$j("#printingCounterLabel").text(labelMessage);
	}
	
	
	$j("#dialog-confirm").hide();
	$j("#dialog-confirm").css("visibility", "hidden");
	$j("#dialog-removeDuplicate").hide();
	$j("#dialog-removeDuplicate").css("visibility", "hidden");
	$j("#dialog-confirmDuplicate").hide();
	$j("#dialog-confirmDuplicate").css("visibility", "hidden");
	
	var $confirmMatchesList = $j('.confirmExistingPatientModalList');
	
	
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
	
	$j.removeDuplicateFromArray = function(duplicateId) {
		if(duplicatePatientsData.length>0 && duplicateId.length>0){
			for(var i=0; i < duplicatePatientsData.length; i++){
				var duplicatePatient = new Object();
				duplicatePatient = duplicatePatientsData[i];
				if(duplicatePatient.patientId == duplicateId){
					duplicatePatientsData.splice(i,1);
					break;
				}
			}
		}
	};
	
	$j.removeDuplicatePatient =  function(mapId, patientListId){
		console.log("removing the duplicate association between mapId=" + mapId + "; and patientListId=" + patientListId);		
		$j.ajax({
			type: 'POST',
			async: false,
			url: pageContextAddress + '/module/patientregistration/ajax/removeFalseDuplicates.form',
			//dataType: 'json',
			data: { 'patientId': mapId, 'duplicateId': patientListId },
			success: function(elements) {													
				console.log("removeFalseDuplicates returned OK");	
			}
		}).complete(function(){					
			console.log("removeFalseDuplicates.form completed successfully");
		}).error(function(){
			console.log("removeFalseDuplicates.form failed");
		});	
	}
	
	function addDuplicatePatient(mapId, patientListId){
		var returnValue = false;
		console.log("add to mapId=" + mapId + "; and patientListId=" + patientListId);		
		$j.ajax({
			type: 'POST',
			async: false,
			url: pageContextAddress + '/module/patientregistration/ajax/addPatientDuplicate.form',			
			data: { 'patientId': mapId, 'duplicateId': patientListId },
			success: function(elements) {													
				console.log("addPatientDuplicate returned OK");	
				returnValue = true;
			}
		}).complete(function(){					
			console.log("addPatientDuplicate.form completed");
		}).error(function(){
			console.log("addPatientDuplicate.form failed");
		});	
		return returnValue;
	}
	
	$j(document).keydown(function(event) {		
		if ($j('#confirmExistingPatientModalDiv').is(':visible') ){
			if (event.keyCode == KEYCODE_ARROW_UP){				
				//user pressed up arrow						
				if(selectedMatchItem === null){
					selectedMatchItem=1;
				}
				setSelectedMatchItem(selectedMatchItem - 1);				
				event.preventDefault();
			}else if (event.keyCode == KEYCODE_ARROW_DOWN){				
				//user pressed down arrow						
				if(selectedMatchItem === null){
					setSelectedMatchItem(0);
				}else{
					setSelectedMatchItem(selectedMatchItem + 1);
				}				
				event.preventDefault();
			}else if (event.keyCode == KEYCODE_ENTER ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();			  
			  if((selectedMatchItem!==null)){		
				alertUserAboutLeaving = false;			  
				var selectedRowId = $confirmMatchesList.find('tr').eq(selectedMatchItem).find("input").val();				
				window.location.href=pageContextAddress + '/module/patientregistration/workflow/patientDashboard.form?patientId=' + selectedRowId ;
				setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);
			  }				  		  		  
			}	
		}
	});
	
	
	
	
	
	$j('#printedIdCard').click(function(event){		
		$j("#dialog-confirm").css("visibility", "visible");
		$j("#dialog-confirm").show();
		$j("#dialog-confirm").dialog("open");
	});
	
	$j("#dialog-confirm" ).dialog({
		autoOpen: false,
		resizable: false,					
		height: 240,
		width: 600,
		modal: true,
		closeOnEscape: true,	
		buttons: [								
			{
				text: "",
				label: "yesCard",
				id: "yesBtn",
				click: function() {						
					$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createEncounter=patientRegistrationEncounterType&cardPrinted=true&patientId=' + patientId );					
					setTimeout('$j("#dialog-confirm").dialog("close"); ', 1000);							
				}
			},
			{
				text: "",
				label: "noCard",
				id: "noBtn",
				click: function() {						
					$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?createEncounter=patientRegistrationEncounterType&cardPrinted=false&patientId=' + patientId );					
					setTimeout('$j("#dialog-confirm").dialog("close"); ', 1000);
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
				'height' : "40", 
				'width' : "50"
			}
			$j("#noBtn").css(cssObj);
			$j("#noBtn").css("float", "left");
			$j("#noBtn").css("margin-left", "20px");
			$j("#noBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/z-red.png') center center no-repeat");				
			$j("#yesBtn").css(cssObj);
			$j("#yesBtn").css("float", "right");
			$j("#yesBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png')");
			$j("#yesBtn").focus();							
			
		}
	});
	
	$j('#checkmark-yellow').click(function(event) {
		if(nextTask.length>0){
			window.location.href=pageContextAddress + '/module/patientregistration/workflow/' + nextTask + '?patientId=' + patientId;
		}else{
			window.location.href=pageContextAddress + '/module/patientregistration/workflow/' + taskName + 'Task.form';
		}
	});
	$j('#checkmark-yellow').blur(function() {
		console.log("checkmark lost focus");
		$j('#checkmark-yellow').css('border', '0px');
	});
	
	$j('#checkmark-yellow').mouseover(function() {		
		$j('#checkmark-yellow').css('border', '5px solid #EFB420');
		$j('#checkmark-yellow').focus();
	});
	
	$j("#overviewMenu").click(function(event){
		if($j(this).hasClass('disabled')){
			event.preventDefault();
			event.stopPropagation();
		}else{
			$j("#encounterDashboardDiv").hide();			
			$j("#encountersMenu").removeClass('highlighted');
			$j("#overviewMenu").addClass('highlighted');
			$j("#overviewDashboardDiv").css("visibility", "visible");
			$j("#overviewDashboardDiv").show();
		}
		return true;
	});
	$j("#encountersMenu").click(function(event){
		if($j(this).hasClass('disabled')){
			event.preventDefault();
			event.stopPropagation();
		}else{
			$j("#overviewDashboardDiv").hide();			
			$j("#overviewMenu").removeClass('highlighted');
			$j("#encountersMenu").addClass('highlighted');
			$j("#encounterDashboardDiv").css("visibility", "visible");
			$j("#encounterDashboardDiv").show();
		}
		return true;
	});
	
	$j("#editDossier").click(function(event){
		$j.goToNextPage(nextTask, '/module/patientregistration/workflow/primaryCareReceptionDossierNumber.form?edit=true&patientId='+patientId);
	});
	$j("#editDentalDossier").click(function(event){
		$j.goToNextPage(nextTask, '/module/patientregistration/workflow/primaryCareReceptionDossierNumber.form?edit=true&patientId='+patientId+
		'&identifierTypeId='+dentalDossierTypeId);
	});
	
	$j(".editDemoDiv").click(function(event){
		var divId = this.id;		
		$j.goToNextPage(nextTask, '/module/patientregistration/workflow/enterPatientDemo.form?patientId='+patientId + "&editDivId=" + divId);		
	});
	
	$j("#brokenPrinterBtn").click(function(event) {
		$j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?cardPrinted=false&patientId=' + patientId);
	});
	
	
	$j("#reprintIDCardBtn").click(function(event) {
		console.log("reprint ID card");
		$j("#reprintIDCardForm").submit();
	});
	
	$j('#scanPatientIdentifier').keypress(function(event) {			
		if (event.keyCode == 13 ) {
		  // User pressed enter key.			 			 
		  event.stopPropagation();
		  var scanedPatientIdentifier = $j('#scanPatientIdentifier').val();
		  if( scanedPatientIdentifier.length>1){
			console.log("patientIdentifier.keypress 13: " + scanedPatientIdentifier);				
			console.log("patientPreferredIdentifier=" + patientPreferredIdentifier);	
			if(scanedPatientIdentifier !== patientPreferredIdentifier){				
				alert(scriptMessages['invalidIdentifier']);		
				$j('#scanPatientIdentifier').val("");				
			}else{
				window.location.href=pageContextAddress + '/module/patientregistration/workflow/patientDashboard.form?createEncounter=patientRegistrationEncounterType&cardPrinted=true&patientId=' + patientId ;				
			}
		  }else{
			console.log("patientIdentifier is empty")
		  }
		}
			
	});
	
	
	if(scanIdCard == 'true'){
		//hide the dashboard div
		$j("#overviewDashboardDiv").hide();
		$j("#encounterDashboardDiv").hide();	
		$j("#overviewMenu").addClass('disabled');
		$j("#encountersMenu").addClass('disabled');
		$j("#scanIdCardDiv").css("visibility", "visible");
		$j("#scanIdCardDiv").show();
		$j("#scanPatientIdentifier").focus();
	}
});