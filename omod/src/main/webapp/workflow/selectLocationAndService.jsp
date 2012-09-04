<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>

<!-- SPECIALIZED STYLES FOR THIS PAGE -->
<style type="text/css">
	.locationListItem{text-align:left}
</style>

<script type="text/javascript">

$j(document).ready(function(){	
	
	var locSelected = 0;
	var taskSelected = '';
	
	$j("#locationDiv").show();
	$j("#taskDiv").hide();
	
	// mouseovers
	$j('.locationListRow').mouseover(function(){
		$j(this).addClass('highlighted');
	});	
	$j('.locationListRow').mouseout(function(){
		$j(this).removeClass('highlighted');
	});
	
	$j('.taskListRow').mouseover(function(){
		$j(this).addClass('highlighted');
	});	
	$j('.taskListRow').mouseout(function(){
		$j(this).removeClass('highlighted');
	});
	
	$j.handleLocation= function(locationName){
	  if(locSelected !==null){						
		$j("#location").val(locSelected);			
	  }else{
		alert('newLocations is null');	  
	  }	  	  	 
	  if(taskSelected>0){		 
		  $j("#selectLocationForm").submit();
	  }else{
		$j("#locationDiv").hide();
		$j("#taskDiv").show();
		$j("#headerLocationName").html(locationName);		
	  }
	};
	
	//select location
	$j(".locationListRow").click(function() {
	  locSelected =  $j(this).find("input").val();	 	
	  locationName = $j(this).find(".locationListItem").html();
	  $j.handleLocation(locationName);	  
	});
	
	$j.handleTask= function(){
	  if (taskSelected !== null){				
		$j("#task").val(taskSelected);	 	
	  } 
	  else {
		alert('task is null');	  
	  }
	   	 
	  if(locSelected > 0){		
		  $j("#selectLocationForm").submit();
	  }else{
		$j("#taskDiv").hide();
		$j("#locationDiv").show();		 
	  }
	  
	};
	
	//select service
	$j(".taskListRow").click(function() {
	  taskSelected = $j(this).find("input").val();		 	 
	  $j.handleTask();
	});

	var $autocompleteLocations = $j('.locationList');
	$j('.locationList').find('tr').removeClass('highlighted');
	var selectedLocation = null;
	var setSelectedLocation = function(item) {		
		selectedLocation = item;
		if (selectedLocation !== null) {
			if (selectedLocation < 0) {
				selectedLocation = 0;
			}
			if (selectedLocation >= $autocompleteLocations.find('tr').length) {
			  selectedLocation = $autocompleteLocations.find('tr').length - 1;
			}
			$autocompleteLocations.find('tr').removeClass('highlighted').eq(selectedLocation).addClass('highlighted');												
		}		  		
	};
	
	var $autocompleteTasks = $j('.taskList');
	$j('.taskList').find('tr').removeClass('highlighted');
	var selectedTask = null;
	var setSelectedTask = function(item) {		
		selectedTask = item;
		if (selectedTask !== null) {
			if (selectedTask < 0) {
				selectedTask = 0;
			}
			if (selectedTask >= $autocompleteTasks.find('tr').length) {
			  selectedTask = $autocompleteTasks.find('tr').length - 1;
			}
			$autocompleteTasks.find('tr').removeClass('highlighted').eq(selectedTask).addClass('highlighted');												
		}		  		
	};
	
	$j(document).keydown(function(event) {		
		if (event.keyCode ==38){
			//user pressed up arrow
			console.log("up arrow");
			//user pressed up arrow
			if ($j('#locationDiv').is(':visible') ){		
				if(selectedLocation === null){
					selectedLocation=1;
				}
				setSelectedLocation(selectedLocation - 1);
			}else if ($j('#taskDiv').is(':visible') ){		
				if(selectedTask === null){
					selectedTask=1;
				}
				setSelectedTask(selectedTask - 1);
			}
			event.preventDefault();
		}else if (event.keyCode ==40){
			//user pressed down arrow
			console.log("down arrow");
			//user pressed down arrow		
			if ($j('#locationDiv').is(':visible') ){		
				if(selectedLocation === null){
					setSelectedLocation(0);
				}else{
					setSelectedLocation(selectedLocation + 1);
				}
			}else if ($j('#taskDiv').is(':visible') ){
				if(selectedTask === null){
					setSelectedTask(0);
				}else{
					setSelectedTask(selectedTask + 1);
				}
			}
			event.preventDefault();
		}else if (event.keyCode == 13 ) {
		  //User pressed enter key.
		  event.stopPropagation();
		  event.preventDefault();
		  if ($j('#locationDiv').is(':visible') ){
			  if((selectedLocation!==null)){			
				locSelected = $autocompleteLocations.find('tr').eq(selectedLocation).find("input").val();				
				var locationName = $autocompleteLocations.find('tr').eq(selectedLocation).find(".locationListItem").html();				
				$j.handleLocation(locationName);
			  }	
		  }else if ($j('#taskDiv').is(':visible') ){
			  if((selectedTask!==null)){			
				taskSelected = $autocompleteTasks.find('tr').eq(selectedTask).find("input").val();				
				$j.handleTask();
			  }	
		  }		  		  
		}	
	});
	
	
	if (${fn:length(locations) == 1}) {
		$j(".locationListRow").click();
	}

});	 
	
</script>

<div class="topBar fullBar">
	<p id="headerLocationName"></p>
	<p id="headerTaskName"></p>
</div>

<div class="mainArea fullBar largeFont boldFont">
	<table class="maxSize">
		<tr>
			<td align="center" valign="center">
				<form id="selectLocationForm" name="selectLocationForm" method="post">
					<div id="locationDiv" class="selectLocationClass">
						<table align="center" width="80%">
							<tr>
								<td align="left" style="padding: 5px"><spring:message
									code="patientregistration.selectLocation" /></td>
							</tr>
							<br />
							<tr>
								<td align="left">
								<table width="100%" style="border: solid 1px;">
									<tr>
										<td align="left" style="padding: 0px"><input type="hidden"
											id="location" name="location" value="" />
										<table class="locationList" width="100%">
											<c:forEach var="loc" items="${locations}" varStatus="i">
												<c:if test="${i.count % 2 == 0 }">
													<c:set var="rowColor" value="evenRow" />
												</c:if>
												<c:if test="${i.count % 2 != 0 }">
													<c:set var="rowColor" value="oddRow" />
												</c:if>
												<tr
													class="locationListRow ${rowColor} <c:if test="${loc == registration_location}">highlighted</c:if>">
													<td class="locationListItem" style="padding: 5px">${loc.name}</td>
													<td class="locationListItemId" id="locationTd${loc.id}"><input
														type="hidden" id="locationSelected${loc.id}" value="${loc.id}" />
													</td>
												</tr>
											</c:forEach>
										</table>
										</td>
									</tr>
								</table>
								</td>
							</tr>
						</table>
					</div>
					<div id="taskDiv" class="selectTaskClass">
						<table align="center" width="80%">
							<tr>
								<td align="left" style="padding: 5px;"><spring:message code="patientregistration.selectService" /></td>
							</tr>
							<br />
							<tr>
								<td align="left">
								<table width="100%" style="border: solid 1px;">
									<tr>
										<td align="left"><input type="hidden" id="task" name="task" value="" />
										<table class="taskList" width="100%">
											<c:forEach var="task" items="${tasks}" varStatus="i">
												<c:if test="${i.count % 2 == 0 }">
													<c:set var="rowColor" value="evenRow" />
												</c:if>
												<c:if test="${i.count % 2 != 0 }">
													<c:set var="rowColor" value="oddRow" />
												</c:if>
												<tr class="taskListRow ${rowColor} <c:if test="${task == registration_task}">highlighted</c:if>">
													<td class="taskListItem" style="padding: 5px"><spring:message code="patientregistration.tasks.${task}"/></td>
													<td class="taskListItemId" id="taskTd${task}">
														<input type="hidden" id="typeSelected${task}" value="${task}" />
													</td>
												</tr>
											</c:forEach>
										</table>
										</td>
									</tr>
								</table>
								</td>
							</tr>
						</table>
					</div>
				</form>
			</td>
		</tr>
		<tr>
			<td>&nbsp;</td>
		</tr>
	</table>
</div>

<div class="bottomBar fullBar">
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>