package org.openmrs.module.patientregistration.util;

import java.util.Date;
import java.util.List;

public class PatientDiagnosis implements Comparable<PatientDiagnosis>{

	Integer receptionEncounterId;
	Date receptionEncounterDate;
	boolean today = false;
	Integer year;
	Integer month;
	Integer day;
	List<POCObservation> patientObservation;

	public PatientDiagnosis() {}

	public Integer getReceptionEncounterId() {
		return receptionEncounterId;
	}

	public void setReceptionEncounterId(Integer receptionEncounterId) {
		this.receptionEncounterId = receptionEncounterId;
	}

	public Date getReceptionEncounterDate() {
		return receptionEncounterDate;
	}

	public void setReceptionEncounterDate(Date receptionEncounterDate) {
		this.receptionEncounterDate = receptionEncounterDate;
	}
    
	public boolean isToday() {
		return today;
	}

	public void setToday(boolean today) {
		this.today = today;
	}

	public List<POCObservation> getPatientObservation() {
		return patientObservation;
	}

	public void setPatientObservation(List<POCObservation> patientObservation) {
		this.patientObservation = patientObservation;
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

	public int compareTo(PatientDiagnosis o) {	
		return (o.getReceptionEncounterDate().compareTo(receptionEncounterDate));
	}
	
}
