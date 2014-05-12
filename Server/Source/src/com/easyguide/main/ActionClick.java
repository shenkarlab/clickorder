package com.easyguide.main;

import java.sql.Date;

// Action click class
public class ActionClick extends BaseAction 
{
	private String		m_elementID;	// Page element ID	
	
	// Ctor
	public ActionClick( int recordingID, Date index, String elementID )
	{
		super( recordingID, index );
		
		m_elementID = elementID;
	}

	
	public String getElementID() 
	{
		return m_elementID;
	}
}
