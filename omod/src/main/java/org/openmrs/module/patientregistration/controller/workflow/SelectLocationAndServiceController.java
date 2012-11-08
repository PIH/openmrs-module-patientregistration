package org.openmrs.module.patientregistration.controller.workflow;

import java.util.Collections;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.openmrs.Location;
import org.openmrs.api.LocationService;
import org.openmrs.api.context.Context;
import org.openmrs.module.emr.api.EmrService;
import org.openmrs.module.emr.EmrContext;
import org.openmrs.module.patientregistration.PatientRegistrationConstants;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.module.patientregistration.util.TaskProgress;
import org.openmrs.propertyeditor.LocationEditor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SelectLocationAndServiceController {
	 
	@Autowired
	@Qualifier("emrService")
	private EmrService emrService;
	
	@Autowired
	@Qualifier("locationService")
	private LocationService locationService;
	
	@InitBinder
	public void initBinder(HttpServletRequest request, ServletRequestDataBinder binder) throws Exception {
		binder.registerCustomEditor(Location.class, new LocationEditor());
	}
	
	@ModelAttribute("locations")
	public List<Location> getLocations(HttpSession session) {
		Integer locationId = (Integer) session.getAttribute(EmrContext.LOCATION_SESSION_ATTRIBUTE);
		List<Location> ret = null;
		if (locationId!=null) {
			Location location = locationService.getLocation(locationId);
			if (location != null) {
				ret = Collections.singletonList((Location) location);
			}
		}
		if (ret == null) {
			ret = emrService.getLoginLocations();
			if (ret.isEmpty()) {
				ret = Context.getLocationService().getAllLocations();
			}
		}
		return ret;
	}
	
	@RequestMapping(value = "/module/patientregistration/workflow/selectLocationAndService.form", method = RequestMethod.GET)
	public ModelAndView showSetEncounterTypeAndLocation(Model model, HttpSession session) {
		PatientRegistrationWebUtil.setTimeout(session);
		List<String> tasks = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_SUPPORTED_TASKS();
		for (Iterator<String> i = tasks.iterator(); i.hasNext();) {
			String task = i.next();
			if (!Context.hasPrivilege("Patient Registration Task - " + task)) {
				i.remove();
			}
		}
		
		model.addAttribute("tasks", tasks);
		return new ModelAndView("/module/patientregistration/workflow/selectLocationAndService");
	}
	
	@RequestMapping(value = "/module/patientregistration/workflow/selectLocationAndService.form", method = RequestMethod.POST)
	public String processSetEncounterTypeAndLocation(
			HttpSession session, HttpServletRequest request	
			, @RequestParam("location") Location location
			, @RequestParam("task") String task){
		
		PatientRegistrationWebUtil.setRegistrationLocation(session, location);
		PatientRegistrationWebUtil.setRegistrationTask(session, task);

		if (StringUtils.isNotBlank(task)) {	
			if(StringUtils.equalsIgnoreCase(task, PatientRegistrationConstants.RETROSPECTIVE_TASK)){
				TaskProgress taskProgress = new TaskProgress();
				taskProgress.setProgressBarImage(PatientRegistrationConstants.RETROSPECTIVE_PROGRESS_1_IMG);				
				PatientRegistrationWebUtil.setTaskProgress(session, taskProgress);
			}else{
				session.removeAttribute(PatientRegistrationConstants.SESSION_TASK_PROGRESS);
			}
			return "redirect:/module/patientregistration/workflow/"+task + "Task.form";
		}
		else {
			return "/module/patientregistration/workflow/selectLocationAndService";
		}
	}
}
