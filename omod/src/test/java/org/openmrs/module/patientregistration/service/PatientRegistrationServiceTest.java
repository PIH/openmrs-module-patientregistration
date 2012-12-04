package org.openmrs.module.patientregistration.service;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.module.emr.printer.Printer;
import org.openmrs.module.emr.printer.PrinterService;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@RunWith(PowerMockRunner.class)
@PrepareForTest(PatientRegistrationUtil.class)
public class PatientRegistrationServiceTest {

    private PatientRegistrationServiceImpl patientRegistrationService;

    private PrinterService printerService;

    @Before
    public void setup() {
        patientRegistrationService = spy(new PatientRegistrationServiceImpl());
        printerService = mock(PrinterService.class);
        patientRegistrationService.setPrinterService(printerService);
    }


    @Test
    public void printIdCardLabel_shouldCallMethodToPrintIdCardLabel() {

        Location location = new Location(1);
        Patient patient = new Patient(1);
        Printer printer = new Printer();
        printer.setId(1);

        when(printerService.getDefaultPrinter(location, Printer.Type.LABEL)).thenReturn(printer);
        doReturn(true).when(patientRegistrationService).printIdCardLabelUsingZPL(patient, printer);

        patientRegistrationService.printIDCardLabel(patient, location);

        verify(patientRegistrationService).printIdCardLabelUsingZPL(patient, printer);
    }

    @Test
    public void printIdCard_shouldCallMethodToPrintIdCard() {

        Location location = new Location(1);
        Location medicalRecordLocation = new Location(2);
        Patient patient = new Patient(1);
        Printer printer = new Printer();
        printer.setId(1);

        mockStatic(PatientRegistrationUtil.class);
        when(PatientRegistrationUtil.getMedicalRecordLocationRecursivelyBasedOnTag(location)).thenReturn(medicalRecordLocation);
        when(printerService.getDefaultPrinter(location, Printer.Type.ID_CARD)).thenReturn(printer);
        doReturn(true).when(patientRegistrationService).printIdCardUsingEPCL(patient, printer, medicalRecordLocation);

        patientRegistrationService.printIDCard(patient, location);

        verify(patientRegistrationService).printIdCardUsingEPCL(patient, printer, medicalRecordLocation);

    }

    @Test
    public void printRegistrationLabel_shouldCallMethodToPrintRegistrationLabel() {

        Location location = new Location(1);
        Location medicalRecordLocation = new Location(2);
        Patient patient = new Patient(1);
        Printer printer = new Printer();
        printer.setId(1);

        mockStatic(PatientRegistrationUtil.class);
        when(PatientRegistrationUtil.getMedicalRecordLocationRecursivelyBasedOnTag(location)).thenReturn(medicalRecordLocation);
        when(printerService.getDefaultPrinter(location, Printer.Type.LABEL)).thenReturn(printer);
        doReturn(true).when(patientRegistrationService).printRegistrationLabelUsingZPL(patient, printer, medicalRecordLocation, 2);

        patientRegistrationService.printRegistrationLabel(patient, location, 2);

        verify(patientRegistrationService).printRegistrationLabelUsingZPL(patient, printer, medicalRecordLocation, 2);
    }

}
