package com.easyguide.main;

/**
 * Available server commands and commands keys
 */
public class Commands 
{
	// Commands
	final static String COMMAND_CREATE_RECORDING 		= "command_create_recording";	// Create new recording and return the ID
	final static String COMMAND_SAVE_RECORDING			= "command_save_recording";		// Save recording, if ID is empty, creates a new recording ID
	
	// Unique keys
	final static String KEY_COMMAND 					= "key_command";	   	 		// Command to parse
	final static String KEY_RECORDING_ID 				= "key_recording_id";	   	 	// Command to parse
	final static String KEY_DATA 						= "key_data";	   	 			// JSON data key
	final static String KEY_NAME 						= "key_name";	   	 			// Command to parse
}
