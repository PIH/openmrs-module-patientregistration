package org.openmrs.module.patientregistration.controller.workflow;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.openmrs.Patient;
import org.openmrs.PatientIdentifierType;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ConfirmPatientController extends AbstractPatientDetailsController{
	
	@SuppressWarnings("unchecked")
    @RequestMapping("/module/patientregistration/workflow/confirmPatient.form") 
	public ModelAndView showPatientInfo(HttpSession session, ModelMap model, 			
			@RequestParam(value= "patientIdentifier", required = false) String patientIdentifier, 
			@RequestParam(value= "patientId", required = false) String patientId) {
	
			
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
		
		String message = "Lookup patient with " + (patientIdentifier != null ? "identifier = " + patientIdentifier : "id = " + patientId);

		Patient patient = null;
		if(StringUtils.isNotBlank(patientIdentifier)){
			List<Patient> patientList = null; 
			List<PatientIdentifierType> identifierTypes = new ArrayList<PatientIdentifierType>();			
			PatientIdentifierType preferredIdentifierType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_IDENTIFIER_TYPE();	
			if(preferredIdentifierType!=null){
				identifierTypes.add(preferredIdentifierType);
				patientList = Context.getPatientService().getPatients(null, patientIdentifier, identifierTypes, true);				
				if(patientList!=null && patientList.size()>0){
					patient = patientList.get(0);
				}
			}else{
				model.put("patientError", "Please set global property patientregistration.primaryIdentifierType");
			}
			
		}
		if(StringUtils.isNotBlank(patientId)){
			try{
				patient = Context.getPatientService().getPatient(new Integer(patientId));
			}catch(Exception e){
				log.error("patient not found", e);
			}
		}		
		
		if (patient != null) {
			model.put("patient", patient);			
			// get the identifier we wish to display
			model.put("preferredIdentifier", PatientRegistrationUtil.getPreferredIdentifier(patient));
		}else{			
			model.put("patientError", "patientregistration.noPatientFoundWithIdentifier");
		}
		
		return new ModelAndView("/module/patientregistration/workflow/confirmPatient");
	}
}
