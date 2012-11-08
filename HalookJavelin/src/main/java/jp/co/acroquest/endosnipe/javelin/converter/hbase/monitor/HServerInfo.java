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

import java.net.InetSocketAddress;

public class HServerInfo
{
    private InetSocketAddress serverAddress;

    private long              startCode;

    private HServerLoad       load;

    private int               infoPort;

    private java.lang.String  serverName;

    private java.lang.String  hostname;

    private java.lang.String  cachedHostnamePort;

    public InetSocketAddress getServerAddress()
    {
        return serverAddress;
    }

    public void setServerAddress(InetSocketAddress serverAddress)
    {
        this.serverAddress = serverAddress;
    }

    public long getStartCode()
    {
        return startCode;
    }

    public void setStartCode(long startCode)
    {
        this.startCode = startCode;
    }

    public HServerLoad getLoad()
    {
        return load;
    }

    public void setLoad(HServerLoad load)
    {
        this.load = load;
    }

    public int getInfoPort()
    {
        return infoPort;
    }

    public void setInfoPort(int infoPort)
    {
        this.infoPort = infoPort;
    }

    public java.lang.String getServerName()
    {
        return serverName;
    }

    public void setServerName(java.lang.String serverName)
    {
        this.serverName = serverName;
    }

    public java.lang.String getHostname()
    {
        return hostname;
    }

    public void setHostname(java.lang.String hostname)
    {
        this.hostname = hostname;
    }

    public java.lang.String getCachedHostnamePort()
    {
        return cachedHostnamePort;
    }

    public void setCachedHostnamePort(java.lang.String cachedHostnamePort)
    {
        this.cachedHostnamePort = cachedHostnamePort;
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = 1;
        result =
                 prime * result
                         + ((cachedHostnamePort == null) ? 0 : cachedHostnamePort.hashCode());
        result = prime * result + ((hostname == null) ? 0 : hostname.hashCode());
        result = prime * result + infoPort;
        result = prime * result + ((load == null) ? 0 : load.hashCode());
        result = prime * result + ((serverAddress == null) ? 0 : serverAddress.hashCode());
        result = prime * result + ((serverName == null) ? 0 : serverName.hashCode());
        result = prime * result + (int)(startCode ^ (startCode >>> 32));
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
        HServerInfo other = (HServerInfo)obj;
        if (cachedHostnamePort == null)
        {
            if (other.cachedHostnamePort != null)
                return false;
        }
        else if (!cachedHostnamePort.equals(other.cachedHostnamePort))
            return false;
        if (hostname == null)
        {
            if (other.hostname != null)
                return false;
        }
        else if (!hostname.equals(other.hostname))
            return false;
        if (infoPort != other.infoPort)
            return false;
        if (load == null)
        {
            if (other.load != null)
                return false;
        }
        else if (!load.equals(other.load))
            return false;
        if (serverAddress == null)
        {
            if (other.serverAddress != null)
                return false;
        }
        else if (!serverAddress.equals(other.serverAddress))
            return false;
        if (serverName == null)
        {
            if (other.serverName != null)
                return false;
        }
        else if (!serverName.equals(other.serverName))
            return false;
        if (startCode != other.startCode)
            return false;
        return true;
    }

    
}
