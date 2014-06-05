package org.openmrs.module.patientregistration.controller.workflow;

import org.openmrs.*;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
public class PrimaryCareVisitTaskController extends AbstractPatientDetailsController{
	
	@RequestMapping(value = "/module/patientregistration/workflow/primaryCareVisitTask.form", method = RequestMethod.GET)
	public ModelAndView showEnterPatientIdentifier(HttpSession session,  ModelMap model) {
		
		// confirm that we have an active session
		if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
				
		// reset the workflow because we are starting a new session
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);
		
		return new ModelAndView("/module/patientregistration/workflow/primaryCareVisitTask");
	}
	
	
	@RequestMapping(value = "/module/patientregistration/workflow/primaryCareVisitCreateEncounterTaskItem.form", method = RequestMethod.GET)
	public ModelAndView showPrimaryCareReceptionCreateEncounterTaskItem(HttpSession session, ModelMap model, @RequestParam("patientId") Integer patientId) {
		
		Patient patient = null;
		
		// fetch the patient
		patient = Context.getPatientService().getPatient(patientId);
		
		// make sure we have a patient
		if (patient == null) {
			throw new APIException("No valid patient passed to handleSubmitPrimaryCareVisitCreateEncounterTaskItem");
		}
		
		// add the patient and preferred identifier to the map
		model.addAttribute("patient", patient);
		model.addAttribute("preferredIdentifier", PatientRegistrationUtil.getPreferredIdentifier(patient));
		
		// Initialize the EncounterTaskItem
		EncounterTaskItem taskItem = initializeEncounterTaskItem(session);
		
		// call the EncounterTaskItem renderer
		return new EncounterTaskItemHandler().render(taskItem, model);
	}
	
	@RequestMapping(value = "/module/patientregistration/workflow/primaryCareVisitCreateEncounterTaskItem.form", method = RequestMethod.POST)
	public ModelAndView handleSubmitPrimaryCareReceptionCreateEncounterTaskItem(HttpSession session, HttpServletRequest request, ModelMap model, @RequestParam("patientId") Integer patientId) {
		
		Patient patient = null;
		
		// fetch the patient
		patient = Context.getPatientService().getPatient(patientId);
		
		// make sure we have a patient
		if (patient == null) {
			throw new APIException("No valid patient passed to handleSubmitPrimaryCareVisitCreateEncounterTaskItem");
		}
		
		// add the patient and preferred identifier to the map
		model.addAttribute("patient", patient);
		model.addAttribute("preferredIdentifier", PatientRegistrationUtil.getPreferredIdentifier(patient));
		
		// Initialize the EncounterTaskItem
		EncounterTaskItem taskItem = initializeEncounterTaskItem(session);
		
		// call the EncounterTaskItem submit handlers
		ModelAndView ret = new EncounterTaskItemHandler().handleSubmit(taskItem, patient, request, model);
		
		return ret;
	}
	
	/**
	 * Utility functions
	 */
	private EncounterTaskItem initializeEncounterTaskItem(HttpSession session)  {
			
			EncounterTaskItem taskItem = new EncounterTaskItem();
			
			// set the mode to "create"
			taskItem.setMode(EncounterTaskItem.Mode.CREATE);
			
			taskItem.setEncounterDate(PatientRegistrationUtil.clearTimeComponent(new Date()));  // for the visit encounter, we only want the date component of the date
			taskItem.setEncounterDateEditable(true);
			taskItem.setEncounterProvider(Context.getAuthenticatedUser().getPerson());
			taskItem.setEncounterProviderEditable(false);
			taskItem.setEncounterLocationEditable(false);
			
			EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_ENCOUNTER_TYPE();
			taskItem.setEncounterType(encounterType);
			taskItem.setEncounterTypeEditable(false);
			taskItem.setEncounterLocation(PatientRegistrationWebUtil.getRegistrationLocation(session));
			
			List<EncounterTaskItemQuestion> questions = new ArrayList<EncounterTaskItemQuestion>();
			
			EncounterTaskItemQuestion coded = new EncounterTaskItemQuestion();
			coded.setConcept(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_CODED_DIAGNOSIS_CONCEPT());
			String label = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_CODED_DIAGNOSIS_CONCEPT_LOCALIZED_LABEL(Context.getLocale());
			if (label != null) {
				coded.setLabel(label);
			}
			coded.setType(EncounterTaskItemQuestion.Type.AUTOCOMPLETE);
			coded.setBlankAllowed(true);
			
			// configure the answers for this question
			ConceptSource icd10 = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_ICD10_CONCEPT_SOURCE();
			// if the source hasn't been configured, just use the standard configuration
			if (icd10 == null) {
				coded.initializeAnswersFromConceptAnswers();
			}
			// otherwise, manually configure
			else {
				Map<String,String> answers = new HashMap<String,String>();
				
				for (ConceptAnswer answer : coded.getConcept().getAnswers()) {
					ConceptMap mapping = PatientRegistrationUtil.getConceptMapping(answer.getAnswerConcept(), icd10);
					
					if (mapping == null) {
						answers.put(answer.getAnswerConcept().getName().getName(), answer.getAnswerConcept().getId().toString());
					}
					else {
						answers.put("(" + mapping.getSourceCode() + ") " + answer.getAnswerConcept().getName().getName(), answer.getAnswerConcept().getId().toString());
					}
				}
				coded.setAnswers(answers);
			}
			
			questions.add(coded);
			
			EncounterTaskItemQuestion nonCoded = new EncounterTaskItemQuestion();
			nonCoded.setConcept(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NON_CODED_DIAGNOSIS_CONCEPT());
			label = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NON_CODED_DIAGNOSIS_CONCEPT_LOCALIZED_LABEL(Context.getLocale());
			if (label != null) {
				nonCoded.setLabel(label);
			}
			nonCoded.setType(EncounterTaskItemQuestion.Type.TEXT);
			nonCoded.setBlankAllowed(true);
			questions.add(nonCoded);
					
			taskItem.setQuestions(questions);
			
			taskItem.setConfirmDetails(true);
			taskItem.setBackUrl("/module/patientregistration/workflow/primaryCareVisitTask.form");
			taskItem.setSuccessUrl("/module/patientregistration/workflow/patientDashboard.form");
			
			return taskItem;
		}
				
}
