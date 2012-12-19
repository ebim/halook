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

public class HRegionInfo
{
    private byte[]             startKey;

    private byte[]             endKey;

    private boolean            offLine;

    private long               regionId;

    private transient byte[]   regionName;

    private String             regionNameStr;

    private boolean            split;

    private volatile String    encodedName;

    private byte[]             encodedNameAsBytes;

    protected HTableDescriptor tableDesc = null;

    public byte[] getEndKey()
    {
        return endKey;
    }

    public void setEndKey(byte[] endKey)
    {
        this.endKey = endKey;
    }

    public boolean isOffLine()
    {
        return offLine;
    }

    public void setOffLine(boolean offLine)
    {
        this.offLine = offLine;
    }

    public long getRegionId()
    {
        return regionId;
    }

    public void setRegionId(long regionId)
    {
        this.regionId = regionId;
    }

    public byte[] getRegionName()
    {
        return regionName;
    }

    public void setRegionName(byte[] regionName)
    {
        this.regionName = regionName;
    }

    public String getRegionNameStr()
    {
        return regionNameStr;
    }

    public void setRegionNameStr(String regionNameStr)
    {
        this.regionNameStr = regionNameStr;
    }

    public boolean isSplit()
    {
        return split;
    }

    public void setSplit(boolean split)
    {
        this.split = split;
    }

    public byte[] getStartKey()
    {
        return startKey;
    }

    public void setStartKey(byte[] startKey)
    {
        this.startKey = startKey;
    }

    public String getEncodedName()
    {
        return encodedName;
    }

    public void setEncodedName(String encodedName)
    {
        this.encodedName = encodedName;
    }

    public byte[] getEncodedNameAsBytes()
    {
        return encodedNameAsBytes;
    }

    public void setEncodedNameAsBytes(byte[] encodedNameAsBytes)
    {
        this.encodedNameAsBytes = encodedNameAsBytes;
    }

    public HTableDescriptor getTableDesc()
    {
        return tableDesc;
    }

    public void setTableDesc(HTableDescriptor tableDesc)
    {
        this.tableDesc = tableDesc;
    }
}
