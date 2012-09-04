<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<script type="text/javascript"><!--
		
	$j(document).ready(function(){
	
		// hide the white right arrow
		$j('#right-arrow-white').hide();
		$j('#cross-red').hide();	
		$j('#checkmark-yellow').show();	
			
		});
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
		<td class="menu"><spring:message code="patientregistration.patientDashboard.overview" /></td>
	</tr>
	<tr>
		<td class="menu"><spring:message code="patientregistration.patientDashboard.graphs" /></td>
	</tr>
	<tr>
		<td class="menu"><spring:message code="patientregistration.encounter" /></td>
	</tr>
</table>
</div>

<div class="partBar mainArea">
<div class="patientDashboardDiv">
<table class="patientDashboardTable">
	<tr style="vertical-align:top;">
		<td style="width:20%;">
			<spring:message code="patientregistration.person.address"/>
		</td>
		<td class="italics">
			<spring:message code="patientregistration.person.address.stateProvince"/>:<br/>
			<spring:message code="patientregistration.person.address.cityVillage"/>:<br/>
			<spring:message code="patientregistration.person.address.neighborhoodCell"/>:<br/>
			<spring:message code="patientregistration.person.address.locality"/>:
		</td>
		<td style="width:20%;"><spring:message code="patientregistration.dossier"/>:</td>
		<td style="width:20%;">
			(id no.)
		</td>
	</tr>
	<tr style="vertical-align:top;">
		<td><spring:message code="patientregistration.telephoneNumber"/>:</td>
		<td>
			(phone no.)
		</td>
		<td colspan="2">&nbsp;</td>
	</tr>	
</table>
</div>
<div class="patientDashboardDiv">
<table class="patientDashboardTable">
	<tr>
		<th style="width:45%;"><spring:message code="patientregistration.patientDashboard.weightGraph" />:</th>
		<td style="width:2%;"></td>
		<th><spring:message code="patientregistration.patientDashboard.recentEncounters" />:</th>
	</tr>
	<tr>
		<td id="patientDashboardGraph"></td>
		<td></td>
		<td style="vertical-align: top;"> 
			<table style="width:100%; cell-padding:10px;">
				<tr style="background-color: gray; color: white;">
					<th class="encounter"><spring:message code="patientregistration.date" /></th>
					<th class="encounter"><spring:message code="patientregistration.encounterType" /></th>
					<th class="encounter"><spring:message code="patientregistration.location" /></th>
					<th class="encounter"><spring:message code="patientregistration.provider" /></th>
				</tr>
				<tr class="alt0">
					<td class="encounter">now</td>
					<td class="encounter">initial</td>
					<td class="encounter">Boston</td>
					<td class="encounter">Hamish</td>
				</tr>
				<tr class="alt1">
					<td class="encounter">today</td>
					<td class="encounter">rdv</td>
					<td class="encounter">Boston</td>
					<td class="encounter">Cosmin</td>
				</tr>
				<tr class="alt0">
					<td class="encounter">1 mo ago</td>
					<td class="encounter">pediatric</td>
					<td class="encounter">Boston</td>
					<td class="encounter">Mark</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr style="height: 3em; vertical-align: bottom;">
		<th><spring:message code="patientregistration.patientDashboard.currentTreatment" />:</th>
		<td></td>
		<th><spring:message code="patientregistration.patientDashboard.alerts" />:</th>
	</tr>
	<tr id="patientDashboardTextCells" class="italics">
		<td style="background-color: lightgray; "><p>none</p></td>
		<td></td>
		<td style="background-color: lightgray;"><p>none</p></td>
	</tr>
</table>
</div>
</center>
</div>

</div>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>
