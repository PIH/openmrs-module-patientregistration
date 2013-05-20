$j(document).ready(function(){

    var prevDiv ='';
    var nextDiv='';
    var CODED = 'CODED';
    var NUMERIC = 'NUMERIC';
    var NONCODED = 'NON-CODED';
    var FOREVER = 180; // 3 minutes, longer than the normal session timeout
    var submitPayment = false;
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

    $j.clearPaymentGroupArray = function() {
        for(var i=0; i<paymentGroupArray.length; i++){
            paymentGroupArray.splice(i,1);
        }
        paymentGroupArray = new Array();
    };

    $j.addPaymentEntry = function() {
        obsArray = new Array();
        $j("#receiptInput").val("");
        $j.setupDiv('visitReasonDiv');
    };

    $j("#plusPayment").click(function(event) {
        console.log("plusPayment tr has been clicked");
        $j.addPaymentEntry();
    });

    $j.getObsId = function(searchConceptId) {
        var returnObject = null;
        for(var i =0; i<obsArray.length; i++){
            if(obsArray[i].conceptId == searchConceptId){
                returnObject = new Object();
                returnObject = obsArray[i];
                return returnObject;
            }
        }
        return returnObject;
    };

    function submitData(){
        if(submitPayment){
            return;
        }else{
            submitPayment= true;
        }
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
                        var obsItemLabel = obsItem.label;
                        if(obsItemLabel.length<1){
                            obsItemLabel =0;
                        }
                        var obsId = parseInt(obsItem.obsId, 10);
                        if (isNaN(obsId)){
                            obsId = 0;
                        }

                        obsList =obsList + obsCode + ','
                            + codedId + ','
                            + obsItemLabel + ','
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

    var divItems = new Array(
        "encounterDateDiv",
        "dialog-checkedInDiv",
        "visitReasonDiv",
        "paymentAmountDiv",
        "receiptDiv",
        "confirmDiv",
        "dialog-confirm",
        "confirmMessageArea"
    );

    var leftMenuItems = new Array(
        "encounterDateMenu",
        "visitReasonMenu",
        "paymentAmountMenu",
        "receiptMenu",
        "confirmMenu"
    );

    var navigationArrows = new Array(
        "cross-red",
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

    $j.setVisitReasonDiv = function() {
        prevDiv="encounterDateDiv";
        nextDiv="paymentAmountDiv";
        $j("#visitReasonMenu").addClass('highlighted');
        setSelectedVisitReason(0);

        var visitReasonObject = $j.getObsId(visitReasonConceptId);
        if(visitReasonObject!=null){
            var dbId = visitReasonObject.obsId;
            if (!isNaN(dbId)){
                $j("#visitReasonObsId").val(dbId);
                var findTd= $visitReasonRows.find('td:contains("' + visitReasonObject.label +'")');
                if(findTd!=null){
                    var closestTr = findTd.closest('tr');
                    if(closestTr !=null){
                        selectedVisitReason = closestTr.prevAll().length;
                        setSelectedVisitReason(selectedVisitReason);
                    }

                }
            }
        }

        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();
    };

    $j.setPaymentAmountDiv = function() {
        prevDiv=null;
        nextDiv="confirmDiv";
        $j("#paymentAmountMenu").addClass('highlighted');
        setSelectedPaymentAmount(0);

        var paymentAmountObject = $j.getObsId(paymentAmountConceptId);
        if(paymentAmountObject!=null){
            var dbId = paymentAmountObject.obsId;
            if (!isNaN(dbId)){
                $j("#paymentAmountObsId").val(dbId);
                //$paymentAmountRows.find('tr').removeClass('highlighted');
                var findTd= $paymentAmountRows.find('td:contains("' + paymentAmountObject.label +'")');
                if(findTd!=null){
                    var closestTr = findTd.closest('tr');
                    if(closestTr !=null){
                        //closestTr.addClass('highlighted');
                        selectedPaymentAmount = closestTr.prevAll().length;
                        setSelectedPaymentAmount(selectedPaymentAmount);
                    }
                }
            }
        }
        if (displayCheckedInDialogIfNeeded()) {
            return;
        }else{
            //add a default empty visit reason
            var visitReasonObject = $j.getObsId(visitReasonConceptId);
            if(visitReasonObject ==null ){
                selectedVisitReasonObject = new Object();
                selectedVisitReasonObject.type=CODED;
                selectedVisitReasonObject.id = 0;
                selectedVisitReasonObject.conceptName = visitReasonConceptName;
                selectedVisitReasonObject.conceptId = visitReasonConceptId;
                selectedVisitReasonObject.label="";
                var visitReasonObsId = $j("#visitReasonObsId").val();
                if(parseInt(visitReasonObsId, 10) > 0){
                    selectedVisitReasonObject.obsId=visitReasonObsId;
                }
                //obsArray.push(selectedVisitReasonObject);
            }
            $j("#visitReasonObsId").val("");

            //add empty receipt number
            var selectedReceiptObject = $j.getObsId(receiptConceptId);
            if(selectedReceiptObject ==null ){
                selectedReceiptObject = new Object();
                selectedReceiptObject.conceptName = receiptConceptName;
                selectedReceiptObject.conceptId = receiptConceptId;
                selectedReceiptObject.type=NONCODED;
                selectedReceiptObject.label="";
                var receiptObsId = $j("#receiptObsId").val();
                if(parseInt(receiptObsId,10) > 0){
                    selectedReceiptObject.obsId= receiptObsId;
                }
                $j.removeObs(receiptConceptId);
                //obsArray.push(selectedReceiptObject);
            }
            $j("#receiptObsId").val("");
        }
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
            var visitReasonObsId = $j("#visitReasonObsId").val();
            if(parseInt(visitReasonObsId, 10) > 0){
                selectedVisitReasonObject.obsId=visitReasonObsId;
            }
            $j.removeObs(visitReasonConceptId);
            obsArray.push(selectedVisitReasonObject);
            $j("#visitReasonObsId").val("");
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
        if(parseInt(paymentAmountSelectedId, 10) >= 0){
            var selectedPaymentAmountObject = new Object();
            selectedPaymentAmountObject.type=NUMERIC;
            selectedPaymentAmountObject.id = paymentAmountSelectedId;
            selectedPaymentAmountObject.conceptName = paymentAmountConceptName;
            selectedPaymentAmountObject.conceptId = paymentAmountConceptId;
            var paymentAmountLabel = $j(this).find("td").text();
            if(paymentAmountLabel.length > 0){
                selectedPaymentAmountObject.label=paymentAmountLabel;
            }
            var paymentAmountObsId = $j("#paymentAmountObsId").val();
            if(parseInt(paymentAmountObsId, 10) > 0){
                selectedPaymentAmountObject.obsId=paymentAmountObsId;
            }
            $j.removeObs(paymentAmountConceptId);
            obsArray.push(selectedPaymentAmountObject);
            $j("#paymentAmountObsId").val("");
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

        if ($j('#dialog-checkedInDiv').is(':visible') ){
            return true;
        }else if ($j('#paymentAmountDiv').is(':visible') ){
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
        var receiptObject = $j.getObsId(receiptConceptId);
        if(receiptObject!=null){
            var label = receiptObject.label;
            if(label.length>0){
                $j("#receiptInput").val(label);
            }
            var dbId = receiptObject.obsId;
            if (!isNaN(dbId)){
                $j("#receiptObsId").val(dbId);
            }
        }

        $j("#receiptInput").focus();
        $j('#left-arrow-white').show();
        $j('#right-arrow-yellow').show();

    };

    $j.setConfirmDiv = function() {
        prevDiv="paymentAmountDiv";
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
            var hiddenInput = $j(document.createElement('input')).addClass('paymentGroupArrayIdClass')
                .attr({type: 'hidden', id: 'paymentGroupArrayId'+i})
                .val(i);
            rowObs.append(hiddenInput);

            var obsVisitReason = paymentItem[0];
            if(typeof(obsVisitReason) !=='undefined'){
                rowObs.attr('id', 'obsConcept' + obsVisitReason.conceptName);
                var columnLabel=  obsVisitReason.label;
                /* + ", "
                 + paymentItem[2].conceptName + ": "
                 + paymentItem[2].label ;
                 */

                var biggerSpan = $j(document.createElement('span')).addClass('normalFont').text(columnLabel);
                var smallerSpan = $j(document.createElement('span')).addClass('smallerFont greyColor').text("");
                var columnObs = $j(document.createElement('td')).addClass('questionAnswer');
                columnObs.append(biggerSpan);
                columnObs.append(smallerSpan)
                rowObs.append(columnObs);

                var editObsId = obsVisitReason.obsId;
                if (isNaN(editObsId)){
                    //append the Delete button
                    var secondColumn = $j(document.createElement('td'));
                    var cssObj = {
                        'border' : "0",
                        'height' : "50",
                        'width' :  "50"
                    }
                    var deletePaymentGroupBtn = $j(document.createElement('button'))
                        .addClass('deletePaymentGroupClick deletePayment')
                        .click(function(event){
                            var paymentGroupArrayId = $j(this).closest('tr').find('.paymentGroupArrayIdClass').val();
                            var closestTr = $j(this).closest('tr');
                            paymentGroupArray.splice(paymentGroupArrayId,1);
                            closestTr.remove();

                        });

                    deletePaymentGroupBtn.attr('type', 'button');
                    deletePaymentGroupBtn.attr('id', 'deletePaymentGroupBtnId');
                    deletePaymentGroupBtn.attr('align', 'left');

                    secondColumn.append(deletePaymentGroupBtn);
                    rowObs.append(secondColumn);
                }else{
                    //add the edit button
                    var secondColumn = $j(document.createElement('td'));

                    var editPaymentGroupBtn = $j(document.createElement('button'))
                        .addClass('editPaymentGroupClick editPayment')
                        .click(function(event){
                            var paymentGroupArrayId = $j(this).closest('tr').find('.paymentGroupArrayIdClass').val();
                            var closestTr = $j(this).closest('tr');
                            obsArray = paymentGroupArray[paymentGroupArrayId];
                            paymentGroupArray.splice(paymentGroupArrayId,1);
                            closestTr.remove();
                            $j.setupDiv('paymentAmountDiv');

                        });
                    editPaymentGroupBtn.attr('type', 'button');
                    editPaymentGroupBtn.attr('id', 'editPaymentGroupBtnId');
                    editPaymentGroupBtn.attr('align', 'left');

                    secondColumn.append(editPaymentGroupBtn);
                    rowObs.append(secondColumn);
                }
                $j('.confirmPaymentTableList').append(rowObs);
            }

        }

        $j('#checkmark-yellow').css('border', '5px solid #EFB420');
        $j('#checkmark-yellow').addClass("highCheckmarkYellow");

        $j('#checkmark-yellow').focus();
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
                selectedDate = $dateList.find('tr').length - 1;
            }
            $dateList.find('tr').removeClass('highlighted').eq(selectedDate).addClass('highlighted');
        }
    };

    $j(document).keydown(function(event) {
        if ($j('#dialog-checkedInDiv').is(':visible') ){
            console.log("#dialog-checkedInDiv keydown event");
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


    $j.validateDivData = function() {
        //place holder for validating entry data
        if ($j('#visitReasonDiv').is(':visible') ){
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
        if(parseInt(editEncounterId, 10) > 0){
            return false;
        }
        if (($j('#newVisit').val() == "") ) {
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
                $j.clearPaymentGroupArray();
                $j.setupDiv("paymentAmountDiv");
            }
        }, {

            text: doNotCreateNewVisit,
            label: "",
            id: "cancelBtn",
            click: function() {
                $j('#newVisit').val("false");
                $j(this).dialog("close");
                if(paymentGroupArray.length>0){
                    $j.setupDiv("confirmDiv");
                }else{
                    $j.setupDiv("paymentAmountDiv");
                }
            }
        }],
        open: function(event, ui){
            $j('.modalRow').remove();
            $j(".ui-dialog").css("padding", "0");
            $j(".ui-dialog-buttonpane").css("background", "gray");
            $j(this).parent().children(".ui-widget-header").css("background", "#501d3d");
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

        /*
         if(currentTask == "edCheckIn") {
         $j('#hiddenRequestDossierNumber').val("false");
         submitData();
         return;
         }
         */

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
                $j(this).parent().children(".ui-widget-header").css("background", "#501d3d");
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

    $j.setupDiv('paymentAmountDiv');
    //change the left lower corner red X with the reload image
    $j("#cross-red").attr('src', pageContextAddress + '/moduleResources/patientregistration/images/reload-arrow.png');
    $j('#cross-red').click(function(event){
        alertUserAboutLeaving = false;
        var nextPage = '';
        if(currentTask == "edCheckIn") {
            nextPage = '/mirebalais/patientRegistration/appRouter.page?task=edCheckIn';
        }else{
            nextPage = '/mirebalais/patientRegistration/appRouter.page?task=primaryCareReception';
        }
        window.location.href=pageContextAddress + nextPage;
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

            if (displayCheckedInDialogIfNeeded()) {
                return;
            }else{
                $j.setupDiv("confirmDiv");
            }
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