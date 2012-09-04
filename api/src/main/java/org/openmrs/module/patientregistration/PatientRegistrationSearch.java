package org.openmrs.module.patientregistration;

import java.util.List;
import java.util.Set;

import org.openmrs.Patient;
import org.openmrs.PersonName;


/**
 * Interface that defines a patient search; allows for different patient search
 * algorithms to be defined
 */
public interface PatientRegistrationSearch {

	/**
	 * Given a person name, should return all patients in the system that are potential exact matches
	 */
	public List<Patient> exactSearch(PersonName patientName);
	/**
	 * Given a person name, should return all patients in the system that are potential matches including phonetics matches
	 */
	public List<Patient> search(PersonName patientName);
	
	/**
	 * Given a person first name, should return all patients in the system that are potential matches
	 */
	public List<Patient> search(String patientFirstName);
	
	/**
	 * Given a string, should return all person names in the system that contain the given string
	 */
	public Set<String> searchNames(String name, String nameField);
	
	
	/**
	 * Given an example patient object, should return all patients in the system that are potential matches
	 */
	public List<Patient> search(Patient patient);
	
}
