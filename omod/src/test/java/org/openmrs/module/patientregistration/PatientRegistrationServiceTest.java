package org.openmrs.module.patientregistration;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import junit.framework.Assert;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.Person;
import org.openmrs.PersonName;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.openmrs.test.Verifies;


public class PatientRegistrationServiceTest extends BaseModuleContextSensitiveTest {
	
	protected final Log log = LogFactory.getLog(getClass());
	
	protected static final String PATIENT_REGISTRATION_XML_DATASET_PACKAGE_PATH = "org/openmrs/module/patientregistration/include/patientregistration-dataset.xml";


	@Before
	public void beforeEachTest() throws Exception {
		executeDataSet(PATIENT_REGISTRATION_XML_DATASET_PACKAGE_PATH);
	}
	
	@Ignore("on bamboo this fails with Already value [org.springframework.orm.hibernate3.SessionHolder@4d049ddf] for key [org.hibernate.impl.SessionFactoryImpl@6ce61eb5] bound to thread [main]")
	@Test
	@Verifies(value = "should create registration encounter", method = "registerPatient(Patient patient, Person provider, EncounterType encounterType, Location location)")
	public void registerPatient_shouldRegisterPatient() throws Exception {
		
		Patient patient = Context.getPatientService().getPatient(2);
		EncounterType registration = Context.getEncounterService().getEncounterType(10);
		Location location = Context.getLocationService().getLocation(2);
		Person person = Context.getPersonService().getPerson(2);
		
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location);
		
		// confirm that this patient now has a registration encounter
		Assert.assertEquals(1, Context.getEncounterService().getEncounters(patient, location, null, null, null, Arrays.asList(registration), null, false).size());
		
	}
	
	@Test
	@Verifies(value = "should not create two registration encounters", method = "registerPatient(Patient patient, Person provider, EncounterType encounterType, Location location)")
	public void registerPatient_shouldNotCreateTwoRegistrationEncounters() throws Exception {
		
		Patient patient = Context.getPatientService().getPatient(2);
		EncounterType registration = Context.getEncounterService().getEncounterType(10);
		Location location = Context.getLocationService().getLocation(2);
		Person person = Context.getPersonService().getPerson(2);
		
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location);
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location);
		
		// confirm that this patient still only has one encounter
		Assert.assertEquals(1, Context.getEncounterService().getEncounters(patient, location, null, null, null, Arrays.asList(registration), null, false).size());
		
	}
	
	@Test
	@Verifies(value = "should create two registration encounters at different locations", method = "registerPatient(Patient patient, Person provider, EncounterType encounterType, Location location)")
	public void registerPatient_shouldCreateTwoRegistrationEncountersAtDifferentLocations() throws Exception {
		
		Patient patient = Context.getPatientService().getPatient(2);
		EncounterType registration = Context.getEncounterService().getEncounterType(10);
		Location location2 = Context.getLocationService().getLocation(2);
		Location location3 = Context.getLocationService().getLocation(3);
		Person person = Context.getPersonService().getPerson(2);
		
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location2);
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location3);
		
		// confirm that this patient now has two registration encounter
		Assert.assertEquals(2, Context.getEncounterService().getEncounters(patient, null, null, null, null, Arrays.asList(registration), null, false).size());	

	}
	
	@Test
	@Verifies(value = "should create two registration encounters on different days", method = "registerPatient(Patient patient, Person provider, EncounterType encounterType, Location location, Date registrationDate)")
	public void registerPatient_shouldCreateTwoRegistrationEncountersOnDifferentDays() throws Exception {
		
		Patient patient = Context.getPatientService().getPatient(2);
		EncounterType registration = Context.getEncounterService().getEncounterType(10);
		Location location = Context.getLocationService().getLocation(2);
		Person person = Context.getPersonService().getPerson(2);
		
		Calendar yesterday = Calendar.getInstance();
		yesterday.setTime(new Date());
		yesterday.add(Calendar.DAY_OF_MONTH, -1);
		
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location);
		Context.getService(PatientRegistrationService.class).registerPatient(patient, person, registration, location, yesterday.getTime());
		
		// confirm that this patient has two registration encounters
		Assert.assertEquals(2, Context.getEncounterService().getEncounters(patient, location, null, null, null, Arrays.asList(registration), null, false).size());
		
	}
	
	@Test
	@Verifies(value = "patient search should return empty list when passed empty PersonName object", method = "search(Person personName)")
	public void search_shouldReturnEmptyListWhenPassedEmptyPersonNameObject() throws Exception {
		PersonName name = new PersonName();
		
		List<Patient> patients = Context.getService(PatientRegistrationService.class).search(name);
		
		Assert.assertEquals(0, patients.size());
		
	}
	
	@Test
	@Verifies(value = "should search patient", method = "search(PersonName personName)")
	public void search_shouldReturnPatientList() throws Exception {
		
		PersonName personName=new PersonName("Ion", null, "Popa");
		//personName.setGivenName("Ion");
		//personName.setFamilyName("Popa");
		List<Patient> patientList = Context.getService(PatientRegistrationService.class).search(personName);
		if(patientList !=null && patientList.size()>0){
			for(Patient patient : patientList){
				log.debug("patient.getGivenName()=" + patient.getGivenName());
				log.debug("patient.getFamilyName()=" + patient.getFamilyName());
			}
			//Log.debug(message)
		}
		
		Assert.assertEquals(0, patientList.size());		
	}
	
	@Test
	@Verifies(value = "patient search should return empty list when passed empty Patient object", method = "search(Patient patient)")
	public void search_shouldReturnEmptyListWhenPassedEmptyPatientObject() throws Exception {
		Patient patient = new Patient();
		
		List<Patient> patients = Context.getService(PatientRegistrationService.class).search(patient);
		
		Assert.assertEquals(0, patients.size());
		
	}
	
}
