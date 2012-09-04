<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<openmrs:htmlInclude file="/moduleResources/patientregistration/jquery.flot.min.js"/>

<style>
	table.locationTable td { white-space:nowrap; text-align:center; border:1px solid black; margin: 0px; padding:5px; cursor:pointer;}
	.selected {background-color:grey; font-weight:bold; color:white;}
	.link {padding-left:5px; padding-top:2px; padding-bottom:2px;}
	tr.bottomHeaderRow th { border-bottom:2px solid black; }
	table.dataTable { border: 1px solid black; padding:3px; }
	table.dataTable td { padding:3px; }
	.buttonSelected { color:red; background-color: yellow; }
</style>

<div id="content" style="padding-top:20px;"/>
	<table class="locationTable">
		<tr>
			<td class="${empty location ? 'selected' : ''}" onclick="document.location.href='overviewReport.form'">
				<spring:message code="patientregistration.allLocations"/>
			</td>
			<c:forEach items="${locations}" var="l">
				<td class="${location == l ? 'selected' : ''}" onclick="document.location.href='overviewReport.form?location=${l.id}'">
					${l.name}
				</td>
			</c:forEach>
		</tr>
	</table>
	<br/>
	<table width="100%">
		<tr>
			<td valign="top" style="white-space:nowrap;">
				<table class="dataTable">
					<tr><th></th><th colspan="4" align="center"><spring:message code="patientregistration.numberOfRegistrations"/></th></tr>
					<tr class="bottomHeaderRow">
						<th></th>
						<th><spring:message code="patientregistration.today"/></th>
						<th><spring:message code="patientregistration.pastWeek"/></th>
						<th><spring:message code="patientregistration.pastMonth"/></th>
						<th><spring:message code="patientregistration.ever"/></th>
						<th></th>
					</tr>
					<c:forEach items="${encounterTypes}" var="type">
						<tr>
							<td align="left">${type.name}</td>
							<td>${todayData[type] == null ? 0 : todayData[type]}</td>
							<td>${weekData[type] == null ? 0 : weekData[type]}</td>
							<td>${monthData[type] == null ? 0 : monthData[type]}</td>
							<td>${allData[type] == null ? 0 : allData[type]}</td>
							<td>
								<button onclick="renderChart('${type.encounterTypeId}', '${type.name}')">
									<spring:message code="patientregistration.viewDetails"/>
								</button>
							</td>
						</tr>
					</c:forEach>
				</table>
			</td>
			<td valign="top" align="left">
				<h3 id="chartTitleSection"></h3>
				<div style="width:600px;height:300px" id="chartFrame"></div>
				<table width="600px;" id="monthYearTable" style="display:none; padding-top:20px;">
					<tr>
						<c:forEach begin="${currentYear-11}" end="${currentYear}" var="year">
							<td><button id="yearButton${year}" class="yearButton" onclick="changePeriod(this, 'year', ${year});">${year}</button></td>
						</c:forEach>
					</tr>
					<tr>
						<c:forEach begin="0" end="11" var="month">
							<td><button id="monthButton${month}" class="monthButton" onclick="changePeriod(this, 'month', ${month})"><spring:message code="patientregistration.month.${month+1}"/></button></td>
						</c:forEach>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	<script type="text/javascript">
		
		var monthNames = [<c:forEach begin="1" end="12" var="m" varStatus="mStatus">'<spring:message code="patientregistration.month.${m}"/>'<c:if test="${!mStatus.last}">,</c:if></c:forEach>];
		var chartTitle;
		var chartData;
		var today = new Date();
		var currYear;
		var currMonth;
		
		function renderChart(encounterTypeId, encounterTypeName) {
			chartTitle = '<spring:message code="patientregistration.numRegistrationsByType" arguments="' + encounterTypeName + '"/>';
			<c:if test="${!empty location}">chartTitle='<spring:message code="patientregistration.numRegistrationsByTypeAtLocation" arguments="' + encounterTypeName + ', ${location.name}"/>';</c:if>
			$j.getJSON("encountersByDate.form?encounterType="+encounterTypeId+"<c:if test="${!empty location}">&location=${location.id}</c:if>", function(json) {
				chartData = json;
				currMonth = today.getMonth();
				currYear = today.getFullYear();
				$j("#monthButton"+currMonth).addClass("buttonSelected");
				$j("#yearButton"+currYear).addClass("buttonSelected");
				redrawChart();
			});
			$j("#monthYearTable").show();
		}
		
		function changePeriod(button, yearOrMonth, whichYearOrMonth) {
			$j("."+yearOrMonth + "Button").removeClass("buttonSelected");
			$j(button).addClass("buttonSelected");
			if (yearOrMonth == 'month') {
				currMonth = whichYearOrMonth;
			}
			else {
				$j(".monthButton").removeClass("buttonSelected");
				currMonth = null;
				currYear = whichYearOrMonth;
			}
			redrawChart();
		}
		
		function redrawChart() {
			$j("#chartFrame").html("");
			
			var hasMonth = currMonth != null;	
			var minDate = new Date(currYear, (hasMonth ? currMonth : 0), 1);
			var maxDate = new Date(currYear, (hasMonth ? currMonth + 1 : 12), 0);
			
			var rangeTitle = chartTitle + " (" + (hasMonth ? monthNames[currMonth] + ' ' : '') + currYear + ")";
			$j("#chartTitleSection").html(rangeTitle).show();

			$j.plot($j("#chartFrame"), [{
			  		data: chartData,
			  		label: rangeTitle
				}],
				{
					xaxis: {
					  mode: "time",
					  timeformat: (hasMonth ? "%d" : "%b %y"),
					  minTickSize: [1, (hasMonth ? 'day' : 'month')],
					  min: minDate.getTime(),
					  max: maxDate.getTime(),
					  monthNames: monthNames
					},
					yaxis: {
						tickDecimals: 0
					},
					points: {
						show: true
					},
					lines: {
						show: true
					},
					selection: { mode: "x" }
				}
			);
		}
	</script>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>