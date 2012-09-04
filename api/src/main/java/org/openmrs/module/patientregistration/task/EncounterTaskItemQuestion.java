package org.openmrs.module.patientregistration.task;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.openmrs.Concept;
import org.openmrs.ConceptAnswer;
import org.openmrs.ConceptSet;
import org.openmrs.Patient;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;


public class EncounterTaskItemQuestion {

	public static enum Type { SELECT, TEXT, AUTOCOMPLETE, NUMERIC };
	
	/* The label to display when rendering this question */
	private String label;
	
	/* The type of question to render */
	private Type type;
	
	/* The concept associated with the obs this question will create */
	private Concept concept;
	
	/* The potential answers for this question */
	/* Use initializeAnswersFromConceptAnswers method (see below) to set the answers to this question to the answers of the underlying concept */
	private Map<String,String> answers;
		
	/* Minimum allowed value for this question */
	private int minValue;
	
	/* Maximum allowed value for this question */
	private int maxValue;
	
	/* Whether or not this question can be left blank */
	private boolean blankAllowed = false;
	
	
	/**
	 * Constructors
	 */
	public EncounterTaskItemQuestion() {
	}

	/**
	 * Getters and Setters
	 */
    public String getLabel() {
    	return label;
    }
	
    public void setLabel(String label) {
    	this.label = label;
    }

    public Type getType() {
    	return type;
    }
    
    public void setType(Type type) {
    	this.type = type;
    }

	public Concept getConcept() {
	    return concept;
    }

	public void setConcept(Concept concept) {		
	    this.concept = concept;
    }

	public Map<String,String> getAnswers() {
	    return answers;
    }

	public void setAnswers(Map<String,String> answers) {
	    this.answers = answers;
    }
	
	public int getMinValue() {
	    return minValue;
    }

	public void setMinValue(int minValue) {
	    this.minValue = minValue;
    }

	public int getMaxValue() {
	    return maxValue;
    }

	public void setMaxValue(int maxValue) {
	    this.maxValue = maxValue;
    }

	public boolean isBlankAllowed() {
	    return blankAllowed;
    }

	public void setBlankAllowed(boolean blankAllowed) {
	    this.blankAllowed = blankAllowed;
    }
	
	/**
	 * Initialize the answers to this question as the concept answers for the concept tied to this question
	 */
	public void initializeAnswersFromConceptAnswers() {
		Map<String,String> answers = new HashMap<String,String>();
		
		for (ConceptAnswer answer : this.getConcept().getAnswers()) {
			answers.put(answer.getAnswerConcept().getName().getName(), answer.getAnswerConcept().getId().toString());
		}
		
		this.setAnswers(answers);
	}
	
	public void filterAnswers(Patient patient){
		//the neonatal diseases are really not possible after 28 days (this is the WHO standard)
		if(patient!=null && (PatientRegistrationUtil.getAgeInDays(patient.getBirthdate(), null)>=28) && this.answers!=null && (this.answers.size()>0)){
			Concept neonatalConcept = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_VISIT_NEONATAL_DISEASES_CONCEPT();
			if(neonatalConcept!=null){
				List<ConceptSet> convSet =Context.getConceptService().getConceptSetsByConcept(neonatalConcept);
				if(convSet!=null && (convSet.size()>0)){			
					Map<String, String> filteredAnswers = new HashMap<String, String>();
					for(String answerName : answers.keySet()){
						String answerId = answers.get(answerName);
						boolean addAnswer = true;
						for(ConceptSet cs : convSet){
							if(StringUtils.equals(answerId,cs.getConcept().getId().toString())){
								addAnswer = false;
								break;
							}
						}
											
						if(addAnswer){
							filteredAnswers.put(answerName, answerId);
						}
					}
					if(filteredAnswers.size() >0){
						this.setAnswers(filteredAnswers);
					}
					
				}
			}
		}
		this.setAnswers(answers);
	}
}
