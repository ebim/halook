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

import java.util.HashMap;
import java.util.Map;

import net.arnx.jsonic.JSON;

/**
 * タスクの状態を保持するクラス
 *
 * @author y_asazuma
 * @author ochiai
 *
 */
public class HadoopTaskStatus
{
    /** タスクフェーズの列挙体 */
    public static enum Phase{STARTING, MAP, SHUFFLE, SORT, REDUCE, CLEANUP}

    /** タスクステータスの列挙体 */
    public static enum State {RUNNING, SUCCEEDED, FAILED, UNASSIGNED, KILLED,
                              COMMIT_PENDING, FAILED_UNCLEAN, KILLED_UNCLEAN}

    /** JobID の JSONキー  */
    private static final String JOB_ID = "JobID";

    /** TaskAttemptID の JSONキー  */
    private static final String TASK_ATTEMPT_ID = "TaskAttemptID";

    /** Hostname の JSONキー  */
    private static final String HOSTNAME = "Hostname";

    /** StartTime の JSONキー  */
    private static final String START_TIME = "StartTime";

    /** FinishTime の JSONキー  */
    private static final String FINISH_TIME = "FinishTime";

    /** Status の JSONキー  */
    private static final String STATUS = "Status";

    /** ジョブID */
    private String jobID_;

    /** タスク試行ID */
    private String taskID_;

    /** タスクフェーズ */
    private Phase phase_;

    /** タスクステータス */
    private State state_;

    /** ホスト名 */
    private String hostname_;

    /** 開始時間 */
    private long startTime_ = System.currentTimeMillis();

    /** 終了時間 */
    private long finishTime_ = System.currentTimeMillis();

    /** タスクフェーズマップ */
    private static final Map<String, Phase> PHASE_MAP = new HashMap<String, Phase>() {
        {
            put("STARTING", Phase.STARTING);
            put("MAP", Phase.MAP);
            put("SHUFFLE", Phase.SHUFFLE);
            put("SORT", Phase.SORT);
            put("REDUCE", Phase.REDUCE);
            put("CLEANUP", Phase.CLEANUP);
        }
    };

    /** タスクステータスマップ */
    private static final Map<String, State> STATE_MAP = new HashMap<String, State>() {
        {
            put("RUNNING", State.RUNNING);
            put("SUCCEEDED", State.SUCCEEDED);
            put("FAILED", State.FAILED);
            put("UNASSIGNED", State.UNASSIGNED);
            put("KILLED", State.KILLED);
            put("COMMIT_PENDING", State.COMMIT_PENDING);
            put("FAILED_UNCLEAN", State.FAILED_UNCLEAN);
            put("KILLED_UNCLEAN", State.KILLED_UNCLEAN);
        }
    };

    /**
     * コンストラクタ
     */
    public HadoopTaskStatus()
    {
        // 何もしない
    }

    /**
     * コンストラクタ
     *
     * @param jobID ジョブID
     * @param taskID タスクID
     * @param phase タスクフェーズ
     * @param state タスクステータス
     */
    public HadoopTaskStatus(String jobID,
                            String taskID,
                            String phase,
                            String state)
    {
        this.jobID_ = jobID;
        this.taskID_ = taskID;
        this.phase_ = PHASE_MAP.get(phase);
        this.state_ = STATE_MAP.get(state);
    }

    /**
     * ジョブIDを取得する。
     *
     * @return ジョブID
     */
    public String getJobID()
    {
        return this.jobID_;
    }

    /**
     * TaskStatus を表すJSON形式の文字列を返す。
     * @return TaskStatus を表す JSON 形式の文字列
     */
    public String getJson()
    {
        Map<String,Object> jobStatusMap = new HashMap<String, Object>();
        jobStatusMap.put(JOB_ID, this.jobID_);
        jobStatusMap.put(TASK_ATTEMPT_ID, this.taskID_);
        jobStatusMap.put(HOSTNAME, this.hostname_);
        jobStatusMap.put(START_TIME, this.startTime_);
        jobStatusMap.put(FINISH_TIME, this.finishTime_);
        jobStatusMap.put(STATUS, this.state_.toString());
        
        String jsonString = JSON.encode(jobStatusMap);
        
        return jsonString;
    }

    /**
     * タスクIDを取得する。
     *
     * @return タスクID
     */
    public String getTaskID()
    {
        return this.taskID_;
    }

    /**
     * タスクのフェーズを取得する。
     *
     * @return タスクフェーズ
     */
    public Phase getPhase()
    {
        return this.phase_;
    }

    /**
     * タスクのステータスを取得する。
     *
     * @return タスクステータス
     */
    public State getState()
    {
        return this.state_;
    }

    /**
     * ホスト名を取得する。
     *
     * @return ホスト名
     */
    public String getHostname()
    {
        return this.hostname_;
    }

    /**
     * 開始時間を取得する。
     *
     * @return 開始時間
     */
    public long getStartTime()
    {
        return this.startTime_;
    }

    /**
     * 終了時間を取得する。
     *
     * @return 終了時間
     */
    public long getFinishTime()
    {
        return this.finishTime_;
    }

    /**
     * ジョブ試行IDを設定する。
     *
     * @param taskID ジョブID
     */
    public void setJobID(String jobID)
    {
        this.jobID_ = jobID;
    }

    /**
     * タスク試行IDを設定する。
     *
     * @param taskID タスクID
     */
    public void setTaskID(String taskID)
    {
        this.taskID_ = taskID;
    }

    /**
     * タスクのフェーズを設定する。
     *
     * @param phase タスクフェーズ
     */
    public void setPhase(Phase phase)
    {
        this.phase_ = phase;
    }

    /**
     * タスクのフェーズを設定する。
     *
     * @param phase タスクフェーズ
     */
    public void setPhase(String phase)
    {
        this.phase_ = PHASE_MAP.get(phase);
    }

    /**
     * タスクのステータスを設定する。
     *
     * @param state タスクステータス
     */
    public void setState(State state)
    {
        this.state_ = state;
    }

    /**
     * タスクのステータスを設定する。
     *
     * @param state タスクステータス
     */
    public void setState(String state)
    {
        this.state_ = STATE_MAP.get(state);
    }
    
    /**
     * ホスト名を設定する。
     *
     * @param hostname ホスト名
     */
    public void setHostname(String hostname)
    {
        this.hostname_ = hostname;
    }
    
    /**
     * 開始時間を設定する。
     *
     * @param startTime 開始時間
     */
    public void setStartTime(long startTime)
    {
        this.startTime_ = startTime;
    }

    /**
     * 終了時間を設定する。
     *
     * @param finishTime 終了時間
     */
    public void setFinishTime(long finishTime)
    {
        this.finishTime_ = finishTime;
    }


}
