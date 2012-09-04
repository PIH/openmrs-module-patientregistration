/**
 * 
 */
package org.openmrs.module.patientregistration.controller.workflow;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.openmrs.Concept;
import org.openmrs.ConceptAnswer;
import org.openmrs.ConceptMap;
import org.openmrs.ConceptSet;
import org.openmrs.ConceptSource;
import org.openmrs.Encounter;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.PatientIdentifier;
import org.openmrs.Person;
import org.openmrs.PersonAttribute;
import org.openmrs.PersonAttributeType;
import org.openmrs.User;
import org.openmrs.api.APIException;
import org.openmrs.api.EncounterService;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.Age;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.module.patientregistration.task.EncounterTaskItemQuestion;
import org.openmrs.module.patientregistration.util.POCObservation;
import org.openmrs.module.patientregistration.util.PatientDiagnosis;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.TaskProgress;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author cospih
 *
 */
@Controller
@RequestMapping(value = "/module/patientregistration/workflow/primaryCareVisitEncounter.form")
public class PrimaryCareVisitEncounterController extends AbstractPatientDetailsController {
	
	@ModelAttribute("patient")
    public Patient getPatient(HttpSession session, 
    		@RequestParam(value= "patientIdentifier", required = false) String patientIdentifier, 
    		@RequestParam(value= "patientId", required = false) String patientId) {
			
		Patient patient = PatientRegistrationUtil.getPatientByAnId(patientIdentifier, patientId);
	
		if (patient == null) {
			throw new APIException("Invalid patient passed to PrimaryCareReceptionDossierNumberController");			
		}
				
		for (PatientIdentifier pi : patient.getIdentifiers()) {
			pi.getIdentifier();
		}
				
		return patient;
    }
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView showSelectPatient(
			@ModelAttribute("patient") Patient patient		
			, @RequestParam(value= "encounterId", required = false) String encounterId
			, HttpSession session
			, ModelMap model) {
		
		
		// confirm that we have an active session
    	if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
			return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		} 

    	// if there is no patient defined, redirect to the primaryCareVisit task first page
		if (patient == null) {
			return new ModelAndView("redirect:/module/patientregistration/workflow/primaryCareVisitTask.form");
		}
		PersonAttributeType providerIdentifierType=PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PROVIDER_IDENTIFIER_ATTRIBUTE_TYPE();
		if(providerIdentifierType!=null){
			model.addAttribute("providerIdentifierType", providerIdentifierType.getName());
		}
		
		List<User> providers = PatientRegistrationUtil.getProviders();
		if(providers!=null && providers.size()>0){
			model.addAttribute("providers", providers);			
		}
		
		model.addAttribute("preferredIdentifier", PatientRegistrationUtil.getPreferredIdentifier(patient));
		EncounterTaskItemQuestion coded = new EncounterTaskItemQuestion();
		Concept codedConcept = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_CODED_DIAGNOSIS_CONCEPT();
		
		coded.setConcept(codedConcept);
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
		
		if(coded!=null){
			coded.filterAnswers(patient);
			model.addAttribute("coded", coded);
		}
		
		Concept notifyConcept = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NOTIFY_DIAGNOSIS_CONCEPT();
		if(notifyConcept==null){
			log.error("Global property patientregistration.primaryCareVisitNotifyDiagnosisConcept is undefined or does not match an existing concept");
		}else{
			Map<String, String> notifyConceptMap = PatientRegistrationUtil.getConvSetMap(notifyConcept, icd10);
			if(notifyConceptMap!=null){
				model.addAttribute("notifyingDiseases", notifyConceptMap);
			}
		}
		Concept urgentConcept = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_URGENT_DIAGNOSIS_CONCEPT();
		if(urgentConcept==null){
			log.error("Global property patientregistration.primaryCareVisitUrgentDiagnosisConcept is undefined or does not match an existing concept");
		}else{
			Map<String, String> urgentConceptMap = PatientRegistrationUtil.getConvSetMap(urgentConcept, icd10);
			if(urgentConceptMap!=null){
				model.addAttribute("urgentDiseases", urgentConceptMap);
			}
		}
		
		Concept ageRestrictedConcept = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_AGE_RESTRICTED_CONCEPT();
		if(ageRestrictedConcept==null){
			log.error("Global property patientregistration.primaryCareVisitAgeRestrictedConcept is undefined or does not match an existing concept");
		}else{
			Map<String, String> ageRestrictedConceptMap = PatientRegistrationUtil.getConvSetMap(ageRestrictedConcept, icd10);
			if(ageRestrictedConceptMap!=null){
				model.addAttribute("ageRestrictedDiseases", ageRestrictedConceptMap);
			}
		}
		
		Concept nonCodedConcept=PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NON_CODED_DIAGNOSIS_CONCEPT();
		if(nonCodedConcept!=null){
			List<String> nonCoded = Context.getService(PatientRegistrationService.class).getDistinctObs(nonCodedConcept.getId());
			if(nonCoded!=null && nonCoded.size()>0){
				model.addAttribute("nonCoded", nonCoded);
			}
		}
		
		Location registrationLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);	
		EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_ENCOUNTER_TYPE();	
		Date encounterDate = new Date();
		List<Obs> obs = null;
		if(StringUtils.isNotBlank(encounterId)){
			Integer editEncounterId = Integer.parseInt(encounterId);
			if(editEncounterId!=null){
				try{
					Encounter editEncounter = Context.getEncounterService().getEncounter(editEncounterId);
					if(editEncounter!=null){
						encounterDate = editEncounter.getEncounterDatetime();
						try{
							Person encounterProvider = editEncounter.getProvider();
							List<User> encounterProviderUsers = Context.getUserService().getUsersByPerson(encounterProvider, false);
							if(encounterProviderUsers!=null && encounterProviderUsers.size()>0){
								for(User user : encounterProviderUsers){
									if(PatientRegistrationUtil.doesUserHaveProviderRole(user)){
										model.addAttribute("encounterProvider", user);
										break;
									}
								}
							}
						}catch(Exception e){
							log.error("failed to get encounter provider");
						}
						obs = PatientRegistrationWebUtil.getPatientDiagnosis(patient, encounterType, editEncounter, registrationLocation, encounterDate);
					}
				}catch(Exception e){
					log.error("failed to retrieve encounter.", e);
				}
			}
		}
		
		EncounterType receptionEncounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_ENCOUNTER_TYPE();
		List<Encounter> encounters = Context.getEncounterService().getEncounters(patient, registrationLocation, null, null, null, Arrays.asList(receptionEncounterType), null, false);
		if(encounters!=null && encounters.size()>0){
			List<PatientDiagnosis> patientDiagnosis =  new ArrayList<PatientDiagnosis>();
			for(Encounter receptionEncounter : encounters){				
				PatientDiagnosis diagnosis = new PatientDiagnosis();
				diagnosis.setReceptionEncounterId(receptionEncounter.getId());					
				Calendar encounterCalendar = Calendar.getInstance();
				encounterCalendar.setTime(receptionEncounter.getEncounterDatetime());
				diagnosis.setReceptionEncounterDate(receptionEncounter.getEncounterDatetime());
				diagnosis.setYear(new Integer(encounterCalendar.get(Calendar.YEAR)));
				diagnosis.setMonth(new Integer(encounterCalendar.get(Calendar.MONTH)+1));
				diagnosis.setDay(new Integer(encounterCalendar.get(Calendar.DAY_OF_MONTH)));
				if(DateUtils.isSameDay(encounterCalendar, Calendar.getInstance())){
					diagnosis.setToday(true);
				}
				List<Obs> diagnosisObs = PatientRegistrationWebUtil.getPatientDiagnosis(patient, encounterType, null, registrationLocation, receptionEncounter.getEncounterDatetime());					
				List<POCObservation> patientObservation=PatientRegistrationWebUtil.getPOCObservation(diagnosisObs, icd10);
				if(patientObservation!=null && patientObservation.size()>0){
					diagnosis.setPatientObservation(patientObservation);
				}
				patientDiagnosis.add(diagnosis);
			}
			Collections.sort(patientDiagnosis);
			model.addAttribute("patientDiagnosis", patientDiagnosis);
		}
		
		if(obs!=null && obs.size()>0){
			List<POCObservation> todayDiagnosis = new ArrayList<POCObservation>();
			for(Obs ob : obs){				
				POCObservation pocDiagnosis = new POCObservation();
				pocDiagnosis.setObsId(ob.getId());
				Concept codedDiagnosis= ob.getValueCoded();
				if(codedDiagnosis!=null){
					pocDiagnosis.setType(POCObservation.CODED);
					pocDiagnosis.setId(codedDiagnosis.getId());
					pocDiagnosis.setLabel(codedDiagnosis.getDisplayString());
					if(icd10!=null){
						ConceptMap mapping = PatientRegistrationUtil.getConceptMapping(codedDiagnosis, icd10);						
						if (mapping == null) {
							pocDiagnosis.setLabel(codedDiagnosis.getDisplayString());							
						}
						else {
							pocDiagnosis.setLabel("(" + mapping.getSourceCode() + ") " + codedDiagnosis.getDisplayString());							
						}
					}
				}
				else{
					pocDiagnosis.setType(POCObservation.NONCODED);
					pocDiagnosis.setId(new Integer(0));
					pocDiagnosis.setLabel(ob.getValueText());
				}
				todayDiagnosis.add(pocDiagnosis);
			}
			model.addAttribute("todayDiagnosis", todayDiagnosis);
		}
		model.addAttribute("encounterDate", PatientRegistrationUtil.clearTimeComponent(encounterDate));
		return new ModelAndView("/module/patientregistration/workflow/primaryCareVisitEncounter");	
	}

	@RequestMapping(method = RequestMethod.POST)
	public ModelAndView processDiagnosis(
			@ModelAttribute("patient") Patient patient		
			,@RequestParam("listOfDiagnosis") String diagnosisList	
			,@RequestParam("hiddenEncounterYear") String encounterYear	
			,@RequestParam("hiddenEncounterMonth") String encounterMonth	
			,@RequestParam("hiddenEncounterDay") String encounterDay	
			,@RequestParam("hiddenProviderId") String providerId	
			, HttpSession session			
			, ModelMap model) {
		
		if(StringUtils.isNotBlank(diagnosisList)){
			List<Obs> observations = PatientRegistrationUtil.parseDiagnosisList(diagnosisList);
			
			if(observations!=null && observations.size()>0){				
				
				//void existing observations
				Location registrationLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);					
								
				EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_ENCOUNTER_TYPE();						
				Calendar encounterDate = Calendar.getInstance();
				
				// only process if we have values for all three fields
				if (StringUtils.isNotBlank(encounterYear) && StringUtils.isNotBlank(encounterMonth) && StringUtils.isNotBlank(encounterDay)) {					
					Integer year;
					Integer month;
					Integer day;
						
					try {
						year = Integer.valueOf(encounterYear);
						month = Integer.valueOf(encounterMonth);
						day = Integer.valueOf(encounterDay);
					}
					catch (Exception e) {
						throw new APIException("Unable to parse encounter date", e);
					}										
					
					// if everything is good, create the new encounter date and update it on the encounter we are creating					
					encounterDate.set(Calendar.YEAR, year);
					encounterDate.set(Calendar.MONTH, month - 1);  // IMPORTANT that we subtract one from the month here
					encounterDate.set(Calendar.DAY_OF_MONTH, day);				
				}
				
				List<Obs> currentObs = PatientRegistrationWebUtil.getPatientDiagnosis(patient, encounterType, null, registrationLocation, encounterDate.getTime());
				if(currentObs!=null && currentObs.size()>0){
					Set<Encounter> voidEncounters = new HashSet<Encounter>();
					for(Obs voidOb : currentObs){
						try{
							Context.getObsService().voidObs(voidOb, "overwrite diagnosis");
							voidEncounters.add(voidOb.getEncounter());
						}catch(Exception e){
							log.error("failed to void ob", e);
						}
					}
					if(voidEncounters.size()>0){
						for(Encounter voidEncounter : voidEncounters){
							Context.getEncounterService().voidEncounter(voidEncounter, "voided diagnosis encounter");
						}
					}
				}
				TaskProgress taskProgress = PatientRegistrationWebUtil.getTaskProgress(session);
				if(taskProgress!=null){
					taskProgress.setPatientId(patient.getId());
					taskProgress.setProgressBarImage(PatientRegistrationConstants.RETROSPECTIVE_PROGRESS_4_IMG);			
					Map<String, Integer> completedTasks = taskProgress.getCompletedTasks();
					if(completedTasks == null){
						completedTasks = new HashMap<String, Integer>();
					}					
					completedTasks.put("primaryCareVisitTask", new Integer(1));
					taskProgress.setCompletedTasks(completedTasks);
					PatientRegistrationWebUtil.setTaskProgress(session, taskProgress);
				}
				
				Encounter encounter = new Encounter();
				encounter.setEncounterDatetime(PatientRegistrationUtil.clearTimeComponent(encounterDate.getTime()));
				encounter.setEncounterType(encounterType);
				encounter.setProvider(Context.getAuthenticatedUser().getPerson());
				encounter.setLocation(PatientRegistrationWebUtil.getRegistrationLocation(session));
				encounter.setPatient(patient);
				for(Obs obs : observations){
					obs.getValueCoded();						
					encounter.addObs(obs);
				}
				if(StringUtils.isNotBlank(providerId)){
					try{
						User provider = Context.getUserService().getUser(Integer.parseInt(providerId));
						if(provider!=null){
							encounter.setProvider(provider.getPerson());
						}
					}catch(Exception e){
						log.error("failed to find provider", e);
					}
				}
				Encounter e = Context.getService(EncounterService.class).saveEncounter(encounter);			
				return new ModelAndView("redirect:/module/patientregistration/workflow/patientDashboard.form?patientId=" + patient.getPatientId(), model);				
			}
		
		}
		return new ModelAndView("redirect:/module/patientregistration/workflow/primaryCareVisitTask.form");	
	}
	
	
}
