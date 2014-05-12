package com.easyguide.main;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


/**
 * Server entry point - implements HttpServlet
 */
@WebServlet("/Main")
public class Main extends HttpServlet 
{
	private static final long 		m_serialVersionID = 1L;
	private static SqlWrapper 		m_sql;
	private static final boolean 	DEBUG_MODE = false;
	
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Main() 
    {
        super(); 
        m_sql = new SqlWrapper();
    }
    

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet( HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException 
	{


	}
	

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost( HttpServletRequest request, HttpServletResponse response ) throws ServletException, IOException 
	{	
		try
		{
			String commandId;
			JsonObject obj = new JsonObject();
			
			// User real data from request
			if ( !DEBUG_MODE )
			{
				String requestData = request.getParameter( Commands.KEY_DATA );
	
				JsonParser parser = new JsonParser();
				obj = ( JsonObject )parser.parse( requestData );
				commandId = obj.get( Commands.KEY_COMMAND ).toString();
			}
			// Use debug data
			else
			{
				/* Debug create recording */
				obj.addProperty( Commands.KEY_COMMAND, Commands.COMMAND_CREATE_RECORDING );
				commandId = obj.get( Commands.KEY_COMMAND ).toString();
			}
			
			// Check which command was received
			//if ( commandId.equals( Commands.COMMAND_CREATE_RECORDING ) )
			//{
				CreateEmptyRecording( response, obj );
			//}
			//else if ( commandId.equals( Commands.COMMAND_SAVE_RECORDING ) )
			//{
				SaveRecording( response, obj );
			//}
		}
		catch ( Exception e )
		{
			// General server exception
			return;
		}
	}
	
	
	// Creates a new recording
	private void CreateEmptyRecording( HttpServletResponse response, JsonObject json )
	{
		String name = json.get( Commands.KEY_NAME ).toString();
		String result = m_sql.CreateRecording( name );
		try 
		{
			response.getWriter().write( result );
		} 
		catch (IOException e) 
		{
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	
	
	// Saves a recording to DB
	// Update exisiting one if exists or creating new one
	// Returns the recording ID in response
	private void SaveRecording( HttpServletResponse response, JsonObject json )
	{
		String name = json.get( Commands.KEY_NAME ).toString();
		String ID = json.get( Commands.KEY_RECORDING_ID ).toString();
		String result = "";
		if ( ID == null || ID == "" )
		{
			// New recording, first create entry in DB
			result = m_sql.CreateRecording( name );
		}
		
		// Parse commands
		
	}
	
}
