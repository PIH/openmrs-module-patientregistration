package org.openmrs.module.patientregistration.service;

import org.joda.time.DateTime;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openmrs.Location;
import org.openmrs.LocationAttribute;
import org.openmrs.LocationAttributeType;
import org.openmrs.Patient;
import org.openmrs.PersonName;
import org.openmrs.module.emrapi.EmrApiProperties;
import org.openmrs.module.paperrecord.PaperRecordService;
import org.openmrs.module.paperrecord.UnableToPrintLabelException;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.PatientRegistrationUtil;
import org.openmrs.module.printer.Printer;
import org.openmrs.module.printer.PrinterService;
import org.openmrs.module.printer.PrinterType;
import org.openmrs.module.printer.UnableToPrintException;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.powermock.api.mockito.PowerMockito.mockStatic;

@RunWith(PowerMockRunner.class)
@PrepareForTest( { PatientRegistrationUtil.class, PatientRegistrationGlobalProperties.class } )
public class PatientRegistrationServiceTest {

    private PatientRegistrationServiceImpl patientRegistrationService;

    private PrinterService printerService;

    private EmrApiProperties emrApiProperties;

    private PaperRecordService paperRecordService;

    @Before
    public void setup() {
        paperRecordService = mock(PaperRecordService.class);
        paperRecordService.setPrinterService(printerService);
        patientRegistrationService = spy(new PatientRegistrationServiceImpl());
        printerService = mock(PrinterService.class);
        patientRegistrationService.setPrinterService(printerService);
        emrApiProperties = mock(EmrApiProperties.class);
        patientRegistrationService.setEmrApiProperties(emrApiProperties);
        patientRegistrationService.setPaperRecordService(paperRecordService);
    }

    @Test
    public void printIdCardLabel_shouldCallMethodToPrintIdCardLabel() throws UnableToPrintLabelException {

        Location location = new Location(1);
        Patient patient = new Patient(1);
        Printer printer = new Printer();
        printer.setId(1);

        patientRegistrationService.printIDCardLabel(patient, location);

        verify(paperRecordService).printIdCardLabel(patient, location);
    }

    @Test
    @Ignore
    public void printIdCard_shouldCallMethodToPrintIdCard() throws UnableToPrintException, UnableToPrintLabelException {

        Location location = new Location(1);
        Location medicalRecordLocation = new Location(2);

        PersonName personName = new PersonName();
        personName.setGivenName("Tom");
        personName.setFamilyName("Jones");
        Patient patient = new Patient(1);;
        patient.addName(personName);
        patient.setBirthdate(new DateTime(2010, 10, 22, 0, 0).toDate());


        Printer printer = new Printer();
        printer.setId(1);

        Map<String,Object> paramMap = new HashMap<String, Object>();


        mockStatic(PatientRegistrationUtil.class);
        when(PatientRegistrationUtil.getMedicalRecordLocationRecursivelyBasedOnTag(location)).thenReturn(medicalRecordLocation);
        when(printerService.getDefaultPrinter(location, PrinterType.ID_CARD)).thenReturn(printer);
        doNothing().when(printerService).print(paramMap, printer, true);

        patientRegistrationService.printIDCard(patient, location);
        verify(printerService).print(paramMap, printer, true);
    }

    @Test
    public void printPaperRecordLabel_shouldCallMethodToPrintPaperRecordLabel() throws UnableToPrintLabelException {

        Location location = new Location(1);
        Patient patient = new Patient(1);

        patientRegistrationService.printPaperRecordLabel(patient, location, 1);

        verify(paperRecordService).printPaperRecordLabels(patient, location, 1);
    }

    @Test
    public void printPaperFormLabel_shouldCallMethodToPrintPaperFormLabel() throws UnableToPrintLabelException {

        Location location = new Location(1);
        Patient patient = new Patient(1);

        patientRegistrationService.printPaperFormLabel(patient, location, 1);

        verify(paperRecordService).printPaperFormLabels(patient, location, 1);
    }

    @Test
    public void getNameToPrintOnIdCardShouldReturnNameToPrintOnIdCard() {

        LocationAttributeType nameToPrintOnIdCardType = new LocationAttributeType();
        nameToPrintOnIdCardType.setId(1);
        nameToPrintOnIdCardType.setUuid(UUID.randomUUID().toString());

        Location location = new Location(1);
        location.setName("Regular name");

        LocationAttribute nameToPrintOnIdCard = new LocationAttribute();
        nameToPrintOnIdCard.setAttributeType(nameToPrintOnIdCardType);
        nameToPrintOnIdCard.setValue("Name to print");
        location.setAttribute(nameToPrintOnIdCard);

        mockStatic(PatientRegistrationGlobalProperties.class);
        when(PatientRegistrationGlobalProperties.getLocationAttributeTypeNameToPrintOnIdCard()).thenReturn(nameToPrintOnIdCardType);

        Assert.assertEquals("Name to print", patientRegistrationService.getNameToPrintOnIdCard(location));
    }

    @Test
    public void getNameToPrintOnIdCardShouldReturnDisplayNameIfNameToDisplayOnIdCardAttributeDefined() {

        LocationAttributeType nameToPrintOnIdCardType = new LocationAttributeType();
        nameToPrintOnIdCardType.setId(1);
        nameToPrintOnIdCardType.setUuid(UUID.randomUUID().toString());

        Location location = new Location(1);
        location.setName("Regular name");

        mockStatic(PatientRegistrationGlobalProperties.class);
        when(PatientRegistrationGlobalProperties.getLocationAttributeTypeNameToPrintOnIdCard()).thenReturn(nameToPrintOnIdCardType);

        Assert.assertEquals("Regular name", patientRegistrationService.getNameToPrintOnIdCard(location));
    }
}
