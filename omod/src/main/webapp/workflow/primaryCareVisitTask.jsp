<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/primaryCareVisitTask.js"/>
<script type="text/javascript">
	
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
				<td align="center" valign="center">
					
					<div>
						<table align="center">	
							<tr>
								<td align="left">
									<b>
										<spring:message code="patientregistration.findPatientByIdentifier"/>
									</b>
								</td>	
							</tr>
							<tr>
								<td align="left">
									<input id="patientIdentifier" class="largeFont" style="height:45px; width:450px; font-size:30px" 
									name="patientIdentifier" AUTOCOMPLETE='OFF' value="${patientIdentifier}"/>
								</td>
							</tr>
							
						</table>
					</div>
					
				</td>
			</tr>
		</table>	
		<div id="confirmPatientModalDiv" title='<spring:message code="patientregistration.confirmPatient"/>'>
		</div>		
	</div>	
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>
