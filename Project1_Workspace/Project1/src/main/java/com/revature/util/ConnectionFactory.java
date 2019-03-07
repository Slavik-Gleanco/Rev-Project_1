package com.revature.util;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class ConnectionFactory {
private static ConnectionFactory cf = new ConnectionFactory();
    
    private ConnectionFactory() {
        super();
    }
    
    public static ConnectionFactory getInstance() {
        return cf;
    }
    
    public Connection getConnection() {

        Connection conn = null;
        
        //We use a .properties file so we do not hard-code our db credentials into the source code
        Properties prop = new Properties();
        
        try {
            
            // Load the properties file (application.properties) keys/values into the Properties Object
            prop.load(new FileReader("src/main/resources/application.properties"));
            
            //Get a connection from the DriverManager class
            conn = DriverManager.getConnection(
                    prop.getProperty("url"),
                    prop.getProperty("usr"),
                    prop.getProperty("pw"));
        }catch (SQLException sqle) {
            sqle.printStackTrace();
        } catch (FileNotFoundException fnfe) {
            fnfe.printStackTrace();
        } catch(IOException ioe) {
            ioe.printStackTrace();
        }
        
        return conn;
        
    }
    
}
