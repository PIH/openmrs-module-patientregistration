package org.openmrs.module.patientregistration.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.PatientIdentifier;
import org.openmrs.PatientIdentifierType;
import org.openmrs.PersonName;
import org.openmrs.api.context.Context;
import org.openmrs.layout.web.name.NameSupport;
import org.openmrs.layout.web.name.NameTemplate;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.PrintErrorType;
import org.openmrs.module.patientregistration.util.TaskProgress;
import org.openmrs.module.patientregistration.validator.AgeValidator;
import org.openmrs.module.patientregistration.validator.BirthdateValidator;
import org.openmrs.module.patientregistration.validator.PatientValidator;
import org.openmrs.propertyeditor.LocationEditor;
import org.openmrs.propertyeditor.PatientIdentifierTypeEditor;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.SimpleFormController;


/**
 * Abstract Controller that defines some module attributes and data binders
 */
public abstract class AbstractPatientDetailsController{

	protected final Log log = LogFactory.getLog(getClass());
	
	protected PatientValidator validator = new PatientValidator();
	protected AgeValidator ageValidator = new AgeValidator();
	protected BirthdateValidator birthdateValidator = new BirthdateValidator();

	@InitBinder
	public void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
		//bind dates
		SimpleDateFormat dateFormat = new SimpleDateFormat(PatientRegistrationConstants.DATE_FORMAT_INPUT);
    	dateFormat.setLenient(false);
    	binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat,true, 10));
    	
		// register other custom binders
		binder.registerCustomEditor(Location.class, new LocationEditor());
		binder.registerCustomEditor(PatientIdentifierType.class, new PatientIdentifierTypeEditor());
	}
	
	@ModelAttribute("taskProgress")
	public TaskProgress getTaskProgress(HttpSession session) {
		return PatientRegistrationWebUtil.getTaskProgress(session);
	}
	
	@ModelAttribute("currentTask")
	public String getCurrentTask(HttpSession session) {
		return PatientRegistrationWebUtil.getRegistrationTask(session);
	}
	@ModelAttribute("patientName")
	public PersonName getPatientName() {
		return new PersonName();
	}
	
	@ModelAttribute("nameTemplate")
	public NameTemplate getNameLayout() {
		return NameSupport.getInstance().getDefaultLayoutTemplate();
	}
	
	@ModelAttribute("addressHierarchyLevels")
	public List<String> getAddressHierarchyLevels(HttpSession session){
		List<String> addressHierarchyLevels = PatientRegistrationUtil.getAddressHierarchyLevels();
		if(addressHierarchyLevels!=null && addressHierarchyLevels.size()>0){
			Collections.reverse(addressHierarchyLevels);
			return addressHierarchyLevels;
		}
		return null;
	}
	@ModelAttribute("jscriptMessages")
	public List<String> getJscriptMessages(HttpSession session){		
		return PatientRegistrationGlobalProperties.GET_JSCRIPT_MESSAGES_LIST();
	}
	@ModelAttribute("jtoolTipMessages")
	public List<String> getToolTipMessages(HttpSession session){		
		return PatientRegistrationGlobalProperties.GET_JSCRIPT_TOOLTIP_LIST();
	}
	@ModelAttribute("locations")
	public Collection<Location> getPossibleLocations() {
		return Context.getLocationService().getAllLocations(false);
	}
    @ModelAttribute(PatientRegistrationConstants.CURRENT_LOCATION)
    public Location getCurrentLocation(HttpSession session){
        return PatientRegistrationWebUtil.getRegistrationLocation(session);
    }
    @ModelAttribute(PatientRegistrationConstants.MEDICAL_RECORD_LOCATION)
    public Location getMedicalRecordLocation(HttpSession session){
        return PatientRegistrationUtil.getMedicalRecordLocationRecursivelyBasedOnTag(PatientRegistrationWebUtil.getRegistrationLocation(session));
    }
	/**
	 * Checks to see if the "fixedIdentifierLocation" global prop has been specified, which is used to determine if we
	 * should show the location selector for identifiers
	 */
	// 
	@ModelAttribute("showIdentifierLocationSelector")
	public boolean getShowIdentifierLocationSelector() {
		return PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_FIXED_IDENTIFIER_LOCATION() == null ? true : false;
	}
	
    @ModelAttribute("patientIdentifierTypes")
	public List<PatientIdentifierType> getPatientIdentifierTypes() {
    	// all patient identifier types to display that weren't in the previous two lists
		return PatientRegistrationUtil.getPatientIdentifierTypesToDisplay();	
	}
    
    @ModelAttribute("autoGenerationOptions")
    public Map<PatientIdentifierType,Object> getAutoGenerationOptions() {
    	return PatientRegistrationUtil.getPatientIdentifierTypesAutoGenerationOptions();
    }

    @ModelAttribute("printErrorsType")
    public List<PrintErrorType> getPrintErrorsType(@RequestParam(value = "printErrorsType", required = false) List<Integer> printErrorCodes){
        if (printErrorCodes==null){
            return Collections.emptyList();
        }

        List<PrintErrorType> printErrorTypes = new ArrayList<PrintErrorType>();


        for (Integer printErrorCode : printErrorCodes) {
            printErrorTypes.add(PrintErrorType.getPrintErrorTypeFromCode(printErrorCode));
        }

        return printErrorTypes;
    }
    
    /**
     * Utility method used to place all patient identifiers in a map so they can
     * be more easily accessed in the jsp
     */
	protected Map<Integer, PatientIdentifier> getPatientIdentifierMap(Patient patient) {
		final Map<Integer,PatientIdentifier> map = new HashMap<Integer,PatientIdentifier>();
		
		if (patient != null) {
			for (PatientIdentifierType type : Context.getPatientService().getAllPatientIdentifierTypes()) {			
				map.put(type.getId(), patient.getPatientIdentifier(type));
			}
		}
		return map;
	}	
	
}
