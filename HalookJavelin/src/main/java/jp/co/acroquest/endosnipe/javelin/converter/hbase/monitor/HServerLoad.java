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

import java.util.List;

public class HServerLoad
{
    private int              numberOfRegions;

    private int              numberOfRequests;

    private int              usedHeapMB;

    private int              maxHeapMB;

    private List<RegionLoad> regionLoad;

    public int getNumberOfRegions()
    {
        return numberOfRegions;
    }

    public void setNumberOfRegions(int numberOfRegions)
    {
        this.numberOfRegions = numberOfRegions;
    }

    public int getNumberOfRequests()
    {
        return numberOfRequests;
    }

    public void setNumberOfRequests(int numberOfRequests)
    {
        this.numberOfRequests = numberOfRequests;
    }

    public int getUsedHeapMB()
    {
        return usedHeapMB;
    }

    public void setUsedHeapMB(int usedHeapMB)
    {
        this.usedHeapMB = usedHeapMB;
    }

    public int getMaxHeapMB()
    {
        return maxHeapMB;
    }

    public void setMaxHeapMB(int maxHeapMB)
    {
        this.maxHeapMB = maxHeapMB;
    }

    public List<RegionLoad> getRegionLoad()
    {
        return regionLoad;
    }

    public void setRegionLoad(List<RegionLoad> regionLoad)
    {
        this.regionLoad = regionLoad;
    }

    public static class RegionLoad
    {
        private byte[] name;

        private int    stores;

        private int    storefiles;

        private int    storefileSizeMB;

        private int    memstoreSizeMB;

        private int    storefileIndexSizeMB;

        public byte[] getName()
        {
            return name;
        }

        public void setName(byte[] name)
        {
            this.name = name;
        }

        public int getStores()
        {
            return stores;
        }

        public void setStores(int stores)
        {
            this.stores = stores;
        }

        public int getStorefiles()
        {
            return storefiles;
        }

        public void setStorefiles(int storefiles)
        {
            this.storefiles = storefiles;
        }

        public int getStorefileSizeMB()
        {
            return storefileSizeMB;
        }

        public void setStorefileSizeMB(int storefileSizeMB)
        {
            this.storefileSizeMB = storefileSizeMB;
        }

        public int getMemstoreSizeMB()
        {
            return memstoreSizeMB;
        }

        public void setMemstoreSizeMB(int memstoreSizeMB)
        {
            this.memstoreSizeMB = memstoreSizeMB;
        }

        public int getStorefileIndexSizeMB()
        {
            return storefileIndexSizeMB;
        }

        public void setStorefileIndexSizeMB(int storefileIndexSizeMB)
        {
            this.storefileIndexSizeMB = storefileIndexSizeMB;
        }
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = 1;
        result = prime * result + maxHeapMB;
        result = prime * result + numberOfRegions;
        result = prime * result + numberOfRequests;
        result = prime * result + ((regionLoad == null) ? 0 : regionLoad.hashCode());
        result = prime * result + usedHeapMB;
        return result;
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        HServerLoad other = (HServerLoad)obj;
        if (maxHeapMB != other.maxHeapMB)
            return false;
        if (numberOfRegions != other.numberOfRegions)
            return false;
        if (numberOfRequests != other.numberOfRequests)
            return false;
        if (regionLoad == null)
        {
            if (other.regionLoad != null)
                return false;
        }
        else if (!regionLoad.equals(other.regionLoad))
            return false;
        if (usedHeapMB != other.usedHeapMB)
            return false;
        return true;
    }

}
