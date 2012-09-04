<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">
	// store a list of the patient fields that we are going to display in the result table for reference by jquery
	var nameFields = [<c:forEach items="${nameTemplate.lines}" var="line"><c:forEach items="${line}" var="token"><c:if test="${token.isToken == nameTemplate.layoutToken}">'${token.codeName}',</c:if></c:forEach></c:forEach>];
	var addressLevels=[<c:forEach var="addressLevel" items="${addressHierarchyLevels}">'${addressLevel}',</c:forEach>];
	
	var scriptMessages=[];	
	<c:forEach var="scriptIndex" items="${jscriptMessages}">'${scriptIndex}',
		scriptMessages['${scriptIndex}']='<spring:message code="patientregistration.jMessages.${scriptIndex}" javaScriptEscape="true"/>';
	</c:forEach>
	
	var toolTipMessages=[];	
	<c:forEach var="scriptIndex" items="${jtoolTipMessages}">'${scriptIndex}',
		toolTipMessages['${scriptIndex}']='<spring:message code="patientregistration.toolTip.${scriptIndex}" javaScriptEscape="true"/>';
	</c:forEach>
	
	var addressLabels=[];
	<c:forEach var="addressLevel" items="${addressHierarchyLevels}">'${addressLevel}',
		addressLabels['${addressLevel}']='<spring:message code="patientregistration.person.address.${addressLevel}" javaScriptEscape="true"/>';
	</c:forEach>
	
	var pageContextAddress = '${pageContext.request.contextPath}';
	
	$j.goToNextPage= function(nextTask, nextPage){		
		if(nextTask.length>0){
			nextPage = nextPage + '&nextTask=' + nextTask;
		}
		window.location.href=pageContextAddress + nextPage;
	};
</script>