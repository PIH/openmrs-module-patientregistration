package org.openmrs.module.patientregistration.task;

import java.util.Calendar;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.api.APIException;
import org.openmrs.api.EncounterService;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;


public class EncounterTaskItemHandler {

	private static Log log = LogFactory.getLog(EncounterTaskItemHandler.class);
	
	public ModelAndView render(EncounterTaskItem taskItem, ModelMap model) {
		
		// TODO: perform basic validation that task item is correct
		
		// add the task item to the model
		model.addAttribute("taskItem", taskItem);
		
		// hack to add the existing encounterMonth to make it easier to pre-select month radio button without using convoluted JSTL
		if (taskItem.getEncounterDate() != null) {
			Calendar cal = Calendar.getInstance();
			cal.setTime(taskItem.getEncounterDate());
			model.addAttribute("encounterMonth", cal.get(Calendar.MONTH) + 1);
		}
		
		return new ModelAndView("/module/patientregistration/task/encounterTaskItem", model);
	}
	
	public ModelAndView handleSubmit(EncounterTaskItem taskItem, Patient patient, HttpServletRequest request, ModelMap model) {
		
		int page = 1;
		
		// TODO: better error handling
		// TODO: add handling of setting encounter provider, etc
		
		// create the new Encounter
		Encounter encounter = new Encounter();
		encounter.setEncounterDatetime(taskItem.getEncounterDate());
		encounter.setEncounterType(taskItem.getEncounterType());
		encounter.setProvider(taskItem.getEncounterProvider());
		encounter.setLocation(taskItem.getEncounterLocation());
		encounter.setPatient(patient);
		
		// skip the first question if it simply the one where we select if we want to edit the date or not
		if (taskItem.getEncounterDateEditable() == true && taskItem.getEncounterDate() != null) {
			page++;
		}
		
		// handle the encounter date if this is a question on the form
		if (taskItem.getEncounterDateEditable()) {
			
			// pull in the day, month, and year
			String yearString = request.getParameter("encounterYear");
			String monthString = request.getParameter("encounterMonth");
			String dayString = request.getParameter("encounterDay");
			
			// only process if we have values for all three fields
			if (StringUtils.isNotBlank(yearString) && StringUtils.isNotBlank(monthString) && StringUtils.isNotBlank(dayString)) {
				
				Integer year;
				Integer month;
				Integer day;
					
				try {
					year = Integer.valueOf(yearString);
					month = Integer.valueOf(monthString);
					day = Integer.valueOf(dayString);
				}
				catch (Exception e) {
					throw new APIException("Unable to parse encounter date", e);
				}
				
				if (! isValidDate(year, month, day)) {
					throw new APIException("Invalid date specified for encounter date");
				}
				
				// if everything is good, create the new encounter date and update it on the encounter we are creating
				Calendar encounterDate = Calendar.getInstance();
				encounterDate.set(Calendar.YEAR, year);
				encounterDate.set(Calendar.MONTH, month - 1);  // IMPORTANT that we subtract one from the month here
				encounterDate.set(Calendar.DAY_OF_MONTH, day);
				encounter.setEncounterDatetime(PatientRegistrationUtil.clearTimeComponent(encounterDate.getTime()));
			}
			
			// increment three pages 
			page = page + 3;		
		}
		
		// handle the concept questions on the form
		for (EncounterTaskItemQuestion question : taskItem.getQuestions()) {	
			// fetch the answers for each question
			Object answer = request.getParameter("question" + page);
			
			if (answer != null) {
				Obs obs = new Obs();			
				
				// handle TEXT and NUMERIC questions
				if  (EncounterTaskItemQuestion.Type.TEXT.equals(question.getType()) || EncounterTaskItemQuestion.Type.NUMERIC.equals(question.getType())) {
					if (StringUtils.isNotEmpty((String) answer)) {
						obs.setConcept(question.getConcept());
						obs.setValueText((String) answer);
						encounter.addObs(obs);
					}
				}
				
				// handle SELECT (coded) and AUTOCOMPLETE questions
				if (EncounterTaskItemQuestion.Type.SELECT.equals(question.getType()) || EncounterTaskItemQuestion.Type.AUTOCOMPLETE.equals(question.getType())) {
					if (StringUtils.isNotBlank((String) answer)) {
						Integer conceptId = Integer.valueOf((String) answer);
						
						if (conceptId != null) {
							Concept valueCoded = Context.getConceptService().getConcept(conceptId);
							
							if (valueCoded != null) {
								obs.setConcept(question.getConcept());
								obs.setValueCoded(valueCoded);
								encounter.addObs(obs);
							}
							else {
								log.error("Invalid conceptId specified for answer to question " + (StringUtils.isNotBlank(question.getLabel()) ? question.getLabel() : question.getConcept().getDisplayString()));
							}
						}
					}
				}
			
			page++;
			}
		}
		
		// save the encounter
		Encounter e = Context.getService(EncounterService.class).saveEncounter(encounter);
		UserActivityLogger.logActivity(request.getSession(), PatientRegistrationConstants.ACTIVITY_ENCOUNTER_SAVED, "Encounter: " + e.getUuid());
		
		return new ModelAndView("redirect:" + taskItem.getSuccessUrl() + "?patientId=" + patient.getPatientId(), model);
	}
	

	/**
	 * Utility functions
	 */
	private boolean isValidDate(Integer year, Integer month, Integer day) {
		
		if (year < 1900 || year > Calendar.getInstance().get(Calendar.YEAR)) {
			return false;
		}
		
		if (month < 1 || month > 12) {
			return false;
		}
		
		// TODO: do better checked based on month
		if (day < 1 || day > 31) {
			return false;
		}
		
		return true;
	}
	
}