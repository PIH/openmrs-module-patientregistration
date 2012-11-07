/**
 * 
 */
package org.openmrs.module.patientregistration.controller.workflow;

import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.openmrs.Encounter;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.PersonName;
import org.openmrs.Visit;
import org.openmrs.api.EncounterService;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.module.emr.adt.AdtService;
import org.openmrs.module.patientregistration.Age;
import org.openmrs.module.patientregistration.Birthdate;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.validation.BindException;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpSession;

import static org.openmrs.module.reporting.common.DateUtil.getDateTime;

/**
 * @author cospih
 *
 */
public class EnterPatientDemoControllerTest extends BasePatientRegistrationControllerTest {

    public static final String GIVEN_NAME = "John";
    public static final String FAMILY_NAME = "Riley";
    public static final String GENDER = "M";
    public static final String HIDDEN_PRINT_ID_CARD = "no";
    public static final String UNKNOWN ="UNKNOWN";

    @Autowired
    @Qualifier("adtService")
    private AdtService adtService;

    @Autowired
    @Qualifier("patientService")
    private PatientService patientService;
    
    @Autowired
    @Qualifier("encounterService")
    private EncounterService encounterService;

    @Test
    public void processSelectPatient_shouldRegisterUnknownPatient() throws Exception{
    	   	
    	String task = "edCheckIn";
    	String subTask = "registerJd";
		Location location = Context.getLocationService().getLocation("Emergency");
		PatientRegistrationWebUtil.setRegistrationLocation(session, location);
		PatientRegistrationWebUtil.setRegistrationTask(session, task);
    	 
    	Patient patient = new Patient();
        patient.addName(buildPatientName(UNKNOWN, UNKNOWN));
        patient.getPersonName().setPreferred(true);
		patient.setGender(GENDER);

        Location registrationLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);
        EnterPatientDemoController controller = new EnterPatientDemoController();

        BindException result = new BindException(patient, "patient");
		BindException birthdateResult = new BindException(new Birthdate(), "birthdate");
		BindException ageResult = new BindException(new Age(), "age");

        String patientAddress = "2nd ave,Cange,3me La Hoye,Lascahobas,Centre,Haiti";
        String phoneNumber = "";
        ModelAndView modelAndView =controller.processSelectPatient(patient, result, new Birthdate(), birthdateResult, new Age(), ageResult,
        	UNKNOWN, UNKNOWN, GENDER, patientAddress, phoneNumber,
				null, HIDDEN_PRINT_ID_CARD, subTask, session, new ExtendedModelMap());
			
		String viewName = modelAndView.getViewName();
		Assert.assertEquals("redirect:/module/patientregistration/workflow/patientDashboard.form?patientId=" + patient.getId(), viewName);

        Patient newPatient = patientService.getPatient(patient.getId());
		Assert.assertNotNull(newPatient);
		boolean unknownPatient = PatientRegistrationUtil.isUnknownPatient(patient);
		Assert.assertTrue(unknownPatient);
		Assert.assertEquals(UNKNOWN, newPatient.getFamilyName());

        // make sure we created a visit
        Visit currentVisit = adtService.getActiveVisit(newPatient, registrationLocation);
        Assert.assertNotNull(currentVisit);
        //make sure we created a check-in encounter
        EncounterType encounterType = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_ENCOUNTER_TYPE();
        Assert.assertNotNull(encounterType);
        List<Encounter> checkInEncounters= encounterService.getEncounters(newPatient, location, null, null, null, Arrays.asList(encounterType), null, null, null, false);
        Assert.assertNotNull(checkInEncounters);
        
    }
 
    @Test
	public void processSelectPatient_shouldRegisterNewPatient() throws Exception{

        Date birthdate = getBirthdate();

        Patient patient = new Patient();
        patient.addName(buildPatientName(GIVEN_NAME, FAMILY_NAME));
        patient.getPersonName().setPreferred(true);
        patient.setBirthdate(birthdate);
		patient.setGender(GENDER);

        Birthdate patientBirthdate = new Birthdate(birthdate);

        Location registrationLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);

        EnterPatientDemoController controller = new EnterPatientDemoController();

        BindException result = new BindException(patient, "patient");
		BindException birthdateResult = new BindException(patientBirthdate, "birthdate");
		BindException ageResult = new BindException(new Age(), "age");

        String patientAddress = "2nd ave,Cange,3me La Hoye,Lascahobas,Centre,Haiti";
        String phoneNumber = "7865-0998";
        ModelAndView modelAndView =controller.processSelectPatient(patient, result, patientBirthdate, birthdateResult, null, ageResult,
				GIVEN_NAME, FAMILY_NAME, GENDER, patientAddress, phoneNumber,
				null, HIDDEN_PRINT_ID_CARD, null, session, new ExtendedModelMap());
			
		String viewName = modelAndView.getViewName();
		Assert.assertEquals("redirect:/module/patientregistration/workflow/patientDashboard.form?patientId=" + patient.getId(), viewName);

        Patient newPatient = patientService.getPatient(patient.getId());
		Assert.assertNotNull(newPatient);
		Assert.assertEquals(FAMILY_NAME, newPatient.getFamilyName());

        // make sure we didn't create a visit
        Visit currentVisit = adtService.getActiveVisit(newPatient, registrationLocation);
        Assert.assertNull(currentVisit);
    }

	private PersonName buildPatientName(String givenName, String familyName) {
		PersonName patientName = new PersonName();
		patientName.setGivenName(givenName);
		patientName.setFamilyName(familyName);
		return patientName;
	}
}
