package org.openmrs.module.patientregistration.controller.workflow;

import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.openmrs.Concept;
import org.openmrs.Encounter;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Obs;
import org.openmrs.Patient;
import org.openmrs.PatientIdentifier;
import org.openmrs.PatientIdentifierType;
import org.openmrs.PersonAddress;
import org.openmrs.PersonAttribute;
import org.openmrs.PersonAttributeType;
import org.openmrs.PersonName;
import org.openmrs.api.APIException;
import org.openmrs.api.EncounterService;
import org.openmrs.api.PersonService.ATTR_VIEW_TYPE;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.Age;
import org.openmrs.module.patientregistration.Birthdate;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.controller.AbstractPatientDetailsController;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.module.patientregistration.task.EncounterTaskItemQuestion;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.TaskProgress;
import org.openmrs.module.patientregistration.util.UserActivityLogger;
import org.openmrs.util.OpenmrsConstants.PERSON_TYPE;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/module/patientregistration/workflow/enterPatientDemo.form")
public class EnterPatientDemoController  extends AbstractPatientDetailsController{
			
	@ModelAttribute("choleraTreatment")
	public EncounterTaskItemQuestion getCholeraTreatment(HttpSession session){
	
		Concept choleraTreatmentConcept = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_CHOLERA_TREATMENT_CONCEPT();
		if(choleraTreatmentConcept!=null){
			EncounterTaskItemQuestion itemQuestion = new EncounterTaskItemQuestion();
			itemQuestion.setConcept(choleraTreatmentConcept);
			itemQuestion.setLabel(choleraTreatmentConcept.getName(Context.getLocale()).getName());
			itemQuestion.setType(EncounterTaskItemQuestion.Type.SELECT);
			itemQuestion.initializeAnswersFromConceptAnswers();
			return itemQuestion;
		}
		return null;
	}
	
	@ModelAttribute("patient")
	public Patient getPatient(HttpSession session
			, @RequestParam(value= "patientId", required = false) String patientId){
		Patient patient = (Patient)session.getAttribute(PatientRegistrationConstants.REGISTRATION_PATIENT);
		if(patient==null && StringUtils.isNotBlank(patientId)){
			try{
				patient = Context.getPatientService().getPatient(new Integer(patientId));
			}catch(Exception e){
				log.error("patient not found", e);
			}
		}
		PersonName personName=null;
		// if a patient is associated with the session, put it in the model map
		if (patient== null) {		
			patient = new Patient();
		}else{
			personName = patient.getPersonName();
		}
		if(personName==null){
			personName = new PersonName();			
		}
		patient.addName(personName);
		patient.getPersonName().setPreferred(true);
				
		// if all the standard attributes haven't been configured, configure them, so that we have something to bind to
		for (PersonAttributeType attr : Context.getPersonService().getPersonAttributeTypes(PERSON_TYPE.PATIENT, ATTR_VIEW_TYPE.VIEWING)) {
			if (patient.getAttribute(attr) == null) {
				patient.addAttribute(new PersonAttribute(attr, null));
			}
		}
		
		return patient;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public ModelAndView showSelectPatient(
			@ModelAttribute("patient") Patient patient
			, @RequestParam(value= "editDivId", required = false) String editDivId
			,@RequestParam(value= "hiddenPrintIdCard", required = false) String hiddenPrintIdCard
			,@RequestParam(value= "nextTask", required = false) String nextTask
			, HttpSession session
			, ModelMap model) {    	
		// confirm that we have an active session
    	if (!PatientRegistrationWebUtil.confirmActivePatientRegistrationSession(session)) {
    		return new ModelAndView(PatientRegistrationConstants.WORKFLOW_FIRST_PAGE);
		}
    	
    	UserActivityLogger.startActivityGroup(session);
    	
    	if (patient.getPatientId() == null) {
    		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_CREATE_STARTED);
    	}
    	else {
    		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_EDIT_STARTED, "Patient: " + patient.getUuid());
    	}
    	
    	if (patient!=null && (patient.getId()!=null)){
			patient = Context.getPatientService().getPatient((Integer) patient.getId());
		}
    	Date encounterDate = new Date();
    	if(patient!=null && patient.getId()!=null){
    		Encounter registrationEncounter = null;					
			EncounterType registrationEncounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PATIENT_REGISTRATION_ENCOUNTER_TYPE();	
			registrationEncounter = Context.getService(PatientRegistrationService.class).getFirstEncounterByType(patient, registrationEncounterType, null);
			if(registrationEncounter!=null){
				encounterDate =  registrationEncounter.getEncounterDatetime();
			}
    	}
    	Birthdate birthdate = new Birthdate();
		if(patient!=null){			
			Date patientBirthdate= patient.getBirthdate();
			if(patientBirthdate!=null){
				birthdate = new Birthdate(patientBirthdate);
				if(patient.isBirthdateEstimated()){
					Age age = PatientRegistrationUtil.calculateAgeFromBirthdate(patientBirthdate, null);
					if(age!=null){
						model.addAttribute("age", age);
					}
				}
			}
		}
		model.addAttribute("encounterDate", PatientRegistrationUtil.clearTimeComponent(encounterDate));
		model.addAttribute("birthdate", birthdate);
		model.addAttribute("patientIdentifierMap", getPatientIdentifierMap(patient));
		if(StringUtils.isNotBlank(editDivId)){
			model.addAttribute("editDivId", editDivId);
		}
		PatientIdentifier preferredIdentifier = PatientRegistrationUtil.getPreferredIdentifier(patient);
		if(preferredIdentifier!=null){
			model.addAttribute("patientPreferredIdentifier", preferredIdentifier.toString());
		}
		if(StringUtils.equals(hiddenPrintIdCard, "yes")){			
			Location registrationLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);
			EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PATIENT_REGISTRATION_ENCOUNTER_TYPE();	
			Encounter encounter = Context.getService(PatientRegistrationService.class).registerPatient(
							  patient
							, Context.getAuthenticatedUser().getPerson()
							, encounterType
							, registrationLocation);
			boolean printingSuccessful = Context.getService(PatientRegistrationService.class).printIDCard(patient, registrationLocation);
			if (printingSuccessful) {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_ID_CARD_PRINTING_SUCCESSFUL);
				//PatientRegistrationWebUtil.updatePrintingCardStatus(patient, encounterType, encounter, registrationLocation, new Boolean(true), new Date());
			}
			else {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_ID_CARD_PRINTING_FAILED);
				//PatientRegistrationWebUtil.updatePrintingCardStatus(patient, encounterType, encounter, registrationLocation, new Boolean(false), new Date());
			}
			return new ModelAndView("redirect:/module/patientregistration/workflow/enterPatientDemo.form?editDivId=scanIdCardDiv&patientId="+ patient.getId()); 
		}
		if(StringUtils.isNotBlank(nextTask)){
			model.addAttribute("nextTask", nextTask);
		}
		return new ModelAndView("/module/patientregistration/workflow/enterPatientDemo");
	}
	
	@RequestMapping(params="clear", method = RequestMethod.POST)
	public ModelAndView clearPatientName(
			@ModelAttribute("patient") Patient patient, BindingResult result
			,HttpSession session){
		
		if(patient!=null){
			PersonName personName= patient.getPersonName();
    		if(personName==null){
    			personName = new PersonName();
    		}
    		personName.setGivenName(null);
    		patient.addName(personName);
    		patient.getPersonName().setPreferred(true);
    		session.setAttribute(PatientRegistrationConstants.REGISTRATION_PATIENT, patient);  		
		}
		return new ModelAndView("/module/patientregistration/workflow/enterPatientDemo");
	}
	
	@RequestMapping(method = RequestMethod.POST)
    public ModelAndView processSelectPatient(
    		@ModelAttribute("patient") Patient patient, BindingResult result
    		, @ModelAttribute("birthdate") Birthdate birthdate, BindingResult birthdateResult
    		, @ModelAttribute("age") Age age, BindingResult ageResult
    		,@RequestParam("hiddenConfirmFirstName") String patientInputName
    		,@RequestParam("hiddenConfirmLastName") String patientLastName
    		,@RequestParam("hiddenConfirmGender") String patientGender
    		,@RequestParam("hiddenPatientAddress") String patientAddress
    		,@RequestParam(value= "hiddenConfirmPhoneNumber", required = false) String phoneNumber
    		,@RequestParam("hiddenNextTask") String nextTask
    		,@RequestParam(value= "hiddenPrintIdCard", required = false) String hiddenPrintIdCard
    		,@RequestParam(value= "hiddenEncounterYear", required = false) String encounterYear	
			,@RequestParam(value= "hiddenEncounterMonth", required = false) String encounterMonth	
			,@RequestParam(value= "hiddenEncounterDay", required = false) String encounterDay 
			,@RequestParam(value= "hiddenConfirmTreatmentStatus", required = false) String treatmentStatus
			,HttpSession session 
			, ModelMap model) {
    
		boolean printIdCard=false;
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_SUBMITTED);
		if (patient!=null && (patient.getId()!=null)){
			patient = Context.getPatientService().getPatient((Integer) patient.getId());
		}
		
		if(StringUtils.isNotBlank(patientInputName)){	    	
	    	if(patient!=null){
	    		PersonName personName= patient.getPersonName();
	    		if(personName==null){
	    			personName = new PersonName();
	    		}
	    		personName.setGivenName(patientInputName);
	    		if(StringUtils.isNotBlank(patientLastName)){
	    			personName.setFamilyName(patientLastName);
	    		}
	    		patient.addName(personName);
	    		patient.getPersonName().setPreferred(true);
	    		
	    	}
		}
		if(StringUtils.isNotBlank(patientGender)){
			patient.setGender(patientGender);	
		}
		// make sure user specified either a birth date or year
		if (!birthdate.hasValue() && !age.hasValue()) {
			birthdateResult.reject("Person.birthdate.required");
		}
		// validate the appropriate set of fields
		if (birthdate.hasValue()) {
			birthdateValidator.validate(birthdate, birthdateResult);
		}		
		if (birthdateResult.hasErrors() || ageResult.hasErrors()) {			
			model.addAttribute("birthdateErrors", birthdateResult);		
			model.addAttribute("ageErrors", ageResult);
			return new ModelAndView("/module/patientregistration/workflow/enterPatientDemo", model);
		}
		if (birthdate.hasValue()){
			patient.setBirthdate(birthdate.asDateObject());
			if (!birthdate.isExact()) {
				patient.setBirthdateEstimated(true);
			}else{
				patient.setBirthdateEstimated(false);
			}
		}else if (age.hasValue()){
			patient.setBirthdate(PatientRegistrationUtil.calculateBirthdateFromAge(age, null));
			patient.setBirthdateEstimated(true);
		}
		Location registrationLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);
		// if a fixed patient identifier location has been set, get it
			
		PatientIdentifierType zlIdentifierType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_IDENTIFIER_TYPE();	
		if(zlIdentifierType!=null){
			PatientIdentifier patientPreferredIdentifier = PatientRegistrationUtil.getPreferredIdentifier(patient);
			if(patientPreferredIdentifier==null ||
					(patientPreferredIdentifier!=null && (patientPreferredIdentifier.getIdentifierType().getId().compareTo(zlIdentifierType.getId())!=0))){
				     //if the existing preferred Identifier is not ZL EMR ID create a new one
					 PatientIdentifier identifier = new PatientIdentifier(null, zlIdentifierType, registrationLocation);
					 identifier.setIdentifier(PatientRegistrationUtil.assignIdentifier(zlIdentifierType)) ;
					 identifier.setPreferred(true);
					 patient.addIdentifier(identifier);							
					 UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_NEW_ZL_ID, "Identifier: " + identifier);					 
			}
			 printIdCard=true;
		}else{
			log.error("no preferred identifier has been set");
			model.addAttribute("identifierErrors", "please set preferred identifier");
			return new ModelAndView("/module/patientregistration/workflow/enterPatientDemo", model);
		}
		
		
		if(StringUtils.isNotBlank(patientAddress)){	    	
	    	if(patient!=null){	    		
	    		PersonAddress personAddress = patient.getPersonAddress();
	    		if(personAddress==null){
	    			personAddress = new PersonAddress();
	    		}
	    		List<String> levels = PatientRegistrationUtil.getAddressHierarchyLevels();
	    		if(levels!=null && levels.size()>0){
	    			Collections.reverse(levels);
	    		}
							
				int i = 0;
				// iterate through all the names in the search string to form the PersonAddress object
				for (String name : patientAddress.split("\\,")) {
					if (name!=null) {
						if (levels.size() <= i-1) {  // make sure we haven't reached the bottom level, because this would make no sense							
							log.error("Address hierarchy levels have not been properly defined.");
						}
						else {							
							PatientRegistrationUtil.setAddressFieldValue(personAddress, levels.get(i), name);
						}
					}
					i++;
				}
			if (personAddress!=null)
				personAddress.setPreferred(true);
				patient.addAddress(personAddress);
	    	}
		}
		
		if(patient.getPersonAddress()!=null){
			// remove the address if it is blank
			if (PatientRegistrationUtil.isBlank(patient.getPersonAddress())) {
				patient.removeAddress(patient.getPersonAddress());
			}
		}
		
		PersonAttributeType phoneType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_ID_CARD_PERSON_ATTRIBUTE_TYPE();
		
		// remove any attributes that are blank
		for (PersonAttributeType attr : Context.getPersonService().getPersonAttributeTypes(PERSON_TYPE.PATIENT, ATTR_VIEW_TYPE.VIEWING)) {
			PersonAttribute att = patient.getAttribute(attr);
			if (att != null) {
				if (StringUtils.isBlank(att.getValue())) {
					patient.removeAttribute(att); // If somehow the patient has any blank attribute saved, remove it
				}
				else if (StringUtils.isBlank(phoneNumber) && attr.equals(phoneType)) {
					patient.removeAttribute(att); // If the user blanked out the existing phone number attribute, remove it
				}
			}								
		}
		
		// now print the patient attribute type that has specified in the idCardPersonAttributeType global property
		
		if (phoneType != null && StringUtils.isNotBlank(phoneNumber)) {
			PersonAttribute personAttribute = new PersonAttribute(phoneType, phoneNumber);
			patient.addAttribute(personAttribute);
		}
			
		TaskProgress taskProgress = PatientRegistrationWebUtil.getTaskProgress(session);
		if(taskProgress!=null){
			taskProgress.setPatientId(patient.getId());
			taskProgress.setProgressBarImage(PatientRegistrationConstants.RETROSPECTIVE_PROGRESS_2_IMG);			
			Map<String, Integer> completedTasks = new HashMap<String, Integer>();
			completedTasks.put("registrationTask", new Integer(1));
			taskProgress.setCompletedTasks(completedTasks);
			PatientRegistrationWebUtil.setTaskProgress(session, taskProgress);
		}
		Context.getPatientService().savePatient(patient);
		//add Patient Registration encounter		
		EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PATIENT_REGISTRATION_ENCOUNTER_TYPE();	
		Date encounterDate = PatientRegistrationUtil.parseEncounterDate(encounterYear, encounterMonth, encounterDay);				
		Encounter encounter = Context.getService(PatientRegistrationService.class).registerPatient(
				  patient
				, Context.getAuthenticatedUser().getPerson()
				, encounterType
				, registrationLocation
				, encounterDate);
		if(StringUtils.isNotBlank(treatmentStatus)){
			List<Obs> treatmentStatusList=PatientRegistrationUtil.parseTreatmentStatusList(treatmentStatus);
			if(treatmentStatusList!=null && treatmentStatusList.size()>0){
				//first void the existing obs
				Set<Obs> existingObs = encounter.getAllObs();
				if(existingObs!=null && existingObs.size()>0){
					for(Obs observation : existingObs){
						observation.setVoided(true);
						observation.setVoidReason("overwrite");
						observation.setVoidedBy(Context.getAuthenticatedUser());
					}
				}
				for(Obs observation : treatmentStatusList){
					encounter.addObs(observation);
				}
				try{
					encounter = Context.getService(EncounterService.class).saveEncounter(encounter);
				}catch(Exception e){
					log.error("failed to add treatment statuses");
				}
			}
		}
		
		String nextPage =null;
		if(StringUtils.equals(hiddenPrintIdCard, "no")){
			printIdCard=false;
		}else if(printIdCard){
			//print an ID card only if a new ZL EMR ID has been created
			boolean printingSuccessful = Context.getService(PatientRegistrationService.class).printIDCard(patient, registrationLocation);
			if (printingSuccessful) {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_ID_CARD_PRINTING_SUCCESSFUL);
				//PatientRegistrationWebUtil.updatePrintingCardStatus(patient, encounterType, encounter, registrationLocation, new Boolean(true), new Date());
			}
			else {
				UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_ID_CARD_PRINTING_FAILED);
				//PatientRegistrationWebUtil.updatePrintingCardStatus(patient, encounterType, encounter, registrationLocation, new Boolean(false), new Date());
			}			
			if(StringUtils.isNotBlank(nextTask)){
				return new ModelAndView("redirect:/module/patientregistration/workflow/" + nextTask + "?patientId=" + patient.getPatientId(), model);				
			}
			nextPage = "redirect:/module/patientregistration/workflow/enterPatientDemo.form?editDivId=scanIdCardDiv&patientId="+ patient.getId();
			return new ModelAndView(nextPage); 
		}
		// since this is a new patient, set the flag that lets us know we want to automatically bring a registration label
		session.setAttribute("registration_printRegistrationLabel", true);
		PatientRegistrationWebUtil.resetPatientRegistrationWorkflow(session);		
		String message = encounter == null ? null : "Created encounter: " + encounter.getUuid();
		UserActivityLogger.logActivity(session, PatientRegistrationConstants.ACTIVITY_REGISTRATION_COMPLETED, message);
		UserActivityLogger.endActivityGroup(session);		
		if(StringUtils.isNotBlank(nextTask)){			
			return new ModelAndView("redirect:/module/patientregistration/workflow/" + nextTask + "?patientId=" + patient.getPatientId(), model);
		}
		nextPage = "redirect:/module/patientregistration/workflow/patientDashboard.form?patientId="+ patient.getId();
		return new ModelAndView(nextPage);    	    	
    }

	
}
