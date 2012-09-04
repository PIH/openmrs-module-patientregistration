<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/encounterTaskItem.js"/>
<script type="text/javascript">
	var backUrl = '${taskItem.backUrl}';
	var currentAnswerArray = new Array();	
	var validatorMaxArray = new Array();
	var validatorMinArray = new Array();
	var validatorBlankAllowedArray = new Array();
	var validatorTypeArray = new Array();
	
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>		

<form id="encounterTaskItemForm" name="encounterTaskItemForm" method="POST">
<div class="middleArea">
	<div class="menu" id="menuArea">
		<table class="menu">
			<tr>
				<th class="menu"><spring:message code="patientregistration.tasks.${registration_task}"/></th>
			</tr>
			
			<c:set var="menuItem" value="1"/>
			
			<!-- DISPLAY LABEL FOR ENCOUNTER DATE -->
			<c:if test="${taskItem.encounterDateEditable}">
			 	<tr>
			 		<!-- hack: we want this label to be displayed for all 3 (or 4) of the encounter date pages, so it gets multiple classes assigned to it -->
					<td class="menu nameMenu${menuItem} nameMenu${menuItem + 1} nameMenu${menuItem + 2}<c:if test='${!empty taskItem.encounterDate}'> nameMenu${menuItem + 3}</c:if>">
						<spring:message code="patientregistration.encounterDate"/>
					</td>
				</tr>
				
				<c:set var="menuItem" value="${menuItem + 3}"/>
				
				<!-- increment one more menu item if we have a going to display the "past visit" screen -->
				<c:if test="${!empty taskItem.encounterDate}">
					<c:set var="menuItem" value="${menuItem + 1}"/>
				</c:if>
			</c:if>
			
			<!-- DISPLAY MENU LABELS FOR OBSERVATIONS -->
			<c:if test="${! empty taskItem.questions}">
				<c:forEach var="question" items="${taskItem.questions}">
					<tr>
						<td class="menu nameMenu${menuItem}">${!empty question.label ? question.label : question.concept.name}</td>
					</tr>
					<c:set var="menuItem" value="${menuItem + 1}"/>
				</c:forEach>
			</c:if>
			
			<!-- DISPLAY LABEL FOR CONFIRMATION PAGE -->
			<tr>
				<td class="menu nameMenu${menuItem}"><spring:message code="patientregistration.taskItem.encounter.confirmDetails"/></td>
			</tr>
		</table>
	</div>
	<div class="partBar mainArea largeFont">
		
		<c:set var="page" value="1"/>
		
		<!-- TODO: handle edit mode -->
	
		<!-- ENCOUNTER DATE -->
		
		<!-- if the encounter date is editable AND there is a current encounter date, prompt the user if they wish to use this encounter date or modify it -->
		<c:if test="${taskItem.encounterDateEditable && !empty taskItem.encounterDate}">
			
			<div id="page${page}" style="display:none" class="padded">	
				<table height="100%" width="100%">												
					<tr>
						<td>
							<b class="leftalign"><spring:message code="patientregistration.encounterDate"/></b>
						</td>											
					</tr>	
					
					<!-- this page mimics a SELECT page for its functionality -->
					<tr>
						<td>	
							
							<table width="100%" class="questionBox">	
								<input type="hidden" id="question${page}" name="question${page}"/>
								<script type="text/javascript">
									currentAnswerArray[${page}] = -1;  // sorts the currently selected item in the area
								</script>
								<tr> 
									<td class="questionAnswer" id="question${page}AnswerValueSkipEncounterDate"><openmrs:formatDate date="${taskItem.encounterDate}" format="${_dateFormatDisplayDash}"/> (<spring:message code="patientregistration.today"/>)</td>
									<!-- TODO: the "today" in parathesis after the date should be customizable since it might not always be today, especially when we add edit functionality -->
								</tr>
								<tr> 
									<td class="questionAnswer" id="question${page}AnswerValue0"><spring:message code="patientregistration.taskItem.encounter.pastVisit"/></td> <!-- TODO: "past visit" should be customizable -->
								</tr>						
							</table>
						</td>						
					</tr>
					
				</table>
			</div>
				
			<c:set var="page" value="${page + 1}"/>
		</c:if>
		
		<!-- now show the three pages for editing the date -->
		<c:if test="${taskItem.encounterDateEditable}">
			<div id="page${page}" style="display:none" class="padded">	
				<table height="100%" width="100%">												
					<tr>
						<td>
							<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.year"/></b>
						</td>											
					</tr>	
					
					<tr>
						<td>
							<!-- TOOD: we may need to modify the automatic setting of year once we add edit functionality; also, will this bomb if no encounterDate has been preset? -->
							<input class="inputField highlighted" type="text" id="question${page}" name="encounterYear" value="<openmrs:formatDate date='${taskItem.encounterDate}' format='yyyy'/>" style="width:100%;"/>
							<script type="text/javascript">
								validatorMinArray[${page}] = 1900;
								validatorTypeArray[${page}] = 'YEAR'; 
							</script>
						</td>
					</tr>
					
				</table>
			</div>
				
			<c:set var="page" value="${page + 1}"/>
			
			<div id="page${page}" style="display:none" class="padded">	
				<table height="100%" width="900px">
					<input type="hidden" id="question${page}" name="encounterMonth" value="<openmrs:formatDate date='${taskItem.encounterDate}' format='MM'/>"/>
					<script type="text/javascript">; 
						validatorTypeArray[${page}] = 'MONTH'; 
					</script>												
					
					<tr>
						<td colspan="4">
							<i class="leftalign"><spring:message code="patientregistration.encounterDate"/>: <span class="review${page - 1}"><openmrs:formatDate date='${taskItem.encounterDate}' format='yyyy'/></span></i>
						</td>											
					</tr>	
					
					<tr><td>&nbsp;</td></tr>
					
					<tr>
						<td colspan="4">
							<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.month"/></b>
						</td>											
					</tr>	
				
					<tr>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 1}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.1"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="1" class="radioClass"<c:if test='${encounterMonth == 1}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 2}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.2"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="2" class="radioClass"<c:if test='${encounterMonth == 2}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 3}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.3"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="3" class="radioClass"<c:if test='${encounterMonth == 3}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 4}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.4"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="4" class="radioClass"<c:if test='${encounterMonth == 4}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
					</tr>	
					
					<tr>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 5}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.5"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="5" class="radioClass"<c:if test='${encounterMonth == 5}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 6}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.6"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="6" class="radioClass"<c:if test='${encounterMonth == 6}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 7}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.7"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="7" class="radioClass"<c:if test='${encounterMonth == 7}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 8}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.8"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="8" class="radioClass"<c:if test='${encounterMonth == 8}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
					</tr>	
					
					<tr>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 9}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.9"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="9" class="radioClass"<c:if test='${encounterMonth == 9}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 10}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.10"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="10" class="radioClass"<c:if test='${encounterMonth == 10}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 11}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.11"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="11" class="radioClass"<c:if test='${encounterMonth == 11}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
						<td width="25%">
							<table width="100%">
								<tr class="radioItem <c:if test='${encounterMonth == 12}'> highlighted</c:if>">
									<td width="80%"><b class="leftalign radioLabel"><spring:message code="patientregistration.month.12"/></b></td>
									<td width="20%"><b class="leftalign"><input type="radio" value="12" class="radioClass"<c:if test='${encounterMonth == 12}'> checked</c:if>/></b></td>
								</tr>
							</table>
						</td>
					</tr>	
					
				</table>
			</div>
				
			<c:set var="page" value="${page + 1}"/>
			
			<div id="page${page}" style="display:none" class="padded">	
				<table height="100%" width="100%">			
				
					<tr>
						<td colspan="4">
							<i class="leftalign"><spring:message code="patientregistration.encounterDate"/>: <span class="review${page - 1}"><openmrs:formatDate date='${taskItem.encounterDate}' format='MMMMMMMM'/></span>-<span class="review${page - 2}"><openmrs:formatDate date='${taskItem.encounterDate}' format='yyyy'/></span></i>
						</td>											
					</tr>	
					
					<tr><td>&nbsp;</td></tr>
													
					<tr>
						<td>
							<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.day"/></b>
						</td>											
					</tr>	
					
					<tr>
						<td>
							<input class="inputField highlighted" type="text" id="question${page}" name="encounterDay" style="width:100%;"/>
							<script type="text/javascript">
								validatorTypeArray[${page}] = 'DAY'; 
							</script>
						</td>
					</tr>
					
				</table>
			</div>
				
			<c:set var="page" value="${page + 1}"/>
		
		</c:if>
	
		<!-- OBSERVATION QUESTIONS -->
		<!-- create a page for each question -->
		<c:if test="${! empty taskItem.questions}">
			<c:forEach var="question" items="${taskItem.questions}">
				<div id="page${page}" style="display:none" class="padded">
					
						
					<table height="100%" width="100%">												
						<tr>
							<td>
								<b class="leftalign">${!empty question.label ? question.label : question.concept.name}</b>
							</td>											
						</tr>	
						
						<!-- define validation -->
						<script type="text/javascript">
								if (${question.minValue}) { validatorMinArray[${page}] = ${question.minValue}; }
								if (${question.maxValue}) { validatorMaxArray[${page}] = ${question.maxValue}; }
								validatorTypeArray[${page}] = '${question.type}';
								validatorBlankAllowedArray[${page}] = '${question.blankAllowed}';		
						</script>
						
						<!-- handle a TEXT question-->
						<c:if test="${question.type eq 'TEXT'}">
							<tr>
								<td>
									<input class="inputField highlighted" type="text" id="question${page}" name="question${page}" style="width:100%;"/>
								</td>
							</tr>
						</c:if>
							
						
						<!--  handle a SELECT question -->	
						<c:if test="${question.type eq 'SELECT'}">
							<script type="text/javascript">
								currentAnswerArray[${page}] = -1;  // sorts the currently selected item in the area
							</script>
						
							<tr>
								<td>	
									<table width="100%" class="questionBox">	
										<input type="hidden" id="question${page}" name="question${page}"/>
										<c:forEach var="answer" items="${question.answers}" varStatus="i">
											<tr> 
												<!-- be careful about screwing up jquery up-and-down arrow functionality in encounterTaskItem.js -->
												<td class="questionAnswer" id="question${page}AnswerValue${answer.value}">${answer.key}</td>
											</tr>	
										</c:forEach>						
									</table>
								</td>						
							</tr>
						</c:if> 
						
						<!-- handle an AUTOCOMPLETE question -->
						<c:if test="${question.type eq 'AUTOCOMPLETE'}">
							<tr>
								<td>
								    <input type="hidden" id="question${page}" name="question${page}"/>
									<input class="inputField highlighted" type="text" id="autocomplete${page}" name="autocomplete${page}" style="width:100%;"/>
								</td>
							</tr>
							<script type="text/javascript">
								$j(document).ready(function(){	
									var accentMap = {
											192: "A",
											193: "A",
											194: "A",
											200: "E",
											201: "E",
											210: "O",
											211: "O",
											217: "U",
											218: "U",
											224: "a",
											225: "a",
											232: "e", 
											233: "e",
											242: "o",
											243: "o",
											249: "u",
											250: "u"
									};
											
									var normalize = function( term ) {
										var ret = "";
										for ( var i = 0; i < term.length; i++ ) {
											//console.log("term.charAt[" + i + "]=" + term.charAt(i) + "; charCodeAt=" + term.charCodeAt(i));
											var temoChar = term.charAt(i).toLowerCase();
											ret += accentMap[ temoChar.charCodeAt(0) ] || term.charAt(i);
										}
										return ret;
									};	
									
									
									var data = [ 
										<c:forEach var="answer" items="${question.answers}" varStatus="i">             
									       { label: "${answer.key}", value: "${answer.value}" }      
									       <c:if test="${!i.last}">,</c:if>   
										</c:forEach>
									];
									$j('#autocomplete${page}').autocomplete({
										  source: function( request, response ) {
														var matcher = new RegExp( $j.ui.autocomplete.escapeRegex( request.term ), "i" );
														response( $j.grep( data, function( value ) {
															value = value.label || value.value || value;
															return matcher.test( value ) || matcher.test( normalize( value ) );
													}) );
											}, 	 	
						                  focus: function( event, ui ) {
							                          $j('#autocomplete${page}').val( ui.item.label );
							                          return false;
						                  },
				                          select: function( event, ui ) {
					                                  $j('#autocomplete${page}').val( ui.item.label );
					                                  $j('#question${page}').val( ui.item.value );
					                                  $j('.review${page}').text( ui.item.label );
					                                  return false;
				                          }
				                     });
								});
							</script>
						</c:if>
						
					</table>
				
				</div>
				<c:set var="page" value="${page + 1}"/>
			</c:forEach>
		</c:if>
		
		<!--  CONFIRM DETAILS -->
		<!-- create the confirm details page -->
		<div id="page${page}" style="display:none" class="padded">
		
			<table height="100%" width="100%">												
				<tr>
					<td>
						<b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.confirmDetailsMessage"/>:</b>
					</td>											
				</tr>
		
				<c:set var="questionNumber" value="1"/>
				
				<c:if test="${taskItem.encounterDateEditable}">
					
					<c:if test="${!empty taskItem.encounterDate}">
						<c:set var="questionNumber" value="${questionNumber + 1}"/>
					</c:if>
			
					<tr><td>&nbsp</td></tr> <!-- spacer -->
							
					<tr>
						<td class="questionLabelSmall"><spring:message code="patientregistration.encounterDate"/></td>
					</tr>
					
					<tr>
						<td>
							<table width="75%">	
								<tr>
									<td width="80%" class="questionBox">
										<span class="review${questionNumber + 2}"><openmrs:formatDate date='${taskItem.encounterDate}' format='dd'/></span>-<span class="review${questionNumber + 1}"><openmrs:formatDate date='${taskItem.encounterDate}' format='MMMMMMMM'/></span>-<span class="review${questionNumber}"><openmrs:formatDate date='${taskItem.encounterDate}' format='yyyy'/></span>
									</td>
									<td width="20%" class="leftalign">
										<img class="editButton" id="edit${questionNumber}" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/edit-button.png"" width="54" height="56"/>
									</td>
								</tr>						
							</table>
						</td>
					</tr>
					
					<c:set var="questionNumber" value="${questionNumber + 3}"/>
				</c:if>
				
				<c:if test="${!empty taskItem.questions}">
					<tr><td>&nbsp;</td></tr>  <!-- spacer -->
					<c:forEach var="question" items="${taskItem.questions}" varStatus="i">
						<tr>
							<td class="questionLabelSmall">${!empty question.label ? question.label : question.concept.name}</td>
						</tr>
						<tr>
							<td>
								<table width="75%">	
									<tr>
										<td width="80%" class="questionBox review${questionNumber}"></td>
										<td width="20%" class="leftalign"><img class="editButton" id="edit${questionNumber}" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/edit-button.png"" width="54" height="56"/></td>
									</tr>						
								</table>
							</td>
						</tr>
						<tr><td>&nbsp;</td></tr>  <!-- spacer -->
						<c:set var="questionNumber" value="${questionNumber + 1}" />
					</c:forEach>
				</c:if>
			</table>
		</div>
		
				
	</div>
	<div id="messageArea" class="hiddenDiv">
		
	</div>
</div>
</form>

<!-- now set a javascript variable that is the count of the number of pages in the workflow -->
<script type="text/javascript">
	var pageCount = '${page}';
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>	

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>