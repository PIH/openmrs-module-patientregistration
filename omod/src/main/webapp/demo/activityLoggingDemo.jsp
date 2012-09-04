<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<openmrs:htmlInclude file="/moduleResources/patientregistration/patientregistration.css" />
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">
	$j(document).ready(function() {
		$j('#activityInput').focus();
		$j('#activityButton').click(function(event) {
			var activity = $j('#activityInput').val();
			recordUserActivity(pageContextAddress, activity);
			$j('#activityInput').val("");
		});
	});
</script>
	
<div id="content"">
	<input id="activityInput" type="text" size="50"/>
	<input id="activityButton" type="button" value="Record Activity"/>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>