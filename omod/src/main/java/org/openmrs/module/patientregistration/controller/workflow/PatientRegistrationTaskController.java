package org.openmrs.module.patientregistration.controller.workflow;

import javax.servlet.http.HttpSession;

import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.TaskProgress;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PatientRegistrationTaskController extends AbstractPatientDetailsController{
	
	@RequestMapping(value = "/module/patientregistration/workflow/patientRegistrationTask.form", method = RequestMethod.GET)
	public ModelAndView showEnterPatientIdentifier(HttpSession session,  ModelMap model, @RequestParam(value = "testPatient", required = false) boolean testPatient) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_INITIATED);

        if (testPatient){
            model.put("testPatient", testPatient);
        }
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		return new ModelAndView("/module/patientregistration/workflow/patientRegistrationTask");
	}
	@RequestMapping(value = "/module/patientregistration/workflow/retrospectiveEntryTask.form", method = RequestMethod.GET)
	public ModelAndView scanPatientIdentifier(HttpSession session,  ModelMap model) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_INITIATED);
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		TaskProgress taskProgress = new TaskProgress();
		taskProgress.setProgressBarImage(PatientRegistrationConstants.RETROSPECTIVE_PROGRESS_1_IMG);				
		PatientRegistrationWebUtil.setTaskProgress(session, taskProgress);
		model.addAttribute("taskProgress", taskProgress);
		
		model.put("nextTask", "primaryCareReceptionEncounter.form");	
		return new ModelAndView("/module/patientregistration/workflow/patientRegistrationTask");
	}
	
	@RequestMapping(value = "/module/patientregistration/workflow/edCheckInTask.form", method = RequestMethod.GET)
	public ModelAndView scanEdPatientIdentifier(HttpSession session,  ModelMap model) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		TaskProgress taskProgress = new TaskProgress();			
		PatientRegistrationWebUtil.setTaskProgress(session, taskProgress);
		model.addAttribute("taskProgress", taskProgress);
		
		model.put("nextTask", "primaryCareReceptionEncounter.form");	
		return new ModelAndView("/module/patientregistration/workflow/patientRegistrationTask");
	}
}
