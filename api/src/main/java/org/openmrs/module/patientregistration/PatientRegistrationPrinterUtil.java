package org.openmrs.module.patientregistration;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.Location;
import org.openmrs.Patient;
import org.openmrs.PatientIdentifier;
import org.openmrs.PersonAttribute;
import org.openmrs.PersonAttributeType;
import org.openmrs.api.context.Context;
import org.openmrs.layout.web.address.AddressSupport;
import org.openmrs.module.emr.printer.Printer;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

public class PatientRegistrationPrinterUtil {

    protected static final Log log = LogFactory.getLog(PatientRegistrationPrinterUtil.class);

    public static boolean printRegistrationLabelUsingZPL(Patient patient, Printer printer, Location medicalRecordLocation, int count)  {

        DateFormat df = new SimpleDateFormat(PatientRegistrationConstants.DATE_FORMAT_DISPLAY, Context.getLocale());

        // TODO: potentially pull this formatting code into a configurable template?
        // build the command to send to the printer -- written in ZPL
        StringBuilder data = new StringBuilder();
        data.append("^XA");
        data.append("^CI28");   // specify Unicode encoding

        /* LEFT COLUMN */

        /* Name (Only print first and last name */
        data.append("^FO140,40^AVN^FD" + (patient.getPersonName().getGivenName() != null ? patient.getPersonName().getGivenName() : "") + " "
                + (patient.getPersonName().getFamilyName() != null ? patient.getPersonName().getFamilyName() : "") + "^FS");

        /* Address (using address template) */
        if (patient.getPersonAddress() != null) {

            int verticalPosition = 140;

            // print out the address using the layout format
            // first iterate through all the lines in the format
            if (AddressSupport.getInstance().getDefaultLayoutTemplate() != null && AddressSupport.getInstance().getDefaultLayoutTemplate().getLines() != null) {

                List<List<Map<String,String>>> lines = AddressSupport.getInstance().getDefaultLayoutTemplate().getLines();
                ListIterator<List<Map<String,String>>> iter = lines.listIterator();

                while(iter.hasNext()){
                    List<Map<String,String>> line = iter.next();
                    // now iterate through all the tokens in the line and build the string to print
                    StringBuffer output = new StringBuffer();
                    for (Map<String,String> token : line) {
                        // find all the tokens on this line, and then add them to that output line
                        if(token.get("isToken").equals(AddressSupport.getInstance().getDefaultLayoutTemplate().getLayoutToken())) {

                            String property = PatientRegistrationUtil.getPersonAddressProperty(patient.getPersonAddress(), token.get("codeName"));

                            if (!StringUtils.isBlank(property)) {
                                output.append(property + ", ");
                            }
                        }
                    }

                    if (output.length() > 2) {
                        // drop the trailing comma and space from the last token on the line
                        output.replace(output.length() - 2, output.length(), "");
                    }

                    if (!StringUtils.isBlank(output.toString())) {
                        data.append("^FO140," + verticalPosition + "^ATN^FD" + output.toString() + "^FS");
                        verticalPosition = verticalPosition + 50;
                    }
                }
            }
            else {
                log.error("Address template not properly configured");
            }
        }

        /* Birthdate */
        data.append("^FO140,350^ATN^FD" + df.format(patient.getBirthdate()) + " " + (patient.getBirthdateEstimated() ? "(*)" : " ") + "^FS");
        data.append("^FO140,400^ATN^FD" + Context.getMessageSourceService().getMessage("patientregistration.gender." + patient.getGender()) + "^FS");

        /* RIGHT COLUMN */

        /* Print the numero dossier for the current location */
        PatientIdentifier numeroDossier = PatientRegistrationUtil.getNumeroDossier(patient, medicalRecordLocation);

        if (numeroDossier != null) {
            data.append("^FO870,50^FB350,1,0,R,0^AVN^FD" + numeroDossier.getIdentifier() + "^FS");
            data.append("^FO870,125^FB350,1,0,R,0^ATN^FD" + medicalRecordLocation.getName() + " " + Context.getMessageSourceService().getMessage("patientregistration.dossier") + "^FS");
            data.append("^FO870,175^FB350,1,0,R,0^ATN^FD" + Context.getMessageSourceService().getMessage("patientregistration.issued") + " " + df.format(new Date()) + "^FS");
        }

        /* Print the bar code, based on the primary identifier */
        PatientIdentifier primaryIdentifier = PatientRegistrationUtil.getPrimaryIdentifier(patient);

        if (primaryIdentifier != null) {
            data.append("^FO790,250^ATN^BY4^BCN,150^FD" + primaryIdentifier.getIdentifier() + "^FS");    // print barcode & identifier
        }

        /* Quanity and print command */
        data.append("^PQ" + count);
        data.append("^XZ");

        return printViaSocket(data, printer);
    }

    public static boolean printerIdCardLabelUsingZPL(Patient patient, Printer printer) {

        // TODO: potentially pull this formatting code into a configurable template?
        // build the command to send to the printer -- written in ZPL
        StringBuilder data = new StringBuilder();
        data.append("^XA");
        data.append("^CI28");   // specify Unicode encoding


        List<PatientIdentifier> patientIdentifiers = PatientRegistrationUtil.getAllNumeroDossiers(patient);

        /* Print all number dossiers in two columns*/
        if (patientIdentifiers != null && patientIdentifiers.size() > 0) {
            int verticalPosition = 30;
            int horizontalPosition = 140;
            int count = 0;

            for (PatientIdentifier identifier : patientIdentifiers) {
                data.append("^FO" + horizontalPosition + "," + verticalPosition + "^AVN^FD" + identifier.getIdentifier() + "^FS");
                data.append("^FO" + horizontalPosition + "," + (verticalPosition + 75) + "^ATN^FD" + identifier.getLocation().getName() + " " + Context.getMessageSourceService().getMessage("patientregistration.dossier") + "^FS");

                verticalPosition = verticalPosition + 130;
                count++;

                // switch to second column if needed
                if (verticalPosition == 420) {
                    verticalPosition = 30;
                    horizontalPosition = 550;
                }

                // we can't fit more than 6 dossier numbers on a label--this is a real edge case
                if (count > 5) {
                    break;
                }
            }
        }

        /* Draw the "tear line" */
        data.append("^FO1025,10^GB0,590,10^FS");

        /* Print command */
        data.append("^XZ");

        return printViaSocket(data, printer);
    }

    public static boolean printIdCardUsingEPCL(Patient patient, Printer printer, Location issuingLocation) {

        DateFormat df = new SimpleDateFormat(PatientRegistrationConstants.DATE_FORMAT_DISPLAY, Context.getLocale());

        // TODO: potentially pull this formatting code into a configurable template?
        // build the command to send to the printer -- written in EPCL
        String ESC = "\u001B";

        StringBuilder data = new StringBuilder();

        data.append(ESC + "+RIB\n");   // specify monochrome ribbon type
        data.append(ESC + "+C 4\n");   // specify thermal intensity
        data.append(ESC + "F\n");	   // clear monochrome buffer

        data.append(ESC + "B 75 550 0 0 0 3 100 0 "+ PatientRegistrationUtil.getPreferredIdentifier(patient) + "\n");    // layout bar code and patient identifier
        data.append(ESC + "T 75 600 0 1 0 45 1 "+ PatientRegistrationUtil.getPreferredIdentifier(patient) + "\n");

        data.append(ESC + "T 75 80 0 1 0 75 1 "+ (patient.getPersonName().getFamilyName() != null ? patient.getPersonName().getFamilyName() : "") + " "
                + (patient.getPersonName().getFamilyName2() != null ? patient.getPersonName().getFamilyName2() : "")
                + (patient.getPersonName().getGivenName() != null ? patient.getPersonName().getGivenName() : "") + " "
                + (patient.getPersonName().getMiddleName() != null ? patient.getPersonName().getMiddleName() : "")
                + "\n");

        data.append(ESC + "T 75 350 0 0 0 25 1 " + Context.getMessageSourceService().getMessage("patientregistration.gender") + "\n");
        data.append(ESC + "T 75 400 0 1 0 50 1 " + Context.getMessageSourceService().getMessage("patientregistration.gender." + patient.getGender()) + "\n");

        data.append(ESC + "T 250 350 0 0 0 25 1 " + Context.getMessageSourceService().getMessage("patientregistration.person.birthdate") +
                (patient.getBirthdateEstimated() ? " (" + Context.getMessageSourceService().getMessage("patientregistration.person.birthdate.estimated") + ")" : " ") + "\n");
        data.append(ESC + "T 250 400 0 1 0 50 1 " + df.format(patient.getBirthdate()) + "\n");

        // layout out the address using the address template, if one exists
        int verticalPosition = 150;
        if (patient.getPersonAddress() != null) {

            // print out the address using the layout format
            // first iterate through all the lines in the format
            if (AddressSupport.getInstance().getDefaultLayoutTemplate() != null && AddressSupport.getInstance().getDefaultLayoutTemplate().getLines() != null) {

                List<List<Map<String,String>>> lines = AddressSupport.getInstance().getDefaultLayoutTemplate().getLines();
                ListIterator<List<Map<String,String>>> iter = lines.listIterator();

                while(iter.hasNext()){
                    List<Map<String,String>> line = iter.next();
                    // now iterate through all the tokens in the line and build the string to print
                    StringBuffer output = new StringBuffer();
                    for (Map<String,String> token : line) {
                        // find all the tokens on this line, and then add them to that output line
                        if(token.get("isToken").equals(AddressSupport.getInstance().getDefaultLayoutTemplate().getLayoutToken())) {

                            String property = PatientRegistrationUtil.getPersonAddressProperty(patient.getPersonAddress(), token.get("codeName"));

                            if (!StringUtils.isBlank(property)) {
                                output.append(property + ", ");
                            }
                        }
                    }

                    if (output.length() > 2) {
                        // drop the trailing comma and space from the last token on the line
                        output.replace(output.length() - 2, output.length(), "");
                    }

                    if (!StringUtils.isBlank(output.toString())) {
                        data.append(ESC + "T 75 " + verticalPosition + " 0 1 0 50 1 " + output.toString() + "\n");
                        verticalPosition = verticalPosition + 50;
                    }
                }
            }
            else {
                log.error("Address template not properly configured");
            }

        }

        // now print the patient attribute type that has specified in the idCardPersonAttributeType global property
        PersonAttributeType type = PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_ID_CARD_PERSON_ATTRIBUTE_TYPE();
        if (type != null) {
            PersonAttribute attr = patient.getAttribute(type);
            if (attr != null && attr.getValue() != null) {
                // see if there is a message code for this type name (by creating a camel case version of the name), otherwise just use the type name directly
                String typeName = Context.getMessageSourceService().getMessage("patientregistration." + PatientRegistrationUtil.toCamelCase(type.getName()), null, type.getName(), Context.getLocale());
                data.append(ESC + "T 600 350 0 0 0 25 1 " + (StringUtils.isBlank(typeName) ? type.getName() : typeName) + "\n");
                verticalPosition = verticalPosition + 50;
                data.append(ESC + "T 600 400 0 1 0 50 1 " + attr.getValue() + "\n");
            }
        }

        // custom card label, if specified
        if (PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_ID_CARD_LABEL_TEXT() != null) {
            data.append(ESC + "T 420 510 0 1 0 45 1 " + PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_ID_CARD_LABEL_TEXT() + "\n");
        }

        // date issued and location issued are aligned to bottom of the card
        data.append(ESC + "T 420 550 0 0 0 25 1 " + Context.getMessageSourceService().getMessage("patientregistration.dateIDIssued") + "\n");
        data.append(ESC + "T 420 600 0 1 0 50 1 " + df.format(new Date()) + "\n");    // date issued is today

        data.append(ESC + "T 720 550 0 0 0 25 1 " + Context.getMessageSourceService().getMessage("patientregistration.locationIssued") + "\n");
        data.append(ESC + "T 720 600 0 1 0 50 1 " + (issuingLocation != null ? issuingLocation.getDisplayString() : "") + "\n");

        data.append(ESC + "L 20 420 955 5 1\n");   //divider line

        data.append(ESC + "I\n");		// trigger the actual print job

        // TOOD: remove this line once we figure out how to make the print stops making noise
        //data.append(ESC + "R\n");       // reset the printer (hacky workaround to make the printer stop making noise)

        return printViaSocket(data, printer);
    }

    private static boolean printViaSocket(StringBuilder data, Printer printer) {

        Socket socket = null;
        // Create a socket with a timeout
        try {
            InetAddress addr = InetAddress.getByName(printer.getIpAddress());
            SocketAddress sockaddr = new InetSocketAddress(addr, Integer.valueOf(printer.getPort()));
            // Create an unbound socket
            socket = new Socket();

            // This method will block no more than timeoutMs.
            // If the timeout occurs, SocketTimeoutException is thrown.
            int timeoutMs = 500;   // 500ms
            socket.connect(sockaddr, timeoutMs);
            IOUtils.write(data.toString(), socket.getOutputStream(), "UTF-8");
            return true;
        }
        catch (Exception e) {
            log.error("Unable o print:", e);
            return false;
        }
        finally{
            try {
                socket.close();
            } catch (IOException e) {
                log.error("failed to close the socket to the label printer" + e);
            }
        }
    }
}
