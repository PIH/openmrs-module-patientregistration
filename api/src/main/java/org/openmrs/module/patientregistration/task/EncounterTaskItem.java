package org.openmrs.module.patientregistration.task;

import java.util.Date;
import java.util.List;

import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Person;


public class EncounterTaskItem {
	
	public static enum Mode { CREATE, EDIT };
	
	/* Whether this is a task to "Create" an encounter or to "Edit" an encounter */
	// TODO: edit mode not currently implemented
	private Mode mode;
	
	/* Default Encounter Date */
	private Date encounterDate;
	
	/* In create mode, whether or not to display date selection widget as part of workflow */
	/* In edit mode, whether or not the encounter date is editable */
	private Boolean encounterDateEditable;
	
	/* Default Encounter Provider */
	private Person encounterProvider;
	
	/* In create mode, whether or not to display provider selection widget as part of the workflow */
	/* In edit mode, whether not the encounter provider is editable */
	private Boolean encounterProviderEditable;
	
	/* Default Encounter Location */
	private Location encounterLocation;
	
	/* In create mode, whether or not to display location selection widget as part of the workflow */
	/* In edit mode, whether or not the encounter location is editable */
	private Boolean encounterLocationEditable;
	
	/* Default Encounter Type */
	private EncounterType encounterType;
	
	/* In create mode, whether or not to display the encounter type selection widget as part of the workflow */
	/* In edit mode, whether or not the encounter type is editable */
	private Boolean encounterTypeEditable;
	
	/* The list of questions to be asked on this form (not including encounter date, location, provider & type) */
	private List<EncounterTaskItemQuestion> questions;
	
	/* Whether or not to display the confirm details page at the end of the workflow */
	// TODO: not currently functioning
	private Boolean confirmDetails;

	/* URL to go to if we back out of this task */
	// TODO: does this belong here?  Should this be extracted into a generic "web" task item?
	private String backUrl;
	
	/* URL to go to when this tast completes successful */
	// TODO: does this belong here?
	private String successUrl;
	
	
	/**
	 * Generic constructor
	 */
	
	public EncounterTaskItem() {
    }

	
	/**
	 * Getters and Setters
	 */

    public Mode getMode() {
	    return mode;
    }


	public void setMode(Mode mode) {
	    this.mode = mode;
    }


	public Date getEncounterDate() {
    	return encounterDate;
    }

	
    public void setEncounterDate(Date encounterDate) {
    	this.encounterDate = encounterDate;
    }

	
    public Boolean getEncounterDateEditable() {
    	return encounterDateEditable;
    }

	
    public void setEncounterDateEditable(Boolean encounterDateEditable) {
    	this.encounterDateEditable = encounterDateEditable;
    }

	
    public Person getEncounterProvider() {
    	return encounterProvider;
    }

	
    public void setEncounterProvider(Person encounterProvider) {
    	this.encounterProvider = encounterProvider;
    }

	
    public Boolean getEncounterProviderEditable() {
    	return encounterProviderEditable;
    }

	
    public void setEncounterProviderEditable(Boolean encounterProviderEditable) {
    	this.encounterProviderEditable = encounterProviderEditable;
    }

	
    public Location getEncounterLocation() {
    	return encounterLocation;
    }

	
    public void setEncounterLocation(Location encounterLocation) {
    	this.encounterLocation = encounterLocation;
    }

	
    public Boolean getEncounterLocationEditable() {
    	return encounterLocationEditable;
    }

	
    public void setEncounterLocationEditable(Boolean encounterLocationEditable) {
    	this.encounterLocationEditable = encounterLocationEditable;
    }

    
	public EncounterType getEncounterType() {
	    return encounterType;
    }


	public void setEncounterType(EncounterType encounterType) {
	    this.encounterType = encounterType;
    }


	public Boolean getEncounterTypeEditable() {
	    return encounterTypeEditable;
    }


	public void setEncounterTypeEditable(Boolean encounterTypeEditable) {
	    this.encounterTypeEditable = encounterTypeEditable;
    }

    public List<EncounterTaskItemQuestion> getQuestions() {
	    return questions;
    }


	public void setQuestions(List<EncounterTaskItemQuestion> questions) {
	    this.questions = questions;
    }


	public Boolean getConfirmDetails() {
    	return confirmDetails;
    }

	
    public void setConfirmDetails(Boolean confirmDetails) {
    	this.confirmDetails = confirmDetails;
    }


	public String getBackUrl() {
	    return backUrl;
    }


	public void setBackUrl(String backUrl) {
	    this.backUrl = backUrl;
    }


	public String getSuccessUrl() {
	    return successUrl;
    }


	public void setSuccessUrl(String successUrl) {
	    this.successUrl = successUrl;
    }
	
	
}
