<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<script type="text/javascript"><!--
		
	$j(document).ready(function(){
		
		
	});
		
		-->
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>		

<div class="middleArea">
	<div class="menu" id="menuArea">	
	</div>
<div class="partBar mainArea largeFont">	
	<div id="patientNameDiv" name="patientNameDiv" class="padded">					
		<table height="100%" width="100%">												
			<tr>
				<td>
					<b class="leftalign"><spring:message code="patientregistration.person.enterFirstName"/></b>
				</td>											
			</tr>	
			<tr>
				<td>
					<input class="inputField" type="text" id="patientNameInput" name="patientNameInput" value="" style="width:95%;" AUTOCOMPLETE='OFF'/>
					<img class="cross-black" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img>
				</td>
			</tr>
			<tr>
				<td class="ajaxResultsCell">	
					<div id="patientNameTableDiv" class="ajaxResultsDiv">
						<table class="patientNameList tableList" width="100%">								
						</table>
					</div>
				</td>						
			</tr>
		</table>
	</div>
</div>		
</div>	

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>