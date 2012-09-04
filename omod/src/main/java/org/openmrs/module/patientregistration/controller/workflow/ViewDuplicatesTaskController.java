package org.openmrs.module.patientregistration.controller.workflow;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.openmrs.Patient;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ViewDuplicatesTaskController extends
		AbstractPatientDetailsController {

	@RequestMapping(value = "/module/patientregistration/workflow/viewDuplicatesTask.form", method = RequestMethod.GET)
	public ModelAndView showDuplicates(HttpSession session,  ModelMap model) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
		List<Patient> pocDuplicates= PatientRegistrationWebUtil.getDistinctDuplicatePatients(session);
		if(pocDuplicates!=null && pocDuplicates.size()>0){
			model.addAttribute("pocDuplicates", pocDuplicates);
		}
		
		
		return new ModelAndView("/module/patientregistration/workflow/viewDuplicatesTask");
	}
}
