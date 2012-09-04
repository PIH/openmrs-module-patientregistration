package org.openmrs.module.patientregistration;

import java.util.Calendar;
import java.util.Date;

/**
 * Class used to store a birthdate in day/month/year format
 */
public class Birthdate {
	
	public Integer year;
	
	public Integer month;
	
	public Integer day;
	
	public Boolean yearUnknown;
	
	public Boolean monthUnknown;
	
	public Boolean dayUnknown;
	
	public Birthdate() {
	}
	
	public Birthdate(Date date) {
		// given a Date, create a Birthdate object that represents that date
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		
		this.year = c.get(Calendar.YEAR);
		this.month = c.get(Calendar.MONTH);
		this.day = c.get(Calendar.DAY_OF_MONTH);
	}
	
    public Integer getYear() {
    	return year;
    }

	
    public void setYear(Integer year) {
    	this.year = year;
    }

	
    public Integer getMonth() {
    	return month;
    }

	
    public void setMonth(Integer month) {
    	this.month = month;
    }

	
    public Integer getDay() {
    	return day;
    }

	
    public void setDay(Integer day) {
    	this.day = day;
    }

    
    public Boolean getYearUnknown() {
    	return yearUnknown;
    }

	
    public void setYearUnknown(Boolean yearUnknown) {
    	this.yearUnknown = yearUnknown;
    }

	
    public Boolean getMonthUnknown() {
    	return monthUnknown;
    }

	
    public void setMonthUnknown(Boolean monthUnknown) {
    	this.monthUnknown = monthUnknown;
    }

	
    public Boolean getDayUnknown() {
    	return dayUnknown;
    }

	
    public void setDayUnknown(Boolean dayUnknown) {
    	this.dayUnknown = dayUnknown;
    }

	/**
     * Returns true if one or more year/month/day fields contains a value, false otherwise
     */
    public Boolean hasValue() {
    	if ((year == null || year == 0) && (month == null || month == 0) && (day == null || day == 0)) {
    		return false;
    	}
    	else {
    		return true;
    	}
    }
    
    /**
     * Returns true if all the fields have a value, false otherwise
     */
    public Boolean isExact() {
    	return (year != null && month != null && day != null ? true : false);
    }
     
    /**
     * Returns the date represented by the Birthdate as a Date object
     * If the month and day are unknown, set the date returned to June 1st
     * If just the day is unknown, set the day returned to the 15th
     */
	public Date asDateObject() {
		Calendar c = Calendar.getInstance();
		c.set(Calendar.YEAR, year);
		c.set(Calendar.MONTH, monthUnknown != null && monthUnknown ? new Integer(6) : month);
		c.set(Calendar.DAY_OF_MONTH, monthUnknown != null && monthUnknown ? new Integer(1) : (dayUnknown != null && dayUnknown ? new Integer(15) : day));
		
		return c.getTime();
	}
	
}
