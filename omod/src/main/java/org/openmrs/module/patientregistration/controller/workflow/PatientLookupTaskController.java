package org.openmrs.module.patientregistration.controller.workflow;

import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping(value = "/module/patientregistration/workflow/patientLookupTask.form")
public class PatientLookupTaskController extends AbstractPatientDetailsController{
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView showEnterPatientIdentifier(HttpSession session,  ModelMap model) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		return new ModelAndView("/module/patientregistration/workflow/patientLookupTask");
	}
}
