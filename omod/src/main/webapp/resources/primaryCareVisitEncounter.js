$j(document).ready(function(){	

	var prevDiv ='';
	var nextDiv='';
	var CODED = 'CODED';
	var NONCODED = 'NON-CODED';
	var FOREVER = 180; // 3 minutes, longer than the normal session timeout
	
	var providerId = 0;
	var providerName ='';
	if(encounterProviderId.length>0 && (parseInt(encounterProviderId,10)>0)){
		poviderId = parseInt(encounterProviderId,10);
		if(encounterProviderName.length>0){
			providerName=encounterProviderName;
		}
	}
	
	var diagnosisObject = new Object();
	diagnosisObject.type='';
	diagnosisObject.id=0;
	diagnosisObject.label='';
	var diagnosisArray = new Array();
	var filteredDiagnosisArray = new Array();	
	var filteredNonCodedDiagnosisArray = new Array();	
	var disableAutocompleteEnter=false;
	var divItems = new Array("encounterDateDiv",
							 "addProviderDiv", 
							 "addDiagnosisDiv",
							 "dialog-confirm",
							 "dialog-urgentDisease",
							 "dialog-ageRestrictedDisease",
							 "confirmDiagnosisDiv",
							 "confirmMessageArea"
	);
	
	var leftMenuItems = new Array("encounterDateMenu", 
								  "providerMenu", 
								  "diagnosisMenu", 
								  "confirmMenu"
	);
	
	var navigationArrows = new Array("cross-red", 
									"left-arrow-white",
									"right-arrow-white",
									"right-arrow-yellow",
									"checkmark-yellow"
	);
	
	var accentMap = {
			192: "A",
			193: "A",
			194: "A",
			200: "E",
			201: "E",
			210: "O",
			211: "O",
			217: "U",
			218: "U",
			224: "a",
			225: "a",
			232: "e", 
			233: "e",
			242: "o",
			243: "o",
			249: "u",
			250: "u"
	};
	
	console.log("encounterMonthLabel=" + encounterMonthLabel);
	
	
	var normalize = function( term ) {
		var ret = "";
		for ( var i = 0; i < term.length; i++ ) {			
			var temoChar = term.charAt(i).toLowerCase();
			ret += accentMap[ temoChar.charCodeAt(0) ] || term.charAt(i);
		}
		return ret;
	};	
	
	$j.pulsate = function(elementId) {
		$j("#"+ elementId).effect( "pulsate", {times:FOREVER}, 2000);
	};
	
	$j.stopPulsate = function(elementId) {
		$j("#"+ elementId).stop( true, false);		
		$j("#"+ elementId).css('display', 'block');
	};
	
	$j.removeAllDiagnosis = function() {		
		for(var i=0; i<diagnosisArray.length; i++){			
			diagnosisArray.splice(i,1);				
		}	
	    diagnosisArray = new Array();		 
	};
	
	$j.removeDiagnosis = function(diagnosisId, diagnosisLabel) {
		if((diagnosisId.length>0 || diagnosisLabel.length>0)
			&& (diagnosisArray.length>0)){
			for(var i=0; i<diagnosisArray.length; i++){
				var diagnosisItem = new Object();
				diagnosisItem = diagnosisArray[i];
				if(diagnosisItem.id == diagnosisId){
					diagnosisArray.splice(i,1);
					break;
				}else if(diagnosisItem.label == diagnosisLabel){
					diagnosisArray.splice(i,1);
					break;
				}
			}			
		}
	};
	
	$j.findNotifyingDisease = function(diseasesData, diagnosisId){
		var index = -1;
		var diseaseId = parseInt(diagnosisId,10);
		if( diseaseId > 0){	
			for(var i=0; i<diseasesData.length; i++){
				if(parseInt(diseasesData[i].value) == diseaseId){
					index = i;
					break;
				}
			}
		}
		return index;
	};
	
	$j.findAgeRestrictedDisease = function(diseasesData, diagnosisId){
		var index = -1;
		var diseaseId = parseInt(diagnosisId,10);
		if( diseaseId > 0){	
			for(var i=0; i<diseasesData.length; i++){
				if(parseInt(diseasesData[i].value) == diseaseId){
					index = i;
					break;
				}
			}
		}
		return index;
	};
	
	$j.addSelectedDiagnosisRow = function(selectedDiagnosisRow){
		if(selectedDiagnosisRow !==null && selectedDiagnosisRow !=='undefined'){
			var selectedDiagnosisObject = new Object();
			console.log("we found the closest row");
			var selectedHiddenInput = selectedDiagnosisRow.find('.diagnosisIdClass').val();
			if (selectedHiddenInput!==null && selectedHiddenInput!=='undefined' && selectedHiddenInput.length>0){
				//we found a coded diagnosis
				selectedDiagnosisObject.id = selectedHiddenInput;
				selectedDiagnosisObject.type=CODED;
			}else{
				selectedDiagnosisObject.type=NONCODED;
			}
			selectedHiddenInput = selectedDiagnosisRow.find('.diagnosisLabelClass').val();
			if (selectedHiddenInput!==null && selectedHiddenInput!=='undefined' && selectedHiddenInput.length>0){
				selectedDiagnosisObject.label = selectedHiddenInput;
			}
			diagnosisArray.push(selectedDiagnosisObject);
			$j("#uncodedMessageArea" ).dialog("close");								

			//repaint addDiagnosisDiv
			$j.setupDiv('addDiagnosisDiv');	
		}
	};
	
	$j.highlightRow= function(rowId){
			console.log("rowToHighlight click, rowId=" + rowId);
			if ($j('#dialog-confirm').is(':visible') ){
				//the confirm delete diagnosis is up, 
				// there is nothing to be highlighted, just quit
				return;
			}
			$j('.rowToHighlight').removeClass("highDiagnosisListRow");
			$j("#plusDiagnosisRow").removeClass("highPlusRow");
			$j("#addDiagnosisLabelId").removeClass("boldFont");	
			$j("#addDiagnosisLabelId").addClass("greyLostFocust");
			
			$j("#plusBtnId").css("background-image", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/plus-fade.png')");			
			$j('.diagnosisListColumn').css({'color': '#727272'});
			$j('.highlightNotifiableDisease').css({'color': 'red'});
			$j('#right-arrow-yellow').removeClass("highRightArrowYellow");
			$j('#checkmark-yellow').removeClass("highCheckmarkYellow");
			$j('#checkmark-yellow').css('border', '0px');	
			$j('.rowToHighlight').contents('td').css('border', 'none');	
			$j(".deleteDiagnosisClick").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/x-grey.png')");
			$j('#right-arrow-yellow').css('border', '0px');			
			if(rowId == 'checkmark-yellow'){
				console.log("checkmark-yellow.focus");
				$j('#checkmark-yellow').css('border', '5px solid #EFB420');
				$j('#checkmark-yellow').addClass("highCheckmarkYellow");
				$j("#checkmark-yellow").focus();
				return;
			}else if(rowId == 'right-arrow-yellow'){
				console.log("right-arrow-yellow.focus");
				$j('#right-arrow-yellow').css('border', '5px solid #EFB420');
				$j('#right-arrow-yellow').addClass("highRightArrowYellow");
				$j("#right-arrow-yellow").focus();
				return;
			}else if(rowId == 'plusDiagnosisRow'){
				console.log("this is the plus diagnosis row");
				$j("#plusBtnId").css("background-image", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/plus.png')");
				$j("#plusDiagnosisRow").addClass("highPlusRow");
				$j("#addDiagnosisLabelId").removeClass("greyLostFocust");
				$j("#addDiagnosisLabelId").addClass("boldFont");				
				$j("#plusColumnId").css('border-right', '5px solid #EFB420');
				$j("#plusColumnId").css({'border': '5px solid #EFB420', 'border-left': 'none'});
				$j("#jsAddDiagnosisId").css({'border': '5px solid #EFB420',  'border-right': 'none'});
				if($j('.autocompleteField').is(':visible') ){
					$j('.autocompleteField').focus();
				}else{
					$j('#plusBtnId').focus();
				}
			}else if(rowId == 'plusEncounterRow'){
				console.log("this is the plus encounter row");
				$j('.dateListRow').removeClass("highlighted");
				$j("#plusEncounterRow").addClass("highPlusRow");
				$j("#plusEncounterColumn").css('border-right', '5px solid #EFB420');
				$j("#plusEncounterColumn").css({'border': '5px solid #EFB420', 'border-left': 'none'});
				$j("#plusEncounterLabelColumn").css({'border': '5px solid #EFB420',  'border-right': 'none'});
				$j('#plusEncounterBtnId').focus();				
			}else{				
				$j("#"+rowId).addClass("highDiagnosisListRow");				
				$j("#"+rowId).contents('td').css({'color': '#000000', 'border': '5px solid #EFB420', 'border-left': 'none', 'border-right': 'none'});				
				$j("#"+rowId).contents('td:last').css('border-right', '5px solid #EFB420');
				//focus on the delete button
				var deleteBtn = $j("#"+rowId).find('.deleteDiagnosisClick');
				if(deleteBtn == null || deleteBtn == 'undefined'){
					console.log("could not find the deleteBtn");					
				}else{
					deleteBtn.css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/z-red.png')");
					console.log("deletebtn has focus");
					deleteBtn.focus();
				}
			}
			$j("#"+rowId).contents('td:first').css('border-left', '5px solid #EFB420');
			
	}
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
		if ($j.findNotifyingDisease(notifyingDiseasesData, item.value) >= 0){			
			t = "<span style='font-weight:bold;color:Red;'>" + t + "</span>";
		}		
		return $j( "<li></li>" )
		  .data( "item.autocomplete", item )
		  .append( "<a>" + t + "</a>" )
		  .appendTo( ul );
	  };
    }
	
	$j.buildAutocomplete = function(autocompleteId){
		console.log("building: " + autocompleteId);
		var autocompleteObject = $j('#'+autocompleteId);
		if(autocompleteObject==null || autocompleteObject == 'undefined'){
			console.log("undefined autocompleteObject");
		}
		monkeyPatchAutocomplete();
		$j('#'+autocompleteId).autocomplete({
			source: function( request, response ) {
					var re  = $j.ui.autocomplete.escapeRegex(request.term);
					if(re.length>0){
						re = re + "+";
					}
					var matcher = new RegExp( re, "i" );
					
					filteredNonCodedDiagnosisArray = $j.grep( nonCodedDiagnosisData, function(value) {
						value = value.value || value;						
						return matcher.test( value ) || matcher.test( normalize( value ) );
					}); 	
					
					filteredDiagnosisArray = $j.grep( diagnosisData, function(item, index) {
						item = item.label || item.value || item;						
						return matcher.test( item ) || matcher.test( normalize( item ) );
					}); 
					response(filteredDiagnosisArray);
			}, 	 
			delay: 1,
			close: function(event, ui) {									
				if ($j('#addDiagnosisDiv').is(':visible')  || 
					$j('#confirmDiagnosisDiv').is(':visible')){						
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
			focus: function( event, ui ) {					
					disableAutocompleteEnter = true;
					event.preventDefault();
			},
			select: function( event, ui ) {
					event.stopPropagation();
					event.preventDefault();
					if(ui.item.label !== diagnosisObject.label ){
						diagnosisObject.label = ui.item.label;
						diagnosisObject.id = ui.item.value;		
						diagnosisObject.type = CODED;						
						$j('#'+autocompleteId).val(diagnosisObject.label);						
						setTimeout(function(){
							disableAutocompleteEnter = false;
						}, 100);
				    }
			}
		 });
		 
		$j( "#"+autocompleteId).val('');
		$j( "#"+autocompleteId).autocomplete({ minLength: 0 });
		$j( "#"+autocompleteId).autocomplete("search", "");
		
		$j( "#"+autocompleteId).autocomplete("option", "autoFocus", false);
		disableAutocompleteEnter = false;
		if(diagnosisObject.label.length>0){
			$j('#'+autocompleteId).val(diagnosisObject.label);
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}	
		
		$j('#'+autocompleteId).autocomplete({position: { my : "left top", at : "left bottom", offset : "1 1", collision: "fit", of : "#"+autocompleteId} });
		
		$j('#'+autocompleteId).keydown(function(event){ 
			if(event.keyCode ==13 && !disableAutocompleteEnter){
				event.stopPropagation();
				event.preventDefault();
				//capture the diagnosis
				if(diagnosisObject.id>0 && diagnosisObject.label.length>1){
					var diagnosisItem =  new Object();
					diagnosisItem.type=diagnosisObject.type;
					diagnosisItem.id=diagnosisObject.id;
					diagnosisItem.label=diagnosisObject.label;
					diagnosisArray.push(diagnosisItem);
					diagnosisObject =  new Object();
					diagnosisObject.type='';
					diagnosisObject.id=0;
					diagnosisObject.label='';
				}else{
					//we got NONCODED diagnosis
					var filteredCoded = filteredDiagnosisArray.length;
					if(filteredCoded <1){
						filteredCoded = 0;
					}
					var uncodedDiagnosis = $j('#'+autocompleteId).val();
					if(uncodedDiagnosis.length<3){
						return false;
					}
					$j("#codedMatches").text(filteredCoded + " ");			
					$j("#stringToMatch").text(' \"' + uncodedDiagnosis + '\"');										
					var $matchedDiagnosisList = $j('.existingDiagnosisList');
					$j('.matchedDiagnosisListRow').remove();
					for(var j=0; j<filteredNonCodedDiagnosisArray.length; j++){
						if(uncodedDiagnosis.toLowerCase() !== filteredNonCodedDiagnosisArray[j].value.toLowerCase()){
							var nonCodedDiagnosisItem = new Object();
							nonCodedDiagnosisItem.type=NONCODED;
							nonCodedDiagnosisItem.label=filteredNonCodedDiagnosisArray[j].value;
							nonCodedDiagnosisItem.id=0;
							filteredDiagnosisArray.push(nonCodedDiagnosisItem);
						}
					}
					var diagnosisItem = new Object();
					diagnosisItem.type=NONCODED;
					diagnosisItem.label=uncodedDiagnosis;
					diagnosisItem.id=0;
					filteredDiagnosisArray.push(diagnosisItem);
					var rowModal = null;
					var columnModal = null;
					//add the filtered CODED diagnosis
					for(var i=0; i<filteredDiagnosisArray.length; i++){						
						diagnosisItem = filteredDiagnosisArray[i];
						rowModal = $j(document.createElement('tr')).addClass('matchedDiagnosisListRow greenTextRow');										
						if (i % 2 == 0) { 
							rowModal.addClass('evenRow');
						} else {
							rowModal.addClass('oddRow');
						}
						rowModal.mouseover(function(){
							$matchedDiagnosisList.find('tr').removeClass('highlighted');
							$j(this).addClass('highlighted');
						});				
						rowModal.mouseout(function(){
							$j(this).removeClass('highlighted');
						});				
						columnModal = $j(document.createElement('td')).addClass('matchedDiagnosisListColumn');	
						var columnLabel=diagnosisItem.label;
						if(diagnosisItem.type == NONCODED){
							rowModal.removeClass('greenTextRow');
							rowModal.addClass('redTextRow');
							columnLabel = '(' + NONCODED + ') ' + columnLabel ; 
						}
						columnModal.append(columnLabel);
						rowModal.append(columnModal); 
						var hiddenInput = $j(document.createElement('input')).addClass('diagnosisIdClass')
						.attr({type: 'hidden', id: 'diagnosisId'+diagnosisItem.value})
						.val(diagnosisItem.value);
						rowModal.append(hiddenInput);
						hiddenInput = $j(document.createElement('input')).addClass('diagnosisTypeClass')
						.attr({type: 'hidden', id: 'diagnosisType'+diagnosisItem.type})
						.val(diagnosisItem.type);
						rowModal.append(hiddenInput);
						hiddenInput = $j(document.createElement('input')).addClass('diagnosisLabelClass')
						.attr({type: 'hidden', id: 'diagnosisLabel'+diagnosisItem.label})
						.val(diagnosisItem.label);
						rowModal.append(hiddenInput);
						rowModal.click(function(){																				
							console.log("select diagnosis");	
							//add the selected diagnosis to the main diagnosisArray and repaint the screen
							var selectedDiagnosisRow =  $j(this).closest('tr');
							$j.addSelectedDiagnosisRow(selectedDiagnosisRow);
							
						});
						$j('.existingDiagnosisList').append(rowModal);	
					}
					
					$j("#uncodedMessageArea" ).dialog("open");
					$j('#uncodedMessageArea').show();		
					$j('#uncodedMessageArea').css("visibility", "visible");
					return false;
				}
				//repaint addDiagnosisDiv
				$j.setupDiv('addDiagnosisDiv');		
			}
			
		});
		autocompleteObject.focus();
	};
	
	$j.hideAllDiv = function() {			
		for(i=0; i<divItems.length; i++){				
			var divItem = "#"+divItems[i];			
			$j(divItem).hide();
		}
		$j("#addProviderAutocomplete").autocomplete("close");
		$j("#autocompleteDiagnosis").autocomplete("close");		
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
	
	$j.setEncounterDateDiv = function() {
		prevDiv=null;
		nextDiv="addProviderDiv";				
		var firstRow = $j('.encounterDateList').find('tr').eq(0);
		if(typeof( firstRow ) !== "undefined"){
			console.log("firstRow= " + firstRow.text());
			firstRow.focus();			
		}else{
			console.log("firstRow is undefined" );
		}		
		$j('#right-arrow-yellow').show();		
	};
	
	// today/past date mouseovers
	$j('.dateListRow').mouseover(function(){
		$j(this).addClass('highlighted');
	});	
	$j('.dateListRow').mouseout(function(){
		$j(this).removeClass('highlighted');
	});
	
	$j('.dateListRow').click(function(event){
		console.log("a visit date was selected");
		var selectedDate = $j(this).children("td:first");
		if(selectedDate.length>0){
			var dateString = $j.trim(selectedDate.text());
			console.log("dateString" + dateString);
		}
		var receptionTdId = $j(this).children("input:first");
		if(receptionTdId.length>0){
			var receptionId = $j.trim(receptionTdId.val());
			console.log("receptionId=" + receptionId);			
			$j.removeAllDiagnosis();
			for(var i=0; i<patientDiagnosisData.length; i++){
				if(patientDiagnosisData[i].receptionEncounterId ==receptionId){
					encounterYear = patientDiagnosisData[i].receptionEncounterYear;
					encounterMonth = patientDiagnosisData[i].receptionEncounterMonth;
					encounterMonthLabel = monthData[encounterMonth-1];
					encounterDay = patientDiagnosisData[i].receptionEncounterDay;
					console.log("encounterDay="+encounterDay+"; encounterMonth="+encounterMonth+"; encounterMonthLabel="+encounterMonthLabel);
					console.log("found our array item: " + patientDiagnosisData[i].receptionEncounterDate);
					var patientObs = patientDiagnosisData[i].patientObservations.patientObservation;
					if(patientObs.length>0){
						for(var j=0; j<patientObs.length; j++){
							var diagnosisItem = new Object();
							diagnosisItem.type= patientObs[j].type;
							diagnosisItem.id= patientObs[j].id;
							diagnosisItem.label= patientObs[j].label;							
							diagnosisArray.push(diagnosisItem);
						}
					}
				}
			}
			setTimeout(function(){
				$j.setupDiv('addProviderDiv');
			}, 100);
			
		}
	});	
	
	
	var $diagnosisTableList = $j('#diagnosisTableListId');
	var selectedCapturedDiag = 0;
	var setSelectedCapturedDiag = function(item, arrow) {						
		if(diagnosisArray.length<1){
			//there are no diagnosis entered yet
			return;
		}
		selectedCapturedDiag = item;
		if (selectedCapturedDiag !== null) {
			if (selectedCapturedDiag < 3) {
				selectedCapturedDiag = 3;
			}
			console.log("tr.length=" + parseInt($diagnosisTableList.find('tr').length, 10));
			console.log("selectedCapturedDiag=" + selectedCapturedDiag);
			if (selectedCapturedDiag >= $diagnosisTableList.find('tr').length) {
			  selectedCapturedDiag = $diagnosisTableList.find('tr').length - 2;
			  if($j('#right-arrow-yellow').is(':visible')){			 
				$j.highlightRow("right-arrow-yellow");
			  }else if($j('#checkmark-yellow').is(':visible')){			 
				$j.highlightRow("checkmark-yellow");
			  }
			  return;
			  
			}
			var selectedRow = $diagnosisTableList.find('tr').eq(selectedCapturedDiag);	
			if(selectedRow !==null && selectedRow !== 'undefined'){
				if(selectedRow.hasClass('smallerspacer') || selectedRow.hasClass('spacer')){
					console.log("spacer row was selected");
					if(arrow == 'up'){
						setSelectedCapturedDiag(selectedCapturedDiag - 1, 'up');	
					}else{
						setSelectedCapturedDiag(selectedCapturedDiag + 1, 'down');
					}
					return;
				}else{					
					$j.highlightRow(selectedRow[0].id);
				}
			}
		}		  		
	};
	
	var $dateList = $j('.encounterDateList');
	var selectedDate = 0;
	var setSelectedDate = function(item) {		
		selectedDate = item;
		if (selectedDate !== null) {
			if (selectedDate < 0) {
				selectedDate = 0;
			}
			if (selectedDate >= $dateList.find('tr').length) {			 
			  $j.highlightRow("plusEncounterRow");
			}else{
				$dateList.find('tr').removeClass('highlighted').eq(selectedDate).addClass('highlighted');												
			}	
		}		  		
	};
	
	$j(document).keydown(function(event) {		
		if ($j('#encounterDateDiv').is(':visible') ){
			if (event.keyCode == KEYCODE_ARROW_UP){				
				console.log("up arrow");
				$j('.rowToHighlight').removeClass("highDiagnosisListRow");
				$j("#plusEncounterRow").removeClass("highPlusRow");				
				$j('.rowToHighlight').contents('td').css('border', 'none');	
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
			  var rowSelected = $j('.highPlusRow');		
			  if(rowSelected.length>0){
				$j("#plusEncounterBtnId").click();
			  }else if((selectedDate!==null)){			
				window.setTimeout(function(event){
					var selectedRow = $dateList.find('tr').eq(selectedDate);								
					var selectedRowId = selectedRow.attr('id');				
					$j("#"+selectedRowId).click();		
				}, 100);		
			  }				  		  		  
			}	
		}else if ($j('#dialog-confirm').is(':visible') ){
			//the delete confirmation modal dialog is displayed
			return;			
		}else if ($j('#dialog-urgentDisease').is(':visible') ){
			//the urgent disease modal dialog is displayed
			return;			
		}else if ($j('#dialog-ageRestrictedDisease').is(':visible') ){
			//the age restricted disease modal dialog is displayed
			return;			
		}else if ($j('#addDiagnosisDiv').is(':visible') ){
			if($j('.autocompleteField').is(':visible') ){				
				if(event.keyCode == KEYCODE_ESC){
					console.log("KEYCODE_ESC has been pressed");					
					$j('.autoBuiltColumn').remove();					
				}
			}
			if (event.keyCode ==KEYCODE_ARROW_UP){
				if($j('.autocompleteField').is(':visible') ){						
					$j("#plusDiagnosisAutocomplete").focus();
				}
				//user pressed up arrow		
				var rowSelected = $j('.highPlusRow');
				if(rowSelected.length>0){
					return;
				}
				if(selectedCapturedDiag === null){
					selectedCapturedDiag=1;
				}
				setSelectedCapturedDiag(selectedCapturedDiag - 1, 'up');				
				event.preventDefault();
			}else if (event.keyCode ==KEYCODE_ARROW_DOWN){
				if($j('.autocompleteField').is(':visible') ){						
					$j("#plusDiagnosisAutocomplete").focus();
				}
				//user pressed down arrow							
				var rowSelected = $j('.highDiagnosisListRow');
				if(rowSelected.length<1){
					return;
				}
				if(selectedCapturedDiag === null){
					setSelectedCapturedDiag(0, 'down');
				}else{					
					setSelectedCapturedDiag(selectedCapturedDiag + 1, 'down');
				}				
				event.preventDefault();
			}else if (event.keyCode ==KEYCODE_ARROW_LEFT){
				//user pressed left arrow							
				$j('#plusDiagnosisRow').click();
				event.preventDefault();
			}else if (event.keyCode ==KEYCODE_ARROW_RIGHT){
				if($j('.autocompleteField').is(':visible') ){						
					$j('.autoBuiltColumn').remove();
				}
				//user pressed right arrow							
				setSelectedCapturedDiag(0, 'down');
				event.preventDefault();
			} else if (event.keyCode ==KEYCODE_ENTER){
				console.log("addDiagnosisDiv KEYCODE_ENTER");	
				event.stopPropagation();
				event.preventDefault();
				var rowSelected = $j('.highDiagnosisListRow');
				if(rowSelected.length>0){
					rowSelected.find('.deleteDiagnosisClick').click();
				}else if ((rowSelected = $j('.highPlusRow')).length>0){
					$j("#plusBtnId").click();
				} else if ((rowSelected = $j('.highRightArrowYellow')).length>0){
					$j("#right-arrow-yellow").click();
				}  else if ((rowSelected = $j('.highCheckmarkYellow')).length>0){
					$j("#checkmark-yellow").click();
				}
			} 
		}
	});
	
	
	$j.showRightArrow = function() {		
		if(diagnosisArray.length>0){
			$j('#right-arrow-white').hide();
			$j('#right-arrow-yellow').show();
		}else{
			$j('#right-arrow-yellow').hide();
			$j('#right-arrow-white').show();
		}
	};
	
	$j.showUrgentMessage = function(message) {
		if(message.length>0){
			//$j("#notifiableDiseaseMsg").text(message);
			$j("#dialog-urgentDisease").dialog({
				autoOpen: false,
				resizable: false,					
				height: 240,
				width: 600,
				modal: true,
				closeOnEscape: true,	
				buttons: [								
					{
						text: "",
						label: "okButton",
						id: "okBtn",
						click: function() {									
							$j("#dialog-urgentDisease").hide();	
							$j(this).dialog("close");									
						}
					}			
				]		
				, 
				focus: function(event, ui){
					console.log("show urgent message has focus");
					$j("#okBtn").focus();
				},
				open: function(event, ui){								
					$j(".ui-dialog").css("padding", "0");	
					$j(".ui-dialog-buttonpane").css("background", "gray");					
					$j(this).parent().children(".ui-widget-header").css("background", "#009384");
					$j(".ui-dialog-buttonset").css("width", "100%");	
					
					$j("#okBtn").addClass('modalConfirmBtn');
					$j("#okBtn").css("border", "0");
					$j("#okBtn").css("float", "right");
					$j("#okBtn").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png') center center no-repeat");
					$j('#okBtn').css('border', '5px solid #EFB420');
					$j("#okBtn").focus();							
					
				},
				close: function(event, ui){	
					console.log("dialog-urgentDisease is closing");
					
					if ($j('#dialog-ageRestrictedDisease').dialog("isOpen") ){
						console.log("dialog-ageRestrictedDisease is open");
						$j('#dialog-ageRestrictedDisease').dialog("moveToTop");
						return;
					}
					
					$j.highlightRow("checkmark-yellow");
					$j('#checkmark-yellow').focus();
					
				}
			});
			
			$j("#dialog-urgentDisease").dialog("open");
			$j("#dialog-urgentDisease").css("visibility", "visible");
			$j("#dialog-urgentDisease").show();
		}
	}
	
	$j.showAgeRestrictedMessage = function(message) {
		if(message.length>0){
			//$j("#notifiableDiseaseMsg").text(message);
			$j("#dialog-ageRestrictedDisease").dialog({
				autoOpen: false,
				resizable: false,					
				height: 340,
				width: 700,
				modal: true,
				closeOnEscape: true,	
				buttons: [								
					{
						text: "",
						label: "okButton",
						id: "okBtnAgeRestricted",
						click: function() {									
							$j("#dialog-ageRestrictedDisease").hide();	
							$j(this).dialog("close");									
						}
					}			
				]		
				, 
				focus: function(event, ui){
					console.log("ageRestrictedDisease has focus");
					$j("#okBtnAgeRestricted").focus();
				},
				open: function(event, ui){								
					var patientAgeMsg ="";
					patientAgeMsg = $j.sprintf(jsPatientAgeMsg, patientAge, patientBirthdate);	
					$j('#patientAgeMsg').text(patientAgeMsg);
					$j(".ui-dialog").css("padding", "0");	
					$j(".ui-dialog-buttonpane").css("background", "gray");					
					$j(this).parent().children(".ui-widget-header").css("background", "#009384");
					$j(".ui-dialog-buttonset").css("width", "100%");	
					
					$j("#okBtnAgeRestricted").addClass('modalConfirmBtn');
					$j("#okBtnAgeRestricted").css("border", "0");
					$j("#okBtnAgeRestricted").css("float", "right");
					$j("#okBtnAgeRestricted").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png') center center no-repeat");
					$j('#okBtnAgeRestricted').css('border', '5px solid #EFB420');
					//$j("#okBtnAgeRestricted").focus();							
					
				},
				close: function(event, ui){	
					console.log("dialog-ageRestrictedDisease is closing");
					if ($j('#dialog-urgentDisease').dialog("isOpen") ){
						console.log("dialog-urgentDisease is open");
						$j('#dialog-urgentDisease').dialog("moveToTop");
						return;
					}
					
					$j.highlightRow("checkmark-yellow");
					$j('#checkmark-yellow').focus();
					
				}
			});
			
			$j("#dialog-ageRestrictedDisease").dialog("open");
			$j("#dialog-ageRestrictedDisease").css("visibility", "visible");
			$j("#dialog-ageRestrictedDisease").show();
		}
	}
	
	$j.setConfirmDiagnosisDiv = function() {
		$j.removeHighlightedMenu();			
		$j("#confirmMenu").addClass('highlighted');		
		$j('.autoBuiltColumn').remove();
		$j('#confirmMessageArea').show();	
		$j('#confirmMessageArea').css("visibility", "visible");
		
		$j('#right-arrow-white').hide();	
		$j('#right-arrow-yellow').hide();
		$j('#checkmark-yellow').show();
		
		disableAutocompleteEnter=false;
		var messageLabel ="";
		var ageRestrictedMessageLabel = "";
		if(diagnosisArray.length>0){			
			$j('.notifiableDiseaseListRow').remove();
			$j('.ageRestrictedDiseaseListRow').remove();
			for(var i=0; i<diagnosisArray.length; i++){				
				if ($j.findNotifyingDisease(urgentDiseasesData, diagnosisArray[i].id) >= 0){
					messageLabel = messageLabel + diagnosisArray[i].label + "\n";	
					var rowDisease = $j(document.createElement('tr')).addClass('notifiableDiseaseListRow');
					var columnDisease = $j(document.createElement('td')).append(diagnosisArray[i].label);	
					rowDisease.append(columnDisease);
					$j('.notifiableDiseaseList').append(rowDisease);
				}else if($j.findAgeRestrictedDisease(ageRestrictedDiseasesData, diagnosisArray[i].id) >= 0){
					ageRestrictedMessageLabel = ageRestrictedMessageLabel + diagnosisArray[i].label + "\n";	
					var rowDisease = $j(document.createElement('tr')).addClass('ageRestrictedDiseaseListRow');
					var columnDisease = $j(document.createElement('td')).append(diagnosisArray[i].label);	
					rowDisease.append(columnDisease);
					$j('.ageRestrictedDiseaseList').append(rowDisease);
				}				
			}			
		}
		var messageDisplayed=false;
		if(messageLabel.length>0){
				$j.showUrgentMessage(messageLabel);		
				messageDisplayed =true;
		}
		if(ageRestrictedMessageLabel.length>0){
				$j.showAgeRestrictedMessage(ageRestrictedMessageLabel);		
				messageDisplayed=true;
				//$j("#okBtnAgeRestricted").focus();
		}
		if(!messageDisplayed){
			$j.highlightRow("checkmark-yellow");
			$j('#checkmark-yellow').focus();
		}
		
		
		
	};
	
	
	
	$j('#addProviderAutocomplete').keydown(function(event){ 
		if(event.keyCode ==13 && !disableAutocompleteEnter){
			event.stopPropagation();
			event.preventDefault();
			$j('#right-arrow-yellow').click();	
		}
		
	});
	
	$j.setAddProviderDiv = function() {
		prevDiv="encounterDateDiv";
		nextDiv="addDiagnosisDiv";		
		disableAutocompleteEnter=false;
		$j("#providerMenu").addClass('highlighted');
		$j('#left-arrow-white').show();
		
		
		
		$j("input#addProviderAutocomplete").autocomplete({
				source:providersData, 	
				delay: 1,				
				//autoFocus: true,					
				close: function(event, ui) {					
					if ($j('#addProviderDiv').is(':visible') ){						
						event.preventDefault();
					}					
				}, 
				focus: function(event, ui) {
					//do not replace the text fields value
					$j("#addProviderAutocomplete").focus();
					disableAutocompleteEnter = true;
					event.preventDefault();
				},	
				select: function(event, ui) {																
						event.stopPropagation();	
						event.preventDefault();	
						if((providerId==0) || (ui.item.value !== providerId) ){	
							providerId= ui.item.value
							providerName = ui.item.label;
							console.log("providerName=" + providerName);
							console.log("providerId=" + providerId);
							$j('#addProviderAutocomplete').val(ui.item.label);
							$j('#right-arrow-white').hide();
							$j('#right-arrow-yellow').show();
						}
						$j("input#addProviderAutocomplete" ).autocomplete("search", "");
						//$j.highlightRow("right-arrow-yellow");
						$j('#right-arrow-yellow').css('border', '5px solid #EFB420');	
						$j('#right-arrow-yellow').focus();													
				}
		});  
		$j( "input#addProviderAutocomplete" ).addClass('inputField');
		$j( "input#addProviderAutocomplete" ).val('');
		$j( "input#addProviderAutocomplete" ).autocomplete({ minLength: 0 });		
		$j( "input#addProviderAutocomplete" ).autocomplete({position: { my : "left top", at : "left bottom", offset : "1 1", collision: "fit", of : "#addProviderAutocomplete"} });		
		$j( "input#addProviderAutocomplete" ).autocomplete("search", "");
		if(providerName.length>0){
			$j( "input#addProviderAutocomplete" ).val(providerName);
			$j( "input#addProviderAutocomplete" ).autocomplete("option", "autoFocus", false);
			$j('#right-arrow-yellow').show();
			disableAutocompleteEnter = false;
		}else{
			$j( "input#addProviderAutocomplete" ).autocomplete("option", "autoFocus", true);
			$j('#right-arrow-white').show();
			disableAutocompleteEnter = true;
		}
		
		$j('#addProviderAutocomplete').focus();
	};
	
	$j.setAddDiagnosisDiv = function() {
		prevDiv="encounterDateDiv";
		nextDiv="addDiagnosisDiv";		
		disableAutocompleteEnter=false;
		$j("#diagnosisMenu").addClass('highlighted');
		$j('#left-arrow-white').show();	

		$j('.diagnosisDateListRow').remove();		
		$j('.diagnosisListRow').remove();		
		$j('.autoBuiltColumn').remove();
			
		$j.showRightArrow();
		$j('#right-arrow-yellow').css('border', '0');
		var dateLabel = encounterDay + "-" + 
			encounterMonthLabel + "-" + 
			encounterYear;
				
		var diagnosisForLabel = $j.sprintf(jsDiagnosisFor, dateLabel);
		var rowDiagnosis = null;
		var columnDiagnosis = null;	
	
		//add the diagnoses list Header
		rowDiagnosis = $j(document.createElement('tr')).addClass('diagnosisDateListRow diagnosisForHeader');	
		columnDiagnosis = $j(document.createElement('td')).addClass('firstDiagnosisListColumn leftalign').css("padding", "1px 5px 1px 5px");
		columnDiagnosis.attr('colspan', '2');
		columnDiagnosis.append($j(document.createElement('span')).addClass('leftalign boldFont').text(diagnosisForLabel));				
		rowDiagnosis.append(columnDiagnosis);
		var secondColumnHeader = $j(document.createElement('td')).css("width", "37px");	
		rowDiagnosis.append(secondColumnHeader);
		//rowDiagnosis.css("");
		$j('.diagnosisTableList').append(rowDiagnosis);		
		
		// add the doctor line		
		var rowDoctor = $j(document.createElement('tr')).addClass('diagnosisDateListRow diagnosisForHeader');	
		var columnDoctor = $j(document.createElement('td')).addClass('firstDiagnosisListColumn leftalign').css("padding", "1px 5px 1px 5px");	
		columnDoctor.attr('colspan', '2');
		columnDoctor.append($j(document.createElement('span')).addClass('leftalign normalFont').text(providerLabel + ": " + providerName));				
		rowDoctor.append(columnDoctor);
		
		var secondColumnDoctor = $j(document.createElement('td')).css("width", "37px");	
		rowDoctor.append(secondColumnDoctor);
		
		$j('.diagnosisTableList').append(rowDoctor);				
		
		
		rowDiagnosis = $j(document.createElement('tr')).addClass('diagnosisListRow spacer');	
		$j('.diagnosisTableList').append(rowDiagnosis);
		//add entered diagnosis
		$j.each(diagnosisArray, function(i, diagnosis){			
			rowDiagnosis = $j(document.createElement('tr')).addClass('diagnosisListRow rowToHighlight');	
			rowDiagnosis.attr('id', 'diagnosisRow' + diagnosis.id);
			if (i % 2 == 0) { 
				rowDiagnosis.addClass('evenRow');
			} else {
				rowDiagnosis.addClass('oddRow');
			}
			var hiddenInput = $j(document.createElement('input')).addClass('diagnosisIdClass')
			.attr({type: 'hidden', id: 'diagnosisId'+diagnosis.id})
			.val(diagnosis.id);
			rowDiagnosis.append(hiddenInput);
			hiddenInput = $j(document.createElement('input')).addClass('diagnosisLabelClass')
			.attr({type: 'hidden', id: 'diagnosisLabel'+diagnosis.label})
			.val(diagnosis.label);
			rowDiagnosis.append(hiddenInput);
			var columnLabel = diagnosis.label;
			if(diagnosis.type == NONCODED){
				columnLabel = '(' + NONCODED + ') ' + columnLabel ; 
			}
			columnDiagnosis = $j(document.createElement('td')).addClass('diagnosisListColumn firstDiagnosisListColumn leftalign').text(columnLabel);	
			if ($j.findNotifyingDisease(urgentDiseasesData, diagnosis.id) >= 0){
				columnDiagnosis.addClass('highlightNotifiableDisease');
			}else{
				columnDiagnosis.addClass('greyLostFocusColor');
			}
			rowDiagnosis.append(columnDiagnosis);	
			
			//append the Delete button
			var secondColumnDiagnosis = $j(document.createElement('td')).addClass('diagnosisListColumn');	
			var cssObj = {
					'border' : "0",					
					'height' : "37", 
					'width' :  "37"
			}	
			var deleteDiagnosisBtn = $j(document.createElement('button'))
			.addClass('deleteDiagnosisClick')
			.click(function(event){
				//delete this diagnosis row
				var diagnosisId = $j(this).closest('tr').find('.diagnosisIdClass').val();
				var diagnosisLabel = $j(this).closest('tr').find('.diagnosisLabelClass').val();
				var closestTr = $j(this).closest('tr');
				$j( "#dialog-confirm" ).dialog({
					resizable: false,					
					height: 140,
					width: 600,
					modal: true,
					closeOnEscape: true,	
					buttons: [								
						{
							text: removeDiagnosisLabel,
							label: "remove",
							id: "removeBtn",
							click: function() {						
								$j.removeDiagnosis(diagnosisId, diagnosisLabel);							
								closestTr.remove();								
								//repaint addDiagnosisDiv
								$j.setupDiv('addDiagnosisDiv');	
								$j(this).dialog( "close" );
							}
						},
						{
							text: cancelLabel,
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
						$j(this).parent().children(".ui-widget-header").css("background", "#009384");
						$j(".ui-dialog-buttonset").css("width", "100%");	
						
						var cssObj = {
							'border' : "0",					
							'height' : "40", 
							'width'  : "160",
							'color'  : "black"
						}								
						$j("#removeBtn").css(cssObj);
						$j("#removeBtn").css("width", "300px");
						$j("#removeBtn").css("float", "left");
						$j("#removeBtn").css("margin-left", "20px");
						$j("#removeBtn").focus();	

						$j("#cancelBtn").css(cssObj);
						$j("#cancelBtn").css("float", "right");
						$j("#cancelBtn").css("margin-right", "20px");
						
					}
				});
			});	
			deleteDiagnosisBtn.css(cssObj);
			deleteDiagnosisBtn.attr('type', 'button');
			deleteDiagnosisBtn.attr('id', 'deleteDiagnosisBtnId');
			deleteDiagnosisBtn.attr('align', 'left');
			deleteDiagnosisBtn.css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/x-grey.png')");
			
			secondColumnDiagnosis.append(deleteDiagnosisBtn);
			rowDiagnosis.append(secondColumnDiagnosis);	
			rowDiagnosis.click(function(){
				$j.highlightRow(this.id);
			});
			
			$j('.diagnosisTableList').append(rowDiagnosis);
			//add a smallerspacer row
			rowDiagnosis = $j(document.createElement('tr')).addClass('diagnosisListRow smallerspacer');	
			
			$j('.diagnosisTableList').append(rowDiagnosis);
		});
		
		//$j.pulsate("plusBtnId");
		$j('#plusDiagnosisRow').click();
		
		$j('#plusBtnId').unbind('click');		
		$j('#plusBtnId').click(function(event){
			console.log("add another diagnosis");
			$j.stopPulsate(this.id);
			$j('.autoBuiltColumn').remove();
			var autocompleteColumn = $j(document.createElement('td')).addClass('autoBuiltColumn');	
			var autocompleteInput = $j(document.createElement('input'))
			.addClass('inputField highlighted autocompleteField')
			.attr({type: 'text', id: 'plusDiagnosisAutocomplete'});	
			autocompleteColumn.append(autocompleteInput);
			
			$j("#autocompleteRowId").append(autocompleteColumn);
			$j.buildAutocomplete('plusDiagnosisAutocomplete');
		});
		
		$j('#plusBtnId').focus();
	};
	
	
	
	
	$j('.rowToHighlight').click(function() {	
			console.log("rowToHighlight click: " + this.id);
			$j.highlightRow(this.id);
			
	});
	
	$j("#plusEncounterBtnId").click(function(event){
		alertUserAboutLeaving = false;
		window.location.href=pageContextAddress + '/module/patientregistration/workflow/primaryCareReceptionEncounter.form?nextTask=primaryCareVisitEncounter.form&createNew=true&patientId=' + patientId;
	});
	
	$j.validateDiagnosisDivData = function() {
		if(diagnosisObject.id>0 && diagnosisObject.label.length>1){
			var diagnosisItem =  new Object();
			diagnosisItem.type= diagnosisObject.type;
			diagnosisItem.id=diagnosisObject.id;
			diagnosisItem.label=diagnosisObject.label;
			diagnosisArray.push(diagnosisItem);
			diagnosisObject =  new Object();
			diagnosisObject.type='';
			diagnosisObject.id=0;
			diagnosisObject.label='';
		}else{
			console.log("we got UNCODED diagnosis");
			$j("#codedMatches").text("3 ");			
			$j("#stringToMatch").text(' \"' + $j("#autocompleteDiagnosis").val() + '\"');
			$j("#uncodedMessageArea" ).dialog("open");
			$j('#uncodedMessageArea').show();		
			$j('#uncodedMessageArea').css("visibility", "visible");
			return false;
		}
		return true;
	};
	
	$j.validateAddProviderDivData = function(){
		providerName = $j('#addProviderAutocomplete').val();
		providerName = $j.trim(providerName);
		if(providerName.length<1){
			alert(scriptMessages['invalidProviderName']);
			$j('#right-arrow-yellow').hide();
			$j.setAddProviderDiv();
			return false;
		}
		return true;
	};
	
	$j.validateDivData = function() {
		//place holder for validating entry data		
		if ($j('#diagnosisDiv').is(':visible') ){						
			return $j.validateDiagnosisDivData();			
		}else if ($j('#addProviderDiv').is(':visible') ){						
			return $j.validateAddProviderDivData();			
		}
		
		return true;
	};
	
	$j.setupDiv = function(devId) {
		$j.hideAllDiv();	
		$j.removeHighlightedMenu();	
		$j.hideNavigationArrows();
		$j('#cross-red').show();
		$j("#"+devId).css("visibility", "visible");
		$j("#"+devId).show();
		if(devId=='encounterDateDiv'){
			$j.setEncounterDateDiv();
		}else if(devId=='addProviderDiv'){
			$j.setAddProviderDiv();
		}else if(devId=='addDiagnosisDiv'){
			$j.setAddDiagnosisDiv();
		}else if(devId=='confirmDiagnosisDiv'){
			$j.setConfirmDiagnosisDiv();
		}
	};
	
	$j("#uncodedMessageArea").dialog({
			autoOpen: false,
			height: 400,
			width: 600,
			modal: true,
			closeOnEscape: true,	
			buttons: [
				{
					text: "",
					label: "ok",
					id: "okBtnConf",
					click: function() {												
						console.log("capture the highlighted diagnosis");
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
					'height' : "40", 
					'width' :  "50"
				}								
				$j('#overflowDiv').scrollTop(0);
				$j("#okBtnConf").css(cssObj);
				$j("#okBtnConf").css("float", "right");
				$j("#okBtnConf").css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-yellow.png')");
				$j("#okBtnConf").focus();			
			}, 
			close: function(event, ui){	
				console.log("close autocomplete");
				$j.setupDiv('addDiagnosisDiv');	
			}
	});		
	
	var $confirmDiagnosisList = $j('#confirmDiagnosisList');
	var selectedDiagItem = 0;
	
	var setSelectedDiagItem = function(item) {				
		selectedDiagItem = item;
		if (selectedDiagItem !== null) {
			if (selectedDiagItem < 0) {
				selectedDiagItem = 0;
			}
			if (selectedDiagItem >= $confirmDiagnosisList.find('tr').length) {
			  selectedDiagItem = $confirmDiagnosisList.find('tr').length - 1;
			}			
			$confirmDiagnosisList.find('tr').removeClass('highlighted').eq(selectedDiagItem).addClass('highlighted');
			$j('#overflowDiv').scrollTop(parseInt(selectedDiagItem, 10) * 10);												
		}		  		
	};
	
	$j(document).keydown(function(event) {		
		if ($j('#uncodedMessageArea').is(':visible') ){
			if (event.keyCode ==38){
				//user pressed up arrow				
				if(selectedDiagItem === null){
					selectedDiagItem=1;
				}
				setSelectedDiagItem(selectedDiagItem - 1);				
				event.preventDefault();
			}else if (event.keyCode ==40){
				//user pressed down arrow							
				if(selectedDiagItem === null){
					setSelectedDiagItem(0);
				}else{
					setSelectedDiagItem(selectedDiagItem + 1);
					
				}				
				event.preventDefault();
			}else if (event.keyCode == 13 ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();			  
			  if((selectedDiagItem!==null)){							  
				console.log("maybe the click event?");	
				var selectedRow =  $confirmDiagnosisList.find('tr').eq(selectedDiagItem);
				$j.addSelectedDiagnosisRow(selectedRow);
			  }				  		  		  
			}	
		}
	});
	
	
	$j('#right-arrow-yellow').click(function(event){						
		console.log("right-arrow-yellow.click");
		if ($j('#addDiagnosisDiv').is(':visible') ){						
			console.log("just change the right arrows");
			$j.setConfirmDiagnosisDiv();
			return;
		}
		if($j.validateDivData()){										
			if(nextDiv !== null){								
				$j.setupDiv(nextDiv);				
			}	
		}		
		
	});
	
	$j('#checkmark-yellow').click(function(event){						
		console.log("checkmark-yellow.click");
		if ($j('#dialog-urgentDisease').is(':visible') ){	
			console.log("dialog-urgentDisease is visible");
			return;
		}else if ($j('#dialog-ageRestrictedDisease').is(':visible') ){	
			console.log("dialog-ageRestrictedDisease is visible");
			return;
		}
		
		var diagnosisList='';
		//submit the array of diagnosis to web controller	
		if(diagnosisArray.length>0){
			for(var i=0; i<diagnosisArray.length; i++){
				var diagnosisItem = new Object();
				diagnosisItem = diagnosisArray[i];
				var diagnosisCode='';
				var diagnosisId = diagnosisItem.id;
				if(diagnosisId !==null && diagnosisId !=='undefined'
					&& (parseInt(diagnosisId,10) > 0)){					
					diagnosisCode=CODED;
				}else{
					diagnosisId=0;
					diagnosisCode=NONCODED;
				}
				diagnosisList =diagnosisList + diagnosisCode + ',' 
								+ diagnosisId + ',' 
								+ diagnosisItem.label + ';';
			}
			$j('#listOfDiagnosis').val(diagnosisList);
			$j('#hiddenEncounterYear').val(encounterYear);
			$j('#hiddenEncounterMonth').val(encounterMonth);
			$j('#hiddenEncounterDay').val(encounterDay);
			console.log("providerId=" + providerId);
			$j('#hiddenProviderId').val(providerId);
			alertUserAboutLeaving = false;
			$j('#diagnosisForm').submit();
		}
	});
	
	
	$j('#left-arrow-white').click(function(event){											
		if(prevDiv !== null){			
			$j.setupDiv(prevDiv);					
		}													
	});
	
	$j.setupDiv('encounterDateDiv');
	//change the left lower corner red X with the reload image
	$j("#cross-red").attr('src', pageContextAddress + '/moduleResources/patientregistration/images/reload-arrow.png');
	$j('#cross-red').click(function(event){
		alertUserAboutLeaving = false;
		window.location.href=pageContextAddress + '/module/patientregistration/workflow/primaryCareVisitTask.form';
	});
	
	if(todayDiagnosisData.length>0 && diagnosisArray.length<1){		
		for(var i=0; i<todayDiagnosisData.length; i++){
			var diagnosisItem = new Object();
			diagnosisItem = todayDiagnosisData[i];
			diagnosisArray.push(diagnosisItem);
		}    
		$j.setupDiv('addProviderDiv');
	}
	
	var alertUserAboutLeaving = true;
	
	$j(window).bind('beforeunload', function(e) {
		if (alertUserAboutLeaving) {
			return leavePageAlert;
		}else {
			return;
		}
	});
});	