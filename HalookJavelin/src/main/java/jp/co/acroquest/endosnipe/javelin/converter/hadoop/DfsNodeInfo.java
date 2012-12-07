package jp.co.acroquest.endosnipe.javelin.converter.hadoop;

public class DfsNodeInfo {
	private String hostName_;
	private long dfsUsed_;
	private long capacity_;

	public String getHostName() {
		return hostName_;
	}

	public void setHostName(String hostName) {
		this.hostName_ = hostName;
	}

	public long getDfsUsed() {
		return dfsUsed_;
	}

	public void setDfsUsed(long dfsUsed) {
		this.dfsUsed_ = dfsUsed;
	}

	public long getCapacity() {
		return capacity_;
	}

	public void setCapacity(long capacity) {
		this.capacity_ = capacity;
	}

}
