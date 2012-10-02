package org.openmrs.module.patientregistration.controller.workflow;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.openmrs.EncounterType;
import org.openmrs.Patient;
import org.openmrs.api.APIException;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.task.EncounterTaskItem;
import org.openmrs.module.patientregistration.task.EncounterTaskItemHandler;
import org.openmrs.module.patientregistration.task.EncounterTaskItemQuestion;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class PrimaryCareReceptionTaskController extends AbstractPatientDetailsController{

	@RequestMapping(value = "/module/patientregistration/workflow/primaryCareReceptionTask.form", method = RequestMethod.GET)
	public ModelAndView showEnterPatientIdentifier(HttpSession session,  ModelMap model) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		return new ModelAndView("/module/patientregistration/workflow/primaryCareReceptionTask");
	}
	
	
	@RequestMapping(value = "/module/patientregistration/workflow/primaryCareReceptionCreateEncounterTaskItem.form", method = RequestMethod.GET)
	public ModelAndView showPrimaryCareReceptionCreateEncounterTaskItem(HttpSession session, ModelMap model, @RequestParam("patientId") Integer patientId) {

		UserActivityLogger.startActivityGroup(session);
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_PRIMARY_CARE_RECEPTION_ENCOUNTER_STARTED);
		
		Patient patient = null;
		
		// fetch the patient
		patient = Context.getPatientService().getPatient(patientId);
		
		// make sure we have a patient
		if (patient == null) {
			throw new APIException("No valid patient passed to handleSubmitPrimaryCareReceptionCreateEncounterTaskItem");
		}
		
		// add the patient and preferred identifier to the map
		model.addAttribute("patient", patient);
		model.addAttribute("preferredIdentifier", PatientRegistrationUtil.getPreferredIdentifier(patient));
		
		// Initialize the EncounterTaskItem
		EncounterTaskItem taskItem = initializeEncounterTaskItem(session);
		
		// call the EncounterTaskItem renderer
		return new EncounterTaskItemHandler().render(taskItem, model);
	}
	
	@RequestMapping(value = "/module/patientregistration/workflow/primaryCareReceptionCreateEncounterTaskItem.form", method = RequestMethod.POST)
	public ModelAndView handleSubmitPrimaryCareReceptionCreateEncounterTaskItem(
			HttpSession session, 
			HttpServletRequest request, 
			ModelMap model, @RequestParam("patientId") Integer patientId) {

		Patient patient = null;
		
		// fetch the patient
		patient = Context.getPatientService().getPatient(patientId);
		
		// make sure we have a patient
		if (patient == null) {
			throw new APIException("No valid patient passed to handleSubmitPrimaryCareReceptionCreateEncounterTaskItem");
		}
		
		// add the patient and preferred identifier to the map
		model.addAttribute("patient", patient);
		model.addAttribute("preferredIdentifier", PatientRegistrationUtil.getPreferredIdentifier(patient));
		
		// Initialize the EncounterTaskItem
		EncounterTaskItem taskItem = initializeEncounterTaskItem(session);
		
		// call the EncounterTaskItem renderer
		ModelAndView ret = new EncounterTaskItemHandler().handleSubmit(taskItem, patient, request, model);
		
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_PRIMARY_CARE_RECEPTION_ENCOUNTER_COMPLETED);
		UserActivityLogger.endActivityGroup(session);
		
		return ret;
	}
	
	/** 
	 * Utility functions
	 */
	private EncounterTaskItem initializeEncounterTaskItem(HttpSession session)  {
		
		EncounterTaskItem taskItem = new EncounterTaskItem();
		
		// set the mode to "create"
		taskItem.setMode(EncounterTaskItem.Mode.CREATE);
		
		taskItem.setEncounterDate(new Date());
		taskItem.setEncounterDateEditable(false);
		taskItem.setEncounterProvider(Context.getAuthenticatedUser().getPerson());
		taskItem.setEncounterProviderEditable(false);
		taskItem.setEncounterLocationEditable(false);
		
		EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_ENCOUNTER_TYPE();
		taskItem.setEncounterType(encounterType);
		taskItem.setEncounterTypeEditable(false);
		taskItem.setEncounterLocation(PatientRegistrationWebUtil.getRegistrationLocation(session));
		
		List<EncounterTaskItemQuestion> questions = new ArrayList<EncounterTaskItemQuestion>();

        // TODO we don't know why this is in this class at all. If it's needed it shoud also have the payment amount question
		EncounterTaskItemQuestion payment = new EncounterTaskItemQuestion();
		payment.setConcept(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_VISIT_REASON_CONCEPT());
		String label = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_VISIT_REASON_CONCEPT_LOCALIZED_LABEL(Context.getLocale());
		if (label != null) {
			payment.setLabel(label);
		}
		payment.setType(EncounterTaskItemQuestion.Type.SELECT);
		payment.initializeAnswersFromConceptAnswers();
		questions.add(payment);
		
		EncounterTaskItemQuestion receipt = new EncounterTaskItemQuestion();
		receipt.setConcept(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_RECEIPT_NUMBER_CONCEPT());
		label = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_RECEIPT_NUMBER_CONCEPT_LOCALIZED_LABEL(Context.getLocale());
		if (label != null) {
			receipt.setLabel(label);
		}
		receipt.setType(EncounterTaskItemQuestion.Type.TEXT);
		questions.add(receipt);

		taskItem.setQuestions(questions);
		
		taskItem.setConfirmDetails(true);
		taskItem.setBackUrl("/module/patientregistration/workflow/primaryCareReceptionTask.form");
		taskItem.setSuccessUrl("/module/patientregistration/workflow/primaryCareReceptionDossierNumber.form");
		
		return taskItem;
	}

}
