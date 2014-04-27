package com.easyguide.main;

import java.sql.Array;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.apache.tomcat.jdbc.pool.PoolProperties;


/**
 * Performs SQL queries on MySql server
 */
public class MySqlConnector 
{
	public static long DAY_IN_MS = 1000 * 60 * 60 * 24;																// Date in MS for time based calculations
	public static java.text.SimpleDateFormat DATE_FORMAT = new java.text.SimpleDateFormat( "yyyy-MM-dd HH:mm:ss" );	// Standard Date format to use
	
	private static Connection conn = null;	
	private static DataSource datasource;

	// Hostname
	//private static String dbHost = "67.231.242.50";
	private static String dbHost = "localhost";

	// Port -- Standard: 3306
	private static String dbPort = "3306";

	// Name
	private static String database = "easy_guide";

	// User
	private static String dbUser = "root";

	// Pass
	private static String dbPassword = "eAsY_Gu1d3<>;";

	
	// Init connection
	public MySqlConnector() 
	{
		Connect();
	}
	
	
	// Should be called before trying to get connection
	public void Connect()
	{
		PoolProperties p = new PoolProperties();
		p.setUrl( "jdbc:mysql://" + dbHost + ":" + dbPort + "/" + database );
		p.setDriverClassName( "com.mysql.jdbc.Driver" );
		p.setUsername( dbUser );
		p.setPassword( dbPassword );
		p.setValidationQuery( "SELECT 1" );
		p.setValidationInterval( 30000 );
		p.setTimeBetweenEvictionRunsMillis( 2000 );
		p.setMaxActive( 100 );
		p.setInitialSize( 10 );
		p.setMaxWait( 10000 );
		p.setRemoveAbandonedTimeout( 60 );
		p.setMinEvictableIdleTimeMillis( 1100000 );
		p.setMinIdle( 10 );
		p.setMaxIdle( 50 );
		p.setJmxEnabled( true );
		p.setLogAbandoned( true );
		p.setRemoveAbandoned( true );
		p.setTestOnBorrow( true );
		p.setTestWhileIdle( true );
		p.setTestOnReturn( false );
		p.setAbandonWhenPercentageFull( 75 );
		p.setJdbcInterceptors( "org.apache.tomcat.jdbc.pool.interceptor.ConnectionState;" + "org.apache.tomcat.jdbc.pool.interceptor.StatementFinalizer" );
		datasource = new DataSource();
		datasource.setPoolProperties( p );
	}
}
