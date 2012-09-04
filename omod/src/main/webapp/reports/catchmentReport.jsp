<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<openmrs:htmlInclude file="/moduleResources/patientregistration/jquery.flot.min.js"/>
<openmrs:htmlInclude file="/moduleResources/patientregistration/jquery.flot.pie.min.js"/>

<style>
	table.locationTable td { white-space:nowrap; text-align:center; border:1px solid black; margin: 0px; padding:5px; cursor:pointer;}
	.selected {background-color:grey; font-weight:bold; color:white;}
	.link {padding-left:5px; padding-top:2px; padding-bottom:2px;}
	tr.bottomHeaderRow th { border-bottom:2px solid black; }
	table.dataTable { border: 1px solid black; padding:3px; }
	table.dataTable td { padding:3px; border-bottom:1px solid black; border-right:1px solid black; }
	.buttonSelected { color:white; background-color: navy; }
	.linkCell { cursor:pointer; color:navy; text-decoration:underline; }
	.pieLabel { font-size: 10pt; }
	.pieSelected {font-weight: bold; color:navy; }
</style>

<script type="text/javascript">
	function removeAndSubmit(elementId) {
		$j("#"+elementId).val("");
		submitForm();
	}
	function addAndSubmit(element) {
		$j("#nextFilter").val($j(element).text());
		submitForm();
	}
	function submitForm() {
		$j("#catchmentForm").submit();
	}
</script>

<c:set var="locationId" value="${empty location ? '' : location.id}"/>
<c:set var="encounterTypeId" value="${empty encounterType ? '' : encounterType.id}"/>

<div id="content" style="padding-top:20px;"/>
	<table width="100%"><tr>
		<td valign="top" align="left" style="white-space:nowrap;">
			<form method="post" id="catchmentForm">
				<b><spring:message code="patientregistration.location"/></b><br/>
				<select name="location" onchange="submitForm();">
					<option value=""${empty location ? ' selected' : ''}><spring:message code="patientregistration.allLocations"/></option>
					<c:forEach items="${locations}" var="l">
						<option value="${l.id}"${location == l ? ' selected' : ''}>
							${l.name}
						</option>
					</c:forEach>
				</select>
				<br/><br/>
				<b><spring:message code="patientregistration.encounterType"/></b><br/>
				<select name="encounterType" onchange="submitForm();">
					<option value=""${empty encounterType ? ' selected' : ''}><spring:message code="patientregistration.allEncounterTypes"/></option>
					<c:forEach items="${encounterTypes}" var="type">
						<option value="${type.id}"${encounterType == type ? ' selected' : ''}>
							${type.name}
						</option>
					</c:forEach>
				</select>
				<br/><br/>
				<b><spring:message code="patientregistration.catchmentArea"/></b><br/>
				<table>
					<c:choose>
						<c:when test="${empty filterCriteria}"><tr><td><spring:message code="patientregistration.unspecified"/></td></tr></c:when>
						<c:otherwise>
							<c:forEach items="${filterCriteria}" var="e" varStatus="filterStatus">
								<c:choose>
									<c:when test="${fn:contains(fixedCriteria, e.key) && hideSingleOptionLevels == true}">
										<input type="hidden" name="fixed_${e.key}" value="${e.value}"/>
										<tr>
											<td>${nameMappings[e.key]}:</td>
											<td>${e.value}</td>
											<td></td>
										</tr>
									</c:when>
									<c:otherwise>
										<input type="hidden" id="${e.key}Input" name="${e.key}" value="${e.value}"/>
										<tr>
											<td>${nameMappings[e.key]}:</td>
											<td>${e.value}</td>
											<td>
												<c:if test="${filterStatus.last}">
													<a href="javascript:removeAndSubmit('${e.key}Input');">[x]</a>
												</c:if>
											</td>
										</tr>
									</c:otherwise>
								</c:choose>
							</c:forEach>
						</c:otherwise>
					</c:choose>
				</table>
				<input type="hidden" id="nextFilter" name="${nextField}" value=""/>
			</form>
		</td>
		<td valign="top" width="100%">
			<c:if test="${!empty nextValues}">
				<table width="100%">
					<tr>
						<td valign="top" style="white-space:nowrap;">
							<table class="dataTable">
								<tr><th></th><th colspan="4" align="center"><spring:message code="patientregistration.numberOfRegistrations"/></th></tr>
								<tr class="bottomHeaderRow">
									<th align="left">${nameMappings[nextField]}</th>
									<th><spring:message code="patientregistration.distinctPatients"/></th>
									<th><spring:message code="patientregistration.distinctEncounters"/></th>
								</tr>
								<c:forEach items="${nextValues}" var="nextVal" varStatus="nextValStatus">
									<c:set value="${numPatientsByAddress[nextVal]}" var="patCount"/>
									<c:set value="${numEncountersByAddress[nextVal]}" var="encCount"/>
									<tr>
										<c:choose>
											<c:when test="${nextField != lastLevel && (patCount > 0 || encCount > 0)}">
												<td class="linkCell" align="left" onclick="javascript:addAndSubmit(this);">${nextVal}</td>
											</c:when>
											<c:otherwise><td align="left">${nextVal}</td></c:otherwise>
										</c:choose>
										<td>${patCount}</td>
										<td>${encCount}</td>
									</tr>
								</c:forEach>
								<c:forEach items="other,unspecified" var="nextVal">
									<c:set value="${numPatientsByAddress[nextVal]}" var="patCount"/>
									<c:set value="${numEncountersByAddress[nextVal]}" var="encCount"/>
									<tr>
										<td align="left"><spring:message code="patientregistration.${nextVal}"/></td>
										<td>${patCount}</td>
										<td>${encCount}</td>
									</tr>
								</c:forEach>
							</table>
						</td>
						<td valign="top" align="left">
							<table align="center" id="monthYearTable" style="padding-bottom:20px;">
								<tr>
									<th align="left"><spring:message code="patientregistration.registrationBreakdownBy"/>:</th>
									<td><button id="encounterBreakdownButton" onclick="showEncounterBreakdown();"><spring:message code="patientregistration.encounter"/></button></td>
									<td><button id="patientBreakdownButton" onclick="showPatientBreakdown();"><spring:message code="patientregistration.patient"/></button></td>
								</tr>
							</table>
							<div style="width:600px;height:300px;" id="chartFrame"></div>
							<div id="detailSection"></div>
						</td>
					</tr>
				</table>
			</c:if>
		</td>
	</tr></table>
</div>

<script type="text/javascript">
	$j(document).ready(function() {	
		showEncounterBreakdown();
	});
	
	function showEncounterBreakdown() {
		var data = ${numEncounterJson};
		$j("#patientBreakdownButton").removeClass("buttonSelected");
		$j("#encounterBreakdownButton").addClass("buttonSelected");
		drawChart(data);
	}
	
	function showPatientBreakdown() {
		var data = ${numPatientJson};
		$j("#encounterBreakdownButton").removeClass("buttonSelected");
		$j("#patientBreakdownButton").addClass("buttonSelected");
		drawChart(data);
	}
	
	function drawChart(data) {
		$j.plot($j("#chartFrame"), data, {
			series: {
				pie: {
					show: true
				}
			},
			legend: {
				show: true,
				labelFormatter: function(label, series) {
					var l = label;
					if (l == 'other') {
						l = '<spring:message code="patientregistration.other"/>';
					}
					if (l == 'unspecified') {
						l = '<spring:message code="patientregistration.unspecified"/>';
					}
					return '<span class="pieLabel pieLabel'+series.label+'">' + l + ' ( ' + parseFloat(series.percent).toFixed(1)  + '% )</span>';
				}
			},
	        grid: {
	            hoverable: true,
	            clickable: true
	        }
		});
		$j("#chartFrame").bind("plothover", pieClick);
		$j("#chartFrame").bind("plotclick", pieClick);
	}
	
	function pieClick(event, pos, obj) {
		if (obj) {
			$j(".pieLabel").removeClass('pieSelected');
			$j(".pieLabel"+obj.series.label).addClass('pieSelected');
		}
	}
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>