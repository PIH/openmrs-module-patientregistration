package org.openmrs.module.patientregistration.util;

import java.util.Map;

public class TaskProgress {

	Integer patientId;
	String progressBarImage;
	Map<String, Integer> completedTasks;
	
	
	public TaskProgress() {
	}
	public Integer getPatientId() {
		return patientId;
	}
	public void setPatientId(Integer patientId) {
		this.patientId = patientId;
	}
	public String getProgressBarImage() {
		return progressBarImage;
	}
	public void setProgressBarImage(String progressBarImage) {
		this.progressBarImage = progressBarImage;
	}
	public Map<String, Integer> getCompletedTasks() {
		return completedTasks;
	}
	public void setCompletedTasks(Map<String, Integer> completedTasks) {
		this.completedTasks = completedTasks;
	}
	
	
}
