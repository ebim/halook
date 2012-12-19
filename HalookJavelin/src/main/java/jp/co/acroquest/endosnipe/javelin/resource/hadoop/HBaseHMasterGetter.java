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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import jp.co.acroquest.endosnipe.common.config.JavelinConfig;
import jp.co.acroquest.endosnipe.common.entity.DisplayType;
import jp.co.acroquest.endosnipe.common.entity.ItemType;
import jp.co.acroquest.endosnipe.common.entity.ResourceItem;
import jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HMasterMonitor;
import jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HRegionInfo;
import jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerInfo;
import jp.co.acroquest.endosnipe.javelin.util.HashMap;

/**
 * HBaseのHMasterから収集した情報を取得するためのGetterクラス。
 * 
 * @author ochiai
 */
public class HBaseHMasterGetter extends HadoopGetter
{
    /** 前回Splitした際の数 */
    private int           previousSplitCount_ = 0;

    /** Javelin設定 */
    private JavelinConfig config_             = new JavelinConfig();

    @Override
    public List<ResourceItem> getValues()
    {
        List<ResourceItem> returnList = new ArrayList<ResourceItem>();
        if (config_.isCollectHBaseAgentResources() == false || HMasterMonitor.gethMaster() == null)
        {
            return returnList;
        }

        Map<String, HServerInfo> serverInfoMap = HMasterMonitor.getServerInfo();
        int regionCount = addServerInfo(returnList, serverInfoMap);

        String event = createEvent();
        addEvent(returnList, regionCount, event);

        Map<HServerInfo, List<HRegionInfo>> assignmentMap = HMasterMonitor.getAssignments();
        addTableInfo(returnList, assignmentMap);

        return returnList;
    }

    private void addTableInfo(List<ResourceItem> returnList,
            Map<HServerInfo, List<HRegionInfo>> assignmentMap)
    {
        Map<String, Map<String, Integer>> tableMap = new HashMap<String, Map<String, Integer>>();
        for (Map.Entry<HServerInfo, List<HRegionInfo>> entry : assignmentMap.entrySet())
        {
            HServerInfo hServerInfo = entry.getKey();
            List<HRegionInfo> regionList = entry.getValue();
            for (HRegionInfo regionInfo : regionList)
            {
                String tableName = regionInfo.getTableDesc().getNameAsString();
                Map<String, Integer> map = tableMap.get(tableName);
                if (map == null)
                {
                    map = new HashMap<String, Integer>();
                    tableMap.put(tableName, map);
                }

                String serverName = getServerName(hServerInfo.getServerName());
                Integer serverRegionCount = map.get(serverName);
                if (serverRegionCount == null)
                {
                    serverRegionCount = Integer.valueOf(1);
                }
                else
                {
                    serverRegionCount = serverRegionCount + 1;
                }

                map.put(serverName, serverRegionCount);
            }
        }

        for (Map.Entry<String, Map<String, Integer>> entry : tableMap.entrySet())
        {
            String tableName = entry.getKey();
            Map<String, Integer> map = entry.getValue();

            for (Map.Entry<String, Integer> serverEntry : map.entrySet())
            {
                String serverName = serverEntry.getKey();
                Integer serverRegionCount = serverEntry.getValue();
                
                returnList.add(createResourceItem("/hbase/table/" + tableName + "/" + serverName
                        + "/regioncount", String.valueOf(serverRegionCount), getItemType()));
                
            }
        }
    }

    private void addEvent(List<ResourceItem> returnList, int regionCount, String event)
    {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        returnList.add(createResourceItem("/hbase/event", "{\"RegionNumber\":" + regionCount
                + ",\"EventList\":[{\"EventTime\":\"" + dateFormat.format(new Date())
                + "\",\"EventName\":\"" + event + "\",\"EventArgs\":\"\"}]}", getItemType()));
    }

    private int addServerInfo(List<ResourceItem> returnList, Map<String, HServerInfo> serverInfoMap)
    {
        int regionCount = 0;
        int requestCount = 0;
        for (Map.Entry<String, HServerInfo> entry : serverInfoMap.entrySet())
        {
            HServerInfo info = entry.getValue();
            int numberOfRegions = info.getLoad().getNumberOfRegions();
            int numberOfRequests = info.getLoad().getNumberOfRequests();
            String serverName = info.getServerName();
            serverName = getServerName(serverName);

            returnList.add(createResourceItem("/hbase/regionserver/" + serverName + "/regioncount",
                                              String.valueOf(numberOfRegions), getItemType()));
            returnList.add(createResourceItem("/hbase/regionserver/" + serverName + "/requestcount",
                                              String.valueOf(numberOfRequests), getItemType()));
            returnList.add(createResourceItem("/hbase/regionserver/" + serverName + "/usedheap:MB",
                                              String.valueOf(info.getLoad().getUsedHeapMB()),
                                              getItemType()));

            regionCount += numberOfRegions;
            requestCount = numberOfRequests;
        }
        returnList.add(createResourceItem("/hbase/regionserver/--all--/regioncount",
                                          String.valueOf(regionCount), getItemType()));
        returnList.add(createResourceItem("/hbase/regionserver/--all--/requestcount",
                                          String.valueOf(requestCount), getItemType()));
        return regionCount;
    }

    private String getServerName(String serverName)
    {
        int lastIndexOfDQuote = serverName.lastIndexOf(",");
        if (lastIndexOfDQuote >= 0)
        {
            serverName = serverName.substring(0, lastIndexOfDQuote);
        }
        return serverName;
    }

    private String createEvent()
    {
        String event = "";
        int splitCount = HMasterMonitor.getSplitCount();
        if (this.previousSplitCount_ < splitCount)
        {
            this.previousSplitCount_ = splitCount;
            event = "Split";
        }
        return event;
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
    private ResourceItem createResourceItem(String name, String value, ItemType itemType)
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
