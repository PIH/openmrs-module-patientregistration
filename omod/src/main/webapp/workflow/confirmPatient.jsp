<%@ include file="/WEB-INF/template/include.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationHeader.jsp"%>
<%@ include file="/WEB-INF/view/module/patientregistration/details.jsp"%>

<!-- JQUERY FOR THIS PAGE -->
<script type="text/javascript">

    var addressLevels=[<c:forEach var="addressLevel" items="${addressHierarchyLevels}">'${addressLevel}',</c:forEach>];
    var addressMap =new Array();
    <c:forEach var="addressLevel" items="${addressHierarchyLevels}">
            addressMap['${addressLevel}'] = "${patient.personAddress[addressLevel]}";
    </c:forEach>

    var errorCode="${patientError}";
    var existingPatientAddress = '';
    $j.each(addressLevels, function(i, addressLevel) {
        existingPatientAddress = existingPatientAddress + "${patient.personAddress[addressLevel]}" + ', ';
    });


</script>

<table id="modalTable" width="100%">
    <tr style="text-align:left; vertical-align:top">
        <td>
            <div id="overflowDiv" style="overflow: auto;">
                <table class="confirmExistingPatientModalList maxSize">
                    <c:if test="${!empty patientError}">
                        <tr class="modalRow">
                            <td class="boldFont error" colspan="2">
                                <span id="confirmErrorMessage"><spring:message code="${patientError}"/></span>
                            </td>
                        </tr>
                    </c:if>
                    <c:if test="${!empty patient}">
                        <tr class="modalRow">
                            <td class="boldFont" colspan="2">
                                <c:choose>
                                    <c:when test="${!empty remoteUuid}">
                                    <span style="color:Red;">
                                        <spring:message code="patientregistration.confirmImportPatient" />:
                                    </span>
                                    </c:when>
                                    <c:otherwise>
                                        <spring:message code="patientregistration.confirmPatientDetails" />:
                                    </c:otherwise>
                                </c:choose>
                            </td>
                        </tr>
                        <tr class="modalRow">
                            <td class="boldFont" colspan="2">
                                <br>
                            </td>
                        </tr>
                        <tr class="modalRow">
                            <input type="hidden" id="hiddenPatientId" name="hiddenPatientId" type="number" value="${patient.id}"/>
                            <td class="modalLeftColumn">
                                <spring:message code="patientregistration.person.surname"/>, <spring:message code="patientregistration.person.firstName"/>:
                            </td>
                            <td class="boldFont">
                                <c:if test="${!empty patient.familyName}">
                                    ${patient.familyName}, ${patient.givenName}
                                </c:if>
                            </td>
                        </tr>
                        <tr class="modalRow">
                            <c:if test="${!empty preferredIdentifier}">
                                <td>
                                    <spring:message code="patientregistration.patient.zlEmrId"/>:
                                </td>
                                <td class="boldFont">
                                    <span style="font-size:1.5em;">
                                        ${preferredIdentifier}
                                    </span>
                                </td>
                            </c:if>
                        </tr>
                        <c:forEach var="identifier" items="${patient.identifiers}">
                            <c:if test="${(identifier.identifier != preferredIdentifier.identifier) && identifier.voided != true}">
                                <tr class="modalRow">
                                    <td>
                                        <c:choose>
                                            <c:when test="${ identifier.identifierType.name == preferredIdentifier.identifierType.name}">
                                                <spring:message code="patientregistration.patient.zlEmrId"/>:
                                            </c:when>
                                            <c:otherwise>
                                                ${identifier.identifierType.name}:
                                            </c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td class="boldFont">
                                        ${identifier.identifier}
                                    </td>
                            </c:if>
                            </tr>
                        </c:forEach>
                        <tr class="modalRow">
                            <td>
                                <spring:message code="patientregistration.gender"/>:
                            </td>
                            <td class="boldFont">
                                <c:if test="${!empty patient.gender}">
                                    <spring:message code="patientregistration.gender.${patient.gender}"/>
                                </c:if>
                            </td>
                        </tr>
                        <tr class="modalRow">
                            <td>
                                <c:choose>
                                    <c:when test="${patient.birthdateEstimated == true}">
                                        <spring:message code="patientregistration.age"/>
                                    </c:when>
                                    <c:otherwise>
                                        <spring:message code="patientregistration.person.birthdate"/>
                                    </c:otherwise>
                                </c:choose>
                            </td>
                            <td class="boldFont">
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
                        </tr>
                        <tr class="modalRow">
                            <td>
                                <spring:message code="patientregistration.person.address"/>:
                            </td>
                            <td>
                            </td>
                        </tr>

                        <c:forEach var="addressLevel" items="${addressHierarchyLevels}">
                            <tr class="modalRow">
                                <td>&nbsp;
                                </td>
                                <td>
                                    <em><spring:message code="patientregistration.person.address.${addressLevel}"/></em>:
                                    <span class="boldFont">${patient.personAddress[addressLevel]}</span>
                                </td>
                            </tr>
                        </c:forEach>
                        <openmrs:forEachDisplayAttributeType personType="patient" displayType="viewing" var="attrType">
                            <tr class="modalRow">
                                <td>
                                    <spring:message code="patientregistration.${fn:replace(attrType.name, ' ', '')}" text="${attrType.name}"/>:
                                    <br/>
                                </td>
                                <td class="boldFont">
                                    ${patient.attributeMap[attrType.name].hydratedObject}<br/>
                                </td>
                            </tr>
                        </openmrs:forEachDisplayAttributeType>
                    </c:if>
                </table>
            </div>
        </td>
    </tr>
</table>

<%@ include file="/WEB-INF/view/module/patientregistration/patientregistrationFooter.jsp"%>
