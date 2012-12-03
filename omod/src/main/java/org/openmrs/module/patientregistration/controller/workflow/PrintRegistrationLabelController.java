package org.openmrs.module.patientregistration.controller.workflow;

import org.apache.commons.lang.StringUtils;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.emr.EmrContext;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;

@Controller
public class PrintRegistrationLabelController {

    @RequestMapping("/module/patientregistration/workflow/printRegistrationLabel.form") 
	public ModelAndView showPrintRegistrationLabel(HttpSession session, ModelMap model, @RequestParam(value = "patientId", required = false) Integer patientId,
	                                               										@RequestParam (value = "count", required = false) Integer count, 
	                                               										@RequestParam (value = "nextTask", required = false) String nextTask) {
	
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
		
		Patient patient = PatientRegistrationWebUtil.updatePatientIdSessionAttributeAndGetPatient(session, patientId);
		
		// figure out how many labels are configured to be printed
		// if the number of labels to count hasn't been specified as a parameter, use the default specified in the global property 
		if (count == null) {
			count = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_REGISTRATION_LABEL_PRINT_COUNT();
		}
		if (count == null) {
			// default to 1
			count = 1;
		}
		if(count>0){
			// print the registration label (or labels)
			boolean labelSuccess = Context.getService(PatientRegistrationService.class).printRegistrationLabel(patient, new EmrContext(session), count);
			if (labelSuccess) {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_DOSSIER_LABEL_PRINTING_SUCCESSFUL);
			}
			else {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_DOSSIER_LABEL_PRINTING_FAILED);
				// TODO: Decide what else to do if this fails
			}
			
			// print out the ID card label
			boolean cardSuccess = Context.getService(PatientRegistrationService.class).printIDCardLabel(patient, new EmrContext(session));
			if (cardSuccess) {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_ID_CARD_LABEL_PRINTING_SUCCESSFUL);
			}
			else {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_ID_CARD_LABEL_PRINTING_FAILED);
				// TODO: Decide what else to do if this fails
			}
		}
		String nextPage = "redirect:/module/patientregistration/workflow/patientDashboard.form?patientId="+ patientId;
		if(StringUtils.isNotBlank(nextTask)){
			nextPage = nextPage + "&nextTask=" + nextTask;
		}
		return new ModelAndView(nextPage);
	}
}
