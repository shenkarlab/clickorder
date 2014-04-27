package com.easyguide.main;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import com.sun.jmx.snmp.Timestamp;



/**
 * General SQL connector, receives data request and redirects them to the active sql DB connector
 */
public class SqlConnector 
{

	private static MySqlConnector 		mySql;		// Ref to MySQL object
	
	// TODO: add prepared statements below
	
	
	// Ctor
	public SqlConnector()
	{
		mySql = new MySqlConnector();
	}
}
