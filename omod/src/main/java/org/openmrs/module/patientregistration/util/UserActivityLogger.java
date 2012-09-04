package org.openmrs.module.patientregistration.util;

import java.util.UUID;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.UserActivity;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.web.WebConstants;

/**
 * Logs user activity events
 */
public class UserActivityLogger {
	
	protected static final Log log = LogFactory.getLog(UserActivityLogger.class);

	/**
	 * Extracts the current context from the request, and logs this along with the activity
	 */
	public static void logActivity(HttpSession session, String activity) {
		logActivity(session, activity, null);
	}
	
	/**
	 * Extracts the current context from the request, and logs this along with the activity
	 */
	public static void logActivity(HttpSession session, String activity, String extraInfo) {
		try {
			UserActivity a = new UserActivity(activity);
			if (session != null) {
				a.setTask(PatientRegistrationWebUtil.getRegistrationTask(session));
				a.setLocation(PatientRegistrationWebUtil.getRegistrationLocation(session));
				a.setSessionId(session.getId());
				a.setIpAddress((String)session.getAttribute(WebConstants.OPENMRS_CLIENT_IP_HTTPSESSION_ATTR));
				a.setActivityGroup((String)session.getAttribute(PatientRegistrationConstants.SESSION_TASK_GROUP));
				a.setExtraInfo(extraInfo);
			}
			Context.getService(PatientRegistrationService.class).saveUserActivity(a);
		}
		catch (Throwable t) {
			log.warn("Error logging activity: " + activity);
		}
	}
	
	/**
	 * Start a new activity group
	 */
	public static void startActivityGroup(HttpSession session) {
		session.setAttribute(PatientRegistrationConstants.SESSION_TASK_GROUP, UUID.randomUUID().toString());
	}
	
	/**
	 * End the current activity group
	 */
	public static void endActivityGroup(HttpSession session) {
		session.removeAttribute(PatientRegistrationConstants.SESSION_TASK_GROUP);
	}
}
