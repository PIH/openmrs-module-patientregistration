<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/primaryCareVisitEncounter.js"/>
<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">
	
	var encounterProviderId = "${encounterProvider.id}";
	var encounterProviderName = "${encounterProvider.familyName}" + " " + "${encounterProvider.givenName}";
	
	var providerIdentifierType = "${providerIdentifierType}";
	
	var providersData = [ 
		<c:forEach var="provider" items="${providers}" varStatus="i">             
		   { label: "${provider.familyName} ${provider.givenName}" + " (" + "${provider.person.attributeMap[providerIdentifierType]}" + ")"
		   , value: "${provider.id}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	
	var diagnosisData = [ 
		<c:forEach var="answer" items="${coded.answers}" varStatus="i">             
		   { label: "${answer.key}", value: "${answer.value}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	var notifyingDiseasesData = [ 
		<c:forEach var="disease" items="${notifyingDiseases}" varStatus="i">             
		   { label: "${disease.key}", value: "${disease.value}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];
	var urgentDiseasesData = [ 
		<c:forEach var="disease" items="${urgentDiseases}" varStatus="i">             
		   { label: "${disease.key}", value: "${disease.value}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	
	var ageRestrictedDiseasesData = [ 
		<c:forEach var="disease" items="${ageRestrictedDiseases}" varStatus="i">             
		   { label: "${disease.key}", value: "${disease.value}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	
	var nonCodedDiagnosisData = [ 
		<c:forEach var="nonCodedDiagnosis" items="${nonCoded}" varStatus="i">             
		   { label: "${nonCodedDiagnosis}", value: "${nonCodedDiagnosis}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	
	var todayDiagnosisData = [ 
		<c:forEach var="diag" items="${todayDiagnosis}" varStatus="i">             
		   { label: "${diag.label}", id: "${diag.id}", type: "${diag.type}" }      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	
	var patientDiagnosisData = [ 
		<c:forEach var="patientDiag" items="${patientDiagnosis}" varStatus="i">             
		   { receptionEncounterId: "${patientDiag.receptionEncounterId}",
		   receptionEncounterDate: "${patientDiag.receptionEncounterDate}", 
		   receptionEncounterYear: "${patientDiag.year}", 
		   receptionEncounterMonth: "${patientDiag.month}", 
		   receptionEncounterDay: "${patientDiag.day}", 
		   today: "${patientDiag.today}",
		   patientObservations: { patientObservation: [
				   <c:forEach var="patientObs" items="${patientDiag.patientObservation}" varStatus="j">
						{ label: "${patientObs.label}", id: "${patientObs.id}", type: "${patientObs.type}", notifiable: "${patientObs.notifiable}" }      
						<c:if test="${!j.last}">,</c:if>   
				   </c:forEach>
				   ]
				}
			}      
		   <c:if test="${!i.last}">,</c:if>   
		</c:forEach>
	];	
	var patientId = '${patient.id}';
	var patientAge = '${patient.age}';
	var patientBirthdate= '<openmrs:formatDate date="${patient.birthdate}" format="${_dateFormatDisplayDash}"/>';
					
					
	var encounterYear= '<openmrs:formatDate date="${encounterDate}" format="yyyy"/>';
	var encounterMonth = parseInt('<openmrs:formatDate date="${encounterDate}" format="MM"/>', 10);
	var monthData = [<c:forEach begin="1" end="12" varStatus="i">'<spring:message code="patientregistration.month.${i.count}"/>',</c:forEach>];
	var encounterMonthLabel = monthData[encounterMonth -1];
	var encounterDay = '<openmrs:formatDate date="${encounterDate}" format="dd"/>';
	var todayLabel = '<spring:message code="patientregistration.today"/>';
	var jsEncounterDate = '<openmrs:formatDate date="${encounterDate}" format="${_dateFormatDisplayDash}"/>'; 
	var jsAddDiagnosis = '<spring:message code="patientregistration.addDiagnosis"/>';
	var jsDiagnosisFor = '<spring:message code="patientregistration.diagnosisFor"/>';
	var jsPatientAgeMsg = '<spring:message code="patientregistration.patientAgeMsg"/>';
	var removeDiagnosisLabel = '<spring:message code="patientregistration.removeDiagnosis"/>';
	var cancelLabel = '<spring:message code="patientregistration.cancel"/>';
	var leavePageAlert = '<spring:message code="patientregistration.alert.leavePageConfirmation"/>';
	var providerLabel = '<spring:message code="patientregistration.provider"/>';
	
</script>
	
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>		

<div class="middleArea">

	<div class="menu" id="menuArea">
	<table class="menu">
		<tr>
			<th class="menu"><spring:message code="patientregistration.tasks.${registration_task}"/></th>
		</tr>
		<tr>
			<td class="menu highlighted" id="encounterDateMenu">
				<spring:message code="patientregistration.encounterDate"/>
			</td>
		</tr>
		<tr>
			<td class="menu highlighted" id="providerMenu">
				<spring:message code="patientregistration.provider"/>
			</td>
		</tr>
		<tr>
			<td class="menu" id="diagnosisMenu">${!empty coded.label ? coded.label : coded.concept.name}</td>
		</tr>		
		
		<!-- DISPLAY LABEL FOR CONFIRMATION PAGE -->
		<tr>
			<td class="menu" id="confirmMenu"><spring:message code="patientregistration.taskItem.encounter.confirmDetails"/></td>
		</tr>
	</table>
	</div>
	
	<c:if test="${!empty diagnosisError}">
		<div id="errorArea">
			<span class="error"><spring:message code="${diagnosisError}"/>:&nbsp;"${diagnosisError}"</span>
		</div>
	</c:if>
	
	<div class="partBar mainArea largeFont">
			
		<div id="encounterDateDiv" name="encounterDateDiv" class="padded">	
			<table height="100%" width="100%">												
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.selectVisitDate"/></b>
					</td>											
				</tr>								
				<tr>
					<td>	
						
						<table width="100%" id="receptionDateList" class="questionBox encounterDateList">	
							<c:forEach var="patientDiag" items="${patientDiagnosis}" varStatus="i">             
								<c:set var="receptionId" value="${patientDiag.receptionEncounterId}" />								
								<c:if test="${i.count % 2 == 0 }">
									<c:set var="rowColor" value="evenRow" />
								</c:if>
								<c:if test="${i.count % 2 != 0 }">
									<c:set var="rowColor" value="oddRow" />
								</c:if>
								<c:choose>									
									<c:when test="${i.count == 1}">
										<c:set var="highClass" value="highlighted" />
									</c:when>
									<c:otherwise>
										<c:set var="highClass" value="not-highlighted" />				
									</c:otherwise>
								</c:choose>									
								<tr id="receptionTr${patientDiag.receptionEncounterId}" class="dateListRow biggerRow ${rowColor} ${highClass}">		
									<input type="hidden" id="receptionInput${receptionId}" name="receptionInput${receptionId}" value="${receptionId}">
									<td class="questionAnswer" id="receptionTd${patientDiag.receptionEncounterId}">										
										<patientregistration:pocFormatDate date="${patientDiag.receptionEncounterDate}" format="${_dateFormatDisplayDash}"/>
											<c:if test="${patientDiag.today == true}"><span class="boldFont">(<spring:message code="patientregistration.today"/>)</span></c:if> 
											<c:forEach var="patientObs" items="${patientDiag.patientObservation}" varStatus="j">
												<c:if test="${j.first}"><span class="smallerFont greyColor">(</c:if>
													<c:if test="${patientObs.notifiable == true}"><span class="smallerFont redColor"></c:if>
												${patientObs.label}
													<c:if test="${patientObs.notifiable == true}"></span></c:if>
												<c:choose>
													<c:when test="${j.last}">
														)</span>
													</c:when>
													<c:otherwise>
														,
													</c:otherwise>	
												</c:choose>												
											</c:forEach>
									</td>
								</tr>
							</c:forEach>																								
						</table>
					</td>						
				</tr>
				<tr class="spacer">
				</tr>
				<tr>
					<td>
						<table class="maxSize">
							<tr id="plusEncounterRow" class="left rowToHighlight">						
								<td id="plusEncounterLabelColumn" width="25%" class="smallerFont">							
									<spring:message code="patientregistration.visitNotListed"/>?<br>
									<spring:message code="patientregistration.addReceptionEncounter"/>:<br>
								</td>
								<td id="plusEncounterColumn" width="10%">
									<button id="plusEncounterBtnId" name="plusEncounterBtnId" class="plusBtnImg" type="button" align="left"></button>
								</td>
								<td width="65%">
									&nbsp;
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
			
		</div>	
		
		<div id="addProviderDiv" name="addProviderDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.addProvider"/>
									</b>
								</td>								
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">
						<div id="addProviderTableDiv" style="overflow: auto; height: 300px; width:95%;">
							<input id="addProviderAutocomplete" name="addProviderAutocomplete" class="inputField" style="width:95%;"/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>	
						</div>
					</td>
				</tr>							
			</table>					
		</div>
		
		<div id="addDiagnosisDiv" name="addDiagnosisDiv" class="padded hiddenDiv">												
			<div id="leftAddDiagnosisDiv" name="leftAddDiagnosisDiv">	
				<table id="plusDiagnosisTable" name="plusDiagnosisTable" height="100%" width="100%" cellpadding="20">										
					<tr id="plusDiagnosisRow" name="plusDiagnosisRow" class="leftalign rowToHighlight" style="width:450px;">
						<td id="jsAddDiagnosisId" name="jsAddDiagnosisId" class="padded" style="width:100%;">
							<span id="addDiagnosisLabelId" class="boldFont"><spring:message code="patientregistration.addDiagnosis"/></span>
						</td>										
						<td id="plusColumnId" name="plusColumnId">
							<button id="plusBtnId" name="plusBtnId" class="plusDiagnosisClick plusBtnImg" type="button" align="left"></button>
						</td>
					</tr>	
					<tr id="autocompleteRowId" name="autocompleteRowId" class="leftalign">						
					</tr>
				</table>
			</div>
			<div id="rightAddDiagnosisDiv" name="rightAddDiagnosisDiv">
				<form id="diagnosisForm" name="diagnosisForm" method="post">
					<input type="hidden" id="listOfDiagnosis" name="listOfDiagnosis" value="">
					<input type="hidden" id="hiddenEncounterYear" name="hiddenEncounterYear" value="">
					<input type="hidden" id="hiddenEncounterMonth" name="hiddenEncounterMonth" value="">
					<input type="hidden" id="hiddenEncounterDay" name="hiddenEncounterDay" value="">
					<input type="hidden" id="hiddenProviderId" name="hiddenProviderId" value="">
					<table id="diagnosisTableListId" class="diagnosisTableList">							
					</table>
				</form>	
			</div>																
		</div>	
		<div id="dialog-confirm" title='<spring:message code="patientregistration.removeDiagnosis"/>?' class="padded hiddenDiv">			
		</div>	
		<div id="dialog-urgentDisease" name="dialog-urgentDisease" title='<spring:message code="patientregistration.notifiableDisease"/>?' class="padded hiddenDiv">	
			<table class="maxSize">							
				<tr>
					<td>
						<b><span style="font-size:1.3em; color:black; text-align:center;"><spring:message code="patientregistration.reportDisease"/>!</span></b>
						<br>
						<br>
						<b><span id="notifiableDiseaseMsg" name="notifiableDiseaseMsg" style="color:red; text-align:center;"></span></b>					
					</td>
				</tr>
				<tr>
					<td>
						<table id="notifiableDiseaseTable" class="notifiableDiseaseList">
						</table>
					</td>
				</tr>
			</table>	
		</div>
		<div id="dialog-ageRestrictedDisease" name="dialog-ageRestrictedDisease" title='<spring:message code="patientregistration.ageRestrictedDisease"/>' class="padded hiddenDiv">	
			<table class="maxSize">							
				<tr>
					<td>
						<b><span id="patientAgeMsg" name="patientAgeMsg" style="font-size:1.3em; color:black; text-align:center;"></span></b>
						<br>
						<b><span style="font-size:1.3em; color:black; text-align:center;"><spring:message code="patientregistration.reportAgeRestrictedDisease"/>?</span></b>
						<br>
						<br>
						<b><span id="ageRestrictedMsg" name="ageRestrictedMsg" style="color:red; text-align:center;"></span></b>					
					</td>
				</tr>
				<tr>
					<td>
						<table id="ageRestrictedDiseaseTable" class="ageRestrictedDiseaseList">
						</table>
					</td>
				</tr>
			</table>	
		</div>
	</div>
	<div id="confirmMessageArea" class="hiddenDiv">
		<spring:message code="patientregistration.confirmDiagnosis"/>
	</div>
	
	<div id="uncodedMessageArea" class="hiddenDiv" style="overflow: hidden;" title="">	
		<table width="100%">							
			<tr>
				<td>
					<b><span id="codedMatches" name="codedMatches"></span></b>
					<spring:message code="patientregistration.matchesFor"/>
					<b><span id="stringToMatch" name="stringToMatch"></span></b>
					<br>					
					<br>					
					<spring:message code="patientregistration.selectMatch"/>
				</td>
			</tr>
			<tr>												
				<td style="text-align:left;border:solid 1px;">
					<div id="overflowDiv" style="overflow-x: hidden; overflow-y:auto; height: 220px; width:100%">
						<table id="confirmDiagnosisList" class="existingDiagnosisList searchTableList">
						</table>
					</div>
				</td>
			</tr>					
		</table>	
	</div>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>