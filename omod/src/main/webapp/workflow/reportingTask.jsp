<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<c:set var="__openmrs_hide_report_link" value="true"/>
<openmrs:htmlInclude file="/moduleResources/patientregistration/reportingTask.js"/>
	
<!-- SPECIALIZED STYLES FOR THIS PAGE -->
<style type="text/css">
	
</style>

<c:url var="iconFilename" value="/images/file.gif"/>
<c:url var="iconViewReport" value="/moduleResources/reporting/images/report_icon.gif"/>
<script type="text/javascript" charset="utf-8">
	//var history_uuid = "${historyUUID}";
	var history_uuid = "${request.uuid}";
	var jsDateFormat = '<openmrs:datePattern localize="false"/>';
	var jsTimeFormat = '<openmrs:timePattern format="jquery" localize="false"/>';
	var jsLocale = '<%= org.openmrs.api.context.Context.getLocale() %>';
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>		

<div class="middleArea">

	<div class="menu" id="menuArea">
		<table class="menu">
			<tr>
				<th class="reportMenu" style="font-size: 1.2em"><spring:message code="patientregistration.tasks.${registration_task}"/></th>
			</tr>
			<tr>
				<th class="reportMenu">&nbsp;</th>
			</tr>
			<c:forEach items="${reportsList}" var="category">
				<tr>
					<th class="reportMenu"><spring:message code="${category.name}"/>
				</tr>					
				<c:forEach items="${category.reports}" var="pocreport">
					<tr>
						<td class="reportMenu">						
							<a class="reportMenu" href="${pageContext.request.contextPath}/${pocreport.url}&messageId=${pocreport.messageId}"><spring:message code="${pocreport.messageId}"/></a>
						</td>
					</tr>
				</c:forEach>
				<tr>
					<th class="reportMenu">&nbsp;</th>
				</tr>
			</c:forEach>
		</table>
	</div>

	<div class="partBar mainArea largeFont">		
		<div id="reportParamDiv" class="padded ajaxResultsDiv">
		
		<b class="leftalign greenTextRow"><spring:message code="${report.messageId}"/></b><br><br>
		<c:choose>	
			<c:when test="${empty report.messageId}">
				no report has been selected
			</c:when>
			<c:otherwise>			
				<spring:nestedPath path="report">
					<spring:bind path="reportDefinition">
						<c:if test="${not empty status.errorMessage}">
							<span class="error">${status.errorMessage}</span>
						</c:if>
					</spring:bind>

					<form method="post">
						<table>
							<c:forEach var="parameter" items="${report.reportDefinition.parameters}">								
								<tr id="trParam${parameter.name}">
									<spring:bind path="userEnteredParams[${parameter.name}]">
										<td align="right">
										   <spring:message code="${parameter.label}"/>:
										</td>
										<td align="left">										
											<c:choose>											
												<c:when test="${parameter.collectionType != null}">											
													<wgt:widget id="userEnteredParam${parameter.name}" name="${status.expression}" type="${parameter.collectionType.name}" genericTypes="${parameter.type.name}" defaultValue="${report.userEnteredParams[parameter.name]}" attributes="${parameter.widgetConfigurationAsString}"/>	
												</c:when>
												<c:otherwise>
													<wgt:widget id="userEnteredParam${parameter.name}" name="${status.expression}" type="${parameter.type.name}" defaultValue="${report.userEnteredParams[parameter.name]}" attributes="${parameter.widgetConfigurationAsString}"/>	
												</c:otherwise>
											</c:choose>
											<c:if test="${not empty status.errorMessage}">
												<span class="error">${status.errorMessage}</span>
											</c:if>
										</td>
									</spring:bind>
								</tr>
							</c:forEach>
							<tr>				
								<td align="right"><spring:message code="reporting.Report.run.outputFormat"/>:</td>					
								<td>
									<spring:bind path="selectedRenderer">
										<select id="selectOutputFormat" name="${status.expression}">
											<c:forEach var="renderingMode" items="${report.renderingModes}">
												<c:set var="thisVal" value="${renderingMode.descriptor}"/>
												<option
													<c:if test="${status.value == thisVal}"> selected</c:if>
													value="${thisVal}">${renderingMode.label}
												</option>
											</c:forEach>
										</select>
										<c:if test="${not empty status.errorMessage}">
											<span class="error">${status.errorMessage}</span>
										</c:if>
									</spring:bind>
								</td>		
							</tr>
							
							<tr><td>&nbsp;</td></tr>			
							<tr>
								<td></td>
								<td>					
									<input type="submit" value="<spring:message code="reporting.Report.run.button"/>" />
									<c:if test="${!empty report.existingRequestUuid}">
										<span style="padding-left:20px;">
											<a onclick="return confirm('<spring:message code="reporting.reportHistory.confirmDelete"/>');" href="../reports/reportHistoryDelete.form?uuid=${report.existingRequestUuid}">
												<button border="0"><spring:message code="general.delete"/></button>
											</a>
										</span>
									</c:if>
								</td>
							</tr>
						</table>
					</form>
				</spring:nestedPath>
			</c:otherwise>
		</c:choose>
		</div>
		
		<div id="reportHistoryDiv" name="reportHistoryDiv" class="padded hiddenDiv ajaxResultsDiv">	
			<b class="leftalign greenTextRow">${request.reportDefinition.parameterizable.name}</b>
			<table width="100%">	
				<tr>
					<td valign="top" class="labelSmall">
						<b><spring:message code="general.parameters"/></b><br/>
						<c:forEach var="p" items="${request.reportDefinition.parameterMappings}">
							${p.key}: <rpt:format object="${p.value}"/><br/>
						</c:forEach>
						<br/>
						<br/><br/>
						
						<div id="downloadReportDiv" class="hiddenDiv">						
							<button onClick="window.location.href='${pageContext.request.contextPath}/module/patientregistration/workflow/reportingTask.form?reportDownload=true&uuid=${request.uuid}';" style="width:150px; height:40px;">
								<img src="${iconViewReport}" border="0" width="24" height="24" border="0" style="vertical-align:middle"/>
								<b><spring:message code="reporting.viewReport"/></b><br/>
								
							</button>
						</div>
						<div id="viewReportDiv" class="hiddenDiv">
							<button onClick="window.location='reportHistoryView.form?uuid=${historyUUID}';" style="width:100px; height:40px;">
								<b><spring:message code="general.view"/></b><br/>
								<img src="${iconFilename}" border="0" width="16" height="16"/>
							</button>
						</div>
						<div id="runAgainDiv" class="hiddenDiv">
							<button onClick="window.location.href='${pageContext.request.contextPath}/module/patientregistration/workflow/reportingTask.form?runAgain=true&copyRequest=${request.uuid}';" style="width:100px; height:40px;">
								<b><spring:message code="reporting.reportHistory.runAgain"/></b><br/>
								<img src="<c:url value="/images/play.gif"/>" border="0" width="16" height="16"/>
							</button>
						</div>
					</td>	
					<td valign="top" class="labelSmall">
						<span class="leftalign boldFont"><spring:message code="reporting.reportRequest.status"/></span>
						<br/>
						<div id="reportStatusDiv">
							<div id="statusTextDiv"></div>							
							<div id="loadingGraph" class="ajaxResultsDiv hiddenDiv">							
								<img src="<c:url value="/images/loading.gif"/>" width="24" height="24" border="0" style="vertical-align:middle"/>			
								<span style="font-size:large"><spring:message code="reporting.status.PROCESSING"/></span><br/>
							</div>
						</div>
						<br/><br/>
						<div id="errorDiv" class="hiddenDiv">							
							<a href="#" id="errorDetailsLink">
							<img src="<c:url value="/images/error.gif"/>" width="24" height="24" border="0" style="vertical-align:middle"/>
							<spring:message code="reporting.errorDetails"/>
						</a>
						</div>
					</td>				
				</tr>								
			</table>
		</div>	
	</div>
	
	<div id="contextualInfo" class="hiddenDiv">
	</div>
	
</div>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>
