<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/patientDemo.js"/>

<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">
	var choleraTreatment = "${choleraTreatment}";
	var choleraTreatmentConceptId = "${choleraTreatment.concept.id}";
	var nextTask = "${nextTask}";
	var currentTask = "${currentTask}";
	var maleGender = '<spring:message code="patientregistration.gender.M"/>';
	var femaleGender = '<spring:message code="patientregistration.gender.F"/>';
	var birthdateLabel = '<spring:message code="patientregistration.person.birthdate"/>' + ":" ;
	var adultUnknownAgeLabel = '<spring:message code="patientregistration.person.adultUnknownAge"/>';
	var childUnknownAgeLabel = '<spring:message code="patientregistration.person.childUnknownAge"/>';
	var ageEstimateLabel = '<spring:message code="patientregistration.ageEstimate"/>' + ":" ;
	var estimateYearsLabel = '<spring:message code="patientregistration.years"/>';
	var estimateMonthsLabel = '<spring:message code="patientregistration.months"/>';
	var currentYear = parseInt((new Date()).getFullYear(), 10);
	var birthdateEstimateYears= currentYear - parseInt("${birthdate.year}", 10);
	var	birthdateEstimateMonths="${birthdate.month}";
	var similarAlert='<spring:message code="patientregistration.similarAlert"/>';
	var similarExactAlert='<spring:message code="patientregistration.similarExactAlert"/>';
	var similarSoundexAlert='<spring:message code="patientregistration.similarSoundexAlert"/>';
	var similarFilterAlert='<spring:message code="patientregistration.similarFilterAlert"/>';
	var addressNotKnownLabel= '<spring:message code="patientregistration.person.addressNotFound"/>';
	var leavePageAlert = '<spring:message code="patientregistration.alert.leavePageConfirmation"/>';
	var todayLabel = '<spring:message code="patientregistration.today"/>';
	var encounterDay = '<openmrs:formatDate date="${encounterDate}" format="dd"/>';
	var encounterYear= '<openmrs:formatDate date="${encounterDate}" format="yyyy"/>';
    var encounterMonth = parseInt('<openmrs:formatDate date="${encounterDate}" format="MM"/>', 10);
	var monthData = [<c:forEach begin="1" end="12" varStatus="i">'<spring:message code="patientregistration.month.${i.count}"/>',</c:forEach>];
	var encounterMonthLabel = monthData[encounterMonth -1];
	var firstNameVal='';
	var lastNameVal='';	
	var phoneNumber='';
	var patientId = '';
	var editDivId="${editDivId}";
	patientId="${patient.id}";
	var editPatientIdentifier = "${patientPreferredIdentifier}";
	if(patientId.length>0){
		firstNameVal= "${patient.givenName}"; 
		lastNameVal= "${patient.familyName}"; 
		<openmrs:forEachDisplayAttributeType personType="patient" displayType="viewing" var="attrType">
			phoneNumber = '${patient.attributeMap[attrType.name].hydratedObject}';
		</openmrs:forEachDisplayAttributeType>		
	}
	var genderVal = "${patient.gender}"; 
	var patientBirthdate= '<openmrs:formatDate date="${patient.birthdate}" format="${_dateFormatInput}"/>';	
	var birthdateDay=0;
	var birthdateMonth='';
	var birthdateMonthId=0;
	var birthdateYear=0;
	if(patientBirthdate.length>1){
		var elements = patientBirthdate.split("/");
		if(elements.length ==3){
			birthdateDay = elements[0];
			birthdateMonthId = elements[1];
			birthdateYear = elements[2];
			birthdateMonthId = parseInt(birthdateMonthId, 10) -1;
			birthdateMonth = monthData[birthdateMonthId];
		}
	}
	var personAddress='';
	var iterator=0;
	var patientAddress = "${patient.personAddress}";
	if(patientAddress.length>0){
		<c:forEach var="addressLevel" items="${addressHierarchyLevels}">									
			if(iterator==0){
				personAddress = personAddress + "${patient.personAddress[addressLevel]}";		
			}else{			
				personAddress = personAddress + "," + "${patient.personAddress[addressLevel]}";	
			}				
			iterator = iterator + 1;
		</c:forEach>
		console.log("enterPatientDemo.jsp:personAddress=" + personAddress);		
		
	}
	var departmentsData= new Array();
	var communeData= new Array();
	var sectionCommuneData= new Array();
	var localitieData= new Array();
	
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
			<th class="menu"><spring:message code="patientregistration.lookUpByName"/></th>
		</tr>
		<tr>
            <td class="menu highlighted" id="encounterDateMenu">
                <spring:message code="patientregistration.encounterDate"/>
            </td>
        </tr>
		<tr>
			<td class="menu highlighted" id="nameMenu"><spring:message code="patientregistration.person.name"/></td>
		</tr>
		<tr>
			<td class="menu" id="genderMenu"><spring:message code="patientregistration.gender"/></td>
		</tr>
		<tr>
			<td class="menu" id="ageMenu"><spring:message code="patientregistration.age"/></td>
		</tr>
		<tr>
			<td class="menu" id="addressMenu"><spring:message code="patientregistration.person.address"/></td>
		</tr>
		<tr>
			<td class="menu" id="treatmentStatusMenu"><spring:message code="patientregistration.treatment.status"/></td>
		</tr>
		<tr>
			<td class="menu" id="confirmMenu"><spring:message code="patientregistration.person.confirm"/></td>
		</tr>
		
	</table>
	</div>

	<div class="partBar mainArea largeFont">
	
		<form id="patientNameSearch" method="post">	
			<input type="hidden" id="searchFieldName" name="searchFieldName" value="" />
			<input type="hidden" id="resultsCounter" name="resultsCounter" value="8" />
		</form>	
		
		<div id="encounterDateDiv" name="encounterDateDiv" class="padded">
			<table height="100%" width="100%">
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.encounterDate"/></b>
					</td>
				</tr>
				<tr>
					<td>

						<table width="100%" class="questionBox encounterDateList">
							<input type="hidden" id="encounterDateInstance" name="encounterDateInstance"/>
							<tr id="todayDateRow" name="todayDateRow" class="dateListRow">
								<td class="questionAnswer" id="todayEncounterDate" name="todayEncounterDate">
								</td>
							</tr>
							<tr id="pastDateRow" name="pastDateRow" class="dateListRow">
								<td class="questionAnswer" id="pastEncounterDate" name="pastEncounterDate">
									<spring:message code="patientregistration.taskItem.encounter.pastVisit"/>
								</td>

							</tr>
						</table>
					</td>
				</tr>
				
			</table>
		</div>
		<div id="yearDiv" name="yearDiv" class="padded hiddenDiv">
			<table height="100%" width="100%">
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.year"/></b>
					</td>
				</tr>
				<tr>
					<td>
						<input class="inputField highlighted" type="text" id="encounterYear" name="encounterYear" value="" style="width:100%;"/>
					</td>
				</tr>
			</table>
		</div>
		<div id="monthDiv" name="monthDiv" class="padded hiddenDiv">
			<table height="100%" width="80%">
				<tr>
					<td colspan="4">
						<i class="leftalign"><spring:message code="patientregistration.encounterDate"/>:
							<span class="dateSpan"></span>
						</i>
					</td>
				</tr>

				<tr><td>&nbsp;</td></tr>
				<tr>
					<td colspan="4">
						<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.month"/></b>
					</td>
				</tr>
				<tr>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 1}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.1"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="1" class="radioClass"<c:if test='${encounterMonth == 1}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 2}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.2"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="2" class="radioClass"<c:if test='${encounterMonth == 2}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 3}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.3"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="3" class="radioClass"<c:if test='${encounterMonth == 3}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 4}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.4"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="4" class="radioClass"<c:if test='${encounterMonth == 4}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 5}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.5"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="5" class="radioClass"<c:if test='${encounterMonth == 5}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 6}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.6"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="6" class="radioClass"<c:if test='${encounterMonth == 6}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 7}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.7"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="7" class="radioClass"<c:if test='${encounterMonth == 7}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 8}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.8"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="8" class="radioClass"<c:if test='${encounterMonth == 8}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
				</tr>

				<tr>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 9}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.9"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="9" class="radioClass"<c:if test='${encounterMonth == 9}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 10}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.10"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="10" class="radioClass"<c:if test='${encounterMonth == 10}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 11}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.11"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="11" class="radioClass"<c:if test='${encounterMonth == 11}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
					<td width="25%">
						<table width="100%">
							<tr class="radioItem <c:if test='${encounterMonth == 12}'> highlighted</c:if>">
								<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.12"/></b></td>
								<td width="20%"><b class="leftalign"><input type="radio" value="12" class="radioClass"<c:if test='${encounterMonth == 12}'> checked</c:if>/></b></td>
							</tr>
						</table>
					</td>
				</tr>

			</table>
		</div>
		<div id="dayDiv" name="dayDiv" class="padded hiddenDiv">
			<table height="100%" width="100%">
				<tr>
					<td colspan="4">
						<i class="leftalign">
							<span class="dateSpan"></span>
						</i>
					</td>
				</tr>

				<tr><td>&nbsp;</td></tr>
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.day"/></b>
					</td>
				</tr>
				<tr>
					<td>
						<input class="inputField highlighted" type="text" id="encounterDay" name="encounterDay" value="" style="width:100%;"/>
					</td>
				</tr>
			</table>
		</div>

		
		<div id="firstNameDiv" name="firstNameDiv" class="firstNameClass padded hiddenDiv">					
			<table height="100%" width="100%">												
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.person.enterFirstName"/></b>
					</td>											
				</tr>	
				<tr>
					<td>
						<input class="inputField highlighted" type="text" id="patientInputFirstName" name="patientInputFirstName" value="" style="width:95%;" AUTOCOMPLETE='OFF'/>
						<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png" title='<spring:message code="patientregistration.clearEntry"/>'></img>
					</td>
				</tr>
				<tr>
					<td class="ajaxResultsCell">	
						<div id="firstNameTableDiv" class="ajaxResultsDiv">
							<table class="patientFirstNameList tableList" width="100%">								
							</table>
						</div>
					</td>						
				</tr>
			</table>
		</div>
		
		<div id="lastNameDiv" name="lastNameDiv" class="lastNameClass padded hiddenDiv">
			<table width="100%">												
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.person.enterLastName"/></b>
					</td>											
				</tr>	
				<tr>
					<td>
						<input class="inputField" type="text" id="patientInputLastName" name="patientInputLastName" value=""  style="width:95%;" AUTOCOMPLETE='OFF'/>
						<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>
					</td>
				</tr>
				<tr>
					<td class="ajaxResultsCell">	
						<div id="lastNameTableDiv" class="ajaxResultsDiv">
							<table class="patientLastNameList tableList" width="100%">								
							</table>
						</div>
					</td>						
				</tr>
			</table>
		</div>	
		
		<div id="genderDiv" name="genderDiv" class="padded hiddenDiv">
			<table width="100%">
				<tr>
					<td align="left" style="width:100%;">
						<b><spring:message code="patientregistration.person.enterGender"/></b>
					</td>											
				</tr>	
				
				<tr align="left" valign="top" style="height:330px;">
					<td>
						<table align="left" class="none" cellspacing="0">									
							<tr id="rdioTrM" name="rdioTrM" class="RadioClass">
								<td style="height : 50px;">
									<span><spring:message code="patientregistration.gender.M"/></span>
								</td>	
								<td style="height : 50px;">
									 <input type="radio" name="rdio" id="rdioM" value="M" class="radioClass"/><br>
								</td>
							</tr>
							<tr id="rdioTrF" name="rdioTrF">
								<td style="height : 50px;">
									<span><spring:message code="patientregistration.gender.F"/></span>
								</td>	
								<td style="height : 50px;">
									<input type="radio" name="rdio" id="rdioF" value="F" class="radioClass"/><br>
								</td>
							</tr>
						</table>
					</td>							
				</tr>
			</table>
		</div>
		
		<div id="birthdateDiv" name="birthdateDiv" class="birthdateClass padded hiddenDiv">
			<table style="width: 90%; cell-padding: 20px;">
				<tr>
					<td align="left"><b><spring:message
						code="patientregistration.person.enterBirthdate" /></b></td>
			
					<td align="right">
						<button id="unknownBirthdate" type="button" class="unknownBirthdate">
							<span class="largeFont"><spring:message code="patientregistration.person.birthdateUnknown"/></span>
						</button> 
					</td>
				</tr>
				<tr>
					<td align="left" colspan="2" height="20px"></td>
				</tr>
			</table>

			<table style="width: 90%;">				
				<tr align="left" valign="bottom" style="text-align:left;">	
					<td colspan="4">
						<c:if test="${fn:length(birthdateErrors.allErrors) > 0}">
							<c:forEach var="error" items="${birthdateErrors.allErrors}">
								<span class="error"><spring:message code="${error.code}"/></span>										
							</c:forEach>
							<br/>
						</c:if>
					</td>					
				</tr>					
				<tr>
					<td style="width:20%;">
						<input id="day" name="day" class="birthdateField inputField" AUTOCOMPLETE='OFF' value="${birthdate.day}" />
					</td>
					<td style="width:45%;">
						<input id="monthAutocomplete" class="birthdateField inputField" />																		
					</td>
					<td style="width:25%;" align="left">							
						<input id="year" name="year" class="birthdateField inputField" AUTOCOMPLETE='OFF' value="${birthdate.year}" />
					</td>
					<td>
						<button type="button" class="NavigationButton"  style="visibility: hidden;">
							<spring:message code="patientregistration.cancel"/>
						</button>
					</td>
				</tr>
				<tr font-size="small">
					<td>
						<spring:message code="patientregistration.day.long"/>
					</td>
					<td>
						&nbsp;
					</td>
					<td>
						<spring:message code="patientregistration.year.long"/>
					</td>
					<td>
						<button type="button" class="NavigationButton"  style="visibility: hidden;">
							<spring:message code="patientregistration.cancel"/>
						</button>
					</td>
				</tr>	
			</table>			
		</div>	
		
		<div id="ageEstimateDiv" name="ageEstimateDiv" class="birthdateClass padded hiddenDiv">					
			<table>
				<tr>
					<td style="text-align:left;">
						<b><spring:message code="patientregistration.ageEstimate"/></b>
					</td>
															
				</tr>
				<tr>
					<td align="left" colspan="2" height="20px"></td>
				</tr>
				<tr style="text-align:left; vertical-align:bottom">	
					<td>
						<c:if test="${fn:length(birthdateErrors.allErrors) > 0}">
							<c:forEach var="error" items="${birthdateErrors.allErrors}">
								<span class="error"><spring:message code="${error.code}"/></span>										
							</c:forEach>
							<br/>
						</c:if>
					</td>					
				</tr>					
				<tr style="text-align:left; vertical-align:top">
					<td>
						<input id="estimateYears" name="years" class="birthdateField inputField" AUTOCOMPLETE='OFF' value="${age.years}" />
					</td>							
					<td>							
						<input id="estimateMonths" name="months" class="birthdateField inputField" AUTOCOMPLETE='OFF' value="${age.months}"/>
					</td>
				</tr>	
				<tr font-size="small" style="text-align:center; vertical-align:bottom">
					<td>
						<spring:message code="patientregistration.years"/>
					</td>
					<td>
						<spring:message code="patientregistration.months"/>
					</td>							
				</tr>	
				<tr class="smallerspacer"></tr>
				<tr class="smallerspacer"></tr>
				<tr style="height:100px">
					<td align="center">
						<spring:message code="patientregistration.or"/>
					</td>
				</tr>
				<tr style="text-align:left; vertical-align:bottom">
					<td>
						<button id="unknownAdultAge" type="button" style="height: 45px; width: 450px; font-size:25px; font-weight:bold;" class="unknownBirthdate">
								<span class="largeFont"><spring:message code="patientregistration.person.adultUnknownAge"/></span>
						</button>
					</td>
					<td>
						
					</td>							
				</tr>	
				<tr class="smallerspacer"></tr>
				<tr class="smallerspacer"></tr>
				<tr style="text-align:left; vertical-align:bottom">
					<td>
						<button id="unknownChildAge" type="button" style="height: 45px; width: 450px; font-size:25px; font-weight:bold;" class="unknownBirthdate">
								<span class="largeFont"><spring:message code="patientregistration.person.childUnknownAge"/></span>
						</button>
					</td>
					<td>
						
					</td>							
				</tr>						
			</table>					
		</div>
		<div id="addressLandmarkDiv" name="addressLandmarkDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.person.address.enterLandmark"/>
									</b>
								</td>								
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">
						<div id="addressLandmarkTableDiv" style="overflow: auto; height: 300px; width:95%;">
							<input id="addressLandmarkField" class="inputField" style="width:95%;"/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>	
						</div>
					</td>
				</tr>							
			</table>					
		</div>
		<div id="possibleLocalityDiv" name="possibleLocalityDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.person.address.enterLocalitie"/>
									</b>
								</td>								
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">					
						<input id="possibleLocalityField" class="inputField" style="width:95%;"/>
						<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>						
					</td>
				</tr>	
				<tr>
					<td class="ajaxResultsCell">	
						<div id="possibleLocalityTableDiv" class="ajaxResultsDiv">
							<table class="tableList" id="possibleLocalityList" width="100%">								
							</table>
						</div>
					</td>						
				</tr>
				<tr>
					<td>
						<div id="confirmPossibleLocalityModalDiv" title="" class="hiddenDiv">
							<table width="100%">							
								<tr>
									<td>
										<spring:message code="patientregistration.person.address.locality"/>:&nbsp										
										<b><span id="possibleLocalityEntered" name="possibleLocalityEntered"></span></b>	
										<br>
										<br>
										<spring:message code="patientregistration.person.address.selectAddress"/>:
									</td>
								</tr>
								<tr>												
									<td style="text-align:left;border:solid 1px;">
										<div id="overflowPossibleLocalityDiv" style="overflow: auto; width:100%" >
											<table id="confirmPossibleLocalityModalList" class="searchTableList">
											</table>
										</div>
									</td>
								</tr>					
							</table>		
						</div>
					</td>
				</tr>
			</table>					
		</div>
		
		<div id="addressDepartmentDiv" name="addressDepartmentDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.person.address.enterDepartment"/>
									</b>
								</td>								
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">
						<div id="addressDepartmentTableDiv" style="overflow: auto; height: 300px; width:95%;">
							<input id="addressDepartmentAutocomplete" class="inputField" style="width:95%;"/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>	
						</div>
					</td>
				</tr>							
			</table>					
		</div>
		
		<div id="addressCommuneDiv" name="addressCommuneDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.person.address.enterCommune"/>
									</b>
								</td>								
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">
						<div id="addressCommuneTableDiv" style="overflow: auto; height: 300px; width:95%;">
							<input id="addressCommuneAutocomplete" class="inputField" style="width:95%;"/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>	
						</div>
					</td>
				</tr>							
			</table>					
		</div>
		
		<div id="addressSectionCommuneDiv" name="addressSectionCommuneDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.person.address.enterSectionCommune"/>
									</b>
								</td>
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">
						<div id="addressSectionCommuneTableDiv" style="overflow: auto; height: 300px; width:95%;">
							<input id="addressSectionCommuneAutocomplete" class="inputField" style="width:95%;"/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>	
						</div>
					</td>
				</tr>							
			</table>					
		</div>
		<div id="addressLocalitieDiv" name="addressLocalitieDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr>
					<td>
						<table width="95%">
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.person.address.enterLocalitie"/>
									</b>
								</td>								
							</tr>
						</table>
					</td>
				</tr>								
				<tr>
					<td align="left" style="width:95%; height:30px">
						<div id="addressLocalitieTableDiv" style="overflow: auto; height: 300px; width:95%;">
							<input id="addressLocalitieAutocomplete" class="inputField" style="width:95%;"/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>	
						</div>
					</td>
				</tr>							
			</table>					
		</div>
		<div id="treatmentStatusDiv" name="treatmentStatusDiv" class="padded hiddenDiv">					
			<table width="100%">
				<tr valign="top">
					<td align="left" style="padding: 5px">
						<b class="leftalign">${!empty choleraTreatment.label ? choleraTreatment.label : choleraTreatment.concept.name}</b>
					</td>
				</tr>
				<tr>
					<td align="left">
						<table width="100%" valign="top" style="border: solid 1px;">
							<tr>
								<td align="left" style="padding: 0px">
									<table id="visitReasonTable"  name="visitReasonTable" class="questionBox visitReasonList" width="100%">
										<input type="hidden" id="treatmentStatusObsId" name="treatmentStatusObsId" value="" />
										<c:forEach var="treatmentStatus" items="${choleraTreatment.answers}" varStatus="i">
											<c:if test="${i.count % 2 == 0 }">
												<c:set var="rowColor" value="evenRow" />
											</c:if>
											<c:if test="${i.count % 2 != 0 }">
												<c:set var="rowColor" value="oddRow" />
											</c:if>
											<tr id="treatmentStatusRow${i.count}" class="treatmentStatusListRow ${rowColor}">
												<td class="questionAnswer" id="treatmentStatus${i.count}">${treatmentStatus.key}
													<input type="hidden" id="treatmentStatusId" value="${treatmentStatus.value}"/>
													<input type="hidden" id="treatmentStatusSelected" value="0"/>
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
		
		<div id="confirmDiv" name="confirmDiv" class="confirmClass padded hiddenDiv">
			<form id="patientSearch" name="patientSearch" method="post">
				<input type="hidden" id="givenName" name="givenName" value="" />
				<input type="hidden" id="familyName" name="familyName" value="" />
			</form>
			<form id="confirmPatientInfoForm" name="confirmPatientInfoForm" method="post">
			    <input type="hidden" id="hiddenNextTask" name="hiddenNextTask" value="" />
				<table style="margin-left:5px;" width="95%">
					<tr>
						<td align="left" style="width:100%;">
							<b><spring:message code="patientregistration.confirmPatientDetails"/></b>
						</td>											
					</tr>	
					<tr align="left" valign="bottom" style="text-align:left;">	
						<td>
							<c:if test="${fn:length(birthdateErrors.allErrors) > 0}">
								<c:forEach var="error" items="${birthdateErrors.allErrors}">
									<span class="error"><spring:message code="${error.code}"/></span>										
								</c:forEach>
								<br/>
							</c:if>
						</td>					
					</tr>				
					<tr align="left" valign="top" style="text-align:left;height:250px">
						<td>
							<table>
								<tr>
									<td style="width:200px;">	
										<spring:message code="patientregistration.encounterDate"/>:											
									</td>
									<td>
										<b>
										<span id="confirmEncounterDate" name="confirmEncounterDate"></span>
										</b>																		
									</td>
								</tr>
								<tr>
									<td style="width:200px;">										
										<spring:message code="patientregistration.person.firstName"/>:
									</td>										
									<td>
										<b>
										<span id="confirmFirstName" name="confirmFirstName"></span>
										</b>
										<input type="hidden" id="hiddenConfirmFirstName" name="hiddenConfirmFirstName" value="" />
									</td>
								</tr>
								<tr>
									<td style="width:200px;">										
										<spring:message code="patientregistration.person.lastName"/>:
									</td>
									<td>
										<b>
										<span id="confirmLastName" name="confirmLastName"></span>
										</b>
										<input type="hidden" id="hiddenConfirmLastName" name="hiddenConfirmLastName" value="" />
									</td>
								</tr>
								<tr>
									<td style="width:200px;">										
										<spring:message code="patientregistration.gender"/>:
									</td>
									<td>
										<b>
										<span id="confirmGender" name="confirmGender"></span>
										</b>
										<input type="hidden" id="hiddenConfirmGender" name="hiddenConfirmGender" value="" />																								
									</td>
								</tr>
								<tr>
									<td style="width:200px;">	
										<span id="confirmBirthdateLabel" name="confirmBirthdateLabel"></span>												
									</td>
									<td>
										<b>
										<span id="confirmBirthdate" name="confirmBirthdate"></span>
										</b>
										<input type="hidden" id="hiddenConfirmDay" name="day" class="birthdateField" type="number" value="${birthdate.day}"/>
										<input type="hidden" id="hiddenConfirmMonth" name="month" class="birthdateField"  value="${birthdate.month}"/>
										<input type="hidden" id="hiddenConfirmYear" name="year" class="birthdateField" type="number" value="${birthdate.year}"/>
										<input type="hidden" id="hiddenConfirmEstimateYears" name="years" class="birthdateField" type="number" value="${age.years}"/>
										<input type="hidden" id="hiddenConfirmEstimateMonths" name="months" class="birthdateField" type="number" value="${age.months}"/>											
										<input type="hidden" id="hiddenPrintIdCard" name="hiddenPrintIdCard" value="no"/>
										<input type="hidden" id="hiddenEncounterYear" name="hiddenEncounterYear" value="">
										<input type="hidden" id="hiddenEncounterMonth" name="hiddenEncounterMonth" value="">
										<input type="hidden" id="hiddenEncounterDay" name="hiddenEncounterDay" value="">										
									</td>
								</tr>
								<tr>
									<td style="width:200px;">										
										<spring:message code="patientregistration.treatment.status"/>:
									</td>
									<td>
										<b>
										<span id="confirmTreatmentStatus" name="confirmTreatmentStatus"></span>
										<input type="hidden" id="hiddenConfirmTreatmentStatus" name="hiddenConfirmTreatmentStatus" value="" />
										</b>
									</td>
								</tr>
								<tr>
									<td class="confirmColumn"  valign="top">										
										<spring:message code="patientregistration.person.address"/>
									</td>
									<td>												
										<input type="hidden" id="hiddenPatientAddress" name="hiddenPatientAddress" class="address" value="${patient.personAddress}"/>									
									</td>
								</tr>
								<tr>
									<td valign="top">										
										<spring:message code="patientregistration.person.address.address2"/>:
									</td>
									<td>																						
										<b>
										<span id="confirmAddress0" name="confirmAddress0"></span><br>										
										</b>
									</td>
								</tr>
								<tr>
									<td valign="top">										
										<spring:message code="patientregistration.person.address.address1"/>:
									</td>
									<td>																						
										<b>
										<span id="confirmAddress1" name="confirmAddress1"></span><br>										
										</b>
									</td>
								</tr>
								<tr>
									<td valign="top">										
										<spring:message code="patientregistration.person.address.neighborhoodCell"/>:
									</td>
									<td>																						
										<b>
										<span id="confirmAddress2" name="confirmAddress2"></span><br>										
										</b>
									</td>
								</tr>
								<tr>
									<td valign="top">									
										<spring:message code="patientregistration.person.address.cityVillage"/>:
									</td>
									<td>																						
										<b>
										<span id="confirmAddress3" name="confirmAddress3"></span><br>										
										</b>
									</td>
								</tr>
								<tr>
									<td valign="top">									
										<spring:message code="patientregistration.person.address.stateProvince"/>:
									</td>
									<td>																						
										<b>
										<span id="confirmAddress4" name="confirmAddress4"></span><br>										
										</b>
									</td>
								</tr>
								<tr>
									<td valign="top">									
										<spring:message code="patientregistration.person.address.country"/>:
									</td>
									<td>																						
										<b>
										<span id="confirmAddress5" name="confirmAddress5"></span><br>										
										</b>
									</td>
								</tr>								
								
							</table>
						</td>
					</tr>
				</table>
			</form>
		</div>
		
		
	</div>
	
	<div id="messageArea" class="hiddenDiv">
		<!-- displays alert messages -->
		<div id="matchedPatientDiv" name="matchedPatientDiv" class="matchedPatientClass" style="visibility:hidden">
			<div id="loadingSimilarPatients" style="background-color: #FF732F;">
				<table>									
					<tr>
						<td align="left">
							<img src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/smallwhiteloader.gif"></img>
							<span><spring:message code="patientregistration.searchingMatchingPatients"/></span>
						</td>																	
					</tr>										
				</table>												
			</div>
			<div id="confirmExistingPatientDiv">
				<table class="confirmExistingPatientList searchTableList">
				</table>
			</div>
			<div id="confirmExistingPatientModalDiv" title='<spring:message code="patientregistration.similarPatients"/>'>
				<table>							
					<tr>
						<td>
							<spring:message code="patientregistration.youHaveEntered"/>
							<br>
							<b><span id="modalPatientName" name="modalPatientName"></span></b>
							<br>
							<b><span id="modalPatientGenderDOB" name="modalPatientGenderDOB"></span></b>
							<br>
							<spring:message code="patientregistration.similarPatientsFound"/>
						</td>
					</tr>
					<tr>												
						<td style="text-align:left;border:solid 1px;">
							<div id="overflowDiv" style="overflow: auto;">
								<table class="confirmExistingPatientModalList searchTableList">
								</table>
							</div>
						</td>
					</tr>					
				</table>	
				<div id="confirmPatientModalDiv" title="Similar patients">
				</div>	
			</div>
		</div>
	</div>
	<div id="loadingGraph" class="ajaxResultsDiv hiddenDiv">
		<table width="100%" height="100%">									
			<tr>
				<td align="center">
					<img src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/biggerloader.gif"></img>
				</td>																	
			</tr>										
		</table>												
	</div>

	<div id="contextualInfo" class="hiddenDiv">
	</div>
	
</div>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>
