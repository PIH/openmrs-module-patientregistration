package org.openmrs.module.patientregistration.search;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.collections.ListUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Patient;
import org.openmrs.PersonName;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.PatientRegistrationSearch;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;


public class DefaultPatientRegistrationSearch implements PatientRegistrationSearch {

	protected final Log log = LogFactory.getLog(getClass());
	
	@SuppressWarnings("unchecked")
    public List<Patient> exactSearch(PersonName patientName) {

		// handle null case
		if (patientName == null) {
			return new ArrayList<Patient>();
		}		
		// use the standard name search to start out with
		List<Patient> patients = Context.getPatientService().getPatients(patientName.getFullName());
		return patients;
		
    }
	
	@SuppressWarnings("unchecked")
    public List<Patient> search(PersonName patientName) {

		// handle null case
		if (patientName == null) {
			return new ArrayList<Patient>();
		}		
		// use the standard name search to start out with
		List<Patient> patients = Context.getPatientService().getPatients(patientName.getFullName());
		
		// now also do a name phonetics search
		List<Patient> namePhoneticsPatients = PatientRegistrationUtil.findPatientsByNamePhonetics(patientName);
		
		// return the sum of the two lists
		if (patients == null) {
			return namePhoneticsPatients;
		}
		else if (namePhoneticsPatients == null){
			return patients;
		}
		else {
			return (List<Patient>) ListUtils.sum(patients, namePhoneticsPatients);
		}
    }

	@SuppressWarnings("unchecked")
    public List<Patient> search(String personFirstName) {

		if(!StringUtils.isNotBlank(personFirstName)){
			return new ArrayList<Patient>();
		}
				
		// use the standard name search to start out with
		List<Patient> patients = Context.getPatientService().getPatients(personFirstName);
		return patients;
		
    }

	public Set<String> searchNames(String name, String nameField) {
		if(!StringUtils.isNotBlank(name) || 
				!StringUtils.isNotBlank(nameField)){
			return new HashSet<String>();
		}
		return Context.getService(PatientRegistrationService.class).searchNames(name, nameField);		
	}
	
	public List<Integer> getPhoneticsPersonId(String firstName, String lastName){
		if(StringUtils.isBlank(firstName) || 
				StringUtils.isBlank(lastName)){
			return null;
		}
		return Context.getService(PatientRegistrationService.class).getPhoneticsPersonId(firstName, lastName);
	}
	public Map<String,Integer> searchNamesByOccurence(String name, String nameField) {
		if(!StringUtils.isNotBlank(name) || 
				!StringUtils.isNotBlank(nameField)){
			return new HashMap<String,Integer>();
		}
		return Context.getService(PatientRegistrationService.class).searchNamesByOccurence(name, nameField);		
	}

	public List<Patient> search(Patient patient) {
		
		// TODO: right now we use the same search as we do if we just have a name, but we may want to add further restrictions,
		// possibly by age or gender
		
		// handle null case
		if (patient == null) {
			return new ArrayList<Patient>();
		}
		
		return search(patient.getPersonName());
    }

}
