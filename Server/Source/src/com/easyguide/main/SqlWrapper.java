package com.easyguide.main;

import java.io.IOException;
import java.io.StringWriter;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import com.sun.jmx.snmp.Timestamp;
import org.json.simple.JSONObject;




/**
 * General SQL connector, receives data request and redirects them to the active sql DB connector
 */
public class SqlWrapper 
{
	private static MySqlConnector 		mySql;		// Ref to MySQL object
	
	// TODO: add prepared statements below
	private String  					m_insertRecordingQuery = "INSERT INTO recordings (Name) VALUES(?)";
	
	// Ctor
	public SqlWrapper()
	{
		mySql = new MySqlConnector();
	}
	
	
	// Creates a new recording and returns the ID in JSON format
	public String CreateRecording( String name )
	{
		int ID = mySql.CreateRecording( m_insertRecordingQuery, name );
		
		JSONObject obj = new JSONObject();

		obj.put( "Command", Commands.COMMAND_CREATE_RECORDING );
	    obj.put( "ID", ID );
	    obj.put( "Name", name );

	    StringWriter out = new StringWriter();
	    try 
	    {
			obj.writeJSONString( out );
		} 
	    catch ( IOException e ) 
	    {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	      
	      return out.toString();
	}
}
