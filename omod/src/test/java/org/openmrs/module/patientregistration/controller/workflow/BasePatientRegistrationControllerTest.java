/**
 * 
 */
package org.openmrs.module.patientregistration.controller.workflow;

import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.junit.Before;
import org.openmrs.Location;
import org.openmrs.api.context.Context;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.openmrs.web.test.BaseModuleWebContextSensitiveTest;
import org.springframework.mock.web.MockHttpServletRequest;

/**
 * @author cospih
 *
 */
public abstract class BasePatientRegistrationControllerTest extends
		BaseModuleWebContextSensitiveTest {

	
	protected final Log log = LogFactory.getLog(getClass());
	
	protected static final String PATIENT_REGISTRATION_GLOBALPROPERTY_XML = "org/openmrs/module/patientregistration/include/globalproperty.xml";
	protected static final String PATIENT_REGISTRATION_LOCATIONS_XML = "org/openmrs/module/patientregistration/include/locations.xml";
	
	MockHttpServletRequest request = null;
	HttpSession session = null;

	@Before
	public void initTestData() throws Exception{
		executeDataSet(PATIENT_REGISTRATION_GLOBALPROPERTY_XML);
		
		//overwriting the default openmrs test data set(/api/src/test/reources/org/openmrs/include/standardTestDataset.xml)
		executeDataSet(PATIENT_REGISTRATION_LOCATIONS_XML);
		request = new MockHttpServletRequest();
		session = request.getSession();
		String task = "patientRegistration";
		Location location = Context.getLocationService().getLocation("Lacolline");
		PatientRegistrationWebUtil.setRegistrationLocation(session, location);
		PatientRegistrationWebUtil.setRegistrationTask(session, task);
	}
}
