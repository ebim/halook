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
package jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import jp.co.acroquest.endosnipe.javelin.util.ArrayList;
import jp.co.acroquest.endosnipe.javelin.util.HashMap;

/**
 * HMasterの参照から情報を取得する為のモニタ。
 * 
 * @author eriguchi
 */
public class HMasterMonitor
{
    private static HMasterAccessor hMaster__;

    private static int             splitCount__;

    public static synchronized int getSplitCount()
    {
        return splitCount__;
    }

    public static synchronized int incrementSplitCount()
    {
        return ++splitCount__;
    }

    public static Map<String, HServerInfo> getServerInfo()
    {
        if (hMaster__ != null)
        {
            return hMaster__.getServerInfo();
        }
        else
        {
            return new HashMap<String, HServerInfo>();
        }
    }

    public static Set<String> getDeadServerInfo()
    {
        if (hMaster__ != null)
        {
            return hMaster__.getDeadServerInfo();
        }
        else
        {
            return new HashSet<String>();
        }
    }

    public static List<HTableDescriptor> listTables()
    {
        if (hMaster__ != null)
        {
            return hMaster__.listTables();
        }
        else
        {
            return new ArrayList<HTableDescriptor>();
        }
    }

    public static int getRegionsOfTable(byte[] name)
    {
        if (hMaster__ != null)
        {
            return hMaster__.getRegionsOfTable(name);
        }
        else
        {
            return 0;
        }
    }

    public static HMasterAccessor gethMaster()
    {
        return hMaster__;
    }

    public static void sethMaster(HMasterAccessor hMaster)
    {
        hMaster__ = hMaster;
    }

    public static Map<HServerInfo, List<HRegionInfo>> getAssignments()
    {
        if (hMaster__ != null)
        {
            return hMaster__.getAssignments();
        }
        else
        {
            return new HashMap<HServerInfo, List<HRegionInfo>>();
        }
    }

}
