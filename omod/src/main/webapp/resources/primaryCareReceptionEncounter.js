$j(document).ready(function(){

    var prevDiv ='';
    var nextDiv='';
    var CODED = 'CODED';
    var NUMERIC = 'NUMERIC';
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
    var paymentGroupArray = new Array();


    function questionOrder(conceptId){
        if (visitReasonConceptId == conceptId){
            return 1;
        } else if (paymentAmountConceptId == conceptId){
            return 2;
        } else if (receiptConceptId == conceptId){
            return 3;
        }
    }

    function sortPaymentConcepts(a,b){
        var left = questionOrder(a.conceptId);
        var right = questionOrder(b.conceptId);
        return left - right;
    }

    function submitData(){
        var obsList='[';
        var firstItem = true;
        //submit the array of diagnosis to web controller
        if(paymentGroupArray.length>0){
            for(var j=0; j < paymentGroupArray.length; j++){
                if(firstItem){
                    obsList = obsList + "{";
                    firstItem = false;
                }else{
                    obsList = obsList + ",{";
                }
                var paymentItem = new Object();
                paymentItem = paymentGroupArray[j];
                if(paymentItem.length>0){
                    for(var i=0; i<paymentItem.length; i++){
                        var obsItem = new Object();
                        obsItem = paymentItem[i];
                        var obsCode=obsItem.type;
                        var codedId = obsItem.id;
                        if (obsCode === NONCODED) {
                            codedId = 0;
                        }
                        var obsId = parseInt(obsItem.obsId, 10);
                        if (isNaN(obsId)){
                            obsId = 0;
                        }

                        obsList =obsList + obsCode + ','
                            + codedId + ','
                            + obsItem.label + ','
                            + obsItem.conceptId + ','
                            + obsId + ';';
                    }
                }
                obsList = obsList + "}";
            }
            obsList = obsList + "]";
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
    }

    var divItems = new Array("encounterDateDiv",
        "yearDiv",
        "monthDiv",
        "dayDiv",
        "dialog-checkedInDiv",
        "visitReasonDiv",
        "paymentAmountDiv",
        "receiptDiv",
        "confirmDiv",
        "dialog-confirm",
        "confirmMessageArea"
    );

    var leftMenuItems = new Array("encounterDateMenu",
        "visitReasonMenu",
        "paymentAmountMenu",
        "receiptMenu",
        "confirmMenu"
    );

    var navigationArrows = new Array("cross-red",
        "left-arrow-white",
        "right-arrow-white",
        "right-arrow-yellow",
        "checkmark-yellow"
    );

    $j.removeAllDiagnosis = function() {
        for(var i=0; i<obsArray.length; i++){
            obsArray.splice(i,1);
        }
        obsArray = new Array();
    };

    $j.removeObs = function(conceptId) {
        for (var i = 0; i < obsArray.length; i++) {
            if (obsArray[i].conceptId == conceptId) {
                obsArray.splice(i, 1);
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
        nextDiv="visitReasonDiv";
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
        if (displayCheckedInDialogIfNeeded()) {
            return;
        }

        $j.setupDiv('visitReasonDiv');
    });
    $j("#pastDateRow").click(function(event){
        $j.setupDiv('yearDiv');
    });

    $j.setVisitReasonDiv = function() {
        prevDiv="encounterDateDiv";
        nextDiv="paymentAmountDiv";
        $j("#visitReasonMenu").addClass('highlighted');
        setSelectedVisitReason(0);
        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();
    };

    $j.setPaymentAmountDiv = function() {
        prevDiv="visitReasonDiv";
        nextDiv="receiptDiv";
        $j("#paymentAmountMenu").addClass('highlighted');
        setSelectedPaymentAmount(0);
        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();
    };

    $j('.visitReasonListRow').mouseover(function(){
        $visitReasonRows.find('tr').removeClass('highlighted');
        $j(this).addClass('highlighted');
    });
    $j('.visitReasonListRow').mouseout(function(){
        $j(this).removeClass('highlighted');
    });

    $j(".visitReasonListRow").click(function() {
        var visitReasonSelectedId = $j(this).find("input").val();
        console.log("visitReasonSelectedId=" + visitReasonSelectedId);
        if(parseInt(visitReasonSelectedId, 10) > 0){
            var selectedVisitReasonObject = new Object();
            selectedVisitReasonObject.type=CODED;
            selectedVisitReasonObject.id = visitReasonSelectedId;
            selectedVisitReasonObject.conceptName = visitReasonConceptName;
            selectedVisitReasonObject.conceptId = visitReasonConceptId;
            var visitReasonLabel = $j(this).find("td").text();
            console.log("visitReasonLabel=" + visitReasonLabel);
            if(visitReasonLabel.length > 0){
                selectedVisitReasonObject.label=visitReasonLabel;
            }
            $j.removeObs(visitReasonConceptId);
            obsArray.push(selectedVisitReasonObject);
        }
        $j('#right-arrow-yellow').click();
    });

    $j('.paymentAmountListRow').mouseover(function(){
        $paymentAmountRows.find('tr').removeClass('highlighted');
        $j(this).addClass('highlighted');
    });
    $j('.paymentAmountListRow').mouseout(function(){
        $j(this).removeClass('highlighted');
    });

    $j(".paymentAmountListRow").click(function() {
        var paymentAmountSelectedId = $j(this).find("input").val();
        console.log("paymentAmountSelectedId=" + paymentAmountSelectedId);
        if(parseInt(paymentAmountSelectedId, 10) >= 0){
            var selectedPaymentAmountObject = new Object();
            selectedPaymentAmountObject.type=NUMERIC;
            selectedPaymentAmountObject.id = paymentAmountSelectedId;
            selectedPaymentAmountObject.conceptName = paymentAmountConceptName;
            selectedPaymentAmountObject.conceptId = paymentAmountConceptId;
            var paymentAmountLabel = $j(this).find("td").text();
            console.log("paymentAmountLabel=" + paymentAmountLabel);
            if(paymentAmountLabel.length > 0){
                selectedPaymentAmountObject.label=paymentAmountLabel;
            }
            $j.removeObs(paymentAmountConceptId);
            obsArray.push(selectedPaymentAmountObject);
        }
        $j('#right-arrow-yellow').click();
    });


    var $visitReasonRows = $j("#visitReasonTable");
    $visitReasonRows.find('tr').removeClass('highlighted');
    var selectedVisitReason = null;
    var setSelectedVisitReason = function(item) {
        selectedVisitReason = item;
        if (selectedVisitReason !== null) {
            if (selectedVisitReason < 0) {
                selectedVisitReason = 0;
            }
            if (selectedVisitReason >= $visitReasonRows.find('tr').length) {
                selectedVisitReason = $visitReasonRows.find('tr').length - 1;
            }
            $visitReasonRows.find('tr').removeClass('highlighted').eq(selectedVisitReason).addClass('highlighted');
        }
    };

    var $paymentAmountRows = $j("#paymentAmountTable");
    $paymentAmountRows.find('tr').removeClass('highlighted');
    var selectedPaymentAmount = null;
    var setSelectedPaymentAmount = function(item) {
        selectedPaymentAmount = item;
        if (selectedPaymentAmount !== null) {
            if (selectedPaymentAmount < 0) {
                selectedPaymentAmount = 0;
            }
            if (selectedPaymentAmount >= $paymentAmountRows.find('tr').length) {
                selectedPaymentAmount = $paymentAmountRows.find('tr').length - 1;
            }
            $paymentAmountRows.find('tr').removeClass('highlighted').eq(selectedPaymentAmount).addClass('highlighted');
        }
    };



    $j(document).keydown(function(event) {
        if ($j('#visitReasonDiv').is(':visible') ){
            if (event.keyCode == KEYCODE_ARROW_UP){
                if(selectedVisitReason === null){
                    selectedVisitReason=1;
                }
                setSelectedVisitReason(selectedVisitReason - 1);
                event.preventDefault();
            }else if (event.keyCode == KEYCODE_ARROW_DOWN){
                if(selectedVisitReason === null){
                    setSelectedVisitReason(0);
                }else{
                    setSelectedVisitReason(selectedVisitReason + 1);
                }
                event.preventDefault();
            }else if (event.keyCode == KEYCODE_ENTER ) {
                //User pressed enter key.
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                if((selectedVisitReason!==null)){
                    window.setTimeout(function(event){
                        var selectedRow = $visitReasonRows.find('tr').eq(selectedVisitReason);
                        var selectedRowId = selectedRow.find("input").val();
                        console.log("selectedRowId=" + selectedRowId);
                        $j("#" + selectedRow.attr('id')).click();
                    }, 100);
                }
            }
        }
    });

    $j(document).keydown(function(event) {
        if ($j('#paymentAmountDiv').is(':visible') ){
            if (event.keyCode == KEYCODE_ARROW_UP){
                if(selectedPaymentAmount === null){
                    selectedPaymentAmount=1;
                }
                setSelectedPaymentAmount(selectedPaymentAmount - 1);
                event.preventDefault();
            }else if (event.keyCode == KEYCODE_ARROW_DOWN){
                if(selectedPaymentAmount === null){
                    setSelectedPaymentAmount(0);
                }else{
                    setSelectedPaymentAmount(selectedPaymentAmount + 1);
                }
                event.preventDefault();
            }else if (event.keyCode == KEYCODE_ENTER ) {
                //User pressed enter key.
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                if((selectedPaymentAmount!==null)){
                    window.setTimeout(function(event){
                        var selectedRow = $paymentAmountRows.find('tr').eq(selectedPaymentAmount);
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
        prevDiv="paymentAmountDiv";
        nextDiv="confirmDiv";
        $j("#receiptMenu").addClass('highlighted');
        for(var i =0; i<obsArray.length; i++){
            if(obsArray[i].conceptId == receiptConceptId){
                $j("#receiptInput").val(obsArray[i].label);
				var receiptObsId = obsArray[i].obsId;
				if(receiptObsId.length>0){
					$j("#receiptObsId").val(receiptObsId);
				}
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

        if(obsArray.length>0){
            obsArray.sort(sortPaymentConcepts);
            paymentGroupArray.push(obsArray);
        }
        for(var i=0; i<paymentGroupArray.length; i++){
            var paymentItem = paymentGroupArray[i];

            var rowObs = $j(document.createElement('tr')).addClass('dateListRow biggerRow');
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
            var hiddenInput = $j(document.createElement('input')).addClass('paymentGroupArrayIdClass')
                .attr({type: 'hidden', id: 'paymentGroupArrayId'+i})
                .val(i);
            rowObs.append(hiddenInput);

            var obsVisitReason = paymentItem[0];
			if(typeof(obsVisitReason) !=='undefined'){
				rowObs.attr('id', 'obsConcept' + obsVisitReason.conceptName);
				var columnLabel= " (" + paymentItem[1].label + ", "
					+ paymentItem[2].conceptName + ": "
					+ paymentItem[2].label + ")";

				var biggerSpan = $j(document.createElement('span')).addClass('normalFont').text(obsVisitReason.label);
				var smallerSpan = $j(document.createElement('span')).addClass('smallerFont greyColor').text(columnLabel);
				var columnObs = $j(document.createElement('td')).addClass('questionAnswer');
				columnObs.append(biggerSpan);
				columnObs.append(smallerSpan)
				rowObs.append(columnObs);

				//append the Delete button
				var secondColumn = $j(document.createElement('td'));
				var cssObj = {
					'border' : "0",
					'height' : "37",
					'width' :  "37"
				}
				var deletePaymentGroupBtn = $j(document.createElement('button'))
					.addClass('deletePaymentGroupClick')
					.click(function(event){
						var paymentGroupArrayId = $j(this).closest('tr').find('.paymentGroupArrayIdClass').val();
						var closestTr = $j(this).closest('tr');
						paymentGroupArray.splice(paymentGroupArrayId,1);
						closestTr.remove();

					});
				deletePaymentGroupBtn.css(cssObj);
				deletePaymentGroupBtn.attr('type', 'button');
				deletePaymentGroupBtn.attr('id', 'deletePaymentGroupBtnId');
				deletePaymentGroupBtn.attr('align', 'left');
				deletePaymentGroupBtn.css("background", "url('" + pageContextAddress  + "/moduleResources/patientregistration/images/z-red.png')");

				secondColumn.append(deletePaymentGroupBtn);
				rowObs.append(secondColumn);

				$j('.confirmPaymentTableList').append(rowObs);
			}

        }

        $j('#checkmark-yellow').css('border', '5px solid #EFB420');
        $j('#checkmark-yellow').addClass("highCheckmarkYellow");

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
        nextDiv="visitReasonDiv";
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
        if ($j('#dialog-checkedInDiv').is(':visible') ){
            return;
        }else if ($j('#encounterDateDiv').is(':visible') ){
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

    $j.validateVisitReasonDivData = function(){
        for(var i=0; i<obsArray.length; i++){
            var obsItem = obsArray[i];
            if(obsItem.conceptId == visitReasonConceptId){
                return true;
            }
        }
        return false;
    };

    $j.validatePaymentAmountDivData = function(){
        for(var i=0; i<obsArray.length; i++){
            var obsItem = obsArray[i];
            if(obsItem.conceptId == paymentAmountConceptId){
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
		var receiptObsId = $j("#receiptObsId").val();
        
        var selectedReceiptObject = new Object();
        selectedReceiptObject.conceptName = receiptConceptName;
        selectedReceiptObject.conceptId = receiptConceptId;
        selectedReceiptObject.type=NONCODED;
        selectedReceiptObject.label=receiptVal;
		if(parseInt(receiptObsId,10) > 0){
			selectedReceiptObject.obsId= receiptObsId;
		}
        $j.removeObs(receiptConceptId);
		$j("#receiptObsId").val("");
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
        }else if ($j('#visitReasonDiv').is(':visible') ){
            return $j.validateVisitReasonDivData();
        }else if ($j('#paymentAmountDiv').is(':visible') ){
            return $j.validatePaymentAmountDivData();
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
        }else if(devId=='visitReasonDiv'){
            $j.setVisitReasonDiv();
        }else if(devId=='paymentAmountDiv'){
            $j.setPaymentAmountDiv();
        }else if(devId=='receiptDiv'){
            $j.setReceiptDiv();
        }else if(devId=='confirmDiv'){
            $j.setConfirmDiv();
        }
    };

    function displayCheckedInDialogIfNeeded() {
        if ($j('#newVisit').val() == "") {
            $j("#dialog-checkedInDiv").dialog("open");
            $j("#dialog-checkedInDiv").css("visibility", "visible");
            $j("#dialog-checkedInDiv").show();
            return true;
        }
        return false;
    }

    $j('#right-arrow-yellow').click(function(event){
        if($j.validateDivData()){
            if (displayCheckedInDialogIfNeeded()) {
                return;
            }
            if(nextDiv !== null){
                $j.setupDiv(nextDiv);
            }
        }

    });

    $j("#dialog-checkedInDiv").dialog({
        autoOpen: false,
        resizable: false,
        height: 350,
        width: 800,
        modal: true,
        closeOnEscape: false,
        buttons:[{
            text: createNewVisit,
            label: "",
            id: "okCheckedInDialog",
            click: function() {
                $j('#newVisit').val("true");
                $j(this).dialog("close");
                $j.setupDiv(nextDiv);
            }
        }, {

            text: doNotCreateNewVisit,
            label: "",
            id: "cancelBtn",
            click: function() {
                $j('#newVisit').val("false");
                $j(this).dialog("close");
                $j.setupDiv(nextDiv);
            }
        }],
        open: function(event, ui){
            $j('.modalRow').remove();
            $j(".ui-dialog").css("padding", "0");
            $j(".ui-dialog-buttonpane").css("background", "gray");
            $j(this).parent().children(".ui-widget-header").css("background", "#009384");
            $j(".ui-dialog-buttonset").css("width", "100%");

            $j("#cancelBtn").addClass('modalConfirmBtn');
            $j("#cancelBtn").css("border", "0");
            $j("#cancelBtn").css("float", "right");
            $j('#cancelBtn').css('border', '5px solid #EFB420');
            $j("#cancelBtn").focus();

            $j("#okCheckedInDialog").addClass('modalConfirmBtn');
            $j("#okCheckedInDialog").css("float", "left");

        }
    });

    $j('#checkmark-yellow').click(function(event){
        if(currentTask == "edCheckIn") {
            $j('#hiddenRequestDossierNumber').val("false");
            submitData();
            return;
        }

        console.log("checkmark-yellow.click");
        var yes = $j("#hiddenYes").val();
        var no = $j("#hiddenNo").val();
        $j("#dialog-requestDossierNumber").dialog({
            autoOpen: false,
            resizable: false,
            height: 250,
            width: 700,
            modal: true,
            closeOnEscape: true,
            buttons:[{

                text:yes,
                label: "okButton",
                id: "okDialog",
                click: function() {
                    $j('#hiddenRequestDossierNumber').val("true");
                    $j(this).dialog("close");
                    submitData();
                }
            }, {

                text:no,
                label: "cancelButton",
                id: "cancelBtn",
                click: function() {
                    $j('#hiddenRequestDossierNumber').val("false");
                    $j(this).dialog("close");
                    submitData();
                }
            }],
            open: function(event, ui){
                $j('.modalRow').remove();
                $j(".ui-dialog").css("padding", "0");
                $j(".ui-dialog-buttonpane").css("background", "gray");
                $j(this).parent().children(".ui-widget-header").css("background", "#009384");
                $j(".ui-dialog-buttonset").css("width", "100%");

                $j("#cancelBtn").addClass('modalConfirmBtn');
                $j("#cancelBtn").css("border", "0");
                $j("#cancelBtn").css("float", "right");

                $j("#okDialog").addClass('modalConfirmBtn');
                $j("#okDialog").css("float", "left");
                $j('#okDialog').css('border', '5px solid #EFB420');
                $j("#okDialog").focus();
            }
        });

        $j("#dialog-requestDossierNumber").dialog("open");
        $j("#dialog-requestDossierNumber").css("visibility", "visible");
        $j("#dialog-requestDossierNumber").show();
    });

    $j('#left-arrow-white').click(function(event){
        if(prevDiv !== null){
            if($j("#confirmDiv").is(':visible')){
                if(paymentGroupArray!== null && paymentGroupArray.length>0){
                    obsArray = paymentGroupArray.pop();
                }
            }
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

    if(createNew !== 'true' ){
        if(paymentGroupsData.length>0 && obsArray.length<1){
            for(var i=0; i< paymentGroupsData.length; i++){
                var groupPayment = new Object();
                groupPayment = paymentGroupsData[i];
				if(typeof(groupPayment) !=='undefined' && groupPayment.length>0){
					paymentGroupArray.push(groupPayment.sort(sortPaymentConcepts));
				}                
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

    $j("#plusPaymentBtnId").click(function(event){
        console.log("add new payment");
        obsArray = new Array();
        $j("#receiptInput").val("");
        $j.setupDiv('visitReasonDiv');
    });

});