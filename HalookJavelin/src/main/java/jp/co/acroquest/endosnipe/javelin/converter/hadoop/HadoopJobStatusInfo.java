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
package jp.co.acroquest.endosnipe.javelin.converter.hadoop;

import java.util.Map;

import jp.co.acroquest.endosnipe.javelin.util.HashMap;
import net.arnx.jsonic.JSON;


/**
 * Jobの状態を保持するクラス。
 *
 * @author ochiai
 *
 */
public class HadoopJobStatusInfo
{
    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    public static final int RUNNING = 1;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    public static final int SUCCEEDED = 2;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    public static final int FAILED = 3;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    public static final int PREP = 4;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    public static final int KILLED = 5;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    private static final String UNKNOWN = "UNKNOWN";

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    private static final String[] RUNSTATE =
        {UNKNOWN, "RUNNING", "SUCCEEDED", "FAILED", "PREP", "KILLED"};
 
    /** jobID の JSONキー  */
    private static final String JOB_ID = "JobID";

    /** jobName の JSONキー  */
    private static final String JOB_NAME = "JobName";

    /** submitTime の JSONキー  */
    private static final String SUBMIT_TIME = "SubmitTime";

    /** startTime の JSONキー  */
    private static final String START_TIME = "StartTime";

    /** finishTime の JSONキー  */
    private static final String FINISH_TIME = "FinishTime";

    /** status の JSONキー  */
    private static final String STATUS = "Status";

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    private String jobID_;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    private int runState_;

    /** org.apache.hadoop.mapred.JobStatus のフィールド  */
    private long startTime_;

    /** ジョブ投入時刻 */
    private long submitTime_;

    /**  ジョブ終了時刻 */
    private long finishTime_;

    /**  ジョブ名 */
    private String jobName_;

    /**  インスタンス生成時刻 */
    private long timestamp_;

    /**
     * コンストラクタ
     */
    public HadoopJobStatusInfo()
    {
        timestamp_ = System.currentTimeMillis();
    }

    /**
     * コンストラクタ
     *
     * @param jobID ジョブID
     * @param jobName ジョブ名
     * @param submitTime ジョブ投入時刻
     * @param startTime ジョブ開始時刻
     * @param finishTime ジョブ終了
     * @param status タスクステータス
     */
    public HadoopJobStatusInfo(String jobID, 
                            String jobName,
                            long submitTime,
                            long startTime,
                            long finishTime,
                            int status)
    {
        this.jobID_ = jobID;
        this.jobName_ = jobName;
        this.submitTime_ = submitTime;
        this.startTime_ = startTime;
        this.finishTime_ = finishTime;
        this.runState_ = status;
    }
    
    /**
     * JobStatus を表すJSON形式の文字列を返す
     * @return JobStatus を表す JSON 形式の文字列
     */
    public String getJson()
    {
        Map<String,Object> jobStatusMap = new HashMap<String, Object>();
        jobStatusMap.put(JOB_ID, this.jobID_);
        jobStatusMap.put(JOB_NAME, this.jobName_);
        jobStatusMap.put(SUBMIT_TIME, this.submitTime_);
        jobStatusMap.put(START_TIME, this.startTime_);
        jobStatusMap.put(FINISH_TIME, this.finishTime_);
        if (this.runState_ < 0 || this.runState_ >= RUNSTATE.length)
        {
            this.runState_ = 0;
        }
        jobStatusMap.put(STATUS, RUNSTATE[this.runState_]);
        
        String jsonString = JSON.encode(jobStatusMap);
        
        return jsonString;
    }

    /**
     * @return timestamp
     */
    public long getTimestamp()
    {
        return timestamp_;
    }

    /**
     * @return jobID
     */
    public String getJobID()
    {
        return jobID_;
    }

    /**
     * @param jobID セットする jobID
     */
    public void setJobID(String jobID)
    {
        jobID_ = jobID;
    }

    /**
     * @return runState
     */
    public int getRunState()
    {
        return runState_;
    }

    /**
     * @param runState セットする runState
     */
    public void setRunState(int runState)
    {
        runState_ = runState;
    }

    /**
     * @return startTime
     */
    public long getStartTime()
    {
        return startTime_;
    }

    /**
     * @param startTime セットする startTime
     */
    public void setStartTime(long startTime)
    {
        startTime_ = startTime;
    }

    /**
     * @return submitTime
     */
    public long getSubmitTime()
    {
        return submitTime_;
    }

    /**
     * @param submitTime セットする submitTime
     */
    public void setSubmitTime(long submitTime)
    {
        submitTime_ = submitTime;
    }

    /**
     * @return finishTime
     */
    public long getFinishTime()
    {
        return finishTime_;
    }

    /**
     * @param finishTime セットする finishTime
     */
    public void setFinishTime(long finishTime)
    {
        finishTime_ = finishTime;
    }

    /**
     * @return jobName
     */
    public String getJobName()
    {
        return jobName_;
    }

    /**
     * @param jobName セットする jobName
     */
    public void setJobName(String jobName)
    {
        jobName_ = jobName;
    }

}
