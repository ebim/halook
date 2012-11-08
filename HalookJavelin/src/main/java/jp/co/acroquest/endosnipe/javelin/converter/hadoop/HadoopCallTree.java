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
import java.util.List;

import jp.co.acroquest.endosnipe.javelin.CallTree;


/**
 * Hadoop用のコールツリー。
 *
 * @author matsuoka
 */
public class HadoopCallTree extends CallTree
{
    /** コールツリーのリスト */
    private List<CallTree> children_ = new ArrayList<CallTree>();

    /**
     * コンストラクタ。
     */
    public HadoopCallTree()
    {
        // Do Nothing.
    }

    /**
     * コピーコンストラクタ。
     * @param tree コピー元
     */
    public HadoopCallTree(HadoopCallTree tree)
    {
        super(tree);
        children_ = tree.children_;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public HadoopCallTree copy()
    {
        return new HadoopCallTree(this);
    }

    /**
     * 保持しているコールツリーのリストを返す。
     * @return 保持しているコールツリーのリスト。
     */
    public List<CallTree> getChildren()
    {
        return children_;
    }

    /**
     * リストにコールツリーを追加する。
     * @param tree 追加するコールツリー
     */
    public void addChild(CallTree tree)
    {
        synchronized(children_)
        {
            children_.add(tree);
        }
    }

}
