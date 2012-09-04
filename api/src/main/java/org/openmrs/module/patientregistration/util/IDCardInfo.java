package org.openmrs.module.patientregistration.util;

import java.util.Date;

import org.openmrs.Obs;

public class IDCardInfo {
	
	Obs printingObs=null;
	Date lastPrintingDate = null;
	Integer printingCounter = null;
	
	public IDCardInfo(){
	}

	public Obs getPrintingObs() {
		return printingObs;
	}

	public void setPrintingObs(Obs printingObs) {
		this.printingObs = printingObs;
	}

	public Date getLastPrintingDate() {
		return lastPrintingDate;
	}

	public void setLastPrintingDate(Date lastPrintingDate) {
		this.lastPrintingDate = lastPrintingDate;
	}

	public Integer getPrintingCounter() {
		return printingCounter;
	}

	public void setPrintingCounter(Integer printingCounter) {
		this.printingCounter = printingCounter;
	}
	
	
}
