package org.openmrs.module.patientregistration;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.simple.JSONObject;
import org.openmrs.Concept;
import org.openmrs.ConceptMap;
import org.openmrs.ConceptSet;
import org.openmrs.ConceptSource;
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
import org.openmrs.Role;
import org.openmrs.User;
import org.openmrs.api.APIException;
import org.openmrs.api.context.Context;
import org.openmrs.layout.web.address.AddressSupport;
import org.openmrs.module.ModuleFactory;
import org.openmrs.module.idgen.IdentifierSource;
import org.openmrs.module.idgen.service.IdentifierSourceService;
import org.openmrs.module.patientregistration.util.ObjectStore;
import org.openmrs.module.patientregistration.util.simpleconfig.POCConfiguration;
import org.openmrs.util.OpenmrsConstants;
import org.openmrs.util.OpenmrsUtil;
import org.openmrs.web.WebConstants;
import org.simpleframework.xml.Serializer;
import org.simpleframework.xml.load.Persister;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Method;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;



public class PatientRegistrationUtil {

	protected final static Log log = LogFactory.getLog(PatientRegistrationUtil.class);
	
	public static Map<Integer, Set<Integer>> falseDuplicates = null;
	
	public static Map<Integer, Set<Integer>> patientDuplicates = null;
	/**
	 * Gets the list of identifiers to display when creating a patient
	 * This is determined based on global properties
	 */
	public static List<PatientIdentifierType> getPatientIdentifierTypesToDisplay() {

		// first fetch the identifier types specified in the patient registration constant
		List<PatientIdentifierType> identifierTypes = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_IDENTIFIER_TYPES();
	
		// if no identifier types are specified in the patient registration constant, try the generic OpenMRS global property for identifiers
		if (identifierTypes.isEmpty()) {
			String identifierTypesString = Context.getAdministrationService().getGlobalProperty(OpenmrsConstants.GLOBAL_PROPERTY_PATIENT_IDENTIFIER_IMPORTANT_TYPES);
			if (StringUtils.isNotBlank(identifierTypesString)) {
				for (String typeName : identifierTypesString.split(",")) {
					PatientIdentifierType identifierType = Context.getPatientService().getPatientIdentifierTypeByName(typeName.split(":")[0]);
					if (identifierType != null) {
						identifierTypes.add(identifierType);
					}
				}
			}
			// if neither of the global properties have been specified, use all the identifier types by default
			else {
				identifierTypes = Context.getPatientService().getAllPatientIdentifierTypes();
			}
		}
		
		// now make sure that the primary type has been added (if it has been specified) and placed at the front of the list
		PatientIdentifierType identifierType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_IDENTIFIER_TYPE();
		if (identifierType != null) {
			identifierTypes.remove(identifierType);
			identifierTypes.add(0,identifierType);
		}
			
		return identifierTypes;
	}
	
	public static Map<Integer, Set<Integer>> getFalsePositiveDuplicates(){		
	    if (falseDuplicates != null){
	    	return falseDuplicates;
	    }
		ObjectStore store = ObjectStore.getInstance(PatientRegistrationConstants.MODULE_NAME);
		if(store!=null){
			try {
				Object storedMap = store.retrieve(PatientRegistrationConstants.FALSE_DUPLICATES_MAP);
				if(storedMap!=null){
					if (storedMap instanceof Map){
						falseDuplicates = (Map<Integer, Set<Integer>>)storedMap;
					}
				}
			} catch (Exception e) {
				log.error("failed to retrieve " + PatientRegistrationConstants.FALSE_DUPLICATES_MAP);
			}
		}
		return falseDuplicates;
	}
	
	
	
	public static Map<Integer, Set<Integer>> getStorePatientDuplicates(){		
	    if (patientDuplicates != null){
	    	return patientDuplicates;
	    }
		ObjectStore store = ObjectStore.getInstance(PatientRegistrationConstants.MODULE_NAME);
		if(store!=null){
			try {
				Object storedMap = store.retrieve(PatientRegistrationConstants.PATIENT_DUPLICATES_MAP);
				if(storedMap!=null){
					if (storedMap instanceof Map){
						patientDuplicates = (Map<Integer, Set<Integer>>)storedMap;
					}
				}
			} catch (Exception e) {
				log.error("failed to retrieve " + PatientRegistrationConstants.PATIENT_DUPLICATES_MAP);
			}
		}
		return patientDuplicates;
	}
	public static boolean storePatientDuplicates(){		
		boolean stored=false;
		patientDuplicates = getStorePatientDuplicates();
		ObjectStore store = ObjectStore.getInstance(PatientRegistrationConstants.MODULE_NAME);
		if(store!=null && patientDuplicates!=null){
			try {
				store.put(patientDuplicates, PatientRegistrationConstants.PATIENT_DUPLICATES_MAP);
				stored=true;
			} catch (Exception e) {
				log.error("failed to store " + PatientRegistrationConstants.PATIENT_DUPLICATES_MAP);
			}
		}
		
		return stored;
	}
	
	public static boolean storeFalsePositiveDuplicates(){		
		boolean stored=false;
		falseDuplicates = getFalsePositiveDuplicates();
		ObjectStore store = ObjectStore.getInstance(PatientRegistrationConstants.MODULE_NAME);
		if(store!=null && falseDuplicates!=null){
			try {
				store.put(falseDuplicates, PatientRegistrationConstants.FALSE_DUPLICATES_MAP);
				stored=true;
			} catch (Exception e) {
				log.error("failed to store " + PatientRegistrationConstants.FALSE_DUPLICATES_MAP);
			}
		}
		
		return stored;
	}
	
	public static Map<Integer, Set<Integer>> updateFalsePositiveDuplicates(Integer patientId, Integer duplicateId){
	    falseDuplicates = getFalsePositiveDuplicates();
		if(falseDuplicates==null){
			falseDuplicates = new HashMap<Integer, Set<Integer>>();
		}		
		if(patientId!=null){
			Set<Integer> duplicateList=falseDuplicates.get(patientId);
			if(duplicateList==null){
				duplicateList = new HashSet<Integer>();
			}
			if(duplicateId!=null){
				duplicateList.add(duplicateId);
			}
			falseDuplicates.put(patientId, duplicateList);
			storeFalsePositiveDuplicates();
		}
		return falseDuplicates;
	}

	public static Map<Integer, Set<Integer>> updatePatientDuplicates(Integer patientId, Integer duplicateId){
		patientDuplicates = getStorePatientDuplicates();
		if(patientDuplicates==null){
			patientDuplicates = new HashMap<Integer, Set<Integer>>();
		}		
		if(patientId!=null && duplicateId!=null){
			Set<Integer> duplicateList=patientDuplicates.get(patientId);
			if(duplicateList==null){
				duplicateList = new HashSet<Integer>();
			}
			duplicateList.add(duplicateId);			
			patientDuplicates.put(patientId, duplicateList);
			
			for(Integer childId : duplicateList){
				Set<Integer> list=patientDuplicates.get(childId);
				if(list==null){
					list = new HashSet<Integer>();
				}
				list.add(patientId);
			}
			
			duplicateList=patientDuplicates.get(duplicateId);
			if(duplicateList==null){
				duplicateList = new HashSet<Integer>();
			}
			duplicateList.add(patientId);		
			patientDuplicates.put(duplicateId, duplicateList);
			
			storePatientDuplicates();
		}
		return falseDuplicates;
	}

	
	/**
	 * Looks for and loads in the module configuration properties. Searches for a the file in this order: 
	 * 1) environment variable called "OPENMRS_POC_CONFIGURATION_FILE" 
	 * 2) {user_home}/WEBAPPNAME_POC_config.xml 
	 * 3) ./WEBAPPNAME_POC_config.xml 
	 * Returns null if no runtime properties file was found
	 * 
	 * @return POCConfig
	 */
	public static POCConfiguration getConfigProperties() {
		
		POCConfiguration pocConfig = null;
		
		try {
			FileInputStream configStream = null;
			
			// Look for environment variable {WEBAPP.NAME}_RUNTIME_PROPERTIES_FILE
			String webapp = WebConstants.WEBAPP_NAME;
			String env = webapp.toUpperCase() + "_POC_CONFIGURATION_FILE";
			
			String filepath = System.getenv(env);
			
			if (filepath != null) {
				log.debug("Atempting to load config file from: " + filepath + " ");
				try {
					configStream = new FileInputStream(filepath);
				}
				catch (IOException e) {
					log.warn("Unable to load config file with path: " + filepath
							+ ". (derived from environment variable " + env + ")", e);
				}
			} else {
				log.info("Couldn't find an environment variable named " + env);
				log.debug("Available environment variables are named: " + System.getenv().keySet());
			}
			
			// env is the name of the file to look for in the directories
			String filename = webapp + "_" + PatientRegistrationConstants.POC_CONFIGURATION_FILE;
			
			if (configStream == null) {
				filepath = OpenmrsUtil.getApplicationDataDirectory() + File.separatorChar + filename;
				log.debug("Attempting to load config file from: " + filepath);
				try {
					configStream = new FileInputStream(filepath);
				}
				catch (FileNotFoundException e) {
					log.warn("Unable to find config file: " + filepath);
				}
			}
			
			// look in current directory last
			if (configStream == null) {
				filepath = filename;
				log.debug("Attempting to load config file in directory: " + filepath);
				try {
					configStream = new FileInputStream(filepath);
				}
				catch (FileNotFoundException e) {
					log.warn("Also unable to find a config file named " + new File(filepath).getAbsolutePath());
				}
			}
			
			if (configStream == null)
				throw new IOException("Could not open '" + filename + "' in user or local directory.");
			
			Serializer serializer = new Persister();
			try {
				pocConfig = serializer.read(POCConfiguration.class, configStream);				
			} catch (Exception e) {
				log.error("deserialize error: ", e);
			}
			
			configStream.close();
			log.info("Using runtime properties file: " + filepath);
			
		}
		catch (Throwable t) {
			log.debug("Got an error while attempting to load the poc config file", t);
			log.warn("Unable to find a config file. Initial setup is needed. View the webapp to run the setup wizard.");
			return null;
		}
		return pocConfig;
	}
	
	/**
	 * Fetches the primary identifier for a patient based on the patientregistration.primaryIdentifierType property
	 * Returns null if no match found
	 */
	public static PatientIdentifier getPrimaryIdentifier(Patient patient) {
		
		PatientIdentifierType preferredIdentifierType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_IDENTIFIER_TYPE();
		
		if (preferredIdentifierType != null) {
			return patient.getPatientIdentifier(preferredIdentifierType);
		}
		else {
			return null;
		}
	}
	
	public static Patient getPatientByAnId(String patientIdentifier, String patientId){
		Patient patient=null;
		if(StringUtils.isNotBlank(patientIdentifier)){
			List<Patient> patients = Context.getPatientService().getPatients(null, patientIdentifier, null, true);
			if(patients!=null && patients.size()>0){
				patient = patients.get(0);
			}
		}
		if(StringUtils.isNotBlank(patientId)){
			try{
				patient = Context.getPatientService().getPatient(new Integer(patientId));
			}catch(Exception e){
				log.error("patient not found", e);
			}
		}		
		return patient;
	}
	
	/**
	 * Fetches the primary identifier for a patient based on the patientregistration.primaryIdentifierType property
	 * If no identifier found of the primary type, returns the preferred identifier
	 */
	public static PatientIdentifier getPreferredIdentifier(Patient patient) {
		
		PatientIdentifier primaryIdentifier = getPrimaryIdentifier(patient);
		
		if (primaryIdentifier != null && (!primaryIdentifier.isVoided())) {
			return primaryIdentifier;
		}
		else {
			return patient.getPatientIdentifier();
		}
	}
	
	public static boolean doesUserHaveProviderRole(User user){
		boolean hasProviderRole = false;
		if(user!=null){			
			List<Role> providerRoles = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_SUPPORTED_PROVIDER_ROLES();
			if(providerRoles!=null && providerRoles.size()>0){
				Set<Role> userRoles =user.getAllRoles();
				for(Role providerRole : providerRoles){
					if(userRoles.contains(providerRole)){
						hasProviderRole = true;
						break;
					}
				}
			}
		}
		return hasProviderRole;
	}
	
	public static List<User> getProviders(){
		List<User> providers = null;
		List<Role> providerRoles = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_SUPPORTED_PROVIDER_ROLES();
		if(providerRoles!=null && providerRoles.size()>0){
			//providers =  Context.getUserService().getUsers(null, providerRoles , false);
			providers = new ArrayList<User>();
			for(Role role : providerRoles){
				List<User> providerUsers = Context.getUserService().getUsersByRole(role);
				// assumming the provider roles contain distinct users 
				if(providerUsers!=null && providerUsers.size()>0){
					providers.addAll(providerUsers);
				}
			}
		}
		return providers;
	}
	
	public static Map<String, String> getConvSetMap(Concept concept, ConceptSource icd10){
		Map<String, String> convSetMap = null;
		if(concept!=null){			
			List<ConceptSet> convSet =Context.getConceptService().getConceptSetsByConcept(concept);
			if(convSet!=null && (convSet.size()>0)){
				convSetMap = new HashMap<String, String>();
				for(ConceptSet cs : convSet){
					String label = cs.getConcept().getName().getName();
					if(icd10 != null){											
						ConceptMap mapping = PatientRegistrationUtil.getConceptMapping(cs.getConcept(), icd10);
						if(mapping!=null){
							label = "(" + mapping.getSourceCode() + ") " + label;
						}
					}
					if(StringUtils.isNotEmpty(label)){
						convSetMap.put(label, cs.getConcept().getId().toString());
					}
				}				
			}
		}
		return convSetMap;
	}
	
	/**
	 * Returns the numero dossier for the specified patient at the specified location'
	 * TODO: note that if there are multiple dossier numbers at a single location, this method will just return the first found
	 */
	public static PatientIdentifier getNumeroDossier(Patient patient, Location location){		
		
		List<PatientIdentifier> patientIdentifiers =  getAllNumeroDossiers(patient);
		
		if(patientIdentifiers!=null && patientIdentifiers.size()>0){
			for(PatientIdentifier patientIdentifier : patientIdentifiers){
				if(patientIdentifier!=null && location!=null){
					if(StringUtils.equalsIgnoreCase(patientIdentifier.getLocation().getName(), location.getName()) ){
						return patientIdentifier;
					}
				}	
			}
		}								
		
		return null;
	}
	
	/**
	 * Returns all the Numero Dossiers for the specified patient
	 */
	public static List<PatientIdentifier> getAllNumeroDossiers(Patient patient) {
		PatientIdentifierType identifierType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_NUMERO_DOSSIER();	
		if(identifierType!=null){			
			return patient.getPatientIdentifiers(identifierType);						
		}		
		return null;
	}
	
	public static PatientIdentifier getEncounterIdentifier(Patient patient, EncounterType encounterType){
		if(encounterType!=null){
			PatientIdentifierType identifierType = getPatientIdentifierByEncounterType(encounterType);	
			if(identifierType!=null){
				return patient.getPatientIdentifier(identifierType);
			}
		}
		return null;
	}
	
	public static PatientIdentifierType getPatientIdentifierByEncounterType(EncounterType encounterType){
		String encounterTypeLower = null;
		if(encounterType!=null){
			if(StringUtils.isNotBlank(encounterType.getName())){
				encounterTypeLower = encounterType.getName().toLowerCase();
			}
			List<PatientIdentifierType> identifierTypes = Context.getPatientService().getAllPatientIdentifierTypes();
			if(identifierTypes!=null && identifierTypes.size()>0){
				for(PatientIdentifierType identifierType :identifierTypes){
					if(identifierType.getName().toLowerCase().indexOf(encounterTypeLower) > -1){
						return identifierType;									
					}
				}
			}
		}
		return null;
	}
	public static PatientIdentifierType getPatientIdentifierByName(String identifierName){
		String encounterTypeLower = null;
		if(StringUtils.isNotBlank(identifierName)){			
			encounterTypeLower = identifierName.toLowerCase();			
			List<PatientIdentifierType> identifierTypes = Context.getPatientService().getAllPatientIdentifierTypes();
			if(identifierTypes!=null && identifierTypes.size()>0){
				for(PatientIdentifierType identifierType :identifierTypes){
					if(identifierType.getName().toLowerCase().indexOf(encounterTypeLower) > -1){
						return identifierType;									
					}
				}
			}
		}
		return null;
	}
	/**
	 * Fetches the list of identifier types that are auto-assigned (but don't have manual entry enabled)
	 * (As defined by the IDGen module, if it is installed; if not installed, empty list is returned)
	 */
	@SuppressWarnings("unchecked")
    public static List<PatientIdentifierType> getPatientIdentifierTypesAutoGenerated() {
		// this is only relevant if we are using the idgen module
		if(!ModuleFactory.getStartedModulesMap().containsKey("idgen")) {
			return new LinkedList<PatientIdentifierType>();  // return an empty list
		}
		else {
			// access the idgen module via reflection
			try {
				Class<?> identifierSourceServiceClass = Context.loadClass("org.openmrs.module.idgen.service.IdentifierSourceService");
				Object idgen = Context.getService(identifierSourceServiceClass);
				Method getPatientIdentifierTypesByAutoGenerationOption = identifierSourceServiceClass.getMethod("getPatientIdentifierTypesByAutoGenerationOption", Boolean.class, Boolean.class);
				
				List<PatientIdentifierType> autoTypes = (List<PatientIdentifierType>) getPatientIdentifierTypesByAutoGenerationOption.invoke(idgen, false, true);
				List<PatientIdentifierType> manualTypes = (List<PatientIdentifierType>) getPatientIdentifierTypesByAutoGenerationOption.invoke(idgen, true, true);
				if(autoTypes!=null && manualTypes!=null){
					autoTypes.addAll(manualTypes);					
				}else if(autoTypes==null){
					autoTypes= manualTypes;
				}
				return autoTypes;				
			}
			catch(Exception e) {
				log.error("Unable to access IdentifierSourceService for automatic id generation.  Is the Idgen module installed and up-to-date?", e);
				return new LinkedList<PatientIdentifierType>();  // return an empty list
			}
		}
	}
	
	/**
	 * Fetches a map of identifier types to their autogeneration options
	 * (As defined by the IDGen module, if it is installed; if not installed, null is returned)
	 */
    public static Map<PatientIdentifierType,Object> getPatientIdentifierTypesAutoGenerationOptions() {
		// this is only relevant if we are using the idgen module
		if(!ModuleFactory.getStartedModulesMap().containsKey("idgen")) {
			return null;
		}
		else {
			// access the idgen module via reflection
			try {
				Class<?> identifierSourceServiceClass = Context.loadClass("org.openmrs.module.idgen.service.IdentifierSourceService");
				Object idgen = Context.getService(identifierSourceServiceClass);
				Method getAutoGenerationOption = identifierSourceServiceClass.getMethod("getAutoGenerationOption", PatientIdentifierType.class);
				
				Map<PatientIdentifierType,Object> autoGenerationOptions = new HashMap<PatientIdentifierType,Object>();
				
				for (PatientIdentifierType type : Context.getPatientService().getAllPatientIdentifierTypes()) {
					Object options = getAutoGenerationOption.invoke(idgen, type);
					if (options != null) {
						autoGenerationOptions.put(type, options);
					}
				}
				
				return autoGenerationOptions;
			}
			catch(Exception e) {
				log.error("Unable to access IdentifierSourceService for automatic id generation.  Is the Idgen module installed and up-to-date?", e);
				return null;
			}
		}
	}
	
	
	/**
	 * Converts an age (specified in year, month, and day) to a birthdate.
	 * You can specify the specific date to calculate the age from, or, if 
	 * not specified, today's date is used. Year, month, or day can all be left blank.
	 * 
	 * Note that if only a year is specified, the month/day is set to January 1; 
	 * however, if only the month (or the month and year) is specified, the day is not reset
	 * 
	 * For example, if ageOnDate is set to April 3, 2010, and someone is said to be 10 years old,
	 * the method would return January 1, 2000; however, if someone is said to be 2 months old, the
	 * method would return February 3, 2000
	 */
	public static Date calculateBirthdateFromAge(Age age, Date ageOnDate) {
		Calendar c = Calendar.getInstance();
		c.setTime(ageOnDate == null ? new Date() : ageOnDate);
		
		// set the year
		if (age.getYears() != null) {
			c.add(Calendar.YEAR, -1 * age.getYears());
		}
		
		// set the month (if not specified, and no day specified, set to first month of year)
		if (age.getMonths() != null && age.getMonths() != 0) {
			c.add(Calendar.MONTH, -1 * age.getMonths());
		}
		else if (age.getDays() == null || age.getDays() == 0){
			c.set(Calendar.MONTH,0);
		}
		
		// set the day (if not specified, and no month specified, set to first day of month)
		if (age.getDays() != null && age.getDays() !=0) {
			c.add(Calendar.DAY_OF_MONTH, -1 * age.getDays());
		}
		else if (age.getMonths() == null || age.getMonths() == 0){
			c.set(Calendar.DAY_OF_MONTH,1);
		}
		
		return c.getTime();
	}
	
	public static Date calculateBirthdateFromAge(Integer years, Integer months, Integer days, Date ageOnDate) {
		return calculateBirthdateFromAge(new Age(years, months, days), ageOnDate);
	}
	
	
	public static long getAgeInDays(Date birthdate, Date ageOnDate){
		long diffDays = 0;
		if(birthdate!=null){
			Calendar birthdateCalendar = Calendar.getInstance();
			birthdateCalendar.setTime(birthdate);
			Calendar onDateCalendar = Calendar.getInstance();
			if(ageOnDate!=null){
				onDateCalendar.setTime(ageOnDate);
			}
			long birthdateMilliseconds = birthdateCalendar.getTimeInMillis();
			long onDateMilliseconds = onDateCalendar.getTimeInMillis();
			diffDays = (onDateMilliseconds - birthdateMilliseconds )/(24*60*60*1000);
		}
		
		return diffDays;
	}
	/**
	 * Given a person's birthdate, calculate their age (in years, months, and days)
	 * (Note that, unfortunately, if you use calculateBirthdateFromAge, and then calculateAgeFromBirthdate, you
	 * may not get back the exact age you started with; we could probably fix this--this complexity is due to the
	 * fact that not all months have the same number of days; in both algorithms we are calculating the day last,
	 * which cause the problem. Because of the way we use this method, it's not really a problem, because we
	 * always trim the resultant age so that it is only a year, month, or day)
	 * 
	 * TODO: document this issue better
	 */
	public static Age calculateAgeFromBirthdate(Date birthdate, Date ageOnDate) {
		Calendar targetDate = Calendar.getInstance();
		targetDate.setTime(ageOnDate == null ? new Date() : ageOnDate);
		targetDate.set(Calendar.HOUR_OF_DAY, 0);            
		targetDate.set(Calendar.MINUTE, 0);                
		targetDate.set(Calendar.SECOND, 0);                 
		targetDate.set(Calendar.MILLISECOND, 0); 
		targetDate.add(Calendar.DAY_OF_MONTH, 1);
		
		Calendar c = Calendar.getInstance();
		c.setTime(birthdate);

		Age age = new Age();
		
		// increment birthdate by one year at a time until it is great than the target date
		int year = 0;
		while (c.before(targetDate)) {
			c.add(Calendar.YEAR, 1);
			year++;	
		}
		// roll back one year and set that as age
		c.add(Calendar.YEAR, -1);
		age.setYears(year - 1);
		
		// now increment by one month at a time until it is great than the target date
		int month = 0;
		while (c.before(targetDate)) {
			c.add(Calendar.MONTH, 1);
			month++;	
		}
		// roll back one month and set that as age
		c.add(Calendar.MONTH, -1);
		age.setMonths(month - 1);
		
		// now increment by one month at a time until it is great than the target date
		int day = 0;
		while (c.before(targetDate)) {
			c.add(Calendar.DAY_OF_MONTH, 1);
			day++;	
		}
		// set that as days
		age.setDays(day - 1);
		
		return age;
	}
	
	/**
     * @param name
     * @return the source with the given name
     */
    public static IdentifierSource getIdentifierSource(String name) {
    	for (IdentifierSource source : Context.getService(IdentifierSourceService.class).getAllIdentifierSources(false)) {
    		if (source.getName().equals(name)) {
    			return source;
    		}
    	}
    	return null;
    }
	
	 /**
     * Auto-assign a patient identifier for a specific identifier type (if required) if the idgen module is installed, using reflection
     */
    public static String assignIdentifier(PatientIdentifierType type) {		
		try {
			Class<?> identifierSourceServiceClass = Context.loadClass("org.openmrs.module.idgen.service.IdentifierSourceService");
			Object idgen = Context.getService(identifierSourceServiceClass);
	        Method generateIdentifier = identifierSourceServiceClass.getMethod("generateIdentifier", PatientIdentifierType.class, String.class);
	        
	        // note that generate identifier returns null if this identifier type is not set to be auto-generated
	        String identifierId = (String) generateIdentifier.invoke(idgen, type, "auto-assigned during patient creation");
	       
	        if(StringUtils.isNotBlank(identifierId)){
	        	return identifierId;
	        }
		}
		catch (Exception e) {
            throw new IllegalStateException("Unable to access IdentifierSourceService for automatic id generation.  Is the Idgen module installed and up-to-date?", e);
		}
		
		return null;
	}
	
    /**
	 * Performs a soundex search using the name phonetics module
	 */
	@SuppressWarnings("unchecked")
    public static String encodeName(String encodeString, String processorName) {
		// if the name phonetics module is not installed, return null
		if (!ModuleFactory.getStartedModulesMap().containsKey("namephonetics")) {
			return null;
		}
		
		// otherwise, call the name phonetics search method via reflection
		try {
			Class<?> namePhoneticsUtilClass = Context.loadClass("org.openmrs.module.namephonetics.NamePhoneticsUtil");
			Method encodeStringMethod = namePhoneticsUtilClass.getMethod("encodeString", String.class, String.class);
	        return (String) encodeStringMethod.invoke(namePhoneticsUtilClass, encodeString, processorName);
		}
		catch (Exception e) {
			log.error("Unable to access Name Phonetics service to encode string.  Is the Name Phonetics module installed and up-to-date?", e);
		} 
		
		return null;
	}
    
	/**
	 * Performs a soundex search using the name phonetics module
	 */
	@SuppressWarnings("unchecked")
    public static List<Patient> findPatientsByNamePhonetics(PersonName patientName) {
		// if the name phonetics module is not installed, return null
		if (!ModuleFactory.getStartedModulesMap().containsKey("namephonetics")) {
			return null;
		}
		
		// otherwise, call the name phonetics search method via reflection
		try {
			Class<?> namePhoneticsServiceClass = Context.loadClass("org.openmrs.module.namephonetics.NamePhoneticsService");
			Object namePhonetics = Context.getService(namePhoneticsServiceClass);
	        Method findPatient = namePhoneticsServiceClass.getMethod("findPatient", String.class, String.class, String.class, String.class);
	        
	        return (List<Patient>) findPatient.invoke(namePhonetics, patientName.getGivenName(), patientName.getMiddleName(), patientName.getFamilyName(), patientName.getFamilyName2());
		}
		catch (Exception e) {
			log.error("Unable to access Name Phonetics service for patient search.  Is the Name Phonetics module installed and up-to-date?", e);
		} 
		
		return null;
	}
	
	/**
	 * @return possible address hierarchy levels defined
	 */
	@SuppressWarnings("unchecked")
	public static List<String> getAddressHierarchyLevels() {
		List<String> l = new ArrayList<String>();
		
		try {
			Class<?> svcClass = Context.loadClass("org.openmrs.module.addresshierarchy.service.AddressHierarchyService");
			Object svc = Context.getService(svcClass);
			List<Object> levels = (List<Object>)svcClass.getMethod("getOrderedAddressHierarchyLevels", Boolean.class, Boolean.class).invoke(svc, true, true);
	        Class<?> levelClass = Context.loadClass("org.openmrs.module.addresshierarchy.AddressHierarchyLevel");
	        Class<?> fieldClass = Context.loadClass("org.openmrs.module.addresshierarchy.AddressField");
	        for (Object o : levels) {
	        	Object addressField = levelClass.getMethod("getAddressField").invoke(o);
	        	String fieldName = (String)fieldClass.getMethod("getName").invoke(addressField);
	        	l.add(fieldName);
	        }
		}
		catch (Exception e) {
			log.error("Error obtaining address hierarchy levels", e);
		} 
	 
		return l;
	}
	
	/**
	 * @return possible address hierarchy values given the passed filter criteria
	 */
	@SuppressWarnings("unchecked")
	public static List<String> getAddressHierarchyValues(String field, Map<String, String> filterCriteria) {
		List<String> l = new ArrayList<String>();
		if (ModuleFactory.getStartedModulesMap().containsKey("addresshierarchy")) {
			try {
				Class<?> svcClass = Context.loadClass("org.openmrs.module.addresshierarchy.service.AddressHierarchyService");
				Object svc = Context.getService(svcClass);
				Method m = svcClass.getMethod("getPossibleAddressValues", Map.class, String.class);
		        l = (List<String>)m.invoke(svc, filterCriteria, field);
		        Collections.sort(l);
			}
			catch (Exception e) {
				log.error("Error obtaining address hierarchy values for " + field + " given criteria " + filterCriteria, e);
			} 
		}
		return l;
	}
	
	/**
	 * Given a person address object, this method uses reflection to set the value of the specified field
	 */
	public static final  void setAddressFieldValue(PersonAddress address, String fieldName, String fieldValue) {
		try {
			Method setter = PersonAddress.class.getMethod("set" + fieldName.substring(0, 1).toUpperCase() + fieldName.substring(1), String.class);
			setter.invoke(address, fieldValue);
		}
		catch (Exception e) {	        
	        log.error("Unable to set address field " + fieldName + " on PersonAddress", e);
        }
	}
	
	/**
	 * Given a Date object, returns a Date object for the same date but with the time component (hours, minutes, seconds & milliseconds) removed
	 */
	public static Date clearTimeComponent(Date date) {
		// Get Calendar object set to the date and time of the given Date object  
		Calendar cal = Calendar.getInstance();  
		cal.setTime(date);  
		  
		// Set time fields to zero  
		cal.set(Calendar.HOUR_OF_DAY, 0);  
		cal.set(Calendar.MINUTE, 0);  
		cal.set(Calendar.SECOND, 0);  
		cal.set(Calendar.MILLISECOND, 0);  
		  	
		return cal.getTime();
	}
	
	public static List<Obs> parseObsList(String inputList){
		List<Obs> obsList = null;
		if(StringUtils.isNotBlank(inputList)){
			 String[] diagnosisArray= StringUtils.split(inputList, ';');
			 if(diagnosisArray!=null && diagnosisArray.length>0){
				 for(int i=0; i<diagnosisArray.length; i++){
					 String[] obsItems = StringUtils.split(diagnosisArray[i], ',');
					 if(obsItems!=null && obsItems.length>2){
						 //create an observation
						 if(obsList==null){
							 obsList = new ArrayList<Obs>();
						 }
						 Obs obs = new Obs();
						 if(StringUtils.equalsIgnoreCase(obsItems[0], "CODED") ){
							 Integer conceptId = Integer.valueOf((String) obsItems[1]);
							 if(conceptId!=null){
								 Concept valueCoded = Context.getConceptService().getConcept(conceptId);
								 obs.setValueCoded(valueCoded);								
							 }
						 }else if(StringUtils.equalsIgnoreCase(obsItems[0], "NON-CODED") ){
							 String valueText = obsItems[2];
							 if(StringUtils.isNotBlank(valueText)){
								 obs.setValueText(valueText);								 
							 }
						 } else if (StringUtils.equalsIgnoreCase(obsItems[0], "NUMERIC")) {
                             try {
                                 obs.setValueNumeric(Double.parseDouble(obsItems[1]));
                             } catch (NumberFormatException ex) {
                                 throw new IllegalArgumentException("Trying to create a numeric observation for concept " + obsItems[3] + ", but the value passed in is not a number: " + obsItems[1]);
                             }
                         }
						 String conceptId = obsItems[3];
						 if(StringUtils.isNotBlank(conceptId)){
							obs.setConcept(Context.getConceptService().getConcept(new Integer(conceptId)));
						 }
						 obsList.add(obs);
					 }
				 }
			 }
		}
		return obsList;
	}
	
	public static List<Obs> parseDiagnosisList(String diagnosisList){
		List<Obs> obsList = null;
		if(StringUtils.isNotBlank(diagnosisList)){
			 String[] diagnosisArray= StringUtils.split(diagnosisList, ';');
			 if(diagnosisArray!=null && diagnosisArray.length>0){
				 for(int i=0; i<diagnosisArray.length; i++){
					 String[] diagnosisItems = StringUtils.split(diagnosisArray[i], ',');
					 if(diagnosisItems!=null && diagnosisItems.length>2){
						 //create an observation
						 if(obsList==null){
							 obsList = new ArrayList<Obs>();
						 }
						 Obs obs = new Obs();
						 if(StringUtils.equalsIgnoreCase(diagnosisItems[0], "CODED") ){
							 Integer conceptId = Integer.valueOf((String) diagnosisItems[1]);
							 if(conceptId!=null){
								 Concept valueCoded = Context.getConceptService().getConcept(conceptId);
								 obs.setValueCoded(valueCoded);
								 obs.setConcept(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_CODED_DIAGNOSIS_CONCEPT());
							 }
						 }else if(StringUtils.equalsIgnoreCase(diagnosisItems[0], "NON-CODED") ){
							 String valueText = diagnosisItems[2];
							 if(StringUtils.isNotBlank(valueText)){
								 obs.setValueText(valueText);
								 obs.setConcept(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NON_CODED_DIAGNOSIS_CONCEPT());
							 }
						 }
						 obsList.add(obs);
					 }
				 }
			 }
		}
		return obsList;
	}
	
	public static void convertPatientListToJson( List<Patient> patientList, HttpServletResponse response) 
		throws Exception{
		
		response.setContentType("application/json");
    	response.setCharacterEncoding("UTF-8");
    	PrintWriter out=null;
		try {
			out = response.getWriter();
		} catch (IOException e) {
			log.error("failed to get the servlet response writer", e);
			throw new Exception(e);
		}
		if(out!=null){
	    	// start the JSON
	    	out.print("[");
	    	if(patientList!=null && patientList.size()>0){
		    	Iterator<Patient> i = patientList.iterator();    	
		    	while(i.hasNext()) {
		    		out.print(PatientRegistrationUtil.convertPatientToJSON(i.next()));	    	
		    		if (i.hasNext()) {
		    			out.print(",");
		    		}
		    	}
	    	}
	    	// close the JSON
			out.print("]");
		}
	}
	
	
	/**
	 * Takes a patient object and converts it to a simple JSON representation of the with the following parameters:
	 * 
	 * id - patient id
	 * identifier - preferred identifier
	 * gender - patient gender
	 * birthdate - patient birthdate
	 * givenName - given name component of preferred name
	 * middleName - middle name component of preferred name
	 * familyNamePrefix - family name prefix of preferred name
	 * familyName - family name of preferred name
	 * familyName2 - family name 2 of preferred name
	 * familyNameSuffix - family name suffix of preferred name
	 * prefix - prefix of preferred name
	 * degree - degress of preferred name
	 **/
	public static String convertPatientToJSON(Patient patient) {

		if (patient == null) {
			return "{}" ;
		}
		else {
			StringBuffer patientString = new StringBuffer();			
			DateFormat df = new SimpleDateFormat(PatientRegistrationConstants.DATE_FORMAT_DISPLAY, Context.getLocale());
			
			patientString.append('{');
			patientString.append("\"id\": \"" + patient.getId() + "\",");
			PatientIdentifier preferredIdentifier = PatientRegistrationUtil.getPreferredIdentifier(patient);
			String preferredTypeName=null;
			if(preferredIdentifier!=null){
				preferredTypeName = preferredIdentifier.getIdentifierType().getName();
				patientString.append("\"preferredIdentifierType\": \"" + preferredTypeName + "\",");
				patientString.append("\"preferredIdentifier\": \"" + preferredIdentifier.toString() + "\",");
			}
			patientString.append("\"preferredIdentifier\": \"" + PatientRegistrationUtil.getPreferredIdentifier(patient) + "\",");
			Set<PatientIdentifier> identifiers = patient.getIdentifiers();
			if(identifiers!=null && identifiers.size()>0){
				for(PatientIdentifier identifier:identifiers){
					if(identifier.isVoided()){
						continue;
					}
					String identifierTypeName=identifier.getIdentifierType().getName();
					String identifierValue = identifier.getIdentifier();
					patientString.append("\"" + identifierTypeName + "\": \"" + (identifierValue != null ? JSONObject.escape(identifierValue) : " ") + "\",");					
				}
				patientString.append("\"identifiers\": { \"identifier\":[ ");
				boolean first =true;
				for(PatientIdentifier identifier:identifiers){
					if(identifier.isVoided()){
						continue;
					}
					String identifierTypeName=identifier.getIdentifierType().getName();
					if(StringUtils.equals(identifierTypeName, preferredTypeName)){
						continue;
					}
					if(first){
						patientString.append("{ ");
						first=false;
					}else{
						patientString.append(", { ");
					}
					
					patientString.append("\"identifierTypeName\": \"" + identifierTypeName + "\",");
					String identifierValue = identifier.getIdentifier();
					patientString.append("\"identifierValue\": \"" + (identifierValue != null ? JSONObject.escape(identifierValue) : " ") + "\"");
					//patientString.append("\"" + identifierTypeName + "\": \"" + identifier.getIdentifier() + "\",");		
					patientString.append(" }");
				}
				patientString.append("]}, ");
			}						
			//patientString.append("\"identifier\": \"" + patient.getPatientIdentifier() + "\",");
			patientString.append("\"gender\": \"" + patient.getGender() + "\",");
			patientString.append("\"age\": \"" + patient.getAge() + "\",");
			if(patient.getBirthdate()!=null){
				patientString.append("\"birthdate\": \"" + df.format(patient.getBirthdate()) + "\",");
			}
			patientString.append("\"givenName\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getGivenName() != null) ? patient.getPersonName().getGivenName() : "") + "\",");
			patientString.append("\"middleName\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getMiddleName() != null) ? patient.getPersonName().getMiddleName() : "") + "\",");
			patientString.append("\"familyNamePrefix\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getFamilyNamePrefix() != null) ? patient.getPersonName().getFamilyNamePrefix() : "") + "\",");
			patientString.append("\"familyName\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getFamilyName() != null) ? patient.getPersonName().getFamilyName() : "") + "\",");
			patientString.append("\"familyName2\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getFamilyName2() != null) ? patient.getPersonName().getFamilyName2() : "") + "\",");
			patientString.append("\"familyNameSuffix\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getFamilyNameSuffix() != null) ? patient.getPersonName().getFamilyNameSuffix() : "") + "\",");
			patientString.append("\"prefix\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getPrefix() != null) ? patient.getPersonName().getPrefix() : "") + "\",");
			
			// add the patient address using the address template, if one exists			
			if (patient.getPersonAddress() != null) {					
				// print out the address using the layout format		
				// first iterate through all the lines in the format
				for (List<Map<String,String>> line : AddressSupport.getInstance().getDefaultLayoutTemplate().getLines()) {															
					for (Map<String,String> token : line) {
						// find all the tokens on this line, and then add them to that output line 
						if(token.get("isToken").equals(AddressSupport.getInstance().getDefaultLayoutTemplate().getLayoutToken())) {							
							// token.get("codeName")--->country, stateProvince;
							String addressLabel = token.get("codeName");
							String property = PatientRegistrationUtil.getPersonAddressProperty(patient.getPersonAddress(), addressLabel);							
							patientString.append("\"" + addressLabel  + "\": \"" + (property != null ? JSONObject.escape(property) : " ") + "\",");						
						}
					}			
				}

			}			
			patientString.append("\"degree\": \"" + ((patient.getPersonName()!=null && patient.getPersonName().getDegree() != null) ? patient.getPersonName().getDegree() : "") + "\"");
			patientString.append('}');
			
			return patientString.toString();
		}
	}
	
	/**
	 * Takes a patient object and converts it to a simple JSON representation of the with the following parameters:
	 * 	
	 * givenName - given name component of preferred name	 
	 **/
	public static String convertPatientNameToJSON(String patientName) {

		if (!StringUtils.isNotBlank(patientName)) {
			return "{}" ;
		}
		else {
			StringBuffer patientString = new StringBuffer();									
			patientString.append('{');
			patientString.append("\"givenName\": \"" + patientName + "\"");			
			patientString.append('}');			
			return patientString.toString();
		}
	}
	
	/**
	 * Takes a patient object and converts it to a simple JSON representation of the with the following parameters:
	 * 	
	 * givenName - given name component of preferred name	 
	 **/
	public static String convertPatientNameOccurrencesToJSON(String patientName, Integer occurrence) {

		if (!StringUtils.isNotBlank(patientName)) {
			return "{}" ;
		}
		else {
			StringBuffer patientString = new StringBuffer();									
			patientString.append('{');
			patientString.append("\"givenName\": \"" + patientName + "\",");	
			patientString.append("\"occurrence\": \"" + occurrence.toString() + "\"");
			patientString.append('}');			
			return patientString.toString();
		}
	}
	/**
	 * Takes a patient object and converts it to a simple JSON representation of the with the following parameters:
	 * 	
	 * givenName - given name component of preferred name	 
	 **/
	public static String convertPatientNameOccurencesToJSON(String patientName) {

		if (!StringUtils.isNotBlank(patientName)) {
			return "{}" ;
		}
		else {
			StringBuffer patientString = new StringBuffer();									
			patientString.append('{');
			patientString.append("\"givenName\": \"" + patientName + "\"");			
			patientString.append('}');			
			return patientString.toString();
		}
	}
	
	/**
	 * Gets the specified property (referenced by string) off of a person address
	 * Returns null if the underlying property is null
	 */
	public static String getPersonAddressProperty(PersonAddress address, String property) {
		try {
			Class<?> personAddressClass = Context.loadClass("org.openmrs.PersonAddress");
			Method getPersonAddressProperty;
	        getPersonAddressProperty = personAddressClass.getMethod("get" + property.substring(0,1).toUpperCase() + property.substring(1));
	        return (String) getPersonAddressProperty.invoke(address);
        }
        catch (Exception e) {
	       throw new APIException("Invalid property name " + property + " passed to getPersonAddressProperty");
        }
	}
	
	
	/**
	 * Returns true/false if all the fields in the address are empty or null
	 */
	public static Boolean isBlank(PersonAddress address) {
		return StringUtils.isBlank(address.getAddress1()) && StringUtils.isBlank(address.getAddress2()) && StringUtils.isBlank(address.getCityVillage())
				&& StringUtils.isBlank(address.getStateProvince()) && StringUtils.isBlank(address.getCountry()) && StringUtils.isBlank(address.getCountyDistrict())
				&& StringUtils.isBlank(address.getNeighborhoodCell()) && StringUtils.isBlank(address.getPostalCode()) && StringUtils.isBlank(address.getTownshipDivision()) 
				&& StringUtils.isBlank(address.getLatitude()) && StringUtils.isBlank(address.getLongitude()) && StringUtils.isBlank(address.getRegion()) && StringUtils.isBlank(address.getSubregion()) 
				&& StringUtils.isBlank(address.getPostalCode());
	}
	
	/**
	 * Converts the passed string to camel case  
	 */
	
	public static String toCamelCase(String str) {
		
		if (str == null) {
			return null;
		}
		
		StringBuffer result = new StringBuffer();
		Boolean first = true;
		
		// break the string up into words (separated by spaces)
		for (String word : str.split(" ")) {
			
			// if this is the first word, make the first character lowercase
			if (first) {
				result.append(word.substring(0, 1).toLowerCase());
				first = false;
			}
			// otherwise set the first character to uppercase
			else {
				result.append(word.substring(0, 1).toUpperCase());
			}
			
			// append the rest of the word to the result string
			result.append(word.substring(1));
		}
		return result.toString();
	}
	
	public static ConceptMap getConceptMapping(Concept concept, ConceptSource source) {
		for (ConceptMap mapping : concept.getConceptMappings()) {
			if (mapping.getSource().equals(source)) {
				return mapping;
			}
		}
		return null;
	}
	
	/***
	 * Get the concept by id,
	 * the id can either be 
	 * 		1)an integer id like 5090 
	 * 	 or 2)mapping type id like "XYZ:HT"
	 * 	 or 3)uuid like "a3e12268-74bf-11df-9768-17cfc9833272"
	 * @param id
	 * @return the concept if exist, else null
	 * @should find a concept by its conceptId 
     * @should find a concept by its mapping 
     * @should find a concept by its uuid
     * @should return null otherwise
	 */
	public static Concept getConcept(String id){
		Concept cpt = null;
		
		if (id != null){
			
			// see if this is a parseable int; if so, try looking up concept by id
			try { //handle integer: id
				int conceptId = Integer.parseInt(id);
				cpt  = Context.getConceptService().getConcept(conceptId);	
				
				if (cpt != null) {
					return cpt;
				} 
			} catch (Exception ex){
				//do nothing 
			}
			
			// handle  mapping id: xyz:ht
			int index = id.indexOf(":");
			if(index != -1){
				String mappingCode = id.substring(0,index).trim();
				String conceptCode = id.substring(index+1,id.length()).trim();	
				cpt = Context.getConceptService().getConceptByMapping(conceptCode,mappingCode);
				
				if (cpt != null) {
					return cpt;
				} 
			}
			
			//handle uuid id: "a3e1302b-74bf-11df-9768-17cfc9833272", if the id matches a uuid format
			if(isValidUuidFormat(id)){
				cpt = Context.getConceptService().getConceptByUuid(id);
			}
		}
		
		return cpt;
	}
	
	/***
	 * Determines if the passed string is in valid uuid format
	 * By OpenMRS standards, a uuid must be 36 characters in length and not contain whitespace, but
	 * we do not enforce that a uuid be in the "canonical" form, with alphanumerics
	 * seperated by dashes, since the MVP dictionary does not use this format
	 * (We also are being slightly lenient and accepting uuids that are 37 or 38 characters in
	 * length, since the uuid data field is 38 characters long)
	 */
	public static boolean isValidUuidFormat(String uuid) {
		if (uuid.length() < 36 || uuid.length() > 38 || uuid.contains(" ")) {
			return false;
		}
		
		return true;
	}

	/**
	 * Returns the encounter specified by the input string
	 * Encounter can be referenced by id or name
	 */
	public static final EncounterType findEncounterType(String encounterTypeString) {
    	
    	if (StringUtils.isBlank(encounterTypeString)) {
    		return null;
    	}
    	
    	EncounterType encounterType = null;
    	
    	// try to fetch encounterType by name
    	encounterType = Context.getEncounterService().getEncounterType(encounterTypeString);
    	
    	// if that doesn't work, try by id
    	if (encounterType == null) {
    		try {
    			encounterType = Context.getEncounterService().getEncounterType(Integer.parseInt(encounterTypeString));
    		}
    		catch (Exception e) {
    			// do nothing
    		}
    	}
    	
    	return encounterType;  // will return null if no match found
    }

    /**
     * @param patient
     * @return true if this patient is unknown (e.g. created via J. Doe workflow)
     */
    public static boolean isUnknownPatient(Patient patient) {
        boolean unknownPatient = false;
        PersonAttributeType unknownPatientAttributeType = PatientRegistrationGlobalProperties.UNKNOWN_PATIENT_PERSON_ATTRIBUTE_TYPE();
        if(patient!=null){
            PersonAttribute att = patient.getAttribute(unknownPatientAttributeType);
            if (att != null && StringUtils.equals(att.getValue(), "true")) {
                unknownPatient = true;
            }
        }
        return unknownPatient;
    }
	
}
