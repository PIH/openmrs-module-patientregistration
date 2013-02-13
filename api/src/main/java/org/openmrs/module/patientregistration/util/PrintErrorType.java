package org.openmrs.module.patientregistration.util;

public enum PrintErrorType {

    CARD_PRINTER_NOT_CONFIGURED(1, "patientregistration.error.cardPrinter.notConfigured"),
    LABEL_PRINTER_NOT_CONFIGURED(2, "patientregistration.error.labelPrinter.notConfigured"),
    CARD_PRINTER_ERROR(3, "patientregistration.error.cardPrinter.genericError"),
    LABEL_PRINTER_ERROR(4, "patientregistration.error.labelPrinter.genericError");

    private final int errorCode;
    private final String message;

    PrintErrorType(int errorCode, String message) {
        this.errorCode = errorCode;
        this.message = message;
    }


    public int getCode() {
        return errorCode;
    }

    public static PrintErrorType getPrintErrorTypeFromCode(int code){
        PrintErrorType[] printErrorTypes = PrintErrorType.values();

        for (PrintErrorType printErrorType : printErrorTypes) {
            if (printErrorType.getCode()== code){
                return printErrorType;
            }
        }

        throw new IllegalStateException("There is no print error with the code " + code);
    }

    public String getMessage() {
        return message;
    }
}
