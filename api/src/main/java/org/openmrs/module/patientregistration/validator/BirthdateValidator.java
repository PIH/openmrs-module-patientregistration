package org.openmrs.module.patientregistration.validator;

import java.util.Calendar;

import org.openmrs.module.patientregistration.Birthdate;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;


/**
 * Validator for the birhthdate class
 */
public class BirthdateValidator implements Validator {

	/**
	 * Returns whether or not this validator supports validating a given class.
	 * 
	 * @param c The class to check for support.
	 * @see org.springframework.validation.Validator#supports(java.lang.Class)
	 */

	public boolean supports(@SuppressWarnings("rawtypes") Class c) {
		return Birthdate.class.isAssignableFrom(c);
	}
	
	/**
	 * Validates the given Birthdate. 
	 * 
	 * @param obj The patient to validate.
	 * @see org.springframework.validation.Validator#validate(java.lang.Object,
	 *      org.springframework.validation.Errors)
	 */
	public void validate(Object obj, Errors errors) {
		Birthdate birthdate = (Birthdate) obj;

		// make sure that none of the fields have a value but also have the unknown checkbox checked
		if (birthdate.getYear() != null && birthdate.getYearUnknown() != null && birthdate.getYearUnknown()) {
			errors.rejectValue("year","patientregistration.birthdate.year.markedUnknownButHasValue");
		}
		if (birthdate.getMonth() != null && birthdate.getMonthUnknown() != null && birthdate.getMonthUnknown()) {
			errors.rejectValue("year","patientregistration.birthdate.month.markedUnknownButHasValue");
		}
		if (birthdate.getDay() != null && birthdate.getDayUnknown() != null && birthdate.getDayUnknown()) {
			errors.rejectValue("year","patientregistration.birthdate.day.markedUnknownButHasValue");
		}
		
		// make sure a year has been specified
		if (birthdate.getYear() == null) {
			errors.rejectValue("year","patientregistration.birthdate.year.missing");
		}
		
		// make sure a month has been specified or has been marked unknown
		if (birthdate.getMonth() == null && (birthdate.getMonthUnknown() == null || !birthdate.getMonthUnknown())) {
			errors.rejectValue("year","patientregistration.birthdate.month.missing");
		}
		
		// make sure a day has been specified or has been marked unknown
		if (birthdate.getDay() == null && (birthdate.getDayUnknown() == null  || !birthdate.getDayUnknown())) {
			errors.rejectValue("year","patientregistration.birthdate.day.missing");
		}
		// make sure if a day is specified that the month is also specified
		if (birthdate.getDay() != null && birthdate.getMonth() == null) {
			errors.rejectValue("month","patientregistration.birthdate.month.markedUnknownButDayNotMarkedUnknown");
		}
		
		// make sure the year is valid
		if (birthdate.getYear() != null && (birthdate.getYear() < 1900 || birthdate.getYear() > 2050)) {
			errors.rejectValue("year", "patientregistration.birthdate.year.invalid");
		}
		
		// make sure the month is valid
		if (birthdate.getMonth() != null) {
			if (birthdate.getMonth() < 0|| birthdate.getMonth() > 11) {
				errors.rejectValue("year", "patientregistration.birthdate.month.invalid");
			}
		}
		
		// make sure the day is valid
		if (birthdate.getDay() != null && birthdate.getMonth() != null && birthdate.getYear() != null) {
			
			// we set a calendar to the year/month so that we can determine the valid day for this month (i.e, for Jan, 1 thru 31)
			Calendar c = Calendar.getInstance();
			c.set(Calendar.YEAR, birthdate.getYear());
			c.set(Calendar.MONTH, birthdate.getMonth());
			
			if (birthdate.getDay() < c.getActualMinimum(Calendar.DAY_OF_MONTH)|| birthdate.getDay() > c.getActualMaximum(Calendar.DAY_OF_MONTH)) {
				errors.rejectValue("year", "patientregistration.birthdate.day.invalid");
			}
		}
			
		// make sure the date isn't in the future
		if (birthdate.getYear() != null) {
			if (birthdate.getYear() > Calendar.getInstance().get(Calendar.YEAR)) {
				errors.rejectValue("year","patientregistration.birthdate.future");
			}
			else if (birthdate.getMonth() != null) {
				if (birthdate.getYear() == Calendar.getInstance().get(Calendar.YEAR) && birthdate.getMonth() > Calendar.getInstance().get(Calendar.MONTH)) {
					errors.rejectValue("year","patientregistration.birthdate.future");
				}
				else if (birthdate.getDay() != null) {
					if (birthdate.getYear() == Calendar.getInstance().get(Calendar.YEAR) && birthdate.getMonth() == Calendar.getInstance().get(Calendar.MONTH) 
							&& birthdate.getDay() > Calendar.getInstance().get(Calendar.DAY_OF_MONTH)) {
						errors.rejectValue("year","patientregistration.birthdate.future");
					}
				}
			}
		}
	}
}
