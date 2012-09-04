package org.openmrs.module.patientregistration.util.simpleconfig;

import java.util.List;

import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;

@Root(name="POCConfiguration")
public class POCConfiguration {
	
	
	@ElementList(name="ReportCategories")
	private List<POCReportCategory> reportCategories;

	public List<POCReportCategory> getReportCategories() {
		return reportCategories;
	}

	public void setReportCategories(List<POCReportCategory> reportCategories) {
		this.reportCategories = reportCategories;
	}

	
}
