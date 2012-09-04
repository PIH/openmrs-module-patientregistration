/**
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */
package org.openmrs.module.patientregistration.service.db;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.openmrs.Concept;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.module.patientregistration.UserActivity;
import org.openmrs.module.patientregistration.util.DuplicatePatient;

/**
 * Core Patient Registration DB Layer
 */
public interface PatientRegistrationDAO {

	/**
	 * @return the number of distinct registrations with a given encounter type and location, by address field, grouped by encounter or by patient if groupByPatient is true
	 */
	public Map<String, Integer> getNumberOfRegistrationsByAddress(Map<String, String> filterCriteria, String addressField, EncounterType encounterType, Location location, boolean groupByPatient);
	
	/**
	 * 
	 * @param name a String indicating the name to search
	 * @param nameField a String indicating the table field name
	 * @return a Set of strings representing possible name matches to the name parameter
	 */
	public Set<String> searchNames(String name, String nameField);
	
	public List<Patient> getPatientsByNameId(List<Integer> nameIds);
	/**
	 * 
	 * @param firstName a String indicating the first name phonetic encoding
	 * @param lastName a String indicating the last name phonetic encoding
	 * @return a Set of Integer representing the PersonName IDs of the potential matches
	 */
	public List<Integer> getPhoneticsPersonId(String firstName, String lastName);
	
	public List<DuplicatePatient> getDuplicatePatients(Patient patient);
	
	public List<String> getDistinctObs(Integer conceptId);
	
	public Set<Integer> getDistinctDuplicateObs(Integer conceptId);
	/**
	 * 
	 * @param name a String indicating the name to search
	 * @param nameField a String indicating the table field name
	 * @return a Set of strings representing possible name matches to the name parameter
	 */
	public Map<String, Integer> searchNamesByOccurence(String name, String nameField);
	
	/**
	 * Saves an UserActivity to the database
	 */
	public UserActivity saveUserActivity(UserActivity userActivity);
}

