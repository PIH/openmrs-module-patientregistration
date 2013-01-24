$j(document).ready(function(){
	var patientIdentifier='';
	var patientId='';
	var patientsLength=0;
	// show the white right arrow
	$j('#right-arrow-white').show();		
	// set focus to the input field so that we can automatically do bar code scanning
	$j('#patientIdentifier').focus();
	
	var $confirmList = $j('.confirmExistingPatientModalList');
	var selectedItem = 0;
	var setSelectedItem = function(item) {		
		selectedItem = item;
		if (selectedItem !== null) {
			if (selectedItem < 0) {
				selectedItem = 0;
			}
			if (selectedItem >= $confirmList.find('tr').length) {
			  selectedItem = $confirmList.find('tr').length - 1;
			}
			$confirmList.find('tr').removeClass('highlighted').eq(selectedItem).addClass('highlighted');												
		}		  		
	};
	
	$j(document).keydown(function(event) {		
		if ($j('#confirmExistingPatientModalDiv').is(':visible') ){
			if (event.keyCode ==38){
				//user pressed up arrow
				console.log("up arrow");
				//user pressed up arrow						
				if(selectedItem === null){
					selectedItem=1;
				}
				setSelectedItem(selectedItem - 1);				
				event.preventDefault();
			}else if (event.keyCode ==40){
				//user pressed down arrow
				console.log("down arrow");
				//user pressed down arrow						
				if(selectedItem === null){
					setSelectedItem(0);
				}else{
					setSelectedItem(selectedItem + 1);
				}				
				event.preventDefault();
			}else if (event.keyCode == 13 ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();			  
			  if((selectedItem!==null)){								
				var selectedRowId = $confirmList.find('tr').eq(selectedItem).find("input").val();
				console.log("selectedRowId=" + selectedRowId);
				var nextPage = '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + selectedRowId ;
				if(nextTask.length>0){
					nextPage = nextPage + '&nextTask=' + nextTask;
				}
				window.location.href=pageContextAddress + nextPage;
				setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);
			  }				  		  		  
			}	
		}
	});
	
	$j.searchByIdentifier = function(idValue) {		
		$j('.existingPatientModalListRow').remove();	
		$j('#fieldInput').text(idValue);	
		patientsLength=0;		
		$j.getJSON(pageContextAddress + '/module/patientregistration/ajax/patientIdentifierSearch.form'
					, "patientIdentifier=" + idValue + "&resultsCounter=8" 
					, function(patients) {
						patientsLength = patients.length;
						if( patientsLength > 0){														
							$j.each(patients, function(i, patient){
								if(patientsLength ==1){
										patientId= patient.id;
										selectedItem = 0;
										$j("#confirmPatientModalDiv").dialog("open");
										$j('#confirmPatientModalDiv').load(pageContextAddress + '/module/patientregistration/workflow/confirmPatient.form?patientId=' + patientId + ' #modalTable');							
									     return;
								}
								var existingPatientName ='';	
								$j.each(nameFields, function(i, field) {					
									existingPatientName = existingPatientName + patient[field] + ' ';						
								});	
								var emrId = '| ' + patient.preferredIdentifierType + ': ' + patient.preferredIdentifier; 
								var otherIds = '';
								var returnedIdentifiers = eval(patient.identifiers.identifier);
								var j = 0;
								for(j=0; j<returnedIdentifiers.length; j++){										
									console.log("identifierTypeName=" + returnedIdentifiers[j].identifierTypeName);
									console.log("identifierValue=" + returnedIdentifiers[j].identifierValue);
									otherIds= otherIds + ' | ' + returnedIdentifiers[j].identifierTypeName + ': ' + returnedIdentifiers[j].identifierValue; 
								}
								
								var appendText = patient.gender + ', ' + patient.birthdate;	
								var existingPatientAddress = '';
								$j.each(addressLevels, function(i, addressLevel) {
									existingPatientAddress = existingPatientAddress + ', ' + patient[addressLevel] ;
								});	
								var rowModal = $j(document.createElement('tr')).addClass('existingPatientModalListRow');										
								rowModal.mouseover(function(){
									$confirmList.find('tr').removeClass('highlighted');
									
									$j(this).addClass('highlighted');
								});				
								rowModal.mouseout(function(){
									$j(this).removeClass('highlighted');
								});				
								var columnModal = $j(document.createElement('td')).addClass('patientListItem');															
								columnModal.append($j(document.createElement('span')).css("font-weight", "bold").text(existingPatientName));				
								columnModal.append($j(document.createElement('span')).css("font-weight", "bold").text(emrId + otherIds));		
								columnModal.append("<br>");
								columnModal.append(appendText);	
								columnModal.append(existingPatientAddress);	
								var hiddenPatientId = document.createElement("input");
								hiddenPatientId.type = "hidden";
								hiddenPatientId.value= patient.id;
								columnModal.append(hiddenPatientId);
								rowModal.append(columnModal); 
								rowModal.click(function(){	
										var nextPage = '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patient.id ;
										if(nextTask.length>0){
											nextPage = nextPage + '&nextTask=' + nextTask;
										}
										window.location.href=pageContextAddress + nextPage;										
										setTimeout('$j("#confirmExistingPatientModalDiv").dialog("close"); ', 1000);																	
								});
								$j('.confirmExistingPatientModalList').append(rowModal);								
							});
						}							
						if(patientsLength !=1){
							$j("#confirmExistingPatientModalDiv").dialog("open");															
							$confirmList.find('tr').removeClass('highlighted').eq(0).addClass('highlighted');								
						}
					}
				);		
	};
	
	$j.submitPatientIdentifier=function(event){
		event.stopPropagation();
		event.preventDefault();
		$j('#messageArea').show();
		$j('#matchedPatientDiv').css("visibility", "visible");
		$j('#matchedPatientDiv').show();
		$j.searchByIdentifier(patientIdentifier);
		return false;
	};
	
	$j('#patientIdentifier').keyup(function(event) {
		if (event.keyCode > 40 || event.keyCode ==8) {						
			patientIdentifier = $j('#patientIdentifier').val();
			if( patientIdentifier.length>1){					
				$j('#right-arrow-white').hide();
				$j('#right-arrow-yellow').show();
			}else{					
				$j('#right-arrow-white').show();
				$j('#right-arrow-yellow').hide();
			}
		}
	}).keypress(function(event) {			
		if (event.keyCode == 13 ) {
		  // User pressed enter key.			 			 
		  event.stopPropagation();
		  patientIdentifier = $j('#patientIdentifier').val();
		  if( patientIdentifier.length>1){
			console.log("patientIdentifier.keypress 13");
			//$j('#enterPatientIdentifer').submit();
			$j.submitPatientIdentifier(event);
		  }
		}
			
	});
	
	$j('#searchByNameBtn').click(function(event){
		console.log("searchByNameBtn.click");
		var nextPage = '/module/patientregistration/workflow/enterPatientDemo.form';
		if(nextTask.length>0){
			nextPage = nextPage + '?nextTask=' + nextTask;
		}
		window.location.href=pageContextAddress + nextPage;	
	});
	
	$j('#registerJdBtn').click(function(event){
		console.log("registerJdBtn.click");
		var nextPage = '/module/patientregistration/workflow/enterPatientDemo.form';
		nextPage = nextPage + '?subTask=registerJd';
		window.location.href=pageContextAddress + nextPage;	
	});
	
	$j('#right-arrow-yellow').click(function(event){
		$j.submitPatientIdentifier(event);
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
					id: "cancelFirstBtn",
					click: function() {						
						$j(this).dialog("close");
					}
				}					
			]		
			, 
			open: function(event, ui){		
				$j(".ui-dialog").css("padding", "0");	
				$j(".ui-dialog-buttonpane").css("background", "gray");					
				$j(this).parent().children(".ui-widget-header").css("background", "#501d3d");
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
			}
	});		

	$j( "#confirmPatientModalDiv" ).dialog({
		autoOpen: false,
		height: 600,
		width: 900,
		modal: true,
		closeOnEscape: true,	
		close: function(event, ui) {				
			$j('#patientIdentifier').val("");
			setTimeout("$j('#patientIdentifier').focus(); ", 100);
			patientIdentifier='';		
		},
		open: function(event, ui){		
			$j('.modalRow').remove();
			$j(".ui-dialog").css("padding", "0");	
			$j(".ui-dialog-buttonpane").css("background", "gray");					
			$j(this).parent().children(".ui-widget-header").css("background", "#501d3d");
			$j(".ui-dialog-buttonset").css("width", "100%");	
		
			$j("#cancelBtn").addClass('modalConfirmBtn');
			$j("#cancelBtn").css("border", "0");
			$j("#cancelBtn").css("float", "left");
			$j("#cancelBtn").css("margin-left", "20px");			
			$j("#cancelBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/left-arrow-white.png') center center no-repeat");	
					
			$j("#okBtn").addClass('modalConfirmBtn');
			$j("#okBtn").css("float", "right");			
			$j("#okBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png') center center no-repeat");	
			$j('#okBtn').css('border', '5px solid #EFB420');						
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
					var nextPage = '/module/patientregistration/workflow/patientDashboard.form?createId=true&createEncounter=patientRegistrationEncounterType&patientId=' + patientId;
					if(nextTask.length>0){
						nextPage = nextPage + '&nextTask=' + nextTask;
					}
					window.location.href=pageContextAddress + 	nextPage;				
					setTimeout('$j("#confirmPatientModalDiv").dialog("close"); ', 3000);
				}
			}					
		]			
	});		
});