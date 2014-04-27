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

/**
 * Server entry point - implements HttpServlet
 */
@WebServlet("/EasyGuide")
public class Main extends HttpServlet 
{
	private static final long serialVersionUID = 1L;
	private static SqlConnector sql;

       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Main() 
    {
        super(); 
        sql = new SqlConnector();
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
			// Get command from request
			String commandId = request.getParameter( Commands.KEY_COMMAND  );
			
			// Write the command to response
			response.getWriter().write( Commands.KEY_COMMAND );
			
			// Check which command was received
			switch( commandId )
			{
				case Commands.COMMAND_CREATE_RECORDING:
					
					break;
			}
		}
		catch ( Exception e )
		{
			// General server exception
			return;
		}
	}
	
}
