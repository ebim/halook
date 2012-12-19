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

/**
 * HadoopのHeartbeatResponseに含まれる
 * TaskTrackerAction情報を保持するクラス
 *
 * @author asazuma
 *
 */
public class HadoopAction
{
    /** アクション種別の列挙体 */
    public static enum ActionType {LAUNCH_TASK, KILL_TASK, KILL_JOB,
                                   REINIT_TRACKER, COMMIT_TASK};

    /** Mapタスクか？ */
    private boolean isMapTask_;

    /** ジョブID */
    private String jobID_;

    /** タスク試行ID */
    private String taskID_;

    /** ジョブ名 */
    private String jobName_;

    /** アクション種別 */
    private ActionType actionType_;

    /** 処理対象データ */
    private String inputData_;

    /** アクション種別マップ */
    private static final Map<String, ActionType> ACTION_TYPE_MAP =
                                                    new HashMap<String, ActionType>()
    {
        {
            put("LAUNCH_TASK", ActionType.LAUNCH_TASK);
            put("KILL_TASK", ActionType.KILL_TASK);
            put("KILL_JOB", ActionType.KILL_JOB);
            put("REINIT_TRACKER", ActionType.REINIT_TRACKER);
            put("COMMIT_TASK", ActionType.COMMIT_TASK);
        }

    };

    /**
     * コンストラクタ
     */
    public HadoopAction()
    {
        // 何もしない
    }

    /**
     * Mapタスクか？
     *
     * @return {@code true}：Mapタスク／{@code false}：Reduceタスク
     */
    public boolean isMapTask()
    {
        return isMapTask_;
    }

    /**
     * MapタスクかReduceタスクかを設定する。
     *
     * @param flag {@code true}：Mapタスク／{@code false}：Reduceタスク
     */
    public void setMapTask(boolean flag)
    {
        this.isMapTask_  = flag;
    }

    /**
     * ジョブIDを取得する。
     *
     * @return ジョブID
     */
    public String getJobID()
    {
        return jobID_;
    }

    /**
     * ジョブIDを設定する。
     *
     * @param jobID ジョブID
     */
    public void setJobID(String jobID)
    {
        jobID_ = jobID;
    }

    /**
     * タスク試行IDを取得する。
     *
     * @return タスク試行ID
     */
    public String getTaskID()
    {
        return taskID_;
    }

    /**
     * タスク試行IDを設定する。
     *
     * @param taskID タスク試行ID
     */
    public void setTaskID(String taskID)
    {
        taskID_ = taskID;
    }

    /**
     * ジョブ名を取得する。
     *
     * @return ジョブ名
     */
    public String getJobName()
    {
        return jobName_;
    }

    /**
     * ジョブ名を設定する。
     * @param jobName ジョブ名
     */
    public void setJobName(String jobName)
    {
        jobName_ = jobName;
    }

    /**
     * アクション種別を取得する。
     *
     * @return アクション種別
     */
    public ActionType getActionType()
    {
        return actionType_;
    }

    /**
     * アクション種別を設定する。
     *
     * @param actionType アクション種別
     */
    public void setActionType(ActionType actionType)
    {
        actionType_ = actionType;
    }

    /**
     * アクション種別を設定する。
     *
     * @param actionType アクション種別
     */
    public void setActionType(String actionType)
    {
        actionType_ = ACTION_TYPE_MAP.get(actionType);
    }

    /**
     * 処理対象データを設定する
     * @param inputData 処理対象データ
     */
    public void setInputData(String inputData)
    {
        inputData_ = inputData;
    }

    /**
     * 処理対象データを取得する
     * @return inputData 処理対象データ
     */
    public String getInputData()
    {
        return inputData_;
    }
}
