package org.openmrs.module.patientregistration.util;



import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.openmrs.util.OpenmrsUtil;

/**
 * Simple implementation of a persistant store of objects.  The objects
 * are grouped by some id.  Locking is kept to a minimum (one on list of
 * objects, one on map of lists).
 * <p/>
 * The name of a store must be specified as a valid directory name.
 * <p/>
 * The name of any property stored on the store must be a valid file name.
 * <p/>
 */
public class ObjectStore extends Object
{
    /**
     * Root directory of store
     */
    protected File persistenceHome = null;

    /**
     * Map of objects in store (oid=>object)
     */
    protected Map<File,Object> store = new HashMap<File,Object>();

    /**
     * this.storeName => ObjectStore
     */
    private static Map<String,ObjectStore> stores = 
        new HashMap<String,ObjectStore>();

    /**
     * Local logger instance
     */
    private static Log log = LogFactory.getLog(ObjectStore.class);

    /**
     * Accessor for singleton instance of name storeName.
     * Creates an instance if one is not found.
     * @param storeName The name of store to get (must be a valid dir name)
     */
    public static ObjectStore getInstance (String storeName)
    {
        return getInstance(storeName, false);
    }
    
    /**
     * Accessor for singleton instance of name storeName.
     * Creates an instance if one is not found.
     * @param storeName The name of store to get (must be a valid dir name)
     * @param reload Reload the store if found
     */
    public static ObjectStore getInstance (String storeName, boolean reload)
    {
        ObjectStore store = null;

        if (reload)
        {
            synchronized (stores)
            {
                store = new ObjectStore(storeName);
                stores.put(storeName, store);
            }
        }
        else
        {
            store = stores.get(storeName);
            if (store == null)
            {
                synchronized (stores)
                {
                    store = stores.get(storeName);
                    if (store == null)
                    {
                        store = new ObjectStore(storeName);
                        stores.put(storeName, store);
                    }
                }
                
            }
        }

        return store;
    }

    /**
     * Return the names of all known stores
     */
    public static List<String> getKnownStores ()
    {
        List<String> known = new ArrayList<String>();

        synchronized (stores)
        {
            Iterator<String> it = stores.keySet().iterator();
            while (it.hasNext())
            {
                known.add(it.next());
            }
        }

        return known;
    }
    
    /**
     * Default constructor.  Creates this store; reads any persisted store
     * data from store to restore its last known state.
     * <p/>
     * Accessor getInstance(storeName) must be used; do not create your
     * own unmanaged instances of store.
     * <p/>
     * The failure of reading any persisted list of data results only in
     * a log message; the file remains on the file system but is not loaded
     * into memory.
     * <p/>
     * @param storeName The name of the store to load / create
     * @return ObjectStore The singleton instance of the named store
     */
    private ObjectStore (String storeName)
    {
        persistenceHome = new File(OpenmrsUtil.getApplicationDataDirectory() + File.separatorChar 
        						+ "persistence" + File.separatorChar +
                                   storeName + File.separatorChar);

        if (persistenceHome.exists())
        {
            String[] files = persistenceHome.list();
            if (files != null)
            {
                for (int x = 0; x < files.length; x++)
                {
                    File file = new File(persistenceHome, files[x]);
                    
                    try
                    {
                        store.put(file, readFile(file));
                    }
                    catch (Exception e)
                    {
                        log.error("Error reading existing persisted object [" + file.toString() + "]", e);
                    }
                }
            }
        }
        else
        {
            persistenceHome.mkdirs();
        }
    }

    /**
     * Returns a thread safe list (thread safe as in there is no
     * backing collection to the list -- not that the List itself
     * was created with Synchronized collection call).
     */
    public List<Object> getKnownValues ()
    {
        List<Object> values = new ArrayList<Object>();
        
        synchronized (store)
        {
            Iterator<Object> it = store.values().iterator();
            while (it.hasNext())
            {
                values.add(it.next());
            }
        }
        
        return values;
    }
    
    /**
     * Returns a thread safe list of java.io.File objects
     * (thread safe as in there is no
     * backing collection to the list -- not that the List itself
     * was created with Synchronized collection call).
     */
    public List<File> getKnownKeys ()
    {
        List<File> values = new ArrayList<File>();
        
        synchronized (store)
        {
            Iterator<File> it = store.keySet().iterator();
            while (it.hasNext())
            {
                values.add(it.next());
            }
        }
        
        return values;
    }

    /**
     * Returns a thread safe list  of Strings(thread safe as in there is no
     * backing collection to the list -- not that the List itself
     * was created with Synchronized collection call).
     */
    public List<String> getKnownKeysAsString ()
    {
        List<String> values = new ArrayList<String>();
        
        synchronized (store)
        {
            Iterator<File> it = store.keySet().iterator();
            while (it.hasNext())
            {
                File file = it.next();
                if(file != null)
                {
                    values.add(file.getName());
                }
            }
        }
        
        return values;
    }    
    /**
     * Removes the object specified by this id from the store.
     * <p/>
     * @param  id        The key to use for removal
     * @throws Exception Error removing from store
     */
    public void clear (String id) throws Exception
    {
        File file = new File(persistenceHome, id);

        synchronized (store)
        {
            store.remove(file);
            file.delete();
        }
    }

    /**
     * Getter for object from store by id.
     * <p/>
     * @return Object that is found or null if not found
     */
    public Object retrieve (String id) throws Exception
    {
        return retrieve(new File(persistenceHome, id));
    }
    
    /**
     * Getter for object from store by file id
     * <p/>
     * @return Object that is found or null if not found
     */
    public Object retrieve (File file) throws Exception
    {
        return store.get(file);
    }

    /**
     * Puts an object in the store
     */
    public void put (Object object, String id) throws Exception
    {
        File file = new File(persistenceHome, id);

        synchronized (store)
        {
            writeFile(file, object);
            store.put(file, object);
        }
    }

    /**
     * Writes an object to the specified File.
     */
    private void writeFile (File file, Object object) throws Exception
    {
        FileOutputStream fos = null;
        ObjectOutputStream output = null;
        
        try
        {
            fos = new FileOutputStream(file);
            output = new ObjectOutputStream(fos);
        
            output.writeObject(object);
        }
        finally
        {
            try { output.close(); } catch (Exception e) { /* ok to ignore */ }
            try { fos.close(); } catch (Exception e) { /* ok to ignore */ }
        }
    }
    
    /**
     * Reads a List from the specified File.  Returns null object if
     * file cannot be found.
     */
    private Object readFile (File file) throws Exception
    {
        Object result = null;

        if (file.exists() == true)
        {
            FileInputStream fis = null;
            ObjectStoreInputStream input = null;
            
            try
            {
                fis = new FileInputStream(file);
                input = new ObjectStoreInputStream(fis);

                result = input.readObject();
            }
            finally
            {
                // cleaup, do not log these errors:

                if (fis != null) try { fis.close(); } catch (Exception e) { }
                if (input != null) try { input.close(); } catch (Exception e) { }
            }
        }
        
        return result;
    }
    
}


