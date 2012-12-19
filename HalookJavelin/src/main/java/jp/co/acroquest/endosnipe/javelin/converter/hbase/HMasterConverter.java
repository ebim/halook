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
package jp.co.acroquest.endosnipe.javelin.converter.hbase;

import java.io.IOException;
import java.util.List;

import jp.co.acroquest.endosnipe.communicator.entity.TelegramConstants;
import jp.co.acroquest.endosnipe.javelin.converter.AbstractConverter;
import jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HMasterAccessor;
import jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HMasterMonitor;
import jp.co.acroquest.endosnipe.javelin.resource.ResourceCollector;
import jp.co.acroquest.endosnipe.javelin.resource.hadoop.HBaseHMasterGetter;
import jp.co.smg.endosnipe.javassist.CannotCompileException;
import jp.co.smg.endosnipe.javassist.CtBehavior;
import jp.co.smg.endosnipe.javassist.CtClass;
import jp.co.smg.endosnipe.javassist.CtField;
import jp.co.smg.endosnipe.javassist.CtMethod;
import jp.co.smg.endosnipe.javassist.NotFoundException;

/**
 * HBase用のコンバータ
 * 
 * @author eriguchi
 */
public class HMasterConverter extends AbstractConverter {
	/** コンバータ名 */
	private static final String CONVERTER_NAME = "HMasterConverter";

	/**
	 * {@inheritDoc}
	 */
	public void init() {
		ResourceCollector.getInstance().addMultiResource(
				TelegramConstants.ITEMNAME_HBASE_HMASTER,
				new HBaseHMasterGetter());
	}

	/**
	 * {@inheritDoc}
	 */
	@Override
	public void convertImpl() throws CannotCompileException, NotFoundException,
			IOException {
		List<CtBehavior> behaviorList = getMatcheDeclaredBehavior();
		CtClass ctClass = getCtClass();
		if (behaviorList.size() > 0) {
			// インターフェースの追加
			CtClass accessorClass = getClassPool().get(
					HMasterAccessor.class.getName());

			// HServerInfoを、HBaseのクラスから、Javelin用クラスに変換する。
			// RegionLoadについては未対応。
			CtMethod convertServerInfoMethod = CtMethod
					.make(""
							+ "public jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerInfo convertServerInfo(org.apache.hadoop.hbase.HServerInfo inputInfo) { "
							+ "            jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerInfo info ="
							+ "                                                                                         new jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerInfo();"
							+ "            info.setServerAddress(inputInfo.getServerAddress().getInetSocketAddress());"
							+ "            info.setStartCode(inputInfo.getStartCode());"
							+ "" //
							+ "            org.apache.hadoop.hbase.HServerLoad inputLoad = inputInfo.getLoad();"
							+ "            jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerLoad load ="
							+ "                                                                                         new jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerLoad();"
							+ "" //
							+ "            load.setMaxHeapMB(inputLoad.getMaxHeapMB());"
							+ "            load.setUsedHeapMB(inputLoad.getUsedHeapMB());"
							+ "            load.setNumberOfRegions(inputLoad.getNumberOfRegions());"
							+ "            load.setNumberOfRequests(inputLoad.getNumberOfRequests());"
							+ "            info.setLoad(load); " //
							+ "            info.setInfoPort(inputInfo.getInfoPort());"
							+ "            info.setServerName(inputInfo.getServerName());"
							+ "            info.setHostname(inputInfo.getHostname());"
							+ "        return info;" + //
							"}", ctClass);
			ctClass.addMethod(convertServerInfoMethod);

			ctClass.addInterface(accessorClass);

			CtMethod getServerInfoMethod = CtMethod
					.make(""
							+ "public java.util.Map getServerInfo(){ "
							+ "        java.util.Map resMap ="
							+ "                                  new jp.co.acroquest.endosnipe.javelin.util.HashMap();"
							+ "        java.util.Map inputMap ="
							+ "                                  this.serverManager.getOnlineServers();"
							+ ""
							+ "        java.util.Iterator it = inputMap.entrySet().iterator();"
							+ "        while (it.hasNext())"
							+ "        {" //
							+ "            java.util.Map.Entry inputInfoEntry = (java.util.Map.Entry)it.next();"
							+ "            jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerInfo info = convertServerInfo((org.apache.hadoop.hbase.HServerInfo)inputInfoEntry.getValue());"
							+ "            " //
							+ "            resMap.put(inputInfoEntry.getKey(), info);"
							+ "        }" //
							+ "        " //
							+ "        return (resMap);" //
							+ "}", ctClass);
			ctClass.addMethod(getServerInfoMethod);

			CtMethod getDeadServerInfoMethod = CtMethod
					.make(""
							+ "public java.util.Set getDeadServerInfo(){ "
							+ "        java.util.Set deadServers ="
							+ "                                  this.serverManager.getDeadServers();"
							+ "        return (deadServers);" + //
							"}", ctClass);
			ctClass.addMethod(getDeadServerInfoMethod);

			CtField hBaseAdminField = CtField
					.make("private org.apache.hadoop.hbase.client.HBaseAdmin ensHBaseAdmin;",
							ctClass);
			ctClass.addField(hBaseAdminField);

			CtMethod getListTablesMethod = CtMethod
					.make(""
							+ "    public java.util.List listTables()"
							+ "    {"
							+ "        try"
							+ "        {"
							+ "            if (ensHBaseAdmin == null) {"
							+ "                ensHBaseAdmin = new org.apache.hadoop.hbase.client.HBaseAdmin(this.getConfiguration());"
							+ "            }"
							+ "        }"
							+ "        catch (java.lang.Exception ex)"
							+ "        {"
							+ "            "
							+ "        }"
							+ "        java.util.List tableList = new java.util.ArrayList();"
							+ "        try"
							+ "        {"
							+ "            org.apache.hadoop.hbase.HTableDescriptor[] listTables = ensHBaseAdmin.listTables();"
							+ "            for (int index = 0; index < listTables.length; index++)"
							+ "            {"
							+ "                jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HTableDescriptor ensDescriptor ="
							+ "                                                                                                           new jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HTableDescriptor();"
							+ ""
							+ "                ensDescriptor.setName(listTables[index].getName());"
							+ "                ensDescriptor.setNameAsString(listTables[index].getNameAsString());"
							+ "                tableList.add(ensDescriptor);"
							+ "            }"
							+ "        }" //
							+ "        catch (java.lang.Exception ex)"
							+ "        {" //
							+ "            ex.printStackTrace();" //
							+ "        }" //
							+ "        return tableList;" //
							+ "" //
							+ "    }", ctClass);
			ctClass.addMethod(getListTablesMethod);

			CtMethod getRegionsOfTableMethod = CtMethod
					.make(""
							+ "    public int getRegionsOfTable(byte[] name)"
							+ "    {" //
							+ "        java.util.List regionsOfTable = this.assignmentManager.getRegionsOfTable(name);"
							+ "        return regionsOfTable.size();" //
							+ "    }", ctClass);
			ctClass.addMethod(getRegionsOfTableMethod);

			CtMethod getAssignmentsMethod = CtMethod
					.make(""
							+ "    public java.util.Map getAssignments()"
							+ "    {" //
							+ "        java.util.Map resultMap = new jp.co.acroquest.endosnipe.javelin.util.HashMap();"
							+ "        java.util.Map inputMap = this.assignmentManager.getAssignments();"
							+ "" //
							+ "        java.util.Iterator inputIterator = inputMap.entrySet().iterator();"
							+ "        while (inputIterator.hasNext())"
							+ "        {" //
							+ "            java.util.Map.Entry inputInfoEntry = (java.util.Map.Entry)inputIterator.next();"
							+ "            org.apache.hadoop.hbase.HServerInfo inputInfo ="
							+ "                                                            (org.apache.hadoop.hbase.HServerInfo)inputInfoEntry.getKey();"
							+ "            jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HServerInfo info = convertServerInfo(inputInfo);"
							+ "" //
							+ "            java.util.List regionList = new java.util.ArrayList();"
							+ "            java.util.List inputRegionList = (java.util.List)inputInfoEntry.getValue();"
							+ "            for (java.util.Iterator iterator = inputRegionList.iterator(); iterator.hasNext();)"
							+ "            {"
							+ "                org.apache.hadoop.hbase.HRegionInfo inputRegion = (org.apache.hadoop.hbase.HRegionInfo)iterator.next();"
							+ "                jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HRegionInfo regionInfo = new jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HRegionInfo();"
							+ "                regionInfo.setStartKey(inputRegion.getStartKey());"
							+ "                regionInfo.setEndKey(inputRegion.getEndKey());"
							+ "                regionInfo.setEncodedName(inputRegion.getEncodedName());"
							+ "                regionInfo.setEncodedNameAsBytes(inputRegion.getEncodedNameAsBytes());"
							+ "                regionInfo.setOffLine(inputRegion.isOffline());"
							+ "                regionInfo.setRegionId(inputRegion.getRegionId());"
							+ "                regionInfo.setRegionName(inputRegion.getRegionName());"
							+ "                regionInfo.setRegionNameStr(inputRegion.getRegionNameAsString());"
							+ "                regionInfo.setSplit(inputRegion.isSplit());"
							+ "                jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HTableDescriptor tableDesc = new jp.co.acroquest.endosnipe.javelin.converter.hbase.monitor.HTableDescriptor();"
							+ "                tableDesc.setName(inputRegion.getTableDesc().getName());"
							+ "                tableDesc.setNameAsString(inputRegion.getTableDesc().getNameAsString());"
							+ "                regionInfo.setTableDesc(tableDesc);"
							+ "                "
							+ "                regionList.add(regionInfo);"
							+ "            }" //
							+ "            " //
							+ "            resultMap.put(info,"
							+ "                          (java.util.List)regionList);"
							+ "        }" //
							+ "" //
							+ "        return resultMap;" //
							+ "" //
							+ "    }", ctClass);
			ctClass.addMethod(getAssignmentsMethod);

		}

		for (CtBehavior ctBehavior : behaviorList) {
			convertBehavior(ctBehavior);
		}

		setNewClassfileBuffer(ctClass.toBytecode());
	}

	/**
	 * メソッドの振る舞いを修正する。
	 * 
	 * @param ctBehavior
	 *            CtBehavior
	 * @throws CannotCompileException
	 *             コンパイルできない場合
	 * @throws NotFoundException
	 *             クラスが見つからない場合
	 */
	private void convertBehavior(final CtBehavior ctBehavior)
			throws CannotCompileException, NotFoundException {
		ctBehavior.insertAfter(HMasterMonitor.class.getCanonicalName()
				+ ".sethMaster(this);");

		// 処理結果をログに出力する。
		logModifiedMethod(CONVERTER_NAME, ctBehavior);
	}

}
