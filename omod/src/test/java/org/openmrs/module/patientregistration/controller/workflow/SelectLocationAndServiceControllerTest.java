/**
 * 
 */
package org.openmrs.module.patientregistration.controller.workflow;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;
import org.openmrs.Location;
import org.openmrs.api.context.Context;
import org.openmrs.module.emr.EmrContext;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;


/**
 * @author cospih
 *
 */
public class SelectLocationAndServiceControllerTest extends BasePatientRegistrationControllerTest {
	
	@Autowired
	private SelectLocationAndServiceController controller;
	
	@Test
	public void getLocations_shouldShowLocations() throws Exception{
	
		ModelMap modelMap = new ModelMap(); 	
		session.setAttribute(EmrContext.LOCATION_SESSION_ATTRIBUTE, new Integer(4));
		List<Location> locations = controller.getLocations(session);
		Assert.assertNotNull(locations);
		log.debug("number of locations= " + locations.size());
		for(Location location : locations){
			log.debug("locationId=" + location.getId());
			log.debug("locationName=" + location.getName());
		}
		
	}
	
	@Test
	public void showSetEncounterTypeAndLocation_shouldAddTasksToTheModel() throws Exception{
		ExtendedModelMap model = new ExtendedModelMap();
		
		SelectLocationAndServiceController controller = new SelectLocationAndServiceController();
		ModelAndView modelAndView = controller.showSetEncounterTypeAndLocation(model, session);
		List<String> tasks = (List<String>)model.get("tasks");
		Assert.assertNotNull(tasks);
		log.debug("number of tasks=" + tasks.size());
		for(String task : tasks){
			log.debug("taskName=" + task);
		}
	}
	
	@Test
	public void processSetEncounterTypeAndLocation_shouldSetLocationAndTask() throws Exception{
		SelectLocationAndServiceController controller = new SelectLocationAndServiceController();
		String task = "patientRegistration";
		Location location = Context.getLocationService().getLocation("Emergency");
		Assert.assertNotNull(location);
		controller.processSetEncounterTypeAndLocation(session, request, location, task);
		String sessionTask = PatientRegistrationWebUtil.getRegistrationTask(session);
		Assert.assertEquals(task, sessionTask);
		log.debug("sessionTask=" + sessionTask);
		Location sessionLocation = PatientRegistrationWebUtil.getRegistrationLocation(session);
		Assert.assertEquals(location, sessionLocation);
	}
	
}
