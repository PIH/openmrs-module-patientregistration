<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/primaryCareReceptionEncounter.js"/>
<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">

    var paymentGroupsData = [
            <c:forEach var="group" items="${pocPaymentGroups}" varStatus="i">
            [
            <c:forEach var="ob" items="${group}" varStatus="j">
    { label: "${ob.label}", id: "${ob.id}", obsId: "${ob.obsId}", type: "${ob.type}",
        conceptId: "${ob.conceptId}", conceptName: "${ob.conceptName}"}
            <c:if test="${!j.last}">,</c:if>
    </c:forEach>
    ]<c:if test="${!i.last}">,</c:if>
    </c:forEach>
    ];

    var encounterYear= '<openmrs:formatDate date="${encounterDate}" format="yyyy"/>';
    var encounterMonth = parseInt('<openmrs:formatDate date="${encounterDate}" format="MM"/>', 10);
    var monthData = [<c:forEach begin="1" end="12" varStatus="i">'<spring:message code="patientregistration.month.${i.count}"/>',</c:forEach>];
    var encounterMonthLabel = monthData[encounterMonth -1];
    var encounterDay = '<openmrs:formatDate date="${encounterDate}" format="dd"/>';
    var todayLabel = '<spring:message code="patientregistration.today"/>';
    var jsEncounterDate = '<openmrs:formatDate date="${encounterDate}" format="${_dateFormatDisplayDash}"/>';
    var jsAddDiagnosis = '<spring:message code="patientregistration.addDiagnosis"/>';
    var jsDiagnosisFor = '<spring:message code="patientregistration.diagnosisFor"/>';
    var removeDiagnosisLabel = '<spring:message code="patientregistration.removeDiagnosis"/>';
    var cancelLabel = '<spring:message code="patientregistration.cancel"/>';

    var visitReasonConceptId  = '${visitReason.concept.id}';
    var visitReasonConceptName = '${!empty visitReason.label ? visitReason.label : visitReason.concept.name}';
    var paymentAmountConceptId  = '${paymentAmount.concept.id}';
    var paymentAmountConceptName = '${!empty paymentAmount.label ? paymentAmount.label : paymentAmount.concept.name}';
    var receiptConceptId  = '${receipt.concept.id}';
    var receiptConceptName = '${!empty receipt.label ? receipt.label : receipt.concept.name}';
    var createNew="${createNew}";
    var nextTask = "${nextTask}";
    var leavePageAlert = '<spring:message code="patientregistration.alert.leavePageConfirmation"/>';
    var registrationTask = "${registration_task}";
    var currentTask = "${currentTask}";

    var createNewVisit = '<spring:message code="general.yes"/>';
    var doNotCreateNewVisit = '<spring:message code="patientregistration.no"/>';
    var visitSummary = "${visitSummary}";

</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>

<div class="middleArea">

<div class="menu" id="menuArea">
    <table class="menu">
        <tr>
            <th class="menu"><spring:message code="patientregistration.tasks.${registration_task}"/></th>
        </tr>
        <tr>
            <td class="menu highlighted" id="encounterDateMenu">
                <spring:message code="patientregistration.encounterDate"/>
            </td>
        </tr>
        <tr>
            <td class="menu" id="visitReasonMenu">${!empty visitReason.label ? visitReason.label : visitReason.concept.name}</td>
        </tr>
        <tr>
            <td class="menu" id="paymentAmountMenu">${!empty paymentAmount.label ? paymentAmount.label : paymentAmount.concept.name}</td>
        </tr>
        <tr>
            <td class="menu" id="receiptMenu">${!empty receipt.label ? receipt.label : receipt.concept.name}</td>
        </tr>
        <!-- DISPLAY LABEL FOR CONFIRMATION PAGE -->
        <tr>
            <td class="menu" id="confirmMenu"><spring:message code="patientregistration.taskItem.encounter.confirmDetails"/></td>
        </tr>
    </table>
</div>

<c:if test="${!empty obsError}">
    <div id="errorArea">
        <span class="error"><spring:message code="${obsError}"/>:&nbsp;"${obsError}"</span>
    </div>
</c:if>

<div class="partBar mainArea largeFont">

<div id="encounterDateDiv" name="encounterDateDiv" class="padded">
    <table height="100%" width="100%">
        <tr>
            <td>
                <b class="leftalign"><spring:message code="patientregistration.encounterDate"/></b>
            </td>
        </tr>
        <tr>
            <td>

                <table width="100%" class="questionBox encounterDateList">
                    <input type="hidden" id="encounterDateInstance" name="encounterDateInstance"/>
                    <tr id="todayDateRow" name="todayDateRow" class="dateListRow">
                        <td class="questionAnswer" id="todayEncounterDate" name="todayEncounterDate">
                        </td>
                    </tr>
                    <tr id="pastDateRow" name="pastDateRow" class="dateListRow">
                        <td class="questionAnswer" id="pastEncounterDate" name="pastEncounterDate">
                            <spring:message code="patientregistration.taskItem.encounter.pastVisit"/>
                        </td>

                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div id="yearDiv" name="yearDiv" class="padded hiddenDiv">
    <table height="100%" width="100%">
        <tr>
            <td>
                <b class="leftalign"><spring:message code="patientregistration.taskItem.encounter.year"/></b>
            </td>
        </tr>
        <tr>
            <td>
                <input class="inputField highlighted" type="text" id="encounterYear" name="encounterYear" value="" style="width:100%;"/>
            </td>
        </tr>
    </table>
</div>
<div id="monthDiv" name="monthDiv" class="padded hiddenDiv">
    <table height="100%" width="80%">
        <tr>
            <td colspan="4">
                <i class="leftalign"><spring:message code="patientregistration.encounterDate"/>:
                    <span class="dateSpan"></span>
                </i>
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
<div id="dayDiv" name="dayDiv" class="padded hiddenDiv">
    <table height="100%" width="100%">
        <tr>
            <td colspan="4">
                <i class="leftalign">
                    <span class="dateSpan"></span>
                </i>
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
                <input class="inputField highlighted" type="text" id="encounterDay" name="encounterDay" value="" style="width:100%;"/>
            </td>
        </tr>
    </table>
</div>

<div id="dialog-checkedInDiv" name="dialog-checkedInDiv" title="<spring:message code="patientregistration.dialog.checkedIn.title"/>" class="padded hiddenDiv">
<table>
    <tr>
        <td><spring:message code="patientregistration.dialog.checkedIn.patientVisit"/></td>
    </tr>
    <tr>
        <td>Check-In: ${visitSummary.checkInEncounter.location} @ <patientregistration:pocFormatDate date="${visitSummary.checkInEncounter.encounterDatetime}" format="${_dateFormatDisplayDash}"/>
            (<openmrs:formatDate date="${visitSummary.checkInEncounter.encounterDatetime}" format="HH:mm:ss"/>)
        </td>
    </tr>
    <tr>
        <td>Last Seen : ${visitSummary.lastEncounter.encounterType.name},
            ${visitSummary.lastEncounter.location}  @ <patientregistration:pocFormatDate date="${visitSummary.lastEncounter.encounterDatetime}" format="${_dateFormatDisplayDash}"/>
            (<openmrs:formatDate date="${visitSummary.checkInEncounter.encounterDatetime}" format="HH:mm:ss"/>)
        </td>
    </tr>
</table>
<br/>
<br/>
<b><spring:message code="patientregistration.dialog.checkedIn.question"/></b>
</div>

<div id="visitReasonDiv" name="visitReasonDiv" class="padded hiddenDiv">
    <table class="maxSize">
        <tr>
            <td>
                <table align="center" align="left" width="100%">
                    <tr valign="top">
                        <td align="left" style="padding: 5px">
                            <b class="leftalign">${!empty visitReason.label ? visitReason.label : visitReason.concept.name}</b>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <table width="100%" valign="top" style="border: solid 1px;">
                                <tr>
                                    <td align="left" style="padding: 0px">
                                        <table id="visitReasonTable"  name="visitReasonTable" class="questionBox visitReasonList" width="100%">
                                            <c:forEach var="visitReasonStatus" items="${visitReason.answers}" varStatus="i">
                                                <c:if test="${i.count % 2 == 0 }">
                                                    <c:set var="rowColor" value="evenRow" />
                                                </c:if>
                                                <c:if test="${i.count % 2 != 0 }">
                                                    <c:set var="rowColor" value="oddRow" />
                                                </c:if>
                                                <tr id="visitReasonStatusRow${i.count}" class="visitReasonListRow ${rowColor}">
                                                    <td class="questionAnswer" id="visitReasonStatus${i.count}">${visitReasonStatus.key}
                                                        <input type="hidden" id="visitReasonStatusId" value="${visitReasonStatus.value}"/>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div id="paymentAmountDiv" name="paymentAmountDiv" class="padded hiddenDiv">
    <table class="maxSize">
        <tr>
            <td>
                <table align="center" align="left" width="100%">
                    <tr valign="top">
                        <td align="left" style="padding: 5px">
                            <b class="leftalign">${!empty paymentAmount.label ? paymentAmount.label : paymentAmount.concept.name}</b>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <table width="100%" valign="top" style="border: solid 1px;">
                                <tr>
                                    <td align="left" style="padding: 0px">
                                        <table id="paymentAmountTable"  name="paymentAmountTable" class="questionBox paymentAmountList" width="100%">
                                            <c:forEach var="paymentAmountStatus" items="${paymentAmount.answers}" varStatus="i">
                                                <c:if test="${i.count % 2 == 0 }">
                                                    <c:set var="rowColor" value="evenRow" />
                                                </c:if>
                                                <c:if test="${i.count % 2 != 0 }">
                                                    <c:set var="rowColor" value="oddRow" />
                                                </c:if>
                                                <tr id="paymentAmountStatusRow${i.count}" class="paymentAmountListRow ${rowColor}">
                                                    <td class="questionAnswer" id="paymentAmountStatus${i.count}">${paymentAmountStatus.key}
                                                        <input type="hidden" id="paymentAmountStatusId" value="${paymentAmountStatus.value}"/>
                                                    </td>
                                                </tr>
                                            </c:forEach>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div id="receiptDiv" name="receiptDiv" class="padded hiddenDiv">
    <table height="100%" width="100%">
        <tr>
            <td>
                <b class="leftalign">${!empty receipt.label ? receipt.label : receipt.concept.name}</b>
            </td>
        </tr>
        <tr>
            <td>
                <input class="inputField highlighted" type="text" id="receiptInput" name="receiptInput" value="" style="width:100%;"/>
                <input type="hidden" id="receiptObsId" name="receiptObsId" value="" />
            </td>
        </tr>
    </table>
</div>
<div id="confirmDiv" name="confirmDiv" class="padded hiddenDiv">
    <form id="obsForm" name="obsForm" method="post">
        <input type="hidden" id="newVisit" name="newVisit" value="${newVisit}" />
        <input type="hidden" id="listOfObs" name="listOfObs" value="">
        <input type="hidden" id="hiddenEncounterYear" name="hiddenEncounterYear" value="">
        <input type="hidden" id="hiddenEncounterMonth" name="hiddenEncounterMonth" value="">
        <input type="hidden" id="hiddenEncounterDay" name="hiddenEncounterDay" value="">
        <input type="hidden" id="hiddenNextTask" name="hiddenNextTask" value="">
        <input type="hidden" id="hiddenRequestDossierNumber" name="hiddenRequestDossierNumber" value="">
    </form>
    <table id="confirmPaymentTableListId" class="maxSize questionBox confirmPaymentTableList">
    </table>
    <table class="maxSize">
        <tr class="spacer">
        </tr>
        <tr id="plusPayment" class="left rowToHighlight">
            <td id="plusPaymentLabelColumn" width="25%" class="smallerFont">
                <spring:message code="patientregistration.addPayment"/>:<br>
            </td>
            <td id="plusPaymentColumn" width="10%">
                <button id="plusPaymentBtnId" name="plusPaymentBtnId" class="plusBtnImg" type="button" align="left"></button>
            </td>
            <td width="65%">
                &nbsp;
            </td>
        </tr>
    </table>
</div>
<div id="dialog-confirm" title='<spring:message code="patientregistration.removeDiagnosis"/>?' class="padded hiddenDiv">
</div>
<div id="dialog-requestDossierNumber" name="dialog-requestDossierNumber" title='<spring:message code="patientregistration.requestDossierNumber"/>' class="padded hiddenDiv">
    <spring:message code="patientregistration.requestDossierNumberMessage"/>
    <input type="hidden" id="hiddenYes" name="hiddenYes" value=<spring:message code="patientregistration.yes"/>>
    <input type="hidden" id="hiddenNo" name="hiddenNo" value=<spring:message code="patientregistration.no"/>>
</div>
</div>
<div id="confirmMessageArea" class="hiddenDiv">
    <spring:message code="patientregistration.confirmDiagnosis"/>
</div>
<div id="uncodedMessageArea" class="hiddenDiv" title="">
    <table width="100%">
        <tr>
            <td>
                <b><span id="codedMatches" name="codedMatches"></span></b>
                <spring:message code="patientregistration.matchesFor"/>
                <b><span id="stringToMatch" name="stringToMatch"></span></b>
                <br>
                <br>
                <spring:message code="patientregistration.selectMatch"/>
            </td>
        </tr>
        <tr>
            <td style="text-align:left;border:solid 1px;">
                <div id="overflowDiv" style="overflow: auto; width:100%">
                    <table id="confirmDiagnosisList" class="existingDiagnosisList searchTableList">
                    </table>
                </div>
            </td>
        </tr>
    </table>
</div>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>