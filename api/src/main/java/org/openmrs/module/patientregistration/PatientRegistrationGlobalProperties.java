package org.openmrs.module.patientregistration;

import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.Locale;
import java.util.Map.Entry;
import java.util.Properties;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import org.openmrs.Concept;
import org.openmrs.ConceptSource;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.PatientIdentifierType;
import org.openmrs.PersonAttributeType;
import org.openmrs.Role;
import org.openmrs.api.APIException;
import org.openmrs.api.context.Context;
import org.openmrs.module.Module;
import org.openmrs.module.ModuleFactory;


public class PatientRegistrationGlobalProperties {

	public static final String BIRTH_YEAR_INTERVAL = "patientregistration.birthYearInterval";

	protected final static Log log = LogFactory.getLog(PatientRegistrationGlobalProperties.class);
	
	public static List<String> JSCRIPT_MESSAGES_LIST=null;
	public static List<String> JSCRIPT_TOOLTIP_LIST=null;
	
	public static final List<String> GET_JSCRIPT_MESSAGES_LIST(){
		if(JSCRIPT_MESSAGES_LIST==null){
			JSCRIPT_MESSAGES_LIST = new ArrayList<String>();
			Module mod = ModuleFactory.getModuleById("patientregistration");			
			for (Entry<String, Properties> entry : mod.getMessages().entrySet()) {		
				Properties properties = entry.getValue();			
				Enumeration<?> em= properties.keys();
				while(em.hasMoreElements()){
					String code = (String)em.nextElement();					
					int index =code.indexOf(PatientRegistrationConstants.JSCRIPT_MESSAGES); 
					if(index>=0){
						JSCRIPT_MESSAGES_LIST.add(code.substring(index + (PatientRegistrationConstants.JSCRIPT_MESSAGES).length()));
					}				
				}
				break;
			}	
		}
		return JSCRIPT_MESSAGES_LIST;
	}
	
	public static final List<String> GET_JSCRIPT_TOOLTIP_LIST(){
		if(JSCRIPT_TOOLTIP_LIST==null){
			JSCRIPT_TOOLTIP_LIST = new ArrayList<String>();
			Module mod = ModuleFactory.getModuleById("patientregistration");			
			for (Entry<String, Properties> entry : mod.getMessages().entrySet()) {		
				Properties properties = entry.getValue();			
				Enumeration<?> em= properties.keys();
				while(em.hasMoreElements()){
					String code = (String)em.nextElement();					
					int index =code.indexOf(PatientRegistrationConstants.JSCRIPT_TOOLTIP); 
					if(index>=0){
						JSCRIPT_TOOLTIP_LIST.add(code.substring(index + (PatientRegistrationConstants.JSCRIPT_TOOLTIP).length()));
					}				
				}
				break;
			}	
		}
		return JSCRIPT_TOOLTIP_LIST;
	}
	
	/**
	 * @return identifier types to be displayed on Enter Patient Details page, or empty list if none are configured
	 */
	public static final List<PatientIdentifierType> GLOBAL_PROPERTY_IDENTIFIER_TYPES() {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.identifierTypes");
		List<PatientIdentifierType> l = new ArrayList<PatientIdentifierType>();
		if (StringUtils.isNotBlank(propertyValue)) {
			for (String s : propertyValue.split("\\|")) {
				PatientIdentifierType t = Context.getPatientService().getPatientIdentifierTypeByName(s);
				if (t == null) {
					try {
						t = Context.getPatientService().getPatientIdentifierType(Integer.parseInt(s));
					}
					catch (Exception e) {
					}
				}
				if (t != null) {
					l.add(t);
				}
			}
		}
		return l;
	}
	
	/** 
	 * @return identifier type to display on patient dashboard, or null if none configured
	 */
	public static final PatientIdentifierType GLOBAL_PROPERTY_PRIMARY_IDENTIFIER_TYPE() {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.primaryIdentifierType");
		if (StringUtils.isNotBlank(propertyValue)) {
			PatientIdentifierType t = Context.getPatientService().getPatientIdentifierTypeByName(propertyValue);
			if (t == null) {
				try {
					t = Context.getPatientService().getPatientIdentifierType(Integer.parseInt(propertyValue));
				}
				catch (Exception e) {
				}
			}
			return t;
		}
		else {
			return null;
		}
	}
	
	/** 
	 * @return location to use as the standard location to use for a fixed identifier; returns null if no location specified
	 */
	public static final Location GLOBAL_PROPERTY_FIXED_IDENTIFIER_LOCATION () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.fixedIdentifierLocation");
		Location location = null;
		if (StringUtils.isNotBlank(propertyValue)) {
			location = Context.getLocationService().getLocation(propertyValue);
			if (location == null) {
				try {
					location = Context.getLocationService().getLocation(Integer.parseInt(propertyValue));
				}
				catch (Exception e) {
				}
			}
		}
		return location;
	}
	
	/**
	 * @returns the doctor stamp ID(provider identifier), which is modeled as a Person Attribute
	 */
	public static final PersonAttributeType GLOBAL_PROPERTY_PROVIDER_IDENTIFIER_ATTRIBUTE_TYPE () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.providerIdentifierPersonAttributeType");
		PersonAttributeType type = null;
		if (StringUtils.isNotBlank(propertyValue)) {
			type = Context.getPersonService().getPersonAttributeTypeByName(propertyValue);
			if (type == null) {
				try {
					type = Context.getPersonService().getPersonAttributeType(Integer.parseInt(propertyValue));
				}
				catch (Exception e) {
					log.error("failed to get provider identifier type", e);
				}
			}
		}
		return type;
	}
	
	/**
	 * @returns the person attribute type to print on the id card
	 */
	public static final PersonAttributeType GLOBAL_PROPERTY_ID_CARD_PERSON_ATTRIBUTE_TYPE () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.idCardPersonAttributeType");
		PersonAttributeType type = null;
		if (StringUtils.isNotBlank(propertyValue)) {
			type = Context.getPersonService().getPersonAttributeTypeByName(propertyValue);
			if (type == null) {
				try {
					type = Context.getPersonService().getPersonAttributeType(Integer.parseInt(propertyValue));
				}
				catch (Exception e) {
				}
			}
		}
		return type;
	}
	
	/**
	 * @returns the person attribute type to print on the id card
	 */
	public static final PatientIdentifierType GLOBAL_PROPERTY_NUMERO_DOSSIER () {
		PatientIdentifierType type =null;
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.numeroDossier");
		if(StringUtils.isNotBlank(propertyValue)){
			type=PatientRegistrationUtil.getPatientIdentifierByName(propertyValue);
		}			
		return type;
	}
	
	/**
	 * @return number of labels to print when registering a patient for the first time; returns null if no value specified
	 */
	public static final Integer GLOBAL_PROPERTY_REGISTRATION_LABEL_PRINT_COUNT () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.registrationLabelPrintCount");
		return StringUtils.isNotBlank(propertyValue) ? Integer.parseInt(propertyValue) : null;
	}
 	
	/**
	 * @return a string that is the name of the search class to use when searching for a patient; returns null if no class specified 
	 */
	public static final String GLOBAL_PROPERTY_SEARCH_CLASS () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.searchClass");
		return StringUtils.isNotBlank(propertyValue) ? propertyValue : null;
	}
	
	/**
	 * @returns the ip address of the label printer; returns null if no ip specified
	 */
	public static final String GLOBAL_PROPERTY_LABEL_PRINTER_IP_ADDRESS () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.labelPrinterIpAddress");
		return StringUtils.isNotBlank(propertyValue) ? propertyValue : null;
	}
	
	/**
	 * @returns the port of the label printer; returns null if no port specified
	 */
	public static final Integer GLOBAL_PROPERTY_LABEL_PRINTER_PORT () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.labelPrinterPort");
		return StringUtils.isNotBlank(propertyValue) ? Integer.parseInt(propertyValue) : null;
	}
	
	/**
	 * @returns the ip address of the id card printer; returns null if no ip specified
	 */
	public static final String GLOBAL_PROPERTY_ID_CARD_PRINTER_IP_ADDRESS () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.idCardPrinterIpAddress");
		return StringUtils.isNotBlank(propertyValue) ? propertyValue : null;
	}
	
	/**
	 * @returns the port of the id card printer; returns null if no port specified
	 */
	public static final Integer GLOBAL_PROPERTY_ID_CARD_PRINTER_PORT () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.idCardPrinterPort");
		return StringUtils.isNotBlank(propertyValue) ? Integer.parseInt(propertyValue) : null;
	}
	
	/**
	 * @returns the port of the id card printer; returns null if no port specified
	 */
	public static final Integer GLOBAL_PROPERTY_BIRTH_YEAR_INTERVAL () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty(BIRTH_YEAR_INTERVAL);
		return StringUtils.isNotBlank(propertyValue) ? Integer.parseInt(propertyValue) : null;
	}
	
	/**
	 * @returns the label text to print on the id card
	 */
	public static final String GLOBAL_PROPERTY_ID_CARD_LABEL_TEXT () {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.idCardLabelText");
		return StringUtils.isNotBlank(propertyValue) ? propertyValue : null;
	}
	

	/**
	 * @return supported Encounter Types for Patient Registration, or an empty List if none are configured
	 */
	public static final List<EncounterType> GLOBAL_PROPERTY_REGISTRATION_ENCOUNTER_TYPES() {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.registrationEncounterTypes");
		List<EncounterType> l = new ArrayList<EncounterType>();
		if (StringUtils.isNotBlank(propertyValue)) {
			for (String s : propertyValue.split("\\|")) {
				EncounterType t = Context.getEncounterService().getEncounterType(s);
				if (t == null) {
					try {
						t = Context.getEncounterService().getEncounterType(Integer.parseInt(s));
					}
					catch (Exception e) {
					}
				}
				if (t != null) {
					l.add(t);
				}
			}
		}
		return l;
	}
	
	/**
	 * @return supported Locations for Patient Registration, or an empty List if none are configured
	 */
	public static final List<Location> GLOBAL_PROPERTY_REGISTRATION_LOCATIONS() {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.registrationLocations");
		List<Location> l = new ArrayList<Location>();
		if (StringUtils.isNotBlank(propertyValue)) {
			for (String s : propertyValue.split("\\|")) {
				Location t = Context.getLocationService().getLocation(s);
				if (t == null) {
					try {
						t = Context.getLocationService().getLocation(Integer.parseInt(s));
					}
					catch (Exception e) {
					}
				}
				if (t != null) {
					l.add(t);
				}
			}
		}
		return l;
	}
	
	/**
	 * @return a List of all supported tasks
	 */
	public static final List<String> GLOBAL_PROPERTY_SUPPORTED_TASKS() {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.supportedTasks");
		List<String> ret = new ArrayList<String>();
		if (StringUtils.isNotBlank(propertyValue)) {
			for (String s : propertyValue.split("\\|")) {
				ret.add(s);
			}
		}
		return ret;
	}
	
	/**
	 * @return a List of all supported provider roles
	 */
	public static final List<Role> GLOBAL_PROPERTY_SUPPORTED_PROVIDER_ROLES() {
		String propertyValue = Context.getAdministrationService().getGlobalProperty("patientregistration.providerRoles");
		List<Role> providerRoles = null;
		if (StringUtils.isNotBlank(propertyValue)) {
			providerRoles = new ArrayList<Role>();
			for (String s : propertyValue.split("\\|")) {
				Role role = Context.getUserService().getRole(s);				
				if(role!=null){
					providerRoles.add(role);
				}
			}
		}
		return providerRoles;
	}
	
	
	
	/** 
	 * @return the encounter type for the primary care reception encounter
	 */
	public static final EncounterType GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_ENCOUNTER_TYPE() {
		EncounterType encounterType = PatientRegistrationUtil.findEncounterType(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareReceptionEncounterType"));
		
		if (encounterType == null) {
			throw new APIException("Global property patientregistration.primaryCareReceptionEncounterType is undefined or does not match an existing encounter type");
		}
		else {
			return encounterType;
		}
	}
	
	/** 
	 * @return the encounter type for the EPI Info encounter
	 */
	public static final EncounterType GLOBAL_PROPERTY_EPI_INFO_ENCOUNTER_TYPE() {
		EncounterType encounterType = PatientRegistrationUtil.findEncounterType(Context.getAdministrationService().getGlobalProperty("patientregistration.epiInfoEncounterType"));
		
		if (encounterType == null) {
			throw new APIException("Global property patientregistration.epiInfoEncounterType is undefined or does not match an existing encounter type");
		}
		else {
			return encounterType;
		}
	}
	
	/** 
	 * @return the encounter type for the primary care visit encounter
	 */
	public static final EncounterType GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_ENCOUNTER_TYPE() {
		EncounterType encounterType = PatientRegistrationUtil.findEncounterType(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitEncounterType"));
		
		if (encounterType == null) {
			throw new APIException("Global property patientregistration.primaryCareVisitEncounterType is undefined or does not match an existing encounter type");
		}
		else {
			return encounterType;
		}
	}
	
	/** 
	 * @return the encounter type for the patient registration encounter
	 */
	public static final EncounterType GLOBAL_PROPERTY_PATIENT_REGISTRATION_ENCOUNTER_TYPE() {
		EncounterType encounterType = PatientRegistrationUtil.findEncounterType(Context.getAdministrationService().getGlobalProperty("patientregistration.patientRegistrationEncounterType"));
		
		if (encounterType == null) {
			throw new APIException("Global property patientregistration.patientRegistrationEncounterType is undefined or does not match an existing encounter type");
		}
		else {
			return encounterType;
		}
	}
	
	/**
	 * @return the concept for the payment question for the primary care reception
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_PAYMENT_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareReceptionPaymentConcept"));
		
		if (concept == null) {
			throw new APIException("Global property patientregistration.primaryCareReceptionPaymentConcept is undefined or does not match an existing concept");
		}
		else {
			return concept;
		}
	}
	
	/**
	 * @return the localized concept label for the payment question for the primary care reception
	 * @return null if no localized label the specified local
	 */
	public static final String GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_PAYMENT_CONCEPT_LOCALIZED_LABEL(Locale locale) {
		return getLocalizedLabel(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareReceptionPaymentConcept"), locale);
	}
	
	/**
	 * @return the concept for the receipt number question for the primary care reception
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_RECEIPT_NUMBER_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareReceptionReceiptNumberConcept"));
		
		if (concept == null) {
			throw new APIException("Global property patientregistration.primaryCareReceptionReceiptNumberConcept is undefined or does not match an existing concept");
		}
		else {
			return concept;
		}
	}
	
	/**
	 * @return the localized concept label for the receipt number question for the primary care reception
	 * @return null if no localized label the specified local
	 */
	public static final String GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_RECEIPT_NUMBER_CONCEPT_LOCALIZED_LABEL(Locale locale) {
		return getLocalizedLabel(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareReceptionReceiptNumberConcept"), locale);
	}
	
	
	/**
	 * @return the concept for the coded diagnosis question for the primary care visit
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_CODED_DIAGNOSIS_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitCodedDiagnosisConcept"));
		
		if (concept == null) {
			throw new APIException("Global property patientregistration.primaryCareVisitCodedDiagnosisConcept is undefined or does not match an existing concept");
		}
		else {
			return concept;
		}
	}
	/**
	 * @return the concept for the convenient set used to store the neonatal diseases 
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NEONATAL_DISEASES_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitNeonatalDiseasesConcept"));
		
		if (concept == null) {
			log.error("Global property patientregistration.primaryCareVisitNeonatalDiseasesConcept is undefined or does not match an existing concept");			
		}
		return concept;
		
	}
	/**
	 * @return the concept for the nationally notifying diagnoses question for the primary care visit
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NOTIFY_DIAGNOSIS_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitNotifyDiagnosisConcept"));
		
		if (concept == null) {
			return null;
		}
		else {
			return concept;
		}
	}
	/**
	 * @return the concept for the nationally notifying diagnoses question for the primary care visit
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_URGENT_DIAGNOSIS_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitUrgentDiagnosisConcept"));
		
		if (concept == null) {			
			return null;
		}
		else {
			return concept;
		}
	}
	
	/**
	 * @return the concept that represents the convset of age restricted diagnoses
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_AGE_RESTRICTED_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitAgeRestrictedConcept"));		
		if (concept == null) {			
			return null;
		}else {
			return concept;
		}
	}
	/**
	 * @return the localized concept label for the coded diagnosis question for the primary care visit
	 * @return null if no localized label the specified local
	 */
	public static final String GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_CODED_DIAGNOSIS_CONCEPT_LOCALIZED_LABEL(Locale locale) {
		return getLocalizedLabel(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitCodedDiagnosisConcept"), locale);
	}
	
	/**
	 * @return the concept for the non-coded diagnosis question for the primary care visit
	 */
	public static final Concept GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NON_CODED_DIAGNOSIS_CONCEPT() {
		Concept concept  = getConcept(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitNonCodedDiagnosisConcept"));
		
		if (concept == null) {
			throw new APIException("Global property patientregistration.primaryCareVisitNonCodedDiagnosisConcept is undefined or does not match an existing concept");
		}
		else {
			return concept;
		}
	}
	
	/**
	 * @return the localized concept label for the non-coded diagnosis question for the primary care visit
	 * @return null if no localized label the specified local
	 */
	public static final String GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NON_CODED_DIAGNOSIS_CONCEPT_LOCALIZED_LABEL(Locale locale) {
		return getLocalizedLabel(Context.getAdministrationService().getGlobalProperty("patientregistration.primaryCareVisitNonCodedDiagnosisConcept"), locale);
	}
	
	/**
	 * Retrieves the ICD-10 concept source
	 */
	public static final ConceptSource GLOBAL_PROPERTY_ICD10_CONCEPT_SOURCE() {
		ConceptSource source = null;
		String sourceString = Context.getAdministrationService().getGlobalProperty("patientregistration.icd10ConceptSource");
		
		if (StringUtils.isBlank(sourceString)) {
			// just return null if concept source not found, don't throw error
			return null;
		}
		
		// try by name
		source = Context.getConceptService().getConceptSourceByName(sourceString);
		
		// if that doesn't work, try by id
		if (source == null) {
			try {
				source = Context.getConceptService().getConceptSource(Integer.parseInt(sourceString));
			}
			catch (Exception e) {
				// do notthing
			}
		}
		
		// will return null if no match found
		return source;
	}
	
	/**
	 * Utility methods
	 */
	
	private static final Concept getConcept(String concept) {
		if (StringUtils.isNotBlank(concept)) {
			// if this is a pipe-delimited list, we only want the first entry 
			return PatientRegistrationUtil.getConcept(concept.split("\\|")[0]);			
		}
		else {
			return null;
		}
	}
	
	private static final String getLocalizedLabel(String concept, Locale locale) {
		if (StringUtils.isNotBlank(concept)) {
			
			// global property is pipe-delimited list; first entry is reference (by id, uuid, or map) to the 
			// concept itself; the remaining entries are the localized labels
			// so, first test if any localized labels have been specified
			if (concept.contains("|")) {
		
				// iterate through all the possible labels
				String labels = concept.split("\\|",2)[1];
				for (String label : labels.split("\\|")) {
					
					// a label is defined in the format "localeCode:label", no if no colon is present, this entry is invalid
					if (label.contains(":")) {
						// test to see if the text before the colom matches the locale, if so, return the text after the label
						if (label.split(":")[0].equals(locale.getLanguage())) {
							return label.split(":")[1];
						}
					}
				}
			}	
		}
		return null;
	}
}

