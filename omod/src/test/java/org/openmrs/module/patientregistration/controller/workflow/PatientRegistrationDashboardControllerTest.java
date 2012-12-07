package org.openmrs.module.patientregistration.controller.workflow;

import org.directwebremoting.util.FakeHttpSession;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.openmrs.EncounterType;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.User;
import org.openmrs.api.PatientService;
import org.openmrs.api.context.Context;
import org.openmrs.api.impl.PatientServiceImpl;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.service.PatientRegistrationService;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import org.springframework.ui.ModelMap;

import javax.servlet.http.HttpSession;

import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest({Context.class, PatientRegistrationWebUtil.class, PatientRegistrationGlobalProperties.class})
public class PatientRegistrationDashboardControllerTest {

    private PatientRegistrationDashboardController patientRegistrationDashboardController;

    @Before
    public void setup(){
        patientRegistrationDashboardController = new PatientRegistrationDashboardController();
    }
    @Test
    public void testHandleCardPrinting() throws Exception {
        PowerMockito.mockStatic(Context.class);
        PowerMockito.mockStatic(PatientRegistrationWebUtil.class);
        PowerMockito.mockStatic(PatientRegistrationGlobalProperties.class);

        PatientService patientService = mock(PatientService.class);
        when(Context.getPatientService()).thenReturn(patientService);

        Patient patientReloaded = new Patient();
        patientReloaded.setId(10);
        when(patientService.getPatient(10)).thenReturn(patientReloaded);

        FakeHttpSession session = new FakeHttpSession();
        when(PatientRegistrationWebUtil.getRegistrationLocation(session)).thenReturn(new Location());

        when(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PATIENT_REGISTRATION_ENCOUNTER_TYPE()).thenReturn(new EncounterType());

        PatientRegistrationService patientRegistrationService = mock(PatientRegistrationService.class);
        when(Context.getService(PatientRegistrationService.class)).thenReturn(patientRegistrationService);

        when(Context.getAuthenticatedUser()).thenReturn(new User());

        Patient patient = new Patient();
        patient.setId(10);
        patientRegistrationDashboardController.handleCardPrinting(patient,null,session,new ModelMap());

        verify(patientRegistrationService).printIDCard(eq(patientReloaded),any(Location.class));

    }
}
