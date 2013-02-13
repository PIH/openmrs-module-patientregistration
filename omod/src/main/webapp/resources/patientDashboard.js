$j(document).ready(function(){

    // hide the white right arrow
    $j('#right-arrow-white').hide();
    $j('#cross-red').hide();
    $j('#checkmark-yellow').show();
    $j('#checkmark-yellow').css('border', '5px solid #EFB420');
    $j('#checkmark-yellow').focus();



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

    $j("#tdPrintLabelId").click(function(event){
        $j("#printPatientLabelForm").submit();
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
            $j(this).parent().children(".ui-widget-header").css("background", "#501d3d");
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

    $j(".editDemoDiv").click(function(event){
        var divId = this.id;
        $j.goToNextPage(nextTask, '/module/patientregistration/workflow/enterPatientDemo.form?patientId='+patientId + "&editDivId=" + divId);
    });

    $j("#brokenPrinterBtn").click(function(event) {
        $j.goToNextPage(nextTask, '/module/patientregistration/workflow/patientDashboard.form?cardPrinted=false&patientId=' + patientId);
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