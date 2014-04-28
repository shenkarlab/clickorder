package com.easyguide.main;

// Base action class
public abstract class BaseAction
{
	protected int		m_recordingID;		// Unique recording ID 
	protected int		m_index;			// Action index
	
	
	// Base ctor
	public BaseAction( int recordingID, int index )
	{
		m_recordingID = recordingID;
		m_index = index;
	}
	

	public int getRecordingID()
	{
		return m_recordingID;
	}


	public int getiIndex()
	{
		return m_index;
	}
	
}
