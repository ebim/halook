/*
 * Copyright (c) 2012 Acroquest Technology Co., Ltd. All Rights Reserved.
 * Please read the associated COPYRIGHTS file for more details.
 *
 * THE SOFTWARE IS PROVIDED BY Acroquest Technology Co., Ltd., WITHOUT
 * WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
 * AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDER BE LIABLE FOR ANY
 * CLAIM, DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING, MODIFYING
 * OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
 */
package jp.co.acroquest.endosnipe.web.dashboard.dto;

import java.util.HashMap;
import java.util.Map;

/**
 * 複数系列のデータを扱うことができるDto
 * 
 * @author nakagawa
 *
 */
public class MultipleMeasurementValueDto {

	/** 検索文字列 */
	private String searchCondition;
	
    /** 計測時刻。 */
    private long   measurementTime;	
	
    /** 複数系列の測定結果 */
    private Map<String, String> measurementValue = new HashMap<String, String>();

	public String getSearchCondition() {
		return searchCondition;
	}

	public void setSearchCondition(String searchCondition) {
		this.searchCondition = searchCondition;
	}

	public long getMeasurementTime() {
		return measurementTime;
	}

	public void setMeasurementTime(long measurementTime) {
		this.measurementTime = measurementTime;
	}

	public Map<String, String> getMeasurementValue() {
		return measurementValue;
	}

	public void setMeasurementValue(Map<String, String> measurementValue) {
		this.measurementValue = measurementValue;
	}
    
}
