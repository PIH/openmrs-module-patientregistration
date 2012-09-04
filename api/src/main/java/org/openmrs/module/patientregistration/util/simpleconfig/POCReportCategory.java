package org.openmrs.module.patientregistration.util.simpleconfig;

import java.util.List;

import org.simpleframework.xml.Attribute;
import org.simpleframework.xml.ElementList;
import org.simpleframework.xml.Root;

@Root(name="ReportCategory")
public class POCReportCategory {

	@Attribute
	private String name;
	
	@ElementList(name="Reports")
	private List<POCReport> reports;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<POCReport> getReports() {
		return reports;
	}

	public void setReports(List<POCReport> reports) {
		this.reports = reports;
	}
	
}
