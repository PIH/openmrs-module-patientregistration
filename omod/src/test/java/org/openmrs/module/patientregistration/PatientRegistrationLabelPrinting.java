package org.openmrs.module.patientregistration;

import java.net.Socket;
import java.text.DecimalFormat;

import org.apache.commons.io.IOUtils;
import org.junit.Test;


public class PatientRegistrationLabelPrinting {

    /**

	@Test
	public void test() throws Exception {
		
		// go backwards
		
		
		Integer count = 2000;
		Integer end = 1000;
		
		DecimalFormat formatter = new DecimalFormat();
		formatter.setMaximumIntegerDigits(5);
		formatter.setMinimumIntegerDigits(5);
		formatter.setMinimumFractionDigits(0);
		formatter.setMaximumFractionDigits(0);
		formatter.setGroupingUsed(false);
		
		StringBuilder data = new StringBuilder();
		
		String ESC = "\u001B";
		
		/**
		data.append(ESC + "+RIB\n");   // specify monochrome ribbon type
		data.append(ESC + "+C 8\n");   // specify thermal intensity
		data.append(ESC + "F\n");	   // clear monochrome buffer
		**/
		
		
		/**
		data.append(ESC + "G 200 200 0 12 64 1\n");
		
		data.append(ESC + "Z");
			
		for (short b : bytes) {
			data.append(b + " ");
		}
		
		data.append("\n");
		*/
			
		
		/**
		data.append(ESC + "B 75 550 0 0 0 3 100 0 2A1234\n");
		
		data.append(ESC + "T 75 600 0 1 0 45 1 2A1234\n");
		
		
		data.append(ESC + "T 75 80 0 1 0 75 1 Jéàn Baptiste Charles\n");
		
		data.append(ESC + "T 420 150 0 0 0 25 1 Gender\n");
		data.append(ESC + "T 420 200 0 1 0 50 1 Male\n");
		
		data.append(ESC + "T 650 150 0 0 0 25 1 Birthdate\n");
		data.append(ESC + "T 650 200 0 1 0 50 1 03-July-1979\n");
		
		data.append(ESC + "T 420 250 0 0 0 25 1 Telephone\n");
		data.append(ESC + "T 420 300 0 1 0 50 1 123-3445\n");
		
		data.append(ESC + "T 420 350 0 0 0 25 1 Address\n");
		data.append(ESC + "T 420 400 0 1 0 50 1 Buteau\n");
		
		data.append(ESC + "T 420 550 0 0 0 25 1 Date ID Issued\n");
		data.append(ESC + "T 420 600 0 1 0 50 1 03-Dec-2011\n");

		data.append(ESC + "T 720 550 0 0 0 25 1 Location Issued\n");
		data.append(ESC + "T 720 600 0 1 0 50 1 Lacoline\n");
		
		data.append(ESC + "C 75 85 320 340 2 1\n");
		
		data.append(ESC + "I\n");
		//data.append(ESC + "R\n");
		**/

    /**
		data = new StringBuilder();
		
		while (count > end) {
		
			System.out.println(formatter.format(count));
			
			
			
			data.append("^XA");
			//data.append("^CI28");   // specify Unicode encoding
			data.append("^FO400,60^ATN^BY4^BCN,180^FD");
			data.append(formatter.format(count));
			data.append("AA");
			data.append("^PQ1");
			data.append("^XZ");	
			
			count--;
		}
			
		try {
			Socket socket = new Socket("192.168.100.105", 9100);
			IOUtils.write(data.toString().getBytes("Windows-1252"), socket.getOutputStream());
			socket.close();
		}
		catch (Exception e) {
			System.out.println("Error connecting to socket: " + e.getMessage());
		}
		
	}

    **/
}
