$j(document).ready(function(){
	var patientIdentifier='';
	var patientId='';
	// show the white right arrow
	$j('#right-arrow-white').show();		
	// set focus to the input field so that we can automatically do bar code scanning
	$j('#patientIdentifier').focus();
	
	$j.navigateToPage = function() {
		patientId = $j("#hiddenPatientId").val();
		if(patientId.length>0){
			window.location.href=pageContextAddress + '/module/patientregistration/workflow/primaryCareReceptionEncounter.form?patientId=' + patientId;
		}else{
			alert("Invalid patient ID");
		}		
	};
	
	$j.hideOkButton = function() {
		var confirmError = $j("#confirmErrorMessage");			
		var val = confirmError.text();			
		if( (confirmError !== null) && (val!==null && typeof(val) !=='undefined' && val.length>0) ){
			$j("#okBtn").hide();
			$j("#cancelBtn").focus();
		}else{
			$j("#okBtn").show();
			$j("#okBtn").focus();
		}			
	};
	
	$j.submitPatientIdentifier=function(event){
		event.stopPropagation();
		event.preventDefault();		
		$j("#confirmPatientModalDiv").dialog("open");
		$j('#confirmPatientModalDiv').load(pageContextAddress + '/module/patientregistration/workflow/confirmPatient.form?patientIdentifier=' + patientIdentifier + ' #modalTable', 
			function(){				
				$j.hideOkButton();					
			}
		);								
						
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
			patientIdentifier = patientIdentifier.replace(/\s/g, "");
			$j.submitPatientIdentifier(event);
		  }
		}
			
	});
	
	$j('#right-arrow-yellow').click(function(event){
		$j.submitPatientIdentifier(event);
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
					$j.navigateToPage();										
					setTimeout('$j("#confirmPatientModalDiv").dialog("close"); ', 3000);
				}
			}					
		]			
	});		
});