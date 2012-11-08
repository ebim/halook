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

import java.io.IOException;
import java.util.List;

import jp.co.acroquest.endosnipe.communicator.entity.TelegramConstants;
import jp.co.acroquest.endosnipe.javelin.converter.AbstractConverter;
import jp.co.acroquest.endosnipe.javelin.resource.ResourceCollector;
import jp.co.acroquest.endosnipe.javelin.resource.hadoop.HadoopNameNodeGetter;
import jp.co.smg.endosnipe.javassist.CannotCompileException;
import jp.co.smg.endosnipe.javassist.CtBehavior;
import jp.co.smg.endosnipe.javassist.CtClass;
import jp.co.smg.endosnipe.javassist.CtMethod;
import jp.co.smg.endosnipe.javassist.NotFoundException;

/**
 * NameNode用のコンバータ
 * 
 * @author eriguchi
 */
public class NameNodeConverter extends AbstractConverter
{
    /** コンバータ名 */
    private static final String CONVERTER_NAME = "NameNodeConverter";

    /**
     * {@inheritDoc}
     */
    public void init()
    {
		ResourceCollector.getInstance().addMultiResource(
				TelegramConstants.ITEMNAME_HADOOP_NAMENODE,
				new HadoopNameNodeGetter());
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void convertImpl()
        throws CannotCompileException,
            NotFoundException,
            IOException
    {
        List<CtBehavior> behaviorList = getMatcheDeclaredBehavior();
        CtClass ctClass = getCtClass();
        if (behaviorList.size() > 0)
        {
            // インターフェースの追加
            CtClass accessorClass = getClassPool().get(FSNamesystemAccessor.class.getName());
            ctClass.addInterface(accessorClass);

            CtMethod getServerInfoMethod = CtMethod.make("" + //
                    "public java.util.List resolve(java.util.List names){ " + //
                    "        return this.dnsToSwitchMapping.resolve(names);" + //
                    "}", ctClass);
            ctClass.addMethod(getServerInfoMethod);
            
        }

        for (CtBehavior ctBehavior : behaviorList)
        {
            convertBehavior(ctBehavior);
        }

        setNewClassfileBuffer(ctClass.toBytecode());
    }

    /**
     * メソッドの振る舞いを修正する。
     * @param ctBehavior CtBehavior
     * @throws CannotCompileException コンパイルできない場合
     * @throws NotFoundException クラスが見つからない場合
     */
    private void convertBehavior(final CtBehavior ctBehavior)
        throws CannotCompileException,
            NotFoundException
    {
        ctBehavior.insertAfter(HadoopMeasurementInfo.class.getCanonicalName()
                + ".getInstance().setFsNamesystem(this);");

        // 処理結果をログに出力する。
        logModifiedMethod(CONVERTER_NAME, ctBehavior);
    }

}
