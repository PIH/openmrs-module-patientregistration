package org.openmrs.module.patientregistration;

import java.util.Date;
import java.util.UUID;

import org.openmrs.BaseOpenmrsObject;
import org.openmrs.Location;
import org.openmrs.User;
import org.openmrs.api.context.Context;

/**
 * Represents a single user activity
 */
public class UserActivity extends BaseOpenmrsObject {
	
	//***** PROPERTIES *****

	private Integer id;
	private User user;
	private Date activityDatetime;
	private String activity;
	private String activityGroup;
	private String task;
	private Location location;
	private String extraInfo;
	private String sessionId;
	private String ipAddress;
	
	//*****  CONSTRUCTORS ******
	
	/**
	 * Empty constructor for use with sync
	 */
	public UserActivity() {
		
	}
	
	/**
	 * Default constructor
	 */	
	public UserActivity(String activity) {
		setUuid(UUID.randomUUID().toString());
		this.user = Context.getAuthenticatedUser();
		this.activityDatetime = new Date();
		this.activity = activity;
	}
	
	//*****  INSTANCE METHODS ******

	/**
	 * @see Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder(activityDatetime + "|" + user.getUsername() + "|" + activity);
		if (task != null) {
			sb.append("|" + task);
		}
		if (location != null) {
			sb.append("|" + location);
		}
		if (sessionId != null) {
			sb.append("|" + sessionId);
		}
		if (ipAddress != null) {
			sb.append("|" + ipAddress);
		}
		return sb.toString();
	}
	
	/**
	 * @see Object#equals(Object)
	 */
	public boolean equals(Object o) {
		UserActivity other = (UserActivity) o;
		if (getUuid() == null || other.getUuid() == null) {
			return this == other;
		} 
		else {
			return getUuid().equals(other.getUuid());
		}
	}
	
	/**
	 * @see Object#hashCode()
	 */
	public int hashCode() {
		return (getUuid() == null ? super.hashCode() : getUuid().hashCode());
	}
	
	//*****  PROPERTY ACCESS ******

	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}

	/**
	 * @param id the id to set
	 */
	public void setId(Integer id) {
		this.id = id;
	}
	
	/**
	 * @return the user
	 */
	public User getUser() {
		return user;
	}

	/**
	 * @param user the user to set
	 */
	public void setUser(User user) {
		this.user = user;
	}

	/**
	 * @return the activityDatetime
	 */
	public Date getEventDatetime() {
		return activityDatetime;
	}

	/**
	 * @param activityDatetime the activityDatetime to set
	 */
	public void setEventDatetime(Date activityDatetime) {
		this.activityDatetime = activityDatetime;
	}

	/**
	 * @return the activityDatetime
	 */
	public Date getActivityDatetime() {
		return activityDatetime;
	}

	/**
	 * @param activityDatetime the activityDatetime to set
	 */
	public void setActivityDatetime(Date activityDatetime) {
		this.activityDatetime = activityDatetime;
	}

	/**
	 * @return the activity
	 */
	public String getActivity() {
		return activity;
	}

	/**
	 * @param activity the activity to set
	 */
	public void setActivity(String activity) {
		this.activity = activity;
	}

	/**
	 * @return the task
	 */
	public String getTask() {
		return task;
	}

	/**
	 * @param task the task to set
	 */
	public void setTask(String task) {
		this.task = task;
	}

	/**
	 * @return the location
	 */
	public Location getLocation() {
		return location;
	}

	/**
	 * @param location the location to set
	 */
	public void setLocation(Location location) {
		this.location = location;
	}

	/**
	 * @return the activityGroup
	 */
	public String getActivityGroup() {
		return activityGroup;
	}

	/**
	 * @param activityGroup the activityGroup to set
	 */
	public void setActivityGroup(String activityGroup) {
		this.activityGroup = activityGroup;
	}

	/**
	 * @return the extraInfo
	 */
	public String getExtraInfo() {
		return extraInfo;
	}

	/**
	 * @param extraInfo the extraInfo to set
	 */
	public void setExtraInfo(String extraInfo) {
		this.extraInfo = extraInfo;
	}

	/**
	 * @return the sessionId
	 */
	public String getSessionId() {
		return sessionId;
	}

	/**
	 * @param sessionId the sessionId to set
	 */
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	/**
	 * @return the ipAddress
	 */
	public String getIpAddress() {
		return ipAddress;
	}

	/**
	 * @param ipAddress the ipAddress to set
	 */
	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}
}
