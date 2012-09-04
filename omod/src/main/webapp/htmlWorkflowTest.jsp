<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>

<script type="text/javascript"><!--
		
	$j(document).ready(function(){
		// set focus to the input field so that we can automatically do bar code scanning
		$j('#contentCell').load("${pageContext.request.contextPath}/module/htmlformentry/htmlFormEntry.form?personId=1183&formId=19&mode=NEW&pageFragment=true");
		
		$j('.left-arrow').click(function(){ 
			$j('#page2').hide();
			$j('#page1').show();
		});
		
		$j('.right-arrow').click(function(){ 
			$j('#page1').hide();
			$j('#page2').show();
		});
		
	});
		
		-->
</script>

<div class="menu" id="menuTopBar" >
	<span class="padded">${registration_location}</span>
</div>
  
<div class="partBar topBar">
</div>

<div class="middleArea">
<div class="menu" id="menuArea">
</div>
<div class="partBar mainArea largeFont">
<table height="100%" width="100%">
 <tr><td id="contentCell" align="center" valign="center">
	
	
	
 </td></tr>
</table>
</div>
</div>

<div class="menu" id="menuBottomBar">
</div>
  
<div class="partBar bottomBar">
<table class="maxSize">
 <tr class="centered">
 <td width="20%">
 	<img id="left-arrow-white" class="left-arrow" style="display:block;"
    	  src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/left-arrow-white.png"></img>
 </td>
 <td>&nbsp;</td> 	  
 <td width="20%">
	 <img id="right-arrow-white" class="right-arrow" style="display:block;"
    	  src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/right-arrow-white.png"></img>
  </td>
 </tr>
</table>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>