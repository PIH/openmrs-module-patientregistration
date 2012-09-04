package org.openmrs.module.patientregistration.util;

import java.io.InputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectStreamClass;

public class ObjectStoreInputStream extends ObjectInputStream {
    /**
     * Creates a new ObjectStoreInputStream.
     * @param in The InputStream to read from.
     * @throws IOException If there is an error during initialization.
     */
    public ObjectStoreInputStream(InputStream in) throws IOException {
        super(in);
    }

    /**
     * Loads the Class corresponding to the specified description.
     * First attempts to load from the default ClassLoader, then 
     * attempts to load from the DeployLoader.
     * @param desc An ObjectStreamClass describing a serialized class.
     * @return A Class object corresponding to the specified description.
     * @throws IOException If there is an IO error.
     * @throws ClassNotFoundException If the class cannot be resolved.
     */
    protected Class resolveClass(ObjectStreamClass desc) 
        throws IOException, ClassNotFoundException {
        Class thisClass=null;
        try {
            thisClass = super.resolveClass(desc);
        }
        catch (ClassNotFoundException ex) {
           
        }
        return thisClass;
    }
}
