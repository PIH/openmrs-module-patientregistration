<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/patientLookupTask.js"/>
<script type="text/javascript">
	var similarExactAlert='<spring:message code="patientregistration.similarExactAlert" javaScriptEscape="true"/>';
	var similarSoundexAlert='<spring:message code="patientregistration.similarSoundexAlert" javaScriptEscape="true"/>';
	var messageAreaSpan = '<spring:message code="patientregistration.searchingMatchingPatients" javaScriptEscape="true"/>';
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
	
		<div id="patientDiv" name="patientDiv" class="patientClass padded">					
			<table height="100%" width="100%">												
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.searchForPatient"/></b>
					</td>											
				</tr>	
				<tr>
					<td>
						<input class="inputField highlighted" type="text" id="inputPatient" name="inputPatient" value="${patient.givenName}" style="width:95%;" AUTOCOMPLETE='OFF'/>
						<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png" title='<spring:message code="patientregistration.clearEntry"/>'></img>
					</td>
				</tr>
				<tr>
					<td class="ajaxResultsCell">	
						<div id="patientTableDiv" class="ajaxResultsDiv">
						<div id="loadingGraph" class="ajaxResultsDiv hiddenDiv">
							<table width="100%" height="100%">									
								<tr>
									<td align="center">
										<img src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/biggerloader.gif"></img>
									</td>																	
								</tr>										
							</table>												
						</div>
							<table class="patientList tableList" width="100%">								
							</table>
						</div>
					</td>						
				</tr>
			</table>
		</div>
		<div id="confirmPatientModalDiv" title="<spring:message code="patientregistration.confirmPatient"/>">
		</div>	

	</div>	
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>
