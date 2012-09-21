/**
 * 
 */
package org.openmrs.module.patientregistration.controller.workflow;

import java.util.Calendar;

import org.junit.Assert;
import org.junit.Test;
import org.openmrs.Patient;
import org.openmrs.PersonName;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.Age;
import org.openmrs.module.patientregistration.Birthdate;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.validation.BindException;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author cospih
 *
 */
public class EnterPatientDemoControllerTest extends  BasePatientRegistrationControllerTest{
	
	@Test
	public void processSelectPatient_shouldRegisterNewPatient() throws Exception{
		
		Patient patient = new Patient();
		PersonName personName = new PersonName();
		personName.setGivenName("John");
		Assert.assertEquals("John", personName.getGivenName());
		
		personName.setFamilyName("Riley");
		patient.addName(personName);
		patient.getPersonName().setPreferred(true);
		//set patient birthdate to March 22, 1984
		Calendar birthdate = Calendar.getInstance();
		birthdate.set(Calendar.YEAR, 1984);
		birthdate.set(Calendar.MONTH, 2);
		birthdate.set(Calendar.DAY_OF_MONTH, 22);
		patient.setBirthdate(birthdate.getTime());
		patient.setGender("M");
		
		EnterPatientDemoController controller = new EnterPatientDemoController();
		Birthdate patientBirthdate = new Birthdate(birthdate.getTime());
		ExtendedModelMap model = new ExtendedModelMap();
		BindException result = new BindException(patient, "patient");
		BindException birthdateResult = new BindException(patientBirthdate, "birthdate");
		BindException ageResult = new BindException(new Age(), "age");
		ModelAndView modelAndView =controller.processSelectPatient(patient, result, patientBirthdate, birthdateResult, null, ageResult, 
				"John", "Riley", "M", "2nd ave,Cange,3me La Hoye,Lascahobas,Centre,Haiti", "7865-0998", 
				null, "no", session, model);
			
		String viewName = modelAndView.getViewName();
		Assert.assertEquals("redirect:/module/patientregistration/workflow/patientDashboard.form?patientId="+patient.getId(), viewName);
		log.debug("viewName="+viewName);
		Patient newPatient = Context.getPatientService().getPatient(patient.getId());
		Assert.assertNotNull(newPatient);
		Assert.assertEquals("Riley", newPatient.getFamilyName());
		
		
	}
}
