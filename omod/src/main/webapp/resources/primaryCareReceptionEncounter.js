$j(document).ready(function(){	

	var prevDiv ='';
	var nextDiv='';
	var CODED = 'CODED';
	var NONCODED = 'NON-CODED';
	var FOREVER = 180; // 3 minutes, longer than the normal session timeout
	
	var patientDiagnosis ='';
	var obsObject = new Object();
	obsObject.type='';
	obsObject.conceptName='';
	obsObject.conceptId=0;
	obsObject.id=0;
	obsObject.label='';
	var obsArray = new Array();

	var divItems = new Array("encounterDateDiv",
							 "yearDiv",
							 "monthDiv",
							 "dayDiv",
							 "paymentDiv",
							 "receiptDiv",
							 "confirmDiv",
							 "dialog-confirm",							 
							 "confirmMessageArea"
	);
	
	var leftMenuItems = new Array("encounterDateMenu", 										
								  "paymentMenu", 
								  "receiptMenu",
								  "confirmMenu"
	);
	
	var navigationArrows = new Array("cross-red", 
									"left-arrow-white",
									"right-arrow-white",
									"right-arrow-yellow",
									"checkmark-yellow"
	);
	
	
	$j.pulsate = function(elementId) {
		$j("#"+ elementId).effect( "pulsate", {times:FOREVER}, 2000);
	};
	
	$j.stopPulsate = function(elementId) {
		$j("#"+ elementId).stop( true, false);		
		$j("#"+ elementId).css('display', 'block');
	};
	
	$j.removeAllDiagnosis = function() {		
		for(var i=0; i<obsArray.length; i++){			
			obsArray.splice(i,1);				
		}	
	    obsArray = new Array();		 
	};
	
	$j.removeObs = function(obsId, obsLabel, obsType) {
		if((obsId.length>0 || obsLabel.length>0 || obsType.length>0)
			&& (obsArray.length>0)){
			for(var i=0; i<obsArray.length; i++){
				var diagnosisItem = new Object();
				diagnosisItem = obsArray[i];
				if(diagnosisItem.id == obsId){
					obsArray.splice(i,1);
					break;					
				}else if(diagnosisItem.label == obsLabel){
					obsArray.splice(i,1);		
					break;
				}else if(diagnosisItem.type == obsType){
					obsArray.splice(i,1);		
					$j.removeObs(obsId, obsLabel, obsType);
					break;
				}
			}			
		}
	};
	
	$j.hideAllDiv = function() {			
		for(i=0; i<divItems.length; i++){				
			var divItem = "#"+divItems[i];			
			$j(divItem).hide();
		}
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
		nextDiv="paymentDiv";		
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
		$j.setupDiv('paymentDiv');
	});
	$j("#pastDateRow").click(function(event){		
		$j.setupDiv('yearDiv');
	});
	
	$j.setPaymentDiv = function() {
		prevDiv="encounterDateDiv";
		nextDiv="receiptDiv";				
		$j("#paymentMenu").addClass('highlighted');	
		setSelectedPayment(0);
		$j('#left-arrow-white').show();
		$j('#right-arrow-yellow').show();
	};
	
	$j('.paymentListRow').mouseover(function(){
		$paymentRows.find('tr').removeClass('highlighted');
		$j(this).addClass('highlighted');
	});	
	$j('.paymentListRow').mouseout(function(){
		$j(this).removeClass('highlighted');
	});	

	$j(".paymentListRow").click(function() {
	  var paymentSelectedId = $j(this).find("input").val();		 	 
	  console.log("paymentSelectedId=" + paymentSelectedId);
	  if(parseInt(paymentSelectedId, 10) > 0){
		var selectedPaymentObject = new Object();
		selectedPaymentObject.type=CODED;
		selectedPaymentObject.id = paymentSelectedId;
		selectedPaymentObject.conceptName = paymentConceptName;
		selectedPaymentObject.conceptId = paymentConceptId;
		var paymentLabel = $j(this).find("td").text();	
		 console.log("paymentLabel=" + paymentLabel);
		if(paymentLabel.length > 0){
			selectedPaymentObject.label=paymentLabel; 
		}
		$j.removeObs(paymentSelectedId, paymentLabel, CODED);
		obsArray.push(selectedPaymentObject);
	  }
	  $j('#right-arrow-yellow').click();	
	});
	
	var $paymentRows = $j("#paymentTable");	
	$paymentRows.find('tr').removeClass('highlighted');
	var selectedPayment = null;
	var setSelectedPayment = function(item) {				
		selectedPayment = item;
		if (selectedPayment !== null) {
			if (selectedPayment < 0) {
				selectedPayment = 0;
			}
			if (selectedPayment >= $paymentRows.find('tr').length) {
			  selectedPayment = $paymentRows.find('tr').length - 1;
			}			
			$paymentRows.find('tr').removeClass('highlighted').eq(selectedPayment).addClass('highlighted');												
		}		  		
	};
	$j(document).keydown(function(event) {		
		if ($j('#paymentDiv').is(':visible') ){
			if (event.keyCode == KEYCODE_ARROW_UP){							
				if(selectedPayment === null){
					selectedPayment=1;
				}
				setSelectedPayment(selectedPayment - 1);				
				event.preventDefault();
			}else if (event.keyCode == KEYCODE_ARROW_DOWN){							
				if(selectedPayment === null){
					setSelectedPayment(0);
				}else{
					setSelectedPayment(selectedPayment + 1);
				}				
				event.preventDefault();
			}else if (event.keyCode == KEYCODE_ENTER ) {
			  //User pressed enter key.
			  event.stopPropagation();
			  event.preventDefault();		
			  event.stopImmediatePropagation();			  
			  if((selectedPayment!==null)){			
				window.setTimeout(function(event){
					var selectedRow = $paymentRows.find('tr').eq(selectedPayment);								
					//var selectedRowId = selectedRow.attr('id');		
					var selectedRowId = selectedRow.find("input").val();	
					console.log("selectedRowId=" + selectedRowId);
					$j("#" + selectedRow.attr('id')).click();		
				}, 100);	
			  }				  		  		  
			}	
		}
	});
	
	$j("#receiptInput").keypress(function(event) {
		if(event.keyCode == KEYCODE_ENTER){
			event.preventDefault();		
			event.stopPropagation();
			$j('#right-arrow-yellow').click();
		}
		
	});
	
	$j.setReceiptDiv = function() {
		prevDiv="paymentDiv";
		nextDiv="confirmDiv";				
		$j("#receiptMenu").addClass('highlighted');	
		for(var i =0; i<obsArray.length; i++){
			if(obsArray[i].conceptId == receiptConceptId){
				$j("#receiptInput").val(obsArray[i].label);
			}
		}
		$j("#receiptInput").focus();
		$j('#left-arrow-white').show();
		$j('#right-arrow-yellow').show();
		
	};
	
	$j.setConfirmDiv = function() {
		prevDiv="receiptDiv";
		nextDiv="confirmDiv";				
		$j("#confirmMenu").addClass('highlighted');	
		
		$j('#left-arrow-white').show();
		$j('#checkmark-yellow').show();
		$j('.confirmPaymentTableList').find('tr').remove();
		
		obsArray.sort(function(a,b){
			return (a.type > b.type) ? 1 : ((b.type>a.type)? -1: 0);
		});
		
		for(var i=0; i<obsArray.length; i++){
			var obsItem = obsArray[i];			
			
			//add the obs concept name
			var rowObs = $j(document.createElement('tr')).addClass('obsConceptRow');	
			rowObs.attr('id', 'obsConcept' + obsItem.conceptName);
			var columnObs = $j(document.createElement('td')).addClass('leftalign boldFont').text(obsItem.conceptName + ":");				
			rowObs.append(columnObs);	
			$j('.confirmPaymentTableList').append(rowObs);
			
			//add the obs value
			rowObs = $j(document.createElement('tr')).addClass('obsLabelRow');	
			if (i % 2 == 0) { 
				rowObs.addClass('evenRow');
			} else {
				rowObs.addClass('oddRow');
			}
			rowObs.mouseover(function(event){
				$j('.confirmPaymentTableList').find('tr').removeClass('highlighted');
				$j(this).addClass('highlighted');
			});
			rowObs.mouseout(function(event){				
				$j(this).removeClass('highlighted');
			});
			rowObs.attr('id', 'obsLabel' + obsItem.label);
			columnObs = $j(document.createElement('td')).addClass('leftalign greenTextRow').text(obsItem.label);	
			var greenCheckImg =$j(document.createElement('img')).attr('src', pageContextAddress  + "/moduleResources/patientregistration/images/checkmark-green.png");
			columnObs.append(greenCheckImg);			
			rowObs.append(columnObs);	
			
			//append the edit button			
			var editColumn = $j(document.createElement('td')).addClass('obsListColumn');	
			var cssObj = {
					'border' : "0",					
					'height' : "40", 
					'width' :  "40"
			}	
			var editObsBtn = $j(document.createElement('button')).addClass('editObsClick');	
			if(obsItem.type == CODED){				
				editObsBtn.bind('click', function(){
					console.log("bind coded edit");
					$j.setupDiv("paymentDiv");
				});
			}else if(obsItem.type == NONCODED){
				editObsBtn.bind('click', function(){
					console.log("bind noncoded edit");
					$j.setupDiv("receiptDiv");
				});
			}
			
			editObsBtn.css(cssObj);
			editObsBtn.attr('type', 'button');
			editObsBtn.attr('id', 'editObsBtnId');
			editObsBtn.attr('align', 'left');
			editObsBtn.css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/edit-button.png')");
			
			editColumn.append(editObsBtn);
			rowObs.append(editColumn);	
			$j('.confirmPaymentTableList').append(rowObs);
			
			//add a spacer row
			rowObs = $j(document.createElement('tr')).addClass('obsListRow spacer');	
			$j('#checkmark-yellow').css('border', '5px solid #EFB420');
			$j('#checkmark-yellow').addClass("highCheckmarkYellow");
			$j('.confirmPaymentTableList').append(rowObs);
		}
		$j('#checkmark-yellow').focus();
	};
	
	
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
		nextDiv="paymentDiv";				
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
		}else if ($j('#dialog-confirm').is(':visible') ){
			//the delete confirmation modal dialog is displayed
			return;
			
		}
	});
	
	$j.validatePaymentDivData = function(){
		for(var i=0; i<obsArray.length; i++){
			var obsItem = obsArray[i];
			//looking for a CODED obs: Payment Status
			if(obsItem.type == CODED){
				return true;
			}
		}
		return false;
	};
	
	$j.validateReceiptDivData = function(){
		var receiptVal = $j("#receiptInput").val();
		if(receiptVal.length<1){
			receiptVal = " ";
		}
		console.log("receiptVal= " + receiptVal);		
		var selectedReceiptObject = new Object();
		selectedReceiptObject.conceptName = receiptConceptName;
		selectedReceiptObject.conceptId = receiptConceptId;
		selectedReceiptObject.type=NONCODED;			
		selectedReceiptObject.label=receiptVal; 
		$j.removeObs('', receiptVal, NONCODED);
		obsArray.push(selectedReceiptObject);			
		
		return true;
	};
	
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
		$j.removeAllDiagnosis();
		//eventually I would like to make an AJAX call to see if any diagnosis have already be entered on this day
		return true;
	};
	$j.validateDivData = function() {
		//place holder for validating entry data		
		if ($j('#yearDiv').is(':visible') ){						
			return $j.validateYearDivData();			
		}else if ($j('#monthDiv').is(':visible') ){						
			return $j.validateMonthDivData();			
		}else if ($j('#dayDiv').is(':visible') ){						
			return $j.validateDayDivData();			
		}else if ($j('#paymentDiv').is(':visible') ){						
			return $j.validatePaymentDivData();			
		}else if ($j('#receiptDiv').is(':visible') ){						
			return $j.validateReceiptDivData();			
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
		}else if(devId=='yearDiv'){
			$j.setYearDiv();
		}else if(devId=='monthDiv'){
			$j.setMonthDiv();
		}else if(devId=='dayDiv'){
			$j.setDayDiv();
		}else if(devId=='paymentDiv'){
			$j.setPaymentDiv();
		}else if(devId=='receiptDiv'){
			$j.setReceiptDiv();
		}else if(devId=='confirmDiv'){
			$j.setConfirmDiv();
		}
	};
	
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
		var obsList='';
		//submit the array of diagnosis to web controller	
		if(obsArray.length>0){
			for(var i=0; i<obsArray.length; i++){
				var obsItem = new Object();
				obsItem = obsArray[i];
				var obsCode='';
				var obsId = obsItem.id;
				if(obsId !==null && obsId !=='undefined'
					&& (parseInt(obsId,10) > 0)){					
					obsCode=CODED;
				}else{
					obsId=0;
					obsCode=NONCODED;
				}
				obsList =obsList + obsCode + ',' 
								+ obsId + ',' 
								+ obsItem.label + ',' 
								+ obsItem.conceptId + ';';
			}
			$j('#listOfObs').val(obsList);
			$j('#hiddenEncounterYear').val(encounterYear);
			$j('#hiddenEncounterMonth').val(encounterMonth);
			$j('#hiddenEncounterDay').val(encounterDay);
			if(nextTask.length>0){
				$j('#hiddenNextTask').val(nextTask);
			}
			alertUserAboutLeaving = false;
			$j('#obsForm').submit();
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
	
	if(createNew !== 'true'){
		if(todayObsData.length>0 && obsArray.length<1){		
			for(var i=0; i<todayObsData.length; i++){
				var obsItem = new Object();
				obsItem = todayObsData[i];
				obsArray.push(obsItem);			
			}
			
			$j.setupDiv("confirmDiv");
		}
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