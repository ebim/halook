package org.wgp.interceptor;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.wgp.dto.BufferDto;
import org.wgp.manager.MessageInboundManager;
import org.wgp.manager.WgpBufferManager;

@Component
public class CompleteUpdateDataInterceptor {

	/** WgpBufferManager */
	@Autowired
	WgpBufferManager wgpBufferManager;
	
	/**
	 * if complete execute method, send data to client.
	 * @param joinPoint joinpointObject.
	 */
	public void completeInterceptor() {
		Map<String, Map<String, BufferDto>> bufferData = wgpBufferManager.extractBufferData();
		MessageInboundManager messageInboundManager = MessageInboundManager.getInstance();
		if (bufferData != null) {
			messageInboundManager.notifyMessage(bufferData);
		}
	}
}
