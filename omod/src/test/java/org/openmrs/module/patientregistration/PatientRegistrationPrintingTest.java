package org.openmrs.module.patientregistration;

import java.net.Socket;

import org.apache.commons.io.IOUtils;
import org.junit.Ignore;
import org.junit.Test;

public class PatientRegistrationPrintingTest {

	@Test
    @Ignore
	public void test() throws Exception {
		
		StringBuilder data = new StringBuilder();
		
		String ESC = "\u001B";
		
		short bytes [] = {
				0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc0, 0xff, 0xff, 0xff,
				   0xff, 0xff, 0xff, 0x03, 0x70, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x0e,
				   0x18, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x18, 0x0c, 0x00, 0x00, 0xff,
				   0xff, 0x00, 0x00, 0x30, 0x06, 0x00, 0x00, 0xff, 0xff, 0x01, 0x00, 0x20,
				   0x06, 0x00, 0x00, 0xff, 0xff, 0x01, 0x00, 0x60, 0x02, 0x00, 0x00, 0xff,
				   0xff, 0x03, 0x00, 0x40, 0x03, 0x00, 0x80, 0xff, 0xff, 0x07, 0x00, 0x40,
				   0x03, 0x00, 0x80, 0xff, 0xff, 0x07, 0x00, 0x40, 0x03, 0x00, 0x80, 0xff,
				   0xff, 0x0f, 0x00, 0x40, 0x03, 0x00, 0x80, 0xff, 0xff, 0x1f, 0x00, 0x40,
				   0x03, 0x00, 0xc0, 0xff, 0xff, 0x3d, 0x00, 0x40, 0x03, 0x00, 0xc0, 0xff,
				   0xff, 0x38, 0x00, 0x40, 0x03, 0x00, 0xc0, 0xff, 0xff, 0xf8, 0x00, 0x40,
				   0x03, 0x00, 0xe0, 0xff, 0xff, 0xf0, 0x00, 0x40, 0x03, 0x00, 0xe0, 0xff,
				   0xff, 0xe0, 0x01, 0x40, 0x03, 0x00, 0xe0, 0xff, 0xff, 0xc0, 0x03, 0x40,
				   0x03, 0x00, 0xe0, 0xff, 0xff, 0x00, 0x01, 0x40, 0x03, 0x00, 0xe0, 0xfc,
				   0xff, 0x00, 0x00, 0x40, 0x03, 0x00, 0xf0, 0xbc, 0xff, 0x00, 0x00, 0x40,
				   0x03, 0x00, 0xf0, 0x9c, 0xe7, 0x01, 0x00, 0x40, 0x03, 0x00, 0x70, 0x9e,
				   0xc7, 0x00, 0x00, 0x40, 0x03, 0x00, 0x38, 0x9e, 0xc7, 0x01, 0x00, 0x40,
				   0x03, 0x00, 0x38, 0x0e, 0xc7, 0x01, 0x00, 0x40, 0x03, 0x00, 0x38, 0x8e,
				   0xc7, 0x01, 0x00, 0x40, 0x03, 0x00, 0x1f, 0x8e, 0xc3, 0x01, 0x00, 0x40,
				   0x03, 0x80, 0x0f, 0x8f, 0xc7, 0x03, 0x00, 0x40, 0x03, 0xc0, 0x07, 0x8e,
				   0x83, 0x01, 0x00, 0x40, 0x03, 0xe0, 0x03, 0x87, 0x83, 0x03, 0x00, 0x40,
				   0x03, 0xf0, 0x01, 0x87, 0x87, 0x03, 0x00, 0x40, 0x03, 0x78, 0x00, 0x87,
				   0xbf, 0x03, 0x00, 0x40, 0x03, 0x7c, 0x00, 0x83, 0xff, 0x01, 0x00, 0x40,
				   0x03, 0x1f, 0x00, 0xd3, 0xf3, 0x1f, 0x00, 0x40, 0x83, 0x1f, 0x80, 0xff,
				   0xc1, 0xff, 0x01, 0x40, 0xe3, 0x1f, 0xf8, 0xff, 0x01, 0xff, 0xbf, 0x40,
				   0xf3, 0xff, 0xff, 0x3f, 0x00, 0xf8, 0xff, 0x7f, 0xff, 0xff, 0xff, 0xe3,
				   0x2f, 0xf0, 0xff, 0x7f, 0xff, 0xff, 0x3f, 0xe0, 0xff, 0xff, 0xff, 0x7f,
				   0xff, 0xff, 0x1f, 0x80, 0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0x7f, 0x2a,
				   0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0xff, 0xff, 0x8f, 0xff, 0xff, 0x7f,
				   0xff, 0xff, 0xff, 0xff, 0x0f, 0xfc, 0xff, 0x7f, 0xff, 0xff, 0xff, 0xff,
				   0x0f, 0xfc, 0xff, 0x7f, 0xff, 0xff, 0xbf, 0xfa, 0xff, 0xff, 0xff, 0x7f,
				   0xff, 0xff, 0x1f, 0xf8, 0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0x7f, 0xf8,
				   0xff, 0xff, 0xff, 0x7f, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x7f,
				   0xff, 0xff, 0xff, 0xff, 0x01, 0xfe, 0xff, 0x7f, 0xff, 0xff, 0xff, 0xff,
				   0x03, 0xfc, 0xff, 0x7f, 0xff, 0xff, 0xaf, 0xff, 0x87, 0xff, 0xff, 0x7f,
				   0xff, 0xff, 0x0f, 0xa0, 0xfb, 0xff, 0xff, 0x6f, 0xeb, 0xff, 0x3f, 0x80,
				   0xff, 0x7f, 0xff, 0x43, 0x03, 0xe8, 0x7f, 0xc1, 0xff, 0x05, 0xfc, 0x41,
				   0x03, 0x00, 0xff, 0xe7, 0x2f, 0x00, 0x78, 0x40, 0x03, 0x00, 0xf0, 0xdf,
				   0x00, 0x00, 0x3e, 0x40, 0x03, 0x00, 0xc0, 0xff, 0x60, 0x00, 0x1f, 0x40,
				   0x03, 0x00, 0x80, 0xf4, 0x60, 0x80, 0x07, 0x40, 0x03, 0x00, 0xc0, 0xe0,
				   0x70, 0xc0, 0x03, 0x40, 0x03, 0x00, 0xc0, 0xe1, 0x70, 0xe0, 0x03, 0x40,
				   0x03, 0x00, 0xc0, 0xe1, 0x70, 0xe0, 0x00, 0x40, 0x03, 0x00, 0xc0, 0xe1,
				   0x70, 0xf0, 0x00, 0x40, 0x03, 0x00, 0xc0, 0xe1, 0x38, 0x1c, 0x00, 0x40,
				   0x03, 0x00, 0xc0, 0xe1, 0x38, 0x1c, 0x00, 0x40, 0x03, 0x00, 0xc0, 0xf1,
				   0x38, 0x0c, 0x00, 0x40, 0x03, 0x00, 0xc0, 0xe3, 0x38, 0x0e, 0x00, 0x40,
				   0x03, 0x00, 0x80, 0xf3, 0x3c, 0x0f, 0x00, 0x40, 0x03, 0x00, 0x80, 0xf3,
				   0x3c, 0x07, 0x00, 0x40, 0x03, 0x00, 0x80, 0xfb, 0x1c, 0x07, 0x00, 0x40,
				   0x03, 0x00, 0x80, 0xff, 0xbf, 0x07, 0x00, 0x40, 0x03, 0x00, 0x80, 0xff,
				   0xbf, 0x03, 0x00, 0x40, 0x03, 0xe0, 0x00, 0xff, 0xff, 0x03, 0x00, 0x40,
				   0x03, 0xc0, 0x83, 0xff, 0xff, 0x03, 0x00, 0x40, 0x03, 0x80, 0x07, 0xff,
				   0xff, 0x03, 0x00, 0x40, 0x03, 0x00, 0x0f, 0xff, 0xff, 0x01, 0x00, 0x40,
				   0x03, 0x00, 0x1e, 0xff, 0xff, 0x01, 0x00, 0x40, 0x03, 0x00, 0xbc, 0xff,
				   0xff, 0x01, 0x00, 0x40, 0x03, 0x00, 0xf8, 0xff, 0xff, 0x00, 0x00, 0x40,
				   0x03, 0x00, 0xf8, 0xff, 0xff, 0x00, 0x00, 0x40, 0x03, 0x00, 0xf0, 0xff,
				   0xff, 0x00, 0x00, 0x40, 0x03, 0x00, 0xe0, 0xff, 0xff, 0x00, 0x00, 0x40,
				   0x02, 0x00, 0xe0, 0xff, 0xff, 0x00, 0x00, 0x40, 0x06, 0x00, 0xc0, 0xff,
				   0x7f, 0x00, 0x00, 0x60, 0x06, 0x00, 0x80, 0xff, 0x7f, 0x00, 0x00, 0x20,
				   0x0c, 0x00, 0x80, 0xff, 0x7f, 0x00, 0x00, 0x30, 0x18, 0x00, 0x80, 0xff,
				   0x7f, 0x00, 0x00, 0x18, 0x70, 0x00, 0x00, 0xff, 0x7f, 0x00, 0x00, 0x0e,
				   0xc0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x03, 0x00, 0xdb, 0xf6, 0xff,
				   0xff, 0xb6, 0x6d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 
			 };
		
		
		
		data.append(ESC + "+RIB\n");   // specify monochrome ribbon type
		data.append(ESC + "+C 8\n");   // specify thermal intensity
		data.append(ESC + "F\n");	   // clear monochrome buffer
		
		
		
		/**
		data.append(ESC + "G 200 200 0 12 64 1\n");
		
		data.append(ESC + "Z");
			
		for (short b : bytes) {
			data.append(b + " ");
		}
		
		data.append("\n");
		*/
			
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
	
		
	
		/**
		data.append("^XA");
		data.append("^CI28");   // specify Unicode encoding
		data.append("^FO70,30^ATN^BCN,150^FD1234534");
		data.append("^FS");
		data.append("^FO70,225^ATN^FDN. Dossier:"); 
		data.append("^FS");
		data.append("^FO70,275^ATN^FD1321312"); 
		data.append("^FS");
		data.append("^FO70,350^ATN^FD22/1/1975"); 
		data.append("^FS");
		data.append("^FO70,400^ATN^FDMále"); 
		data.append("^FS");
		data.append("^FO420,30^AVN^FDMàrké");
		data.append("^FS");
		data.append("^FO420,105^AVN^FDGoodrich");
		data.append("^PQ1");
		data.append("^XZ");	
		**/
		
		
		try {
			Socket socket = new Socket("192.168.100.103", 9100);
			IOUtils.write(data.toString().getBytes("Windows-1252"), socket.getOutputStream());
			socket.close();
		}
		catch (Exception e) {
			System.out.println("Error connecting to socket: " + e.getMessage());
		}
		
		System.out.println("Finished.");
	}
}
