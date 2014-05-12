package com.easyguide.main;

import java.sql.Date;

// Base action class
public abstract class BaseAction
{
	protected int		m_recordingID;		// Unique recording ID 
	protected Date		m_index;			// Action index
	
	
	// Base ctor
	public BaseAction( int recordingID, Date index )
	{
		m_recordingID = recordingID;
		m_index = index;
	}
	

	public int getRecordingID()
	{
		return m_recordingID;
	}


	public Date getiIndex()
	{
		return m_index;
	}
	
}
