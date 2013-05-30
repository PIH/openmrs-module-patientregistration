<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>


<openmrs:htmlInclude file="/moduleResources/patientregistration/patientDashboard.js"/>

<script type="text/javascript"><!--
	var taskName="${task}";
	var nextTask="${nextTask}";
	var patient = "${patient}";
	var patientId ="${patient.id}";
	var firstNameVal = "${patient.givenName}";
	var lastNameVal = "${patient.familyName}";
	var genderVal = "${patient.gender}";
	var patientBirthdate = '<openmrs:formatDate date="${patient.birthdate}" format="${_dateFormatDisplayDash}"/>';
	
	var patientPreferredIdentifier = "${preferredIdentifier}";
	var cardCounterMessage = '<spring:message code="patientregistration.idCardCounter"/>'; 
	var cardPrintedStatus = "${cardInfo.printingObs.valueText}";
	var cardPrintedLastDate="${cardInfo.lastPrintingDate}";
	var cardPrintedCounter = "${cardInfo.printingCounter}";
	var scanIdCard = "${scanIdCard}";
	var cardPrintedStatusDate = "${cardInfo.printingObs.obsDatetime}";	
	var statusLabel = '<spring:message code="patientregistration.idCardPrinted"/>' + ":";
	var statusDateValue = '<patientregistration:pocFormatDate date="${cardInfo.printingObs.obsDatetime}" format="${_dateFormatDisplayDash}"/>';
	var duplicatePatientsAlert='<spring:message code="patientregistration.duplicatePatientsFound"/>'; 
	
	var patientIdLabel = 'patientId';
	var bornLabel = '<spring:message code="patientregistration.person.birthdate"/>'; 
	var personDateCreatedLabel = '<spring:message code="patientregistration.person.dateCreated"/>'; 
	var address1Label = '<spring:message code="patientregistration.person.address.address1"/>'; 
	var cityVillageLabel = '<spring:message code="patientregistration.person.address.cityVillage"/>'; 
	var zlEmrIdLabel = '<spring:message code="patientregistration.patient.zlEmrId"/>'; 
	var dossierNumberLabel= '<spring:message code="patientregistration.menu.numero"/>'; 	
	var firstEncounterDateLabel = '<spring:message code="patientregistration.patient.firstEncounterDate"/>'; 	
	var dentalDossierTypeId="${dentalDossier.identifierType.id}"
		
	var adultUnknownAgeLabel = '<spring:message code="patientregistration.person.adultUnknownAge"/>';
	var childUnknownAgeLabel = '<spring:message code="patientregistration.person.childUnknownAge"/>';
	var birthdateYear= parseInt('<openmrs:formatDate date="${patient.birthdate}" format="yyyy"/>', 10);
	
	
	
</script>

<!-- SPECIALIZED STYLES FOR THIS PAGE -->
<style type="text/css">


</style>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>
	
<div class="middleArea">
	<div class="menu" id="menuArea">
		<table class="menu">
			<tr>
				<th class="menu"><spring:message code="patientregistration.patientDashboard.title" /></th>
			</tr>
			<tr>
				<td id="overviewMenu" class="menu highlighted"><spring:message code="patientregistration.patientDashboard.overview" /></td>
			</tr>
			<tr>
				<td id="encountersMenu" class="menu"><spring:message code="patientregistration.patientDashboard.encounters" /></td>
			</tr>
		</table>
	</div>
   
	<div class="partBar mainArea largeFont">
		<div id="overviewDashboardDiv" class="padded">
			<table id="overviewTable" width="100%">				
				<tr>
					<td width="50%" valign="top">
						<table width="100%">
							<tr>
								<td class="labelSmall">
									<spring:message code="patientregistration.person.name"/>
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="75%">
									${patient.personName}
								</td>
								<td width="5%">&nbsp;
								</td>
								<td class="leftalign" width="20%">									
									<button type="button" class="editPatientDemo editDemoDiv" id="lastNameDiv" />
								</td>
							</tr>
							<tr>
								<td class="labelSmall">
									<spring:message code="patientregistration.gender"/>
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="75%">
									${patient.gender}
								</td>
								<td width="5%">&nbsp;
								</td>
								<td class="leftalign" width="20%">								
									<button type="button" class="editPatientDemo editDemoDiv" id="genderDiv" />
								</td>
							</tr>
							<tr>
								<td class="labelSmall">
									<spring:message code="patientregistration.person.birthdate"/>
								</td>
							</tr>
							<tr>
								<td id="tdAge" class="questionBox" width="75%">
								    <openmrs:formatDate date="${patient.birthdate}" format="${_dateFormatDisplayDash}"/>
									<c:if test="${patient.birthdateEstimated == true}">
										(<spring:message code="patientregistration.person.birthdate.estimated"/>)
									</c:if>	
									
								</td>
								<td width="5%">&nbsp;
								</td>
								<td class="leftalign" width="20%">								
									<button type="button" class="editPatientDemo editDemoDiv" id="ageEstimateDiv" />
								</td>
							</tr>
							<tr>
								<td class="labelSmall">
									<spring:message code="patientregistration.person.address"/>
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="75%">
									<table>									
									<tr>										
										<td>
											<span class="labelVerySmall"><spring:message code="patientregistration.person.address.address2"/>:</span>
										</td>	
										<td>
											<span>${patient.personAddress['address2']}</span><br>
										</td>											
									</tr>										
									</table>
								</td>
								<td width="5%">&nbsp;
								</td>
								<td class="leftalign" width="20%">									
									<button type="button" class="editPatientDemo editDemoDiv" id="addressLandmarkDiv" />
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="75%">
									<table>
									<c:forEach var="addressLevel" items="${addressHierarchyLevels}">
										<c:if test="${addressLevel != 'address2'}">
										<tr>										
											<td>
												<span class="labelVerySmall"><spring:message code="patientregistration.person.address.${addressLevel}"/>:</span>
											</td>	
											<td>
												<span>${patient.personAddress[addressLevel]}</span><br>
											</td>											
										</tr>	
										</c:if>
									</c:forEach>
									</table>
								</td>
								<td width="5%">&nbsp;
								</td>
								<td class="leftalign" width="20%">									
									<button type="button" class="editPatientDemo editDemoDiv" id="possibleLocalityDiv" />
								</td>
							</tr>
						</table>
					</td>					
					<td width="50%" valign="top">
						<table width="100%">
							<tr>
								<td class="labelSmall">
									<spring:message code="patientregistration.registrationEncounter.date"/>
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="60%">
									<patientregistration:pocFormatDate date="${registrationEncounter.encounterDatetime}" format="${_dateFormatDisplayDash}"/>
								</td>
								<td width="3%">&nbsp;
								</td>
								<td class="leftalign" width="17%">									
									<button type="button" class="editPatientDemo editDemoDiv" id="encounterDateDiv" />
								</td>
								<td width="3%">&nbsp;
								</td>
								<td width="17%">&nbsp;
								</td>
							</tr>
							<form id="printIDCardForm" method="post">
							<tr>
								<td class="labelSmall">
									${preferredIdentifier.identifierType.name}
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="60%">${preferredIdentifier}&nbsp;
								</td>
								<td width="3%">&nbsp;
								</td>
								<td width="17%">&nbsp;									
								</td>
								<td width="3%">&nbsp;
								</td>
								<td width="17%" class="leftalign">
																	
								</td>
							</tr>
							</form>
							<form id="printLabelForm" method="post">
							<c:if test="${!empty numeroDossier}">							
							<tr>
								<td class="labelSmall">
									${numeroDossier.identifierType.name}
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="60%">
									<c:if test="${!empty numeroDossier.identifier}"> 
										${numeroDossier.identifier}&nbsp;(<spring:message code="patientregistration.outpatient"/>)
									</c:if>		
								</td>
								<td width="3%">&nbsp;
								</td>
								<td width="17%" class="leftalign">									
									<button type="button" class="editPatientDemo" id="editDossier" />
								</td>
								<td width="3%">&nbsp;
								</td>
								<td width="17%" class="leftalign">																		
									
								</td>
							</tr>
							</c:if>	
							</form>
																
							<tr>
								<td class="labelSmall">
									<spring:message code="patientregistration.treatment.status"/>
								</td>
							</tr>
							<tr>
								<td class="questionBox" width="60%">
									${choleraStatus}
								</td>
								<td width="3%">&nbsp;
								</td>
								<td class="leftalign" width="17%">									
									<button type="button" class="editPatientDemo editDemoDiv" id="treatmentStatusDiv" />
								</td>
								<td width="3%">&nbsp;
								</td>
								<td width="17%">&nbsp;
								</td>
							</tr>
							
							<tr>
								<td class="labelSmall">
									&nbsp;
								</td>
							</tr>
							<tr>
								<td class="labelSmall">									
									<span id="lastStatusLabel" name="lastStatusLabel">
									</span>
									<br/>
									<span id="lastStatusDate" name="lastStatusDate">										
									</span>
								</td>
							</tr>
							
						</table>
					</td>
				</tr>
			</table>			
		</div>
		<div id="encounterDashboardDiv" class="padded hiddenDiv">
			<table class="patientDashboardTable">
				<tr>		
					<th><spring:message code="patientregistration.patientDashboard.recentEncounters" />:</th>
				</tr>
				<tr>		
					<td style="vertical-align: top;"> 
						<table style="width:100%; cell-padding:10px;">
							<tr style="background-color: gray; color: white;">
								<th class="encounter"><spring:message code="patientregistration.date" /></th>
								<th class="encounter"><spring:message code="patientregistration.encounterType" /></th>
								<th class="encounter"><spring:message code="patientregistration.location" /></th>
								<th class="encounter"><spring:message code="patientregistration.createdBy" /></th>
							</tr>
							<openmrs:forEachEncounter encounters="${encounters}" sortBy="encounterDatetime" descending="true" var="enc">
								<tr class="<c:choose><c:when test="${count % 2 == 0}">alt0</c:when><c:otherwise>alt1</c:otherwise></c:choose>">									
									<td class="encounter">										
										<patientregistration:pocFormatDate date="${enc.encounterDatetime}" format="${_dateFormatDisplayDash}"/>
									</td>						
									<td class="encounter">
										
										<c:if test="${!empty encounterLocale[enc.encounterType.id]}">
											<c:set var="locEncounterName" value="${encounterLocale[enc.encounterType.id]}"/>													
										</c:if>
										<c:choose>
											<c:when test="${!empty encounterLocale[enc.encounterType.id]}">
												<c:set var="locEncounterName" value="${encounterLocale[enc.encounterType.id]}"/>
											</c:when>	
											<c:otherwise>
												<c:set var="locEncounterName" value="${enc.encounterType.name}"/>												
											</c:otherwise>											
										</c:choose>
										<c:choose>
											<c:when test="${!empty editURLs[enc.encounterType.id]}">
											<a href='${pageContext.request.contextPath}/${editURLs[enc.encounterType.id]}?patientId=${patient.id}&encounterId=${enc.id}'>
												${locEncounterName}
											</a>
											</c:when>	
											<c:otherwise>
												${locEncounterName}
											</c:otherwise>											
										</c:choose>
										
									</td>
									<td class="encounter">${enc.location.name}</td>
									<td class="encounter">${enc.creator.personName}</td>						
								</tr>
							</openmrs:forEachEncounter>				
						</table>
					</td>
				</tr>
			</table>
		</div>		
	</div>
</div>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>
