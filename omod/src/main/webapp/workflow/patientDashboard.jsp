<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>


<openmrs:htmlInclude file="/moduleResources/patientregistration/patientDashboard.js"/>

<script type="text/javascript">
    var taskName="${task}";
    var nextTask="${nextTask}";
    var patient = "${patient}";
    var patientId ="${patient.id}";
    var firstNameVal = "${patient.givenName}";
    var lastNameVal = "${patient.familyName}";
    var genderVal = "${patient.gender}";
    var patientBirthdate = '<openmrs:formatDate date="${patient.birthdate}" format="${_dateFormatDisplayDash}"/>';

    var patientPreferredIdentifier = "${preferredIdentifier}";
    var cardCounterMessage = '<spring:message code="patientregistration.idCardCounter" javaScriptEscape="true"/>';
    var cardPrintedStatus = "${cardInfo.printingObs.valueText}";
    var cardPrintedLastDate="${cardInfo.lastPrintingDate}";
    var cardPrintedCounter = "${cardInfo.printingCounter}";
    var scanIdCard = "${scanIdCard}";
    var cardPrintedStatusDate = "${cardInfo.printingObs.obsDatetime}";
    var statusLabel = '<spring:message code="patientregistration.idCardPrinted" javaScriptEscape="true"/>' + ":";
    var statusDateValue = '<patientregistration:pocFormatDate date="${cardInfo.printingObs.obsDatetime}" format="${_dateFormatDisplayDash}"/>';

    var patientIdLabel = 'patientId';
    var bornLabel = '<spring:message code="patientregistration.person.birthdate" javaScriptEscape="true"/>';
    var personDateCreatedLabel = '<spring:message code="patientregistration.person.dateCreated" javaScriptEscape="true"/>';
    var address1Label = '<spring:message code="patientregistration.person.address.address1" javaScriptEscape="true"/>';
    var cityVillageLabel = '<spring:message code="patientregistration.person.address.cityVillage" javaScriptEscape="true"/>';
    var zlEmrIdLabel = '<spring:message code="patientregistration.patient.zlEmrId" javaScriptEscape="true"/>';
    var dossierNumberLabel= '<spring:message code="patientregistration.menu.numero" javaScriptEscape="true"/>';
    var firstEncounterDateLabel = '<spring:message code="patientregistration.patient.firstEncounterDate" javaScriptEscape="true"/>';

    var errorMessages = ${errorMessages};

    if (errorMessages){
        errorMessages.forEach(function(element){
            emr.errorAlert(element);
        });
    }

    var duplicatePatientsData = [
            <c:forEach var="duplicatePatient" items="${duplicatePatients}" varStatus="i">
    {
        patientId : "${duplicatePatient.patientId}",
        firstName : "${duplicatePatient.firstName}" ,
        lastName : "${duplicatePatient.lastName}" ,
        gender : "${duplicatePatient.gender}" ,
        birthdate : '<patientregistration:pocFormatDate date="${duplicatePatient.birthdate}" format="${_dateFormatDisplayDash}"/>' ,
        personDateCreated : '<patientregistration:pocFormatDate date="${duplicatePatient.personDateCreated}" format="${_dateFormatDisplayDash}"/>' ,
        address1 : "${duplicatePatient.address1}" ,
        cityVillage : "${duplicatePatient.cityVillage}" ,
        zlEmrId : "${duplicatePatient.zlEmrId}" ,
        dossierNumber : "${duplicatePatient.dossierNumber}" ,
        firstEncounterDate : '<patientregistration:pocFormatDate date="${duplicatePatient.firstEncounterDate}" format="${_dateFormatDisplayDash}"/>'
    }
            <c:if test="${!i.last}">,</c:if>
    </c:forEach>
    ];
</script>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>

<div class="middleArea">
<div class="menu" id="menuArea">
    <table class="menu">
        <tr>
            <th class="menu"><spring:message code="patientregistration.patientDashboard.title" /></th>
        </tr>
        <tr>
            <td id="overviewMenu" class="menu highlighted"><spring:message code="patientregistration.patientDashboard.overview" /></td>
        </tr>
        <tr>
            <td id="encountersMenu" class="menu"><spring:message code="patientregistration.patientDashboard.encounters" /></td>
        </tr>
    </table>
</div>

<div class="partBar mainArea largeFont">
<div id="overviewDashboardDiv" class="padded">
<table id="overviewTable" width="100%">
<tr>
<td width="50%" valign="top">
    <table width="100%">
        <tr>
            <td class="labelSmall">
                <spring:message code="patientregistration.person.surname"/>
            </td>
        </tr>
        <tr>
            <td class="questionBox" width="75%">
                ${patient.familyName}
            </td>
            <td width="5%">&nbsp;
            </td>
            <td class="leftalign" width="20%">
                <button type="button" class="editPatientDemo editDemoDiv" id="lastNameDiv" />
            </td>
        </tr>
        <tr>
            <td class="labelSmall">
                <spring:message code="patientregistration.person.firstName"/>
            </td>
        </tr>
        <tr>
            <td class="questionBox" width="75%">
                ${patient.givenName}
            </td>
            <td width="5%">&nbsp;
            </td>
            <td class="leftalign" width="20%">
                <button type="button" class="editPatientDemo editDemoDiv" id="firstNameDiv" />
            </td>
        </tr>
        <tr>
            <td class="labelSmall">
                <spring:message code="patientregistration.gender"/>
            </td>
        </tr>
        <tr>
            <td id="tdGenderId" class="questionBox" width="75%">
                ${patient.gender}
            </td>
            <td width="5%">&nbsp;
            </td>
            <td class="leftalign" width="20%">
                <button type="button" class="editPatientDemo editDemoDiv" id="genderDiv" />
            </td>
        </tr>
        <tr>
            <td class="labelSmall">
                <c:choose>
                    <c:when test="${patient.birthdateEstimated == true}">
                        <spring:message code="patientregistration.age"/>
                    </c:when>
                    <c:otherwise>
                        <spring:message code="patientregistration.person.birthdate"/>
                    </c:otherwise>
                </c:choose>
            </td>
        </tr>
        <tr>
            <td class="questionBox" width="75%">
                <c:choose>
                    <c:when test="${patient.birthdateEstimated == true}">
                        ${patient.age}&nbsp;<spring:message code="patientregistration.years"/>
                        (<spring:message code="patientregistration.person.birthdate.estimated"/>)
                    </c:when>
                    <c:otherwise>
                        <openmrs:formatDate date="${patient.birthdate}" format="${_dateFormatDisplayDash}"/>
                    </c:otherwise>
                </c:choose>
            </td>
            <td width="5%">&nbsp;
            </td>
            <td class="leftalign" width="20%">
                <button type="button" class="editPatientDemo editDemoDiv" id="birthdateDiv" />
            </td>
        </tr>
        <tr>
            <td class="labelSmall">
                <spring:message code="patientregistration.person.address"/>
            </td>
        </tr>
        <tr>
            <td class="questionBox" width="75%">
                <table>
                    <tr>
                        <td>
                            <span class="labelVerySmall"><spring:message code="patientregistration.person.address.address2"/>:</span>
                        </td>
                        <td>
                            <span>${patient.personAddress['address2']}</span><br>
                        </td>
                    </tr>
                </table>
            </td>
            <td width="5%">&nbsp;
            </td>
            <td class="leftalign" width="20%">
                <button type="button" class="editPatientDemo editDemoDiv" id="addressLandmarkDiv" />
            </td>
        </tr>
        <tr>
            <td class="questionBox" width="75%">
                <table>
                    <c:forEach var="addressLevel" items="${addressHierarchyLevels}">
                        <c:if test="${addressLevel != 'address2'}">
                            <tr>
                                <td>
                                    <span class="labelVerySmall"><spring:message code="patientregistration.person.address.${addressLevel}"/>:</span>
                                </td>
                                <td>
                                    <span>${patient.personAddress[addressLevel]}</span><br>
                                </td>
                            </tr>
                        </c:if>
                    </c:forEach>
                </table>
            </td>
            <td width="5%">&nbsp;
            </td>
            <td class="leftalign" width="20%">
                <button type="button" class="editPatientDemo editDemoDiv" id="possibleLocalityDiv" />
            </td>
        </tr>
    </table>
</td>
<td width="50%" valign="top">
    <table width="100%">
        <tr>
            <td class="labelSmall">
                <spring:message code="patientregistration.registrationEncounter.date"/>
            </td>
        </tr>
        <tr>
            <td class="questionBox" width="60%">
                <patientregistration:pocFormatDate date="${registrationEncounter.encounterDatetime}" format="${_dateFormatDisplayDash}"/>
            </td>
            <td width="3%">&nbsp;
            </td>
            <td class="leftalign" width="17%">
                <button type="button" class="editPatientDemo editDemoDiv" id="encounterDateDiv" />
            </td>
            <td width="3%">&nbsp;
            </td>
            <td width="17%">&nbsp;
            </td>
        </tr>
        <form id="printIDCardForm" method="post">
            <tr>
                <td class="labelSmall">
                    <spring:message code="patientregistration.patient.zlEmrId"/>
                </td>
            </tr>
            <tr>
                <td class="questionBox" width="60%"><span id="patientPreferredId">${preferredIdentifier}</span>&nbsp;
                </td>
                <td width="3%">&nbsp;
                </td>
                <td width="17%" class="leftalign">
                    <c:if test="${!empty preferredIdentifier.identifier}">
                        <button name="printIDCard" type="submit" class="printButton" />
                    </c:if>
                </td>
            </tr>
        </form>
        <form id="printLabelForm" method="post">
            <c:if test="${!empty numeroDossier}">
                <tr>
                    <td class="labelSmall">
                        ${numeroDossier.identifierType.name}
                    </td>
                </tr>
                <tr>
                    <td class="questionBox" id="dossierNumber" width="60%">
                        <c:if test="${!empty numeroDossier.identifier}">
                            ${numeroDossier.identifier}&nbsp;(${numeroDossier.location.name})
                        </c:if>
                    </td>
                    <td width="3%">&nbsp;
                    </td>
                    <td width="17%" class="leftalign">
                        <button type="button" class="editPatientDemo" id="editDossier" />
                    </td>
                </tr>
            </c:if>
        </form>
        <c:if test="${!empty externalNumeroDossier.identifier}">
            <tr>
                <td class="labelSmall">
                    <spring:message code="ui.i18n.PatientIdentifierType.name.9dbea4d4-35a9-4793-959e-952f2a9f5347"/>
                </td>
            </tr>
            <tr>
                <td class="questionBox" width="60%">
                    <c:if test="${!empty externalNumeroDossier.identifier}">
                        ${externalNumeroDossier.identifier}&nbsp;(${externalNumeroDossier.location.name})
                    </c:if>
                </td>
                <td width="3%">&nbsp;
                </td>
                <td width="17%" class="leftalign">
                </td>
                <td width="3%">&nbsp;
                </td>
                <td width="17%" class="leftalign">
                </td>
            </tr>
        </c:if>
        <openmrs:forEachDisplayAttributeType personType="patient" displayType="viewing" var="attrType">
            <tr>
                <td class="labelSmall">
                    <spring:message code="patientregistration.${fn:replace(attrType.name, ' ', '')}" text="${attrType.name}"/>
                </td>
            </tr>
            <tr>
                <td class="questionBox" width="60%">
                    ${patient.attributeMap[attrType.name].hydratedObject}
                </td>
                <td width="3%">&nbsp;
                </td>
                <td class="leftalign" width="17%">
                    <button type="button" class="editPatientDemo editDemoDiv" id="phoneNumberDiv" />
                </td>
                <td width="3%">&nbsp;
                </td>
                <td width="17%">&nbsp;
                </td>
            </tr>
        </openmrs:forEachDisplayAttributeType>
        <tr>
            <td class="labelSmall">
                &nbsp;
            </td>
        </tr>
        <form id="printPatientLabelForm" method="post">
            <tr>
                <td id="tdPrintLabelId" class="questionBox pointer spanQuestionBox">
                    <input type="hidden" name="printDossierLabel" />
                    <button id="printDossierLabelId" type="submit" class="printButton"></button>
                    <span><spring:message code="patientregistration.patientLabel"/></span>
                </td>
            </tr>
        </form>
        <tr>
            <td class="labelSmall">
                &nbsp;
            </td>
        </tr>
        <tr>
            <td class="labelSmall">
									<span id="lastStatusLabel" name="lastStatusLabel">
									</span>
                <br/>
									<span id="lastStatusDate" name="lastStatusDate">
									</span>
            </td>
        </tr>

        <tr>
            <td>
                <img id="printedIdCard" align="left" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/no-card-icon.png">
            </td>
        </tr>
        <tr>
            <td class="labelSmall">
									<span id="printingCounterLabel" name="printingCounterLabel">
									</span>
            </td>
        </tr>
    </table>
</td>
</tr>
</table>
</div>
<div id="encounterDashboardDiv" class="padded hiddenDiv">
    <table class="patientDashboardTable">
        <tr>
            <th><spring:message code="patientregistration.patientDashboard.recentEncounters" />:</th>
        </tr>
        <tr>
            <td style="vertical-align: top;">
                <table style="width:100%; cell-padding:10px;">
                    <tr style="background-color: gray; color: white;">
                        <th class="encounter"><spring:message code="patientregistration.date" /></th>
                        <th class="encounter"><spring:message code="patientregistration.encounterType" /></th>
                        <th class="encounter"><spring:message code="patientregistration.location" /></th>
                        <th class="encounter"><spring:message code="patientregistration.provider" /></th>
                    </tr>
                    <openmrs:forEachEncounter encounters="${encounters}" sortBy="encounterDatetime" descending="true" var="enc">
                        <tr class="<c:choose><c:when test="${count % 2 == 0}">alt0</c:when><c:otherwise>alt1</c:otherwise></c:choose>">
                        <td class="encounter">
                            <patientregistration:pocFormatDate date="${enc.encounterDatetime}" format="${_dateFormatDisplayDash}"/>
                        </td>
                        <td class="encounter">

                            <c:if test="${!empty encounterLocale[enc.encounterType.id]}">
                                <c:set var="locEncounterName" value="${encounterLocale[enc.encounterType.id]}"/>
                            </c:if>
                            <c:choose>
                                <c:when test="${!empty encounterLocale[enc.encounterType.id]}">
                                    <c:set var="locEncounterName" value="${encounterLocale[enc.encounterType.id]}"/>
                                </c:when>
                                <c:otherwise>
                                    <c:set var="locEncounterName" value="${enc.encounterType.name}"/>
                                </c:otherwise>
                            </c:choose>
                            <c:choose>
                                <c:when test="${!empty editURLs[enc.encounterType.id]}">
                                    <a href='${pageContext.request.contextPath}/${editURLs[enc.encounterType.id]}?patientId=${patient.id}&encounterId=${enc.id}'>
                                        ${locEncounterName}
                                    </a>
                                </c:when>
                                <c:otherwise>
                                    ${locEncounterName}
                                </c:otherwise>
                            </c:choose>

                        </td>
                        <td class="encounter">${enc.location.name}</td>
                        <td class="encounter">${enc.provider.personName}</td>
                        </tr>
                    </openmrs:forEachEncounter>
                </table>
            </td>
        </tr>
    </table>
</div>
<div id="scanIdCardDiv" name="scanIdCardDiv" class="padded hiddenDiv ajaxResultsDiv">
    <table class="maxSize">
        <tr>
            <td>
                <b class="leftalign"><spring:message code="patientregistration.scanIdCard"/></b>
            </td>
        </tr>
        <tr>
            <td>
                <img src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/scanCard.png"></img>
            </td>
        </tr>
        <tr>
            <td>
                <input id="scanPatientIdentifier" class="largeFont" style="height:30px; width:350px; font-size:25px" AUTOCOMPLETE='OFF'
                       name="scanPatientIdentifier" value=""/>
            </td>
        </tr>
    </table>
    <div id="scanBtnDiv" name="scanBtnDiv" class="partBar">
        <table class="maxSize">
            <tr class="centered">
                <td width="50%">
                    &nbsp;
                </td>
                <td width="30%">
                    <button id="brokenPrinterBtn" name="brokenPrinterBtn" type="button" class="unknownBirthdate">
                        <spring:message code="patientregistration.brokenPrinter"/>
                    </button>
                </td>
                <td width="20%">
                    <form id="reprintIDCardForm" method="post">
                        <button name="reprintIDCard" type="submit" class="unknownBirthdate">
                            <spring:message code="patientregistration.reprintIDCard"/>
                        </button>
                    </form>
                </td>
            </tr>
        </table>
    </div>
</div>
<div id="dialog-confirm" name="dialog-confirm" title='<spring:message code="patientregistration.changePrintingStatus"/>?' class="padded hiddenDiv">
    <table class="maxSize">
        <tr>
            <td>
                <b><span style="text-align:center;"><spring:message code="patientregistration.doesHaveCard"/>?</span></b>
            </td>
        </tr>
    </table>
</div>
<div id="messageArea" class="hiddenDiv">
</div>

</div>
</div>


<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>
