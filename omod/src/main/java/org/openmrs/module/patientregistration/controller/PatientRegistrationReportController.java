package org.openmrs.module.patientregistration.controller;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.beanutils.BeanComparator;
import org.apache.commons.lang.StringUtils;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.User;
import org.openmrs.api.context.Context;
import org.openmrs.layout.web.address.AddressSupport;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.propertyeditor.EncounterTypeEditor;
import org.openmrs.propertyeditor.LocationEditor;
import org.openmrs.util.OpenmrsConstants;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class PatientRegistrationReportController {
	
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.registerCustomEditor(Location.class, new LocationEditor());
        binder.registerCustomEditor(EncounterType.class, new EncounterTypeEditor());
    }
    
    @ModelAttribute("locations")
    public List<Location> getLocations() {
    	List<Location> locations = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_REGISTRATION_LOCATIONS();
    	if (locations.isEmpty()) {
    		locations = Context.getLocationService().getAllLocations();
    	}
    	return locations;
    }
    
    @ModelAttribute("users")
    public List<User> getUsers() {
    	List<User> users = Context.getUserService().getAllUsers();
    	/*
    	if (locations.isEmpty()) {
    		locations = Context.getLocationService().getAllLocations();
    	}
    	*/
    	return users;
    }
    
    @SuppressWarnings("unchecked")
    @ModelAttribute("encounterTypes")
    public List<EncounterType> getEncounterTypes() {
    	List<EncounterType> types = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_REGISTRATION_ENCOUNTER_TYPES();
    	if (types.isEmpty()) {
    		types = Context.getEncounterService().getAllEncounterTypes();
    	}
    	Collections.sort(types, new BeanComparator("name"));
    	return types;
    }
    
    @RequestMapping("/module/patientregistration/reports/overviewReport.form") 
    public void overviewReport(@RequestParam(required=false, value="location") Location location, 
    		@RequestParam(value= "messageId", required = false) String messageId, 
    		ModelMap map) {

    	map.addAttribute("location", location == null ? "" : location);
    	
    	Calendar c = Calendar.getInstance();
    	Date today = c.getTime();
    	c.add(Calendar.DATE, -6);
    	Date sixDaysAgo = c.getTime();
    	c.add(Calendar.DATE, -24);
    	Date thirtyDaysAgo = c.getTime();
    	c.setTime(new Date());
    	
    	PatientRegistrationService service = Context.getService(PatientRegistrationService.class);
    	Context.addProxyPrivilege(OpenmrsConstants.PRIV_SQL_LEVEL_ACCESS);
    	List<EncounterType> types = getEncounterTypes();
    	
    	map.addAttribute("todayData", service.getNumberOfRegistrationEncounters(types, location, today, today));
    	map.addAttribute("weekData", service.getNumberOfRegistrationEncounters(types, location, sixDaysAgo, today));
    	map.addAttribute("monthData", service.getNumberOfRegistrationEncounters(types, location, thirtyDaysAgo, today));
    	map.addAttribute("allData", service.getNumberOfRegistrationEncounters(types, location, null, null));
    	map.addAttribute("currentYear", c.get(Calendar.YEAR));
    	map.addAttribute("currentMonth", c.get(Calendar.MONTH));
    	Context.removeProxyPrivilege(OpenmrsConstants.PRIV_SQL_LEVEL_ACCESS);
    }
    
    @RequestMapping("/module/patientregistration/reports/systemUsageReport.form") 
    public void systemUsageReport(@RequestParam(required=false, value="location") Location location, ModelMap map) {

    	map.addAttribute("location", location == null ? "" : location);
    	
    	Calendar c = Calendar.getInstance();
    	Date today = c.getTime();
    	c.add(Calendar.DATE, -6);
    	Date sixDaysAgo = c.getTime();
    	c.add(Calendar.DATE, -24);
    	Date thirtyDaysAgo = c.getTime();
    	c.setTime(new Date());
    	
    	PatientRegistrationService service = Context.getService(PatientRegistrationService.class);
    	List<EncounterType> types = getEncounterTypes();
    	
    	map.addAttribute("todayData", service.getNumberOfRegistrationEncounters(types, location, today, today));
    	map.addAttribute("weekData", service.getNumberOfRegistrationEncounters(types, location, sixDaysAgo, today));
    	map.addAttribute("monthData", service.getNumberOfRegistrationEncounters(types, location, thirtyDaysAgo, today));
    	map.addAttribute("allData", service.getNumberOfRegistrationEncounters(types, location, null, null));
    	map.addAttribute("currentYear", c.get(Calendar.YEAR));
    	map.addAttribute("currentMonth", c.get(Calendar.MONTH));
    }
    
    @RequestMapping("/module/patientregistration/reports/catchmentReport.form") 
    public void catchmentReport(@RequestParam(required=false, value="location") Location location, 
    							@RequestParam(required=false, value="encounterType") EncounterType encounterType,
    							@RequestParam(required=false, value="hideSingleOptionLevels") Boolean hideSingleOptionLevels,
    							HttpServletRequest request, ModelMap map) {

    	map.addAttribute("location", location == null ? "" : location);
    	map.addAttribute("encounterType", encounterType == null ? "" : encounterType);
    	
    	List<String> addressHierarchyLevels = PatientRegistrationUtil.getAddressHierarchyLevels();
    	map.addAttribute("addressHierarchyLevels", addressHierarchyLevels);
    	map.addAttribute("lastLevel", addressHierarchyLevels.isEmpty() ? null : addressHierarchyLevels.get(addressHierarchyLevels.size()-1));
    	
    	Map<String, String> nameMappings = AddressSupport.getInstance().getDefaultLayoutTemplate().getNameMappings();
    	map.addAttribute("nameMappings", nameMappings);
    	
    	Map<String, String> filterCriteria = new LinkedHashMap<String, String>();
    	List<String> fixedCriteria = new ArrayList<String>();
    	String nextField = null;
    	List<String> nextValues = new ArrayList<String>();
    	
    	for (String level : addressHierarchyLevels) {
    		String fixedValue = request.getParameter("fixed_"+level);
    		String filterValue = request.getParameter(level);
			if (StringUtils.isNotBlank(fixedValue)) {
				fixedCriteria.add(level);
				filterCriteria.put(level, fixedValue);
			}
			else if (StringUtils.isNotBlank(filterValue)) {
	    		filterCriteria.put(level, filterValue);
			}
    		else if (nextField == null) {
    			nextValues = PatientRegistrationUtil.getAddressHierarchyValues(level, filterCriteria);
    			if (nextValues.size() == 1 && hideSingleOptionLevels == Boolean.TRUE) {
    				fixedCriteria.add(level);
    				filterCriteria.put(level, nextValues.get(0));
    			}
    			else {
    				nextField = level;
    			}
    		}
    	}
    	map.addAttribute("filterCriteria", filterCriteria);
    	map.addAttribute("fixedCriteria", fixedCriteria);
		map.addAttribute("nextField", nextField);
		map.addAttribute("nextValues", nextValues);
		
    	PatientRegistrationService service = Context.getService(PatientRegistrationService.class);
    	Map<String, Integer> patsByAddress = service.getNumberOfPatientsByAddress(filterCriteria, nextField, encounterType, location);
    	map.addAttribute("numPatientsByAddress", patsByAddress);
    	map.addAttribute("numPatientJson", convertMapForJsonPieChart(patsByAddress));
    	
    	Map<String, Integer> encsByAddress = service.getNumberOfEncountersByAddress(filterCriteria, nextField, encounterType, location);
    	map.addAttribute("numEncountersByAddress", encsByAddress);
    	map.addAttribute("numEncounterJson", convertMapForJsonPieChart(encsByAddress));
    }
    
    @RequestMapping("/module/patientregistration/reports/encountersByDate.form") 
    public void encountersByDate(@RequestParam(required=false, value="encounterType") EncounterType encounterType, 
    							 @RequestParam(required=false, value="location") Location location, 
    							 ModelMap map, HttpServletResponse response) throws Exception {
    	
    	Map<Date, Integer> data = Context.getService(PatientRegistrationService.class).getNumberOfEncountersByDate(encounterType, location);
    	response.setContentType("text/json");
    	response.getWriter().write("[");
    	for (Iterator<Date> i = data.keySet().iterator(); i.hasNext();) {
    		Date d = i.next();
    		response.getWriter().write("[" + d.getTime() + "," + data.get(d) + "]");
    		if (i.hasNext()) {
    			response.getWriter().write(",");
    		}
    	}
    	response.getWriter().write("]");
    }
    
    private String convertMapForJsonPieChart(Map<String, Integer> m) {
    	StringBuilder sb = new StringBuilder();
    	sb.append("[");
    	for (Iterator<String> i = m.keySet().iterator(); i.hasNext();) {
    		String key = i.next();
    		sb.append("{ label: \"" + key + "\", data: " + m.get(key) + "}");
    		if (i.hasNext()) {
    			sb.append(",");
    		}
    	}
    	sb.append("]");
    	return sb.toString();
    }
}
