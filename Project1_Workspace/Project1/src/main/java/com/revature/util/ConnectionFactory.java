package com.revature.util;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

import oracle.jdbc.driver.OracleDriver;
import org.apache.log4j.Logger;

public class ConnectionFactory {
	
	private static Logger log = Logger.getLogger(ConnectionFactory.class);
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
            prop.load(new FileReader("C:\\Users\\Abe\\Desktop\\repos\\Rev-Project_1\\Project1_Workspace\\Project1\\src\\main\\resources\\application.properties"));
            
            DriverManager.registerDriver(new OracleDriver());
            
            //Get a connection from the DriverManager class
            conn = DriverManager.getConnection(
                    prop.getProperty("url"),
                    prop.getProperty("usr"),
                    prop.getProperty("pw"));
            
        } catch (SQLException sqle) {
			log.error(sqle.getMessage());
		} catch (FileNotFoundException fnfe) {
			log.error(fnfe.getMessage());
		} catch (IOException ioe) {
			log.error(ioe.getMessage());
		}
        
        if (conn == null) log.warn("Connection object is null");
        return conn;        
    } 
}
