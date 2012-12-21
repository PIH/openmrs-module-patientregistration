<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/primaryCareReceptionDossierNumber.js"/>

<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">
	var numeroDossierVal='${numeroDossier}';		
	var identifierTypeId='${identifierTypeId}';
	var identifierTypeName='${identifierTypeName}';
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
			<td class="menu highlighted" id="numeroDossierMenu">
				<c:choose>
					<c:when test="${identifierTypeName == 'Dental Dossier Number'}">
						<spring:message code="patientregistration.menu.dentalDossier"/>
					</c:when>
					<c:otherwise>
						<spring:message code="patientregistration.menu.numero"/>
					</c:otherwise>
				</c:choose>
			</td>	
		</tr>		
		<tr>
			<td class="menu" id="printDossierLabelMenu"><spring:message code="patientregistration.menu.printDossierLabel"/></td>
		</tr>
	</table>
	</div>
	<c:if test="${!empty identifierError}">
		<div id="errorArea">
			<span class="error"><spring:message code="${identifierError}"/>:&nbsp;"${dossierPatients}"</span>
		</div>
	</c:if>
	
	<div class="partBar mainArea largeFont">
		
		<form id="patientRegistrationEncounter" method="post">	
			<div id="numeroDossierDiv" class="padded" name="numeroDossierDiv">					
				<table width="100%">					
					<tr>
						<td>
							<b class="leftalign">								
								<c:choose>
									<c:when test="${identifierTypeName == 'Dental Dossier Number'}">
										<spring:message code="patientregistration.menu.enterDentalDossier"/>
									</c:when>
									<c:otherwise>
										<spring:message code="patientregistration.menu.enterNumero"/>
									</c:otherwise>
								</c:choose>
							</b>
						</td>																	
					</tr>										
					<tr>
						<td>
							<input type="hidden" id="hiddenNumeroDossier" name="hiddenNumeroDossier" value="${numeroDossier}"/>		
							<input type="hidden" id="hiddenPrintLabel" name="hiddenPrintLabel" value="no"/>		
							<input type="hidden" id="hiddenIdentifierTypeId" name="hiddenIdentifierTypeId" value="${identifierTypeId}"/>	
							<input class="inputField" type="text" id="patientInputNumeroDossier" name="patientInputNumeroDossier" value="${numeroDossier}"  style="width:95%;" AUTOCOMPLETE='OFF'/>
							<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>
						</td>									
					</tr>								
				</table>					
			</div>
				
			<div id="confirmPrintDiv" name="confirmPrintDiv" class="padded hiddenDiv">					
				<table class="maxSize">
					<tr>
						<td>						
							<div id="locationDiv" class="selectLocationClass">
								<table align="center" width="100%">
									<tr>
										<td align="left" style="padding: 5px">
											<b class="leftalign"><spring:message code="patientregistration.confirmPrintDossier"/></b>
										</td>
									</tr>
									<br />
									<tr>
										<td align="left">
										<table width="100%" style="border: solid 1px;">
											<tr>
												<td align="left" style="padding: 0px">
												<table class="yesNoList" width="100%">								
														<tr id="yesRow" name="yesRow" class="yesNoListRow">													
															<td id="printYes" name="printYes" style="padding: 5px">
															<spring:message code="patientregistration.yes"/>
															</td>													
														</tr>
														<tr  id="noRow" name="noRow" class="yesNoListRow">													
															<td  id="printNo" name="printNo" style="padding: 5px">
															<spring:message code="patientregistration.no"/>
															</td>													
														</tr>												
												</table>
												</td>
											</tr>
										</table>
										</td>
									</tr>
								</table>
							</div>
						</td>																	
					</tr>											
				</table>					
			</div>
			<div id="printDossierLabelDiv" name="printDossierLabelDiv" class="padded hiddenDiv ajaxResultsDiv">					
				<table width="100%" height="100%">
					<tr>
						<td>
							<b class="leftalign"><spring:message code="patientregistration.waitDossierLabel"/></b>
						</td>																	
					</tr>	
					<tr>
						<td>
								<img 
	   	  src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/biggerloader.gif"></img>
						</td>																	
					</tr>					
				</table>					
			</div>					
		</form>	
	
	</div>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>
