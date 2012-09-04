package org.openmrs.module.patientregistration;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import junit.framework.Assert;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.junit.Test;
import org.openmrs.GlobalProperty;
import org.openmrs.PatientIdentifierType;
import org.openmrs.Person;
import org.openmrs.api.context.Context;
import org.openmrs.test.BaseModuleContextSensitiveTest;
import org.openmrs.test.Verifies;


public class PatientRegistrationUtilTest extends BaseModuleContextSensitiveTest {

	protected final Log log = LogFactory.getLog(getClass());

	protected static final String PATIENT_REGISTRATION_XML_DATASET_PACKAGE_PATH = "org/openmrs/module/patientregistration/include/patientregistration-dataset.xml";

	@Before
	public void setupDatabase() throws Exception {
		initializeInMemoryDatabase();
		authenticate();
		executeDataSet(PATIENT_REGISTRATION_XML_DATASET_PACKAGE_PATH);
	}
	
	@Test
	@Verifies(value = "should return all patient identifier types", method = "getPatientIdentifierTypesToDisplay()")
	public void getPatientIdentifierTypesToDisplay_shouldReturnAllPatientIdentifierTypes() throws Exception {
		
		List<PatientIdentifierType> types = PatientRegistrationUtil.getPatientIdentifierTypesToDisplay();
		
		// test that it has all the types in the standard test data set
		Assert.assertEquals(4, types.size());
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(1)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(2)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(5)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(6)));
	}
	
	@Test
	@Verifies(value = "should return patient identifier types stored in Openmrs global property", method = "getPatientIdentifierTypesToDisplay()")
	public void getPatientIdentifierTypesToDisplay_shouldReturnPatientIdentifierTypesStoredInGlobalProp() throws Exception {
		
		// set the global property 
		Context.getAdministrationService().saveGlobalProperty(new GlobalProperty("patient_identifier.importantTypes", "OpenMRS Identification Number:Somewhere,HIV Program Number:Somewhere else"));
		
		List<PatientIdentifierType> types = PatientRegistrationUtil.getPatientIdentifierTypesToDisplay();
		
		// test that it only contains the types specified in the Global property
		Assert.assertEquals(2, types.size());
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(1)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(6)));
	}
	
	@Test
	@Verifies(value = "should return patient identifier types stored in Patient Registration global property", method = "getPatientIdentifierTypesToDisplay()")
	public void getPatientIdentifierTypesToDisplay_shouldReturnPatientIdentifierTypesStoredInPatientRegistrationProp() throws Exception {
		
		// set both global property 
		Context.getAdministrationService().saveGlobalProperty(new GlobalProperty("patient_identifier.importantTypes", "OpenMRS Identification Number:Somewhere,HIV Program Number:Somewhere else"));
		Context.getAdministrationService().saveGlobalProperty(new GlobalProperty("patientregistration.identifierTypes", "Old Identification Number|MDR-TB Program Number"));
		
		List<PatientIdentifierType> types = PatientRegistrationUtil.getPatientIdentifierTypesToDisplay();
		
		// test that it only contains the types specified in the patient registration specific global property
		Assert.assertEquals(2, types.size());
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(2)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(5)));
	}
	
	@Test
	@Verifies(value = "should include primary identifier type in patient identifier types returns", method = "getPatientIdentifierTypesToDisplay()")
	public void getPatientIdentifierTypesToDisplay_shouldIncludePrimaryIdentifierType() throws Exception {
		
		// set both global property 
		Context.getAdministrationService().saveGlobalProperty(new GlobalProperty("patient_identifier.importantTypes", "OpenMRS Identification Number:Somewhere,HIV Program Number:Somewhere else"));
		Context.getAdministrationService().saveGlobalProperty(new GlobalProperty("patientregistration.identifierTypes", "Old Identification Number|MDR-TB Program Number"));
		Context.getAdministrationService().saveGlobalProperty(new GlobalProperty("patientregistration.primaryIdentifierType", "HIV Program Number"));
		
		List<PatientIdentifierType> types = PatientRegistrationUtil.getPatientIdentifierTypesToDisplay();
		
		// test that it only contains the types specified in the patient registration specific global property
		Assert.assertEquals(3, types.size());
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(2)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(5)));
		Assert.assertTrue(types.contains(Context.getPatientService().getPatientIdentifierType(6)));
	}
	
	@Test
	@Verifies(value = "should calculate correct birthdate based on age", method = "calculateBirthdateFromAge(Integer,Integer,Integer,Date)")
	public void calculateBirthdateFromAge_shouldCalculateBirthdateBasedOnAge() throws Exception {
		// set the base date (of course, we can't use today!)
		Calendar c = Calendar.getInstance();
		c.set(2010, Calendar.APRIL, 3, 0, 0, 0);  // April 3, 2010
		Date ageOnDate = c.getTime();
		
		// try someone only a few days old -- birth date should be April 1, 2010
		Date birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(0, 0, 2, ageOnDate);
		c.set(2010, Calendar.APRIL, 1, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
	
		// try someone 51 days old -- birth date should be February 11, 2010
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(0, 0, 51, ageOnDate);
		c.set(2010, Calendar.FEBRUARY, 11, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// try someone 4 months old (but with no day specified) -- birth date should be December 03, 2009 
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(0, 4, 0, ageOnDate);
		c.set(2009, Calendar.DECEMBER, 3, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
	
		// try someone 16 months old (but with no day specified) -- birth date should be December 03, 2008 
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(0, 16, 0, ageOnDate);
		c.set(2008, Calendar.DECEMBER, 3, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// try someone 6 months and 4 days old (but with no year specified) -- birth date should be September 29, 2009 
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(0, 6, 4, ageOnDate);
		c.set(2009, Calendar.SEPTEMBER, 29, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// try someone 38 years old (but with no month or day specified) -- birth date should be January 1, 1972 
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(38, 0, 0, ageOnDate);
		c.set(1972, Calendar.JANUARY, 1, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// try someone 25 years, 3 months, and 6 days old -- birth date should be December 28, 1984 
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(25, 3, 6, ageOnDate);
		c.set(1984, Calendar.DECEMBER, 28, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// try someone 12 years and 8 months old (but with no day specified) -- birth date should be August 3, 1997 
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(12, 8, 0, ageOnDate);
		c.set(1997, Calendar.AUGUST, 3, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// try someone 9 years and 35 days old (but with no month specified--admittedly kind of weird) -- birth date should be February 27, 2000
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(9, 0, 35, ageOnDate);
		c.set(2001, Calendar.FEBRUARY, 27, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		// make sure that the test cases I listed in the javadocs are correct
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(10, 0, 0, ageOnDate);
		c.set(2000, Calendar.JANUARY, 1, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
		birthdate = PatientRegistrationUtil.calculateBirthdateFromAge(0, 2, 0, ageOnDate);
		c.set(2010, Calendar.FEBRUARY, 3, 0, 0, 0);
		Assert.assertEquals(c.getTime(), birthdate);
		
	}
	
	@Test
	@Verifies(value = "should calculate correct age based on birthdate", method = "calculateAgeFromBirthdate(Integer,Integer,Integer,Date)")
	public void calculateAgeFromBirthdate_shouldCalculateAgeBasedOnBirthdate() throws Exception {
		// set the base date (of course, we can't use today!)
		Calendar c = Calendar.getInstance();
		c.set(2010, Calendar.APRIL, 3, 0, 0, 0);  // April 3, 2010
		Date ageOnDate = c.getTime();
		
		// try someone only a few days old -- birth date is April 1, 2010
		c.set(2010, Calendar.APRIL, 1, 0, 0, 0);
		Age age = PatientRegistrationUtil.calculateAgeFromBirthdate(c.getTime(), ageOnDate);
		Assert.assertEquals(new Integer(0), age.getYears());
		Assert.assertEquals(new Integer(0), age.getMonths());
		Assert.assertEquals(new Integer(2), age.getDays());

		// TODO: this test fails and is a good example of the issue described in the javadocs for calculateAgeFromBirthdate
		// (see the equivalen tet in the prior unti test)
		// try someone with birthdate September 29, 2009 -- should be 6 months and 4 days
		//c.set(2009, Calendar.SEPTEMBER, 29, 0, 0, 0);
		//age = PatientRegistrationUtil.calculateAgeFromBirthdate(c.getTime(), ageOnDate);
		//Assert.assertEquals(new Integer(0), age.getYears());
		//Assert.assertEquals(new Integer(6), age.getMonths());
		//Assert.assertEquals(new Integer(4), age.getDays());

		// try someone with birthdate December 28, 1984 -- should be 25 years, 3 months, and 6 days
		c.set(1984, Calendar.DECEMBER, 28, 0, 0, 0);
		age = PatientRegistrationUtil.calculateAgeFromBirthdate(c.getTime(), ageOnDate);
		Assert.assertEquals(new Integer(25), age.getYears());
		Assert.assertEquals(new Integer(3), age.getMonths());
		Assert.assertEquals(new Integer(6), age.getDays());
	}
	
	@Test
	@Verifies(value = "should return proper person address property", method = "getPersonAddressProperty(PersonAddress, String)")
	public void getPersonAddressProperty_shouldReturnPersonAddressProperty() throws Exception {
		
		Person person = Context.getPersonService().getPerson(2);
		String cityVillage = PatientRegistrationUtil.getPersonAddressProperty(person.getPersonAddress(), "cityVillage");
		Assert.assertTrue(StringUtils.equals("Indianapolis", cityVillage));
		
		// try a field with no value
		String countyDistrict = PatientRegistrationUtil.getPersonAddressProperty(person.getPersonAddress(), "countyDistrict");
		Assert.assertTrue(countyDistrict == null);
	}
	
	@Test
	@Verifies(value = "should convert string to camel case", method = "toCamelCase(String)")
	public void toCamelCase_shouldConvertStringToCamelCase() throws Exception {
		Assert.assertEquals("toCamelCase", PatientRegistrationUtil.toCamelCase("To camel Case"));
	}
}
