package org.openmrs.module.patientregistration.util;

import java.util.Date;

public class DuplicatePatient {

	private Integer patientId;
	private String firstName;
	private String lastName;
	private String gender;
	private Date birthdate;
	private Date personDateCreated;
	private String address1;
	private String cityVillage;
	private String zlEmrId;
	private String dossierNumber;
	private Date firstEncounterDate;
	
	public DuplicatePatient() {
	}

	public Integer getPatientId() {
		return patientId;
	}

	public void setPatientId(Integer patientId) {
		this.patientId = patientId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}

	public Date getPersonDateCreated() {
		return personDateCreated;
	}

	public void setPersonDateCreated(Date personDateCreated) {
		this.personDateCreated = personDateCreated;
	}

	public String getCityVillage() {
		return cityVillage;
	}

	public void setCityVillage(String cityVillage) {
		this.cityVillage = cityVillage;
	}
    
	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getZlEmrId() {
		return zlEmrId;
	}

	public void setZlEmrId(String zlEmrId) {
		this.zlEmrId = zlEmrId;
	}

	public String getDossierNumber() {
		return dossierNumber;
	}

	public void setDossierNumber(String dossierNumber) {
		this.dossierNumber = dossierNumber;
	}

	public Date getFirstEncounterDate() {
		return firstEncounterDate;
	}

	public void setFirstEncounterDate(Date firstEncounterDate) {
		this.firstEncounterDate = firstEncounterDate;
	}
	
	
	
	
	
}
