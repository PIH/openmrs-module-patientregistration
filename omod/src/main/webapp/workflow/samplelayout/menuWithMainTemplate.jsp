<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>

  <div class="menu" id="menuTopBar">
	<p>(menuTopBar)</p>
  </div>
  
  <div class="partBar topBar">
     <p>(topBar)</p>
  </div>

<div class="middleArea">
<div class="menu" id="menuArea">
<table class="menu">
	<tr>
		<th class="reportMenu" style="font-size: 1.2em">Reports</th>
	</tr>
	<tr>
		<th class="menu">&nbsp;</th>
	</tr>
	<tr>
		<th class="reportMenu">Program Overview</th>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">All encounters</a></td>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">MSPP health services (m)</a></td>
	</tr>
	<tr>
		<th class="menu">&nbsp;</th>
	</tr>
	<tr>
		<th class="reportMenu">Accounting</th>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">MSPP accounting (d)</a></td>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">Receipt sequence numbers</a></td>
	</tr>
	<tr>
		<th class="menu">&nbsp;</th>
	</tr>
	<tr>
		<th class="reportMenu">Data and Service Quality</th>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">Missing diagnoses (w)</a></td>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">Patient list with diagnoses</a></td>
	</tr>
	<tr>
		<td class="reportMenu"><a class="reportMenu" href="foo">Registration data quality (d)</a></td>
	</tr>
</table>
</div>

<div class="partBar mainArea">
<center>
<table style="width: 90%; cell-padding: 20px;" >
	<tr>
		<th style="text-align: left;"><spring:message code="patientregistration.person.enterBirthdate"/></th>
		<td style="text-align: right; color: blue; font-style:italic"><a href="foo">unknown</a></td>
	</tr>
</table>
<table style="width: 90%;">
	<tr>
		<td><input class="inputField" type="text" name="Day" value="Search" onfocus="if (this.value == 'Search') {this.value = '';}" onblur="if (this.value == '') {this.value = 'Search';}"/></td>
		<td><input class="inputField" type="text" name="Month" value="Mon" /></td>
		<td><input class="inputField" type="text" name="Year" value="yyyy" /></td>
	</tr>
</table>
</center>
</div>

<div id="messageArea">
(messageArea)
jfkajfklj fjfj dkljsdkfjdkls jkljf kljflsdjflksdjfkl fkljklf 
lkfj klsjfklsjfkls fsdkjfklsjfksdjfds jf fjksdjf 
ksjf ksdljfklsjf sklfjsdkfjklajklajfkla jfjasdlkf sdklfjsdlkfj 
sdklsfjlkaj fsjf lsjfl sd
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
 <td width="20%"><img class="left-arrow"
   	  src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/left-arrow-white.png"></img></td>
 <td>(bottomBar)</td>  	  
 <td width="20%"><img class="right-arrow"
   	  src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/right-arrow-white.png"></img></td>
</tr>
</table>
</div>