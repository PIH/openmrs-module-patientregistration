/*
 * The contents of this file are subject to the OpenMRS Public License
 * Version 1.0 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://license.openmrs.org
 *
 * Software distributed under the License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
 * License for the specific language governing rights and limitations
 * under the License.
 *
 * Copyright (C) OpenMRS, LLC.  All Rights Reserved.
 */

package org.openmrs.module.patientregistration.controller.workflow;

import junit.framework.Assert;
import org.junit.Test;
import org.openmrs.Patient;
import org.openmrs.Visit;
import org.openmrs.api.context.Context;
import org.openmrs.module.emr.EmrProperties;
import org.openmrs.module.emr.adt.AdtService;
import org.openmrs.module.patientregistration.PatientRegistrationGlobalProperties;
import org.openmrs.module.patientregistration.util.POCObservation;
import org.openmrs.module.patientregistration.util.PatientRegistrationWebUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ExtendedModelMap;
import org.springframework.web.servlet.ModelAndView;

import java.util.Calendar;
import java.util.List;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.core.Is.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;

public class PrimaryCareReceptionEncounterControllerTest extends BasePatientRegistrationControllerTest {
    @Autowired
    private EmrProperties emrProperties;

	@Test
	public void processPayment_shouldCreateVisitAndCheckInPatient() throws Exception {
		Patient patient = Context.getPatientService().getPatient(7);
		String listOfObs = "[{CODED,2002,Medical certificate without diagnosis,1000,0;NUMERIC,0,50 Gourdes,1001,0;NON-CODED,0,12345,1002,0;}" +
                ", {CODED,2001,Standard outpatient visit,1000,0;NUMERIC,0,100 Gourdes,1001,0;NON-CODED,0,98765,1002,0;}]";
		
		PrimaryCareReceptionEncounterController controller = new PrimaryCareReceptionEncounterController();
        controller.setAdtService(Context.getService(AdtService.class));
        controller.setEmrProperties(emrProperties);

        Calendar now = Calendar.getInstance();
        String year = "" + now.get(Calendar.YEAR);
        String month = "" + (1 + now.get(Calendar.MONTH));
        String day = "" + now.get(Calendar.DAY_OF_MONTH);

		ModelAndView modelAndView = controller.processPayment(patient, listOfObs, false, year, month, day, false, null, session,
		    new ExtendedModelMap());
		
		Visit activeVisit = Context.getService(AdtService.class).getActiveVisit(patient,
		    PatientRegistrationWebUtil.getRegistrationLocation(session));
		
		assertNotNull(activeVisit);
		assertThat(activeVisit.getEncounters().size(), is(1));
		assertThat(activeVisit.getEncounters().iterator().next().getEncounterType(),
		    is(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_ENCOUNTER_TYPE()));
	}

    @Test
    public void showSelectPatient_shouldReturnPaymentGroups() throws Exception{
        Patient patient = Context.getPatientService().getPatient(6);
        String listOfObs = "[{CODED,2002,Medical certificate without diagnosis,1000,0;NUMERIC,0,50 Gourdes,1001,0;NON-CODED,0,12345,1002,0;}" +
                ", {CODED,2001,Standard outpatient visit,1000,0;NUMERIC,0,100 Gourdes,1001,0;NON-CODED,0,98765,1002,0;}]";

        PrimaryCareReceptionEncounterController controller = new PrimaryCareReceptionEncounterController();
        controller.setAdtService(Context.getService(AdtService.class));
        controller.setEmrProperties(emrProperties);

        Calendar now = Calendar.getInstance();
        String year = "" + now.get(Calendar.YEAR);
        String month = "" + (1 + now.get(Calendar.MONTH));
        String day = "" + now.get(Calendar.DAY_OF_MONTH);

        ExtendedModelMap model = new ExtendedModelMap();

        ModelAndView modelAndView = controller.processPayment(patient, listOfObs, false, year, month, day, false, null, session, model);
        String viewName = modelAndView.getViewName();
        Assert.assertEquals("redirect:/module/patientregistration/workflow/patientDashboard.form?patientId=" + patient.getPatientId(), viewName);
        Visit activeVisit = Context.getService(AdtService.class).getActiveVisit(patient,
                PatientRegistrationWebUtil.getRegistrationLocation(session));

        assertNotNull(activeVisit);
        assertThat(activeVisit.getEncounters().size(), is(1));
        assertThat(activeVisit.getEncounters().iterator().next().getEncounterType(),
                is(PatientRegistrationGlobalProperties.GLOBAL_PROPERTY_PRIMARY_CARE_RECEPTION_ENCOUNTER_TYPE()));

        model = new ExtendedModelMap();
        modelAndView = controller.showSelectPatient(patient,null, null, null, session, model);
        List<List<POCObservation>> pocPaymentGroups =(List<List<POCObservation>>) model.get("pocPaymentGroups");
        assertThat(pocPaymentGroups.size(), is(2));
        // assertThat(pocPaymentGroups.iterator().next().iterator().next().getLabel(), contains() containsInAnyOrder("Medical certificate without diagnosis", "Standard outpatient visit"));

        if(pocPaymentGroups!=null && pocPaymentGroups.size()>0){
            log.debug("printing pocPaymentGroups");
            for(List<POCObservation> paymentGroup : pocPaymentGroups){
                for(POCObservation pocObservation : paymentGroup){
                    log.debug("\tobsId=" + pocObservation.getObsId());
                    log.debug("\tconceptName=" + pocObservation.getConceptName());
                    log.debug("\tconceptId=" + pocObservation.getConceptId());
                }
            }
        }

    }

}
