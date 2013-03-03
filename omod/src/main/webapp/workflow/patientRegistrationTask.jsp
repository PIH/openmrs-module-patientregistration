<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<openmrs:htmlInclude file="/moduleResources/patientregistration/patientRegistrationTask.js"/>
<script type="text/javascript">
    var nextTask = "${nextTask}";
    var registrationTask = "${registration_task}";
    var registerWithExistingIdLabel='<spring:message code="patientregistration.registerWithId"/>';
</script>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuTopBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_topBar.jsp"%>

<div class="middleArea">
    <div class="menu" id="menuArea">
        <table class="menu">
            <tr>
                <th class="menu"><spring:message code="patientregistration.tasks.${registration_task}"/></th>
            </tr>
        </table>
    </div>
</div>
<div class="partBar mainArea largeFont">
    <table height="100%" width="100%">
        <tr>
            <td align="center" valign="center">

                <div>
                    <table align="center">
                        <tr>
                            <td align="left">
                                <b>
                                    <spring:message code="patientregistration.findPatientByIdentifier"/>
                                </b>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" class="scan-input">
                                <input id="patientIdentifier" class="largeFont" style="height:45px; width:450px; font-size:1.2em" AUTOCOMPLETE='OFF'
                                       name="patientIdentifier" value="${patientIdentifier}" placeholder="<spring:message code="patientregistration.typeOrIdentifyBarCode.label"/>" />
                            </td>
                        </tr>
                        <tr style="height:50px">
                            <td align="center">
                                <spring:message code="patientregistration.or"/>
                            </td>
                        </tr>
                        <tr>
                            <td align="left">
                                <button id="searchByNameBtn" type="button" style="min-height: 45px; width: 450px; font-size:25px; font-weight:bold;" >
                                    <span class="largeFont"><spring:message code="patientregistration.lookUpByName"/></span>
                                </button>
                            </td>
                        </tr>
                        <c:if test="${registration_task == 'edCheckIn'}">
                            <tr style="height:50px">
                                <td align="center">
                                </td>
                            </tr>
                            <tr>
                                <td align="left">
                                    <button id="registerJdBtn" type="button" style="height: 45px; width: 450px; font-size:25px; font-weight:bold;" >
                                        <span class="largeFont"><spring:message code="patientregistration.unidentifiedPatient"/></span>
                                    </button>
                                </td>
                            </tr>
                        </c:if>
                    </table>
                </div>

            </td>
        </tr>
    </table>
</div>
<div id="messageArea" class="hiddenDiv">
    <!-- displays alert messages -->
    <div id="matchedPatientDiv" name="matchedPatientDiv" class="matchedPatientClass" style="visibility:hidden">
        <div id="confirmExistingPatientDiv">
            <table class="confirmExistingPatientList searchTableList">
            </table>
        </div>
        <div id="confirmExistingPatientModalDiv" title='<spring:message code="patientregistration.similarPatients"/>'>
            <table width="100%">
                <tr>
                    <td>
                        <spring:message code="patientregistration.noPatientWithId"/>:
                        &nbsp;&nbsp;
                        <b><span id="fieldInput" name="fieldInput"></span></b>
                        <br>
                        <br>

                    </td>
                </tr>
                <tr id="reuseIDMessageTr">
                    <td style="text-align:left;">
                        <table>
                            <tr>
                                <td class="labelSmall">
                                    <hr>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <spring:message code="patientregistration.reuseIDMessage"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="labelSmall">
                                    &nbsp;
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button id="registerNewId" class="confirm right"><spring:message code="patientregistration.registerWithNewId"/></button>
                                    <button id="registerWithExistingId" class="cancel"><spring:message code="patientregistration.registerWithId"/></button>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr id="similarPatientsFoundTr">
                    <td style="text-align:left;">
                        <spring:message code="patientregistration.similarPatientsFound"/>
                    </td>
                </tr>
                <tr id="searchTableListTr">
                    <td style="text-align:left;border:solid 1px;">
                        <div id="overflowDiv" style="overflow: auto;">
                            <table class="confirmExistingPatientModalList searchTableList">
                            </table>
                        </div>
                    </td>
                </tr>
            </table>
            <div id="confirmPatientModalDiv" title="<spring:message code="patientregistration.confirmPatient"/>">
        </div>
    </div>
</div>
</div>
</div>

<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_menuBottomBar.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/workflow/_bottomBar.jsp"%>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>
