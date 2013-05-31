package org.openmrs.module.patientregistration;


public class PatientRegistrationConstants {

	// the default class to use for a patient search if search class global property is blank
    public static final String DEFAULT_SEARCH_CLASS = "org.openmrs.module.patientregistration.search.DefaultPatientRegistrationSearch";
   
    public static final String MODULE_NAME = "patientregistration";
    // i18n messages to be used in the java script
    public static final String JSCRIPT_MESSAGES = "patientregistration.jMessages.";
    // i18n tooltip messages to be used in the java script
    public static final String JSCRIPT_TOOLTIP = "patientregistration.toolTip.";
    
	// date formats for display and input
    public static final String DATE_FORMAT_DISPLAY = "dd/MMM/yyyy";
	public static final String DATE_FORMAT_INPUT = "dd/MM/yyyy";
	
	public static final String REGISTRATION_PATIENT= "registration_patient";	
	public static final String REGISTRATION_PATIENT_GENDER= "registration_patientGender";
	public static final String WORKFLOW_FIRST_PAGE= "redirect:/module/patientregistration/workflow/selectLocationAndService.form";

	public static final String SESSION_REGISTRATION_TASK = "registration_task";
	public static final String SESSION_TASK_GROUP = "registration_task_group";
	public static final String SESSION_TASK_PROGRESS = "task_progress";
	public static final String NUMERO_DOSSIER = "numeroDossier";
    public static final String EXTERNAL_NUMERO_DOSSIER = "externalNumeroDossier";
	public static final String RETROSPECTIVE_TASK = "retrospectiveEntry";
	public static final String REGISTER_JOHN_DOE_TASK = "registerJd";
    public static final String EMERGENCY_DEPARTMENT_TASK = "edCheckIn";
	
	public static final String RETROSPECTIVE_PROGRESS_1_IMG = "progress-1.png";
	public static final String RETROSPECTIVE_PROGRESS_2_IMG = "progress-2.png";
	public static final String RETROSPECTIVE_PROGRESS_3_IMG = "progress-3.png";
	public static final String RETROSPECTIVE_PROGRESS_4_IMG = "progress-4.png";
	
	public static final String POC_CONFIGURATION_FILE = "poc_config.xml";
	public static final String FALSE_DUPLICATES_MAP = "falseDuplicatesMap";
	public static final String PATIENT_DUPLICATES_MAP = "patientDuplicatesMap";
	
	public static final String UNKNOWN_PATIENT_PERSON_ATTRIBUTE_TYPE_NAME="Unknown patient";
	
	// user activities that are logged
	
	public static final String ACTIVITY_REGISTRATION_LOCATION_CHANGED = "Registration Location Changed";
	public static final String ACTIVITY_REGISTRATION_TASK_CHANGED = "Registration Task Changed";
	public static final String ACTIVITY_REGISTRATION_INITIATED = "Registration Task Initiated";
	public static final String ACTIVITY_REGISTRATION_CREATE_STARTED = "Registration Task Create Patient Initiated";
	public static final String ACTIVITY_REGISTRATION_EDIT_STARTED = "Registration Task Edit Patient Initiated";
	public static final String ACTIVITY_REGISTRATION_SUBMITTED = "Registration Task Submitted";
	public static final String ACTIVITY_REGISTRATION_NEW_ZL_ID = "Registration Task New ZL EMR ID Created";
	public static final String ACTIVITY_REGISTRATION_COMPLETED = "Registration Task Completed";
	public static final String ACTIVITY_PATIENT_LOOKUP_INITIATED = "Patient Lookup Initiated";
	public static final String ACTIVITY_PATIENT_LOOKUP_STARTED = "Patient Lookup Started";
	public static final String ACTIVITY_PATIENT_LOOKUP_COMPLETED = "Patient Lookup Completed";
	public static final String ACTIVITY_PRIMARY_CARE_RECEPTION_ENCOUNTER_STARTED = "Check-in Encounter Started";
	public static final String ACTIVITY_PRIMARY_CARE_RECEPTION_ENCOUNTER_COMPLETED = "Check-in Encounter Completed";
	public static final String ACTIVITY_PRIMARY_CARE_RECEPTION_DOSSIER_STARTED = "Check-in Dossier Started";
	public static final String ACTIVITY_PRIMARY_CARE_RECEPTION_DOSSIER_COMPLETED = "Check-in Dossier Completed";
	public static final String ACTIVITY_PRIMARY_CARE_VISIT_ENCOUNTER_STARTED = "Primary Care Visit Encounter Started";
	public static final String ACTIVITY_PRIMARY_CARE_VISIT_ENCOUNTER_COMPLETED = "Primary Care Visit Encounter Completed";
	public static final String ACTIVITY_ID_CARD_PRINTING_SUCCESSFUL = "ID Card Printing Successful";
	public static final String ACTIVITY_ID_CARD_PRINTING_FAILED = "ID Card Printing Failed";
	public static final String ACTIVITY_DOSSIER_LABEL_PRINTING_SUCCESSFUL = "Dossier Label Printing Successful";
	public static final String ACTIVITY_DOSSIER_LABEL_PRINTING_FAILED = "Dossier Label Printing Failed";
	public static final String ACTIVITY_ID_CARD_LABEL_PRINTING_SUCCESSFUL = "ID Card Label Printing Successful";
	public static final String ACTIVITY_ID_CARD_LABEL_PRINTING_FAILED = "ID Card Label Printing Failed";
	public static final String ACTIVITY_ENCOUNTER_SAVED = "Encounter Saved";
    public static final String ACTIVITY_PATIENT_IMPORTED = "Patient imported from MPI server";

    public static final String MPI_REMOTE_SERVER = "lacolline";
    public static final Integer MPI_CONNECT_TIMEOUT =10000;
    public static final String MPI_SEARCH_RESULTS="mpiSearchResults";

}
