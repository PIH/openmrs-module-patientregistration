package org.openmrs.module.patientregistration.util.simpleconfig;

import org.simpleframework.xml.Element;
import org.simpleframework.xml.Root;

@Root(name="Report")
public class POCReport {
	
	@Element
	private String name;
	
	@Element
	private String reportId;
	
	@Element
	private String url;
	
	@Element(required=false)
	private String label;

	@Element
	private String messageId;
	
	@Element(required=false)
	private String outputFormat;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getReportId() {
		return reportId;
	}

	public void setReportId(String reportId) {
		this.reportId = reportId;
	}
    
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getMessageId() {
		return messageId;
	}

	public void setMessageId(String messageId) {
		this.messageId = messageId;
	}

	public String getOutputFormat() {
		return outputFormat;
	}

	public void setOutputFormat(String outputFormat) {
		this.outputFormat = outputFormat;
	}
	
	
	
}

