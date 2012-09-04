package org.openmrs.module.patientregistration.controller.workflow;

import javax.servlet.http.HttpSession;

import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/module/patientregistration/workflow/patientLookupTask.form")
public class PatientLookupTaskController extends AbstractPatientDetailsController{
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView showEnterPatientIdentifier(HttpSession session,  ModelMap model) {
		
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_PATIENT_LOOKUP_INITIATED);
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		return new ModelAndView("/module/patientregistration/workflow/patientLookupTask");
	}
}
