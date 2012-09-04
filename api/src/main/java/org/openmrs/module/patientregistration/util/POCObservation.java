package org.openmrs.module.patientregistration.util;

public class POCObservation {

	public static final String CODED =  "CODED";
	public static final String NONCODED ="NON-CODED";
	
	Integer obsId=null;
	Integer id=null;
	String type=null;
	String label=null;
	Integer conceptId=null;
	String conceptName=null;
	Boolean notifiable= null;
	
	
	public POCObservation() {		
	}
	
	public Integer getObsId() {
		return obsId;
	}
	public void setObsId(Integer obsId) {
		this.obsId = obsId;
	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLabel() {
		return label;
	}
	public void setLabel(String label) {
		this.label = label;
	}

	public Integer getConceptId() {
		return conceptId;
	}

	public void setConceptId(Integer conceptId) {
		this.conceptId = conceptId;
	}

	public String getConceptName() {
		return conceptName;
	}

	public void setConceptName(String conceptName) {
		this.conceptName = conceptName;
	}

	public Boolean getNotifiable() {
		return notifiable;
	}

	public void setNotifiable(Boolean notifiable) {
		this.notifiable = notifiable;
	}
	
	
}
