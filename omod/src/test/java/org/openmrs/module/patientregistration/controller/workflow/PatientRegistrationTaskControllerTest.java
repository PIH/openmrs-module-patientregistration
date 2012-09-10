/**
 * 
 */
package org.openmrs.module.patientregistration.controller.workflow;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author cospih
 *
 */
public class PatientRegistrationTaskControllerTest extends
	BasePatientRegistrationControllerTest {

	@Test
	public void showEnterPatientIdentifier_shouldReturnPatientRegistrationTask() throws Exception{
		ModelMap modelMap = new ModelMap();
		
		PatientRegistrationTaskController controller = new PatientRegistrationTaskController();
		ModelAndView modelAndView = controller.showEnterPatientIdentifier(session, modelMap);
		String viewName = modelAndView.getViewName();
		Assert.assertEquals("/module/patientregistration/workflow/patientRegistrationTask", viewName);
		log.debug("viewName="+viewName);
		
	}
}
