/*******************************************************************************
 * ENdoSnipe 5.0 - (https://github.com/endosnipe)
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2012 Acroquest Technology Co.,Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
package jp.co.acroquest.endosnipe.javelin.resource.hadoop;

import java.util.ArrayList;
import java.util.List;

import jp.co.acroquest.endosnipe.common.config.JavelinConfig;
import jp.co.acroquest.endosnipe.common.entity.DisplayType;
import jp.co.acroquest.endosnipe.common.entity.ItemType;
import jp.co.acroquest.endosnipe.common.entity.ResourceItem;
import jp.co.acroquest.endosnipe.common.logger.SystemLogger;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopInfo;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopJobStatusInfo;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopMeasurementInfo;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopRecorder;
import jp.co.acroquest.endosnipe.javelin.converter.hadoop.HadoopTaskStatus;

/**
 *  Hadoop JobTracker の情報を取得するGetter。
 * 
 * @author Ochiai
 *
 */
public class HadoopJobTrackerGetter extends HadoopGetter
{
    /** Jobの情報を表す項目名 */
    private static final String ITEM_NAME_JOB              = "/mapreduce/job";

    /** Taskの情報を表す項目名 */
    private static final String ITEM_NAME_TASK             = "/mapreduce/task";

    /** Javelin設定 */
    private JavelinConfig config_              = new JavelinConfig();

    @Override
    public List<ResourceItem> getValues()
    {
        SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : start");
        List<ResourceItem> returnList = new ArrayList<ResourceItem>();
        
        if (config_.isCollectHadoopAgentResources() == false
                || HadoopRecorder.isInitialized() == false)
        {
            return returnList;
        }
       
        // HadoopConverter によるJob, Taskの情報を取得する
        HadoopMeasurementInfo measurementInfo =  HadoopMeasurementInfo.getInstance();
        List<HadoopJobStatusInfo> jobInfoList = measurementInfo.getAllJobStatusList();
        List<HadoopInfo> hadoopInfoList = measurementInfo.getAllTaskTrackerStatusList();
        
        SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : jobInfoList " + jobInfoList.size());

        // Jobの情報を取得する
        StringBuilder jobInfoBuilder = new StringBuilder();
        jobInfoBuilder.append("[");
        
        for (HadoopJobStatusInfo jobInfo : jobInfoList)
        {
            if (jobInfoBuilder.length() > 1)
            {
                jobInfoBuilder.append(",");
            }
            String jobInfoJSON = jobInfo.getJson();
            jobInfoBuilder.append(jobInfoJSON);
            SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : jobInfoJSON " + jobInfoJSON);
        }
        jobInfoBuilder.append("]");
        String jobInfoListJSON = jobInfoBuilder.toString();
        
        if (jobInfoListJSON.length() > 2)
        {
            ResourceItem jobInfoItem = 
                    createResourceItem(ITEM_NAME_JOB, jobInfoListJSON, ItemType.ITEMTYPE_STRING);
            returnList.add(jobInfoItem);
            SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : jobInfoListJSON " + jobInfoListJSON);
        }
        
        SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : hadoopInfoList " + hadoopInfoList.size());

        // Taskの情報を取得する
        StringBuilder taskInfoBuilder = new StringBuilder();
        taskInfoBuilder.append("[");

        for (HadoopInfo hadoopInfo : hadoopInfoList)
        {
            jp.co.acroquest.endosnipe.javelin.util.ArrayList<HadoopTaskStatus> taskStatusList = 
                    hadoopInfo.getTaskStatuses();
            for(HadoopTaskStatus taskStatus : taskStatusList)
            {
                if (taskInfoBuilder.length() > 1)
                {
                    taskInfoBuilder.append(",");
                }
                taskStatus.setHostname(hadoopInfo.getHost());
                String taskStatusJSON = taskStatus.getJson();
                taskInfoBuilder.append(taskStatusJSON);
                SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : taskStatusJSON " + taskStatusJSON);
            }
        }
        taskInfoBuilder.append("]");
        String taskInfoListJSON = taskInfoBuilder.toString();
        
        if (taskInfoListJSON.length() > 2)
        {
            ResourceItem taskInfoItem = 
                    createResourceItem(ITEM_NAME_TASK, taskInfoListJSON, ItemType.ITEMTYPE_STRING);
            returnList.add(taskInfoItem);
            SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : taskInfoListJSON " + taskInfoListJSON);
        }
        
        SystemLogger.getInstance().info("HadoopJobTrackerGetter.getValues() : end");

        return returnList;
    }

    @Override
    public ItemType getItemType()
    {
        return ItemType.ITEMTYPE_STRING;
    }

    /**
     * ResourceItemを作成する
     * 
     * @param name Item Name
     * @return JMXの値を取得した結果を ResourceItem の形式で返す
     */
    private ResourceItem createResourceItem(String name, String value,
            ItemType itemType)
    {
        ResourceItem retValue = new ResourceItem();

        retValue.setValue(value);
        retValue.setItemType(itemType);
        retValue.setObjectName(name);
        retValue.setName(name);
        retValue.setObjectDisplayNeme(name);
        retValue.setDisplayName(name);
        retValue.setDisplayType(DisplayType.DISPLAYTYPE_NORMAL);

        return retValue;
    }

}
