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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import jp.co.acroquest.endosnipe.common.config.JavelinConfig;
import jp.co.acroquest.endosnipe.javelin.CallTree;
import jp.co.acroquest.endosnipe.javelin.CallTreeNode;
import jp.co.acroquest.endosnipe.javelin.CallTreeRecorder;
import jp.co.acroquest.endosnipe.javelin.bean.Invocation;

/**
 * Hadoop用のコールツリーを記録する。
 *
 * @author matsuoka
 */
public class HadoopCallTreeRecorder extends CallTreeRecorder
{
    /** {@link HadoopCallTreeRecorder}の唯一のインスタンス */
    private static HadoopCallTreeRecorder instance__ = new HadoopCallTreeRecorder();

    /** ジョブIDをキーとした{@link HadoopCallTree}のリスト */
    private Map<String, HadoopCallTree> hadoopCallTreeMap_ = new HashMap<String, HadoopCallTree>();

    /** ジョブIDをキーとしたスレッド毎の{@link CallTree}の一覧 */
    private HashMap<String, HashMap<String, CallTree>> callTreeMap_ = new HashMap<String, HashMap<String, CallTree>>(1);

    /** ジョブIDをキーとしたスレッド毎の{@link CallTreeNode}の一覧 */
    private HashMap<String, HashMap<String, HadoopCallTreeNode>> callTreeNodeMap_ = new HashMap<String, HashMap<String, HadoopCallTreeNode>>(1);

    /** スレッド毎の{@link Invocation} */
    private HashMap<String, Invocation> invocationMap_ = new HashMap<String, Invocation>(1);

    /** スレッド毎のホスト名 */
    private HashMap<String, String> hostNameMap_ = new HashMap<String, String>(1);

    /** スレッド毎のメソッド開始時刻*/
    private HashMap<String, Long> startTimeMap_ = new HashMap<String, Long>(1);

    /**
     * コンストラクタを隠蔽する。
     */
    private HadoopCallTreeRecorder()
    {
    	super();
    }

    /**
     * {@link HadoopCallTreeRecorder}のインスタンスを取得する。
     * @return {@link HadoopCallTreeRecorder}のインスタンスを返す。
     */
    public static HadoopCallTreeRecorder getInstance()
    {
        return instance__;
    }

    /**
     * コールツリーを追加する。
     * @param jobId HadoopのジョブID
     * @param tree 追加するコールツリー
     */
    public void addCallTree(String jobId, CallTree tree)
    {
        synchronized(hadoopCallTreeMap_)
        {
            HadoopCallTree hadoopCallTree = hadoopCallTreeMap_.get(jobId);
            if (hadoopCallTree == null)
            {
                hadoopCallTree = new HadoopCallTree();
                hadoopCallTreeMap_.put(jobId, hadoopCallTree);
            }

            hadoopCallTree.addChild(tree.copy());
        }
    }

    /**
     * HadoopのジョブIDに対応するコールツリーを取得する。
     * @param jobId HadoopのジョブID
     * @return 指定されたジョブIDのコールツリー
     */
    public HadoopCallTree getCallTree(String jobId)
    {
        return hadoopCallTreeMap_.get(jobId);
    }

    /**
     * HadoopのジョブIDに対応するコールツリーを削除する。
     * @param jobId HadoopのジョブID
     */
    public void removeCallTree(String jobId)
    {
        synchronized(hadoopCallTreeMap_)
        {
            hadoopCallTreeMap_.remove(jobId);
        }
    }

    /**
     * JobID一覧を返す
     *
     * @return JobID一覧
     */
    public ArrayList<String> getJobIds()
    {
        ArrayList<String> jobs = new ArrayList<String>();
        for(String jobID : hadoopCallTreeMap_.keySet())
        {
            jobs.add(jobID);
        }
        return jobs;
    }

    /**
     * CallTreeとジョブIDを紐付て格納する。
     * 
     * @param jobID ジョブID
     * @param tree {@link CallTree}
     */
    public void putCallTree(String jobID, CallTree tree)
    {
        String threadID = String.valueOf(Thread.currentThread().getId());
        synchronized(callTreeMap_)
        {
            if(!callTreeMap_.containsKey(threadID))
            {
                callTreeMap_.put(threadID, new HashMap<String, CallTree>(1));
            }
            callTreeMap_.get(threadID).put(jobID, tree);
        }
        return;
    }

    /**
     * 指定されたジョブIDに紐付いたCallTreeを取得する。<br />
     * 取り出したCallTreeはCallTreeRecorderから削除される。
     * 
     * @param jobID ジョブID
     * 
     * @return {@link CallTree}
     */
    public CallTree takeCallTree(String jobID)
    {
        CallTree tree = null;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(callTreeMap_)
        {
            if(!callTreeMap_.containsKey(threadID))
                return tree;

            tree = callTreeMap_.get(threadID).get(jobID);
            callTreeMap_.get(threadID).remove(jobID);
        }

        return tree;
    }

    /**
     * ジョブIDをキーとしたCallTreeの一覧を取得する。<br />
     * 取り出したCallTreeの一覧はCallTreeRecorderから削除される。
     * 
     * @return ジョブIDをキーとした{@link CallTree}の一覧
     */
    public HashMap<String, CallTree> takeAllCallTree()
    {
        HashMap<String, CallTree> callTreeMap = null;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(callTreeMap_)
        {
            if(!callTreeMap_.containsKey(threadID))
                return callTreeMap;

            callTreeMap = callTreeMap_.get(threadID);
            callTreeMap_.remove(threadID);
        }

        return callTreeMap;
    }

    /**
     * CallTreeNodeとジョブIDを紐付て格納する。
     * 
     * @param jobID ジョブID
     * @param node {@link CallTreeNode}
     */
    public void putCallTreeNode(String jobID, HadoopCallTreeNode node)
    {
        String threadID = String.valueOf(Thread.currentThread().getId());
        synchronized(callTreeNodeMap_)
        {
            if(!callTreeNodeMap_.containsKey(threadID))
            {
                callTreeNodeMap_.put(threadID, new HashMap<String, HadoopCallTreeNode>(1));
            }
            callTreeNodeMap_.get(threadID).put(jobID, node);
        }
        return;
    }

    /**
     * 指定されたジョブIDに紐付いたCallTreeNodeを取得する。<br />
     * 取り出したCallTreeNodeはCallTreeRecorderから削除される。
     * 
     * @param jobID ジョブID
     * 
     * @return {@link CallTreeNode}
     */
    public CallTreeNode takeCallTreeNode(String jobID)
    {
        CallTreeNode node = null;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(callTreeNodeMap_)
        {
            if(!callTreeNodeMap_.containsKey(threadID))
                return node;

            node = callTreeNodeMap_.get(threadID).get(jobID);
            callTreeNodeMap_.get(threadID).remove(jobID);
        }

        return node;
    }

    /**
     * ジョブIDをキーとしたCallTreeNodeの一覧を取得する。<br />
     * 取り出したCallTreeNodeの一覧はCallTreeRecorderから削除される。
     * 
     * @return ジョブIDをキーとした{@link CallTreeNode}の一覧
     */
    public HashMap<String, HadoopCallTreeNode> takeAllCallTreeNode()
    {
        HashMap<String, HadoopCallTreeNode> callTreeNodeMap = null;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(callTreeNodeMap_)
        {
            if(!callTreeNodeMap_.containsKey(threadID))
                return callTreeNodeMap;

            callTreeNodeMap = callTreeNodeMap_.get(threadID);
            callTreeNodeMap_.remove(threadID);
        }

        return callTreeNodeMap;
    }

    /**
     * Invocationを取得する。<br />
     * 取り出したInvocationはCallTreeRecorderから削除される。
     * 
     * @return {@link Invocation}
     */
    public Invocation getInvocation()
    {
        Invocation ret = null;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(invocationMap_)
        {
            if(!invocationMap_.containsKey(threadID))
                return ret;

            ret = invocationMap_.get(threadID);
            invocationMap_.remove(threadID);
        }

        return ret;
    }

    /**
     * Invocationを設定する。
     * 
     * @param invocation {@link Invocation} 
     */
    public void setInvocation(Invocation invocation)
    {
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(invocationMap_)
        {
            if(!invocationMap_.containsKey(threadID))
                invocationMap_.put(threadID, invocation);
        }
    }

    /**
     * ホスト名を取得する。<br />
     * 取り出したホスト名はCallTreeRecorderから削除される。
     * 
     * @return ホスト名
     */
    public String takeHostname()
    {
        String ret = null;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(hostNameMap_)
        {
            if(!hostNameMap_.containsKey(threadID))
                return ret;

            ret = hostNameMap_.get(threadID);
            hostNameMap_.remove(threadID);
        }

        return ret;
    }

    /**
     * ホスト名を設定する。
     * 
     * @param hostName ホスト名 
     */
    public void putHostName(String hostName)
    {
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(hostNameMap_)
        {
            if(!hostNameMap_.containsKey(threadID))
                hostNameMap_.put(threadID, hostName);
        }
    }

    /**
     * メソッド開始時刻を取得する。<br />
     * 取り出したメソッド開始時刻はCallTreeRecorderから削除される。
     * 
     * @return メソッド開始時刻
     */
    public long takeStartTime()
    {
        long ret = 0L;
        String threadID = String.valueOf(Thread.currentThread().getId());

        synchronized(startTimeMap_)
        {
            if(!startTimeMap_.containsKey(threadID))
                return ret;

            ret = startTimeMap_.get(threadID).longValue();
            startTimeMap_.remove(threadID);
        }

        return ret;
    }

    /**
     * メソッド開始時刻を設定する。
     * 
     * @param startTime メソッド開始時刻 
     */
    public void putStartTime(long startTime)
    {
        String threadID = String.valueOf(Thread.currentThread().getId());
        Long start = Long.valueOf(startTime);

        synchronized(startTimeMap_)
        {
            if(!startTimeMap_.containsKey(threadID))
                startTimeMap_.put(threadID, start);
        }
    }

    /**
     * CallTreeNodeを取得します。
     *
     * @return CallTree。
     */
    public HadoopCallTreeNode getCallTreeNode()
    {
        return (HadoopCallTreeNode) super.getCallTreeNode();
    }

    
    /**
     * CallTreeNodeを生成します。
     *
     * @param invocation Invocation。
     * @param args 引数。
     * @param stacktrace スタックトレース。
     * @param config 設定。
     * @return CallTreeNode。
     */
    public static HadoopCallTreeNode createNode(
            Invocation invocation,
            final Object[] args,
            final StackTraceElement[] stacktrace,
            final JavelinConfig config)
    {
    	HadoopCallTreeNode node = new HadoopCallTreeNode();

        node.setStacktrace(stacktrace);

        // パラメータ設定が行われているとき、ノードにパラメータを設定する
        if (args != null)
        {
            CallTreeRecorder.addLogArgs(node, args, config);
        }

        node.setInvocation(invocation);

        return node;
    }
}
