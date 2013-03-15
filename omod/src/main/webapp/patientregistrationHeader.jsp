<%@ page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="wgt" uri="/WEB-INF/view/module/htmlwidgets/resources/htmlwidgets.tld" %>
<%@ taglib prefix="rpt" uri="/WEB-INF/view/module/reporting/resources/reporting.tld" %>
<%@ taglib prefix="patientregistration" uri="/WEB-INF/view/module/patientregistration/resources/patientregistration.tld" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<%@ page import="org.openmrs.web.WebConstants" %>
<%
	pageContext.setAttribute("msg", session.getAttribute(WebConstants.OPENMRS_MSG_ATTR));
	pageContext.setAttribute("msgArgs", session.getAttribute(WebConstants.OPENMRS_MSG_ARGS));
	pageContext.setAttribute("err", session.getAttribute(WebConstants.OPENMRS_ERROR_ATTR));
	pageContext.setAttribute("errArgs", session.getAttribute(WebConstants.OPENMRS_ERROR_ARGS));
	session.removeAttribute(WebConstants.OPENMRS_MSG_ATTR);
	session.removeAttribute(WebConstants.OPENMRS_MSG_ARGS);
	session.removeAttribute(WebConstants.OPENMRS_ERROR_ATTR);
	session.removeAttribute(WebConstants.OPENMRS_ERROR_ARGS);

    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    response.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    response.setDateHeader("Expires", 0); // Proxies.
%>

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<openmrs:htmlInclude file="/openmrs.js" />
		<openmrs:htmlInclude file="/moduleResources/patientregistration/utils.js"/>
		<openmrs:htmlInclude file="/moduleResources/patientregistration/patientregistration.css" />

        <openmrs:htmlInclude file="/moduleResources/patientregistration/autocomplete/js/jquery-1.6.2.min.js" />
        <openmrs:htmlInclude file="/moduleResources/patientregistration/autocomplete/js/jquery-ui-1.8.16.custom.min.js" />
        <openmrs:htmlInclude file="/moduleResources/patientregistration/autocomplete/css/ui-lightness/jquery-ui-1.8.16.custom.css" />

        <openmrs:htmlInclude file="/moduleResources/patientregistration/jquery.printf.js" />


        <openmrs:htmlInclude file="/moduleResources/emr/scripts/underscore-min.js"/>
        <openmrs:htmlInclude file="/moduleResources/emr/scripts/emr.js"/>
        <openmrs:htmlInclude file="/moduleResources/emr/scripts/jquery.toastmessage.js"/>
        <openmrs:htmlInclude file="/moduleResources/emr/styles/jquery.toastmessage.css"/>

        <!-- set the date formats to use throughout the module (one for displaying dates, the other two for inputing them -->
		<c:set var="_dateFormatDisplay" value="dd/MMM/yyyy" scope="request"/>
		<c:set var="_dateFormatDisplayDash" value="dd-MMM-yyyy" scope="request"/>
		<c:set var="_dateFormatInput" value="dd/MM/yyyy" scope="request"/>
		<c:set var="_dateFormatInputJavascript" value="dd/mm/yy" scope="request"/>
		
		<c:choose>
			<c:when test="${!empty pageTitle}">
				<title>${pageTitle}</title>
			</c:when>
			<c:otherwise>
				<title><spring:message code="openmrs.title" /></title>
			</c:otherwise>
		</c:choose>

		<script type="text/javascript">
			/* variable used in js to know the context path */
			var openmrsContextPath = '${pageContext.request.contextPath}';
			var $j = jQuery.noConflict();

		</script>
		
		<style>
			.loginStringSection {
				padding-left:6px; padding-right:6px;
			}
		</style>
	</head>

<body>

  	<openmrs:authentication>
		<c:if test="${authenticatedUser == null}">
			<c:redirect url="/index.htm" />
			<span id="userLoggedOut" class="firstChild"> <spring:message code="patientregistration.logged.out" /> </span>
			<span id="userLogIn">
				<a href="${pageContext.request.contextPath}/login.htm"><spring:message code="patientregistration.login" /></a>
			</span>
		</c:if>
	</openmrs:authentication> 
	
	<div id="banner">
	    <table width="100%">
	    	<tr>
	    		<td align="left">
	    			<a href="${pageContext.request.contextPath}">
	    				<img class="logo" src="${pageContext.request.contextPath}/moduleResources/patientregistration/images/PIH_ZL_plum-170x30.jpg"></img>
	    			</a>
	    		</td>
		    	<td class="loginString" style="vertical-align:middle;">
		    		<span class="loginStringSection"><spring:message code="patientregistration.loggedIn"/> ${authenticatedUser.personName}</span> |
		    		<span class="loginStringSection"><a href='${pageContext.request.contextPath}/logout'><spring:message code="header.logout" /></a></span> | 
		    	</td>
	    	</tr>
	    </table>
	</div>
	
	
	
	