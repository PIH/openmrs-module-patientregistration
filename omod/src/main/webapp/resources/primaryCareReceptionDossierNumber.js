$j(document).ready(function(){	

	var divItems = new Array("numeroDossierDiv",		
							 "confirmPrintDiv", 
							 "printDossierLabelDiv"														 
	);
	
	var leftMenuItems = new Array("numeroDossierMenu", 									
									"printDossierLabelMenu"
	);
	
	var navigationArrows = new Array("cross-red", 
									"left-arrow-white",
									"right-arrow-white",
									"right-arrow-yellow",
									"checkmark-yellow"
	);
	
	var prevDiv ='';
	var nextDiv='';
	
	
	jQuery.hideAllDiv = function() {			
		for(i=0; i<divItems.length; i++){				
			var divItem = "#"+divItems[i];			
			$j(divItem).hide();
		}					
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
	
	
	$j.setNumeroDossierDiv = function() {				
		prevDiv=null;
		nextDiv="confirmPrintDiv";		
		$j("#numeroDossierMenu").addClass('highlighted');				
		$j('#right-arrow-yellow').show();		
		$j("[input[id^='patientInput']").focus();
	};
	
	$j.setConfirmPrintDiv = function() {				
		$j("#errorArea").hide();
		prevDiv="numeroDossierDiv";
		nextDiv="printDossierLabelDiv";		
		$j('.yesNoList').find('tr').removeClass('highlighted');
		$j("#yesRow").addClass('highlighted');	
		$j("#yesRow").focus();
		$j('#left-arrow-white').show();	
		$j("#printDossierLabelMenu").addClass('highlighted');						
	};
	
	// send data to EnterPatientDemoControler
	$j.printLabel= function(isPrinting){
		console.log("printLabel: isPrinting=" + isPrinting);		
		if(isPrinting == "yes"){
			$j.hideAllDiv();											
			$j("#"+nextDiv).css("visibility", "visible");
			$j("#"+nextDiv).show();				
			$j.setupDiv(nextDiv);							
			window.setTimeout(function() {					
					$j('#patientRegistrationEncounter').submit();
				}, 
			2000);
		}else{
			$j('#patientRegistrationEncounter').submit();
		}
	}
	
	// Yes/No mouseovers
	$j('.yesNoListRow').mouseover(function(){
		$j(this).addClass('highlighted');
	});	
	$j('.yesNoListRow').mouseout(function(){
		$j(this).removeClass('highlighted');
	});
	
	$j("#yesRow").click(function(event){
		console.log("yes, print a dossier label");
		$j('#hiddenPrintLabel').val("yes");
		$j.printLabel("yes");
	});
	$j("#noRow").click(function(event){
		console.log("no, do not print a dossier label");
		$j('#hiddenPrintLabel').val("no");
		$j.printLabel("no");
	});
	
	var $yesNoPrintList = $j('.yesNoList');
	var selectedYesNo = 0;
	var setSelectedYesNo = function(item) {		
		selectedYesNo = item;
		if (selectedYesNo !== null) {
			if (selectedYesNo < 0) {
				selectedYesNo = 0;
			}
			if (selectedYesNo >= $yesNoPrintList.find('tr').length) {
			  selectedYesNo = $yesNoPrintList.find('tr').length - 1;
			}
			$yesNoPrintList.find('tr').removeClass('highlighted').eq(selectedYesNo).addClass('highlighted');												
		}		  		
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
	
	
	$j.setPrintDossierLabelDiv = function() {				
		$j('#cross-red').hide();
		$j("#printDossierLabelMenu").addClass('highlighted');	
		window.setTimeout(function() {
					$j('#patientRegistrationEncounter').submit();
				}, 1000);		
	};
	
	$j('#cross-red').click(function(event){
		window.location.href=pageContextAddress + '/module/patientregistration/workflow/primaryCareReceptionTask.form';
	});
	
	$j.setupDiv = function(devId) {
		$j.hideAllDiv();	
		$j.removeHighlightedMenu();	
		$j.hideNavigationArrows();
		$j('#cross-red').show();
		$j("#"+devId).css("visibility", "visible");
		$j("#"+devId).show();
		if(devId=='numeroDossierDiv'){
			$j.setNumeroDossierDiv();
		}else if(devId=='confirmPrintDiv'){
			$j.setConfirmPrintDiv();
		}else if(devId=='printDossierLabelDiv'){
			$j.setPrintDossierLabelDiv();
		}
	};
	
	$j.validateNumeroDossierDivData = function() {
		numeroDossierVal = $j('#patientInputNumeroDossier').val();
		console.log("numeroDossierVal="+numeroDossierVal);
		$j('#hiddenNumeroDossier').val(numeroDossierVal);
		return true;
	};
	
	$j.validateDivData = function() {
		//place holder for validating entry data
		if ($j('#numeroDossierDiv').is(':visible') ){						
			return $j.validateNumeroDossierDivData();			
		}
		return true;
	};
	
	$j('#right-arrow-yellow').click(function(event){			
		if($j.validateDivData()){										
			if(nextDiv !== null){								
				$j.setupDiv(nextDiv);				
			}	
		}		
	});
	
	$j('#left-arrow-white').click(function(event){											
		if(prevDiv !== null){			
			$j.setupDiv(prevDiv);					
		}													
	});
	
	
	$j.setupDiv('numeroDossierDiv');

	
	$j.populateConfirmForm = function() {															
		$j('#hiddenNumeroDossier').val(numeroDossierVal);
	};
	
	$j('#patientInputNumeroDossier').keyup(function(event) {
		if ($j(this).val() == '') {
			$j('#right-arrow-yellow').hide();
		}
		else {
			$j('#right-arrow-yellow').show();
		}
	});
	
	$j('#patientInputNumeroDossier').keypress(function(event) {		
		if(event.keyCode == 13){			
			$j('#right-arrow-yellow').click();			
			event.preventDefault();
		}
	});
});