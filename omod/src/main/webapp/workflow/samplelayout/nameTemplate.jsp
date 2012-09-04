<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>

  <div class="menu" id="menuTopBar" >
	<p>Cange - Clinic&nbsp;externe</p>
  </div>
  
  <div class="partBar topBar">
  </div>

<div class="middleArea">
<div class="menu" id="menuArea">
<table class="menu">
	<tr>
		<th class="menu">Register/find by name</th>
	</tr>
	<tr>
		<td class="menu">Name</td>
	</tr>
	<tr>
		<td class="menu">Gender</td>
	</tr>
	<tr>
		<td class="menu">Age</td>
	</tr>
	<tr>
		<td class="menu">Address</td>
	</tr>
	<tr>
		<td class="menu">etc.</td>
	</tr>
</table>
</div>

<div class="partBar mainArea" align="center">
<table style="margin-left: 20px; margin-top: 20px; 
	margin-right: 20px;
	width:100%; text-align:left; text-valign: top;">
	<tr>
		<td align="left" colspan="3">What is the patient's first name?</td>
	</tr>
	<tr width="100%">
		<td align="left">
		    <input id="patientName" class="largeFont"
		    style="width: 100%; height: 35px;" 
			name="patientName" value="${patientName}" /></td>
		<td>&nbsp;</td>
		<td>
		<img class="cross-black" 
			src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-black.png"></img></td>
	</tr>
	<tr>
		<td colspan="3">(dropdown)</td>
	</tr>
</table>
</div>
</div>

<div class="menu" id="menuBottomBar">
<table class="maxSize">
	<tr valign="center">
		<td width="12%"></td>
		<td><img class="cross-red" align="left"
			src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/cross-red.png"></img></td>
	</tr>
</table>
</div>

<div class="partBar bottomBar">
<table class="maxSize">
 <tr class="centered">
 <td width="80%"></td>  	  
 <td width="20%"><img class="right-arrow"
   	  src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/right-arrow-white.png"></img></td>
</tr>
</table>
</div>