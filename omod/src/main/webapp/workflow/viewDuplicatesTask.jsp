<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/viewDuplicatesTask.js"/>
<script type="text/javascript">
"${pocDuplicates}";
	var pocDuplicates = [
		<c:forEach var="pocDuplicate" items="${pocDuplicates}" varStatus="j">
			{
				id: "${pocDuplicate.id}",
				identifiers: "${pocDuplicate.identifiers}",
				personName: "${pocDuplicate.personName}",
				firstName: "${pocDuplicate.givenName}", 
				lastName: "${pocDuplicate.familyName}", 
				age: "${pocDuplicate.age}",
				gender: "${pocDuplicate.gender}",
				birthdate: '<patientregistration:pocFormatDate date="${pocDuplicate.birthdate}" format="${_dateFormatDisplayDash}"/>'
			}
			<c:if test="${!j.last}">,</c:if> 
		</c:forEach>
	
	];

</script>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>		

<div class="middleArea">
	<div class="menu" id="menuArea">
	<table class="menu">
		<tr>
			<th class="menu"><spring:message code="patientregistration.tasks.${registration_task}"/></th>
		</tr>		
	</table>
	</div>
	<div class="partBar mainArea largeFont">
		<table height="100%" width="100%">
			<tr>
				<td class="mergeResultsCell">		
					<div id="duplicatesDiv"  name="duplicatesDiv" class="padded" style="overflow: auto; height: 300px">
						<table id="duplicateTableListId" class="duplicateTableList patientDashboardTable" style="cell-padding:10px;">
							<tr style="background-color: gray; color: white;">
								<th class="encounter"></th>
								<th class="encounter"><spring:message code="patientregistration.patientId" /></th>
								<th class="encounter"><spring:message code="patientregistration.person.firstName" /></th>
								<th class="encounter"><spring:message code="patientregistration.person.lastName" /></th>	
								<th class="encounter"><spring:message code="patientregistration.gender" /></th>
								<th class="encounter"><spring:message code="patientregistration.person.birthdate" /></th>								
							</tr>
						</table>
					</div>
				</td>
			</tr>
			<tr>
				<td align="left" valign="top">
					<button id="mergeBtn" name="mergeBtn" type="button" class="unknownBirthdate">
							<span class="largeFont"><spring:message code="patientregistration.mergePatients"/></span>
					</button>
				</td>
			</tr>
		</table>	
				
	</div>	
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>
