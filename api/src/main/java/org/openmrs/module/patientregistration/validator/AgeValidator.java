package org.openmrs.module.patientregistration.validator;

import org.openmrs.module.patientregistration.Age;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

/**
 * Validator for the Age class
 */
public class AgeValidator implements Validator{

	/**
	 * Returns whether or not this validator supports validating a given class.
	 * 
	 * @param c The class to check for support.
	 * @see org.springframework.validation.Validator#supports(java.lang.Class)
	 */

	public boolean supports(@SuppressWarnings("rawtypes") Class c) {
		return Age.class.isAssignableFrom(c);
	}
	
	/**
	 * Validates the given Age
	 * 
	 * @param obj The patient to validate.
	 * @see org.springframework.validation.Validator#validate(java.lang.Object,
	 *      org.springframework.validation.Errors)
	 */
	public void validate(Object obj, Errors errors) {
		Age age = (Age) obj;
		
		// make sure the years is reasonable
		if (age.getYears() != null && age.getYears() > 130) {
			errors.rejectValue("years", "patientregistration.age.year.tooHigh");
		}
		
		// make sure none of the values are negative
		if ((age.getYears() != null && age.getYears() < 0) ||
			(age.getMonths() != null && age.getMonths() < 0) || 
			(age.getDays() != null && age.getDays() < 0)) {
			errors.reject("patientregistration.age.cantBeNegative");
		}	
	}
}
