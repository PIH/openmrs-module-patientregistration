package org.openmrs.module.patientregistration.controller.ajax;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;

@Controller
public class UserActivityLoggingAjaxController {

	protected final Log log = LogFactory.getLog(getClass());
	
	@RequestMapping("/module/patientregistration/ajax/logActivity.form")
	public void patientIdentifierSearch(HttpSession session, @RequestParam("activity") String activity) throws Exception {
		//UserActivityLogger.logActivity(session, activity);
	}
}
