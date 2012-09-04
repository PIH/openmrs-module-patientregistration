$j(document).ready(function(){
	
	var divItems = new Array("reportParamDiv",
							 "reportHistoryDiv"
	);
	
	console.log("location:" + $j("#userEnteredParamlocation").text());
	console.log("locationVal:" + $j("#userEnteredParamlocation").val());
	$j("#userEnteredParamlocation").attr('disabled', 'disabled');
	//$j("#selectOutputFormat").attr('disabled', 'disabled');
	
	$j.setReportParamDiv = function() {		
		console.log("location:" + $j("#userEnteredParamlocation").text());
	
	};
	$j.setReportHistoryDiv = function() {	
		
	};
	
	$j.hideAllDiv = function() {			
		for(i=0; i<divItems.length; i++){				
			var divItem = "#"+divItems[i];			
			$j(divItem).hide();
		}			
	};
	
	$j.setupDiv = function(devId) {
		$j.hideAllDiv();	
		
		$j("#"+devId).css("visibility", "visible");
		$j("#"+devId).show();
		if(devId=='reportParamDiv'){
			$j.setReportParamDiv();
		}else if(devId=='reportHistoryDiv'){
			$j.setReportHistoryDiv();
		}
	};
	
	
	
	var i=0;
	$j.loadReportStatus = function() {
	    $j("#loadingGraph").css("visibility", "visible");
		$j("#loadingGraph").show();
		
		$j.getJSON(pageContextAddress + '/module/reporting/reports/loadReportStatus.form?uuid='+history_uuid, function(data) {
	    	var statusText = '';
	    	console.log("data.status=" + data.status);
			statusText = data.status;
			
			$j.setupDiv('reportHistoryDiv');
	    	$j("#statusTextDiv").html(statusText);
			
	    	if (data.status == 'COMPLETED' || data.status == 'SAVED') {
				$j("#loadingGraph").hide();
				$j("#downloadReportDiv").css("visibility", "visible");
				$j("#downloadReportDiv").show();	    		
	    	}else if (data.status == 'FAILED') {
	    		$j("#errorDiv").css("visibility", "visible");
				$j("#errorDiv").show();
	    	}else {
	    		setTimeout("$j.loadReportStatus();", 3000);
	    	}
	    });
	}
    
	if(history_uuid.length>0){
		$j.loadReportStatus();
		$("#errorDetailsLink").click(function(event) {
			alert("show the report errors");
		});
	}
});