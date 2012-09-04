package org.openmrs.module.patientregistration;

/**
 * Class used to store the fields that represent a person's age
 */
public class Age {

	private Integer years;
	
	private Integer months;
	
	private Integer days;
	
	public Age() {
	}
	
	public Age(Integer years, Integer months, Integer days) {
		this.years = years;
		this.months = months;
		this.days = days;
	}

	
    public Integer getYears() {
    	return years;
    }

	
    public void setYears(Integer years) {
    	this.years = years;
    }

	
    public Integer getMonths() {
    	return months;
    }

	
    public void setMonths(Integer months) {
    	this.months = months;
    }

	
    public Integer getDays() {
    	return days;
    }

	
    public void setDays(Integer days) {
    	this.days = days;
    }
	
    /**
     * Returns true if one or more of the fields contains a value, false otherwise
     */
    public Boolean hasValue() {
    	if ((years == null || years == 0) && (months == null || months == 0) && (days == null || days == 0)) {
    		return false;
    	}
    	else {
    		return true;
    	}
    }
    
    /**
     * Returns true if days have been specified, false otherwise
     */
    public Boolean isExact() {
    	return (days == null ? false : true);
    }
    
    /**
     * Trims an age down to it's most significant parameter, setting other parameters to null
     */
    public void trim() {
    	if (years != null && years != 0) {
    		months = null;
    		days = null;
    	}
    	else if (months !=null && months != 0) {
    		days = null;
    	}
    }
    
}
