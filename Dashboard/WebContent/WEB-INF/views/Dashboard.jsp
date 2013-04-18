<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../include/ext/javaScriptInclude.jsp"%>
<%@ include file="../include/DashboardInclude.jsp"%>
<title>ENdoSnipe Dashboard</title>
</head>
<body id="main" oncontextmenu="return false;" onload="self.focus();">
	<div id="headerLogo">
		<img src="<%=request.getContextPath()%>/resources/images/ENdoSnipe_logo.png" />
	</div>
	<div id="persArea"></div>
	<input id="treeData" type="hidden" value='${treeData}' />
	<div id="addSignalDialog" title="Add Signal" style="display:none">
		<div id="signalNameArea" class="dialogContentArea">
			<div id="signalNameItem" class="dialogItem">Signal Name : </div>
			<div id="signalNameValue" class="dialogValue">
				<input type="text" id="signalName" class="signalValue" value="new Signal" />
			</div>
		</div>
		<div id="signalMatchingPatternArea" class="dialogContentArea">
			<div id="signalMatchingPatternItem" class="dialogItem">Matching Pattern : </div>
			<div id="signalMatchingPatternValue" class="dialogValue">
				<input type="text" id="matchingPattern" class="signalValue" value="" />
			</div>
		</div>
		<div id="signalPatternArea" class="dialogContentArea">
			<div id="signalPatternItem" class="dialogItem">Signal Pattern : </div>
			<div id="signalPatternValue" class="dialogValue">
				<select>
					<option value="3">3 Level</option>
					<option value="5">5 Level</option>
				</select>
			</div>
		</div>
		<div id="signalPatternValueArea" class="dialogContentArea">
			<div id="signalPatternValueItem" class="dialogItem">Threshold Value of each signal levels : </div>
			<div id="signalPatternValueValue" class="dialogValue">
				<div id="signalPatternValue_1" class="dialogPatternValue">
					<div>1 : </div>
					<input type="text" id="patternValue_1" class="signalValue" value="" />
				</div>
				<div id="signalPatternValue_2" class="dialogPatternValue">
					<div>2 : </div>
					<input type="text" id="patternValue_2" class="signalValue" value="" />
				</div>
				<div id="signalPatternValue_3" class="dialogPatternValue">
					<div>3 : </div>
					<input type="text" id="patternValue_3" class="signalValue" value="" />
				</div>
				<div id="signalPatternValue_4" class="dialogPatternValue">
					<div>4 : </div>
					<input type="text" id="patternValue_4" class="signalValue" value="" />
				</div>
				<div id="signalPatternValue_5" class="dialogPatternValue">
					<div>5 : </div>
					<input type="text" id="patternValue_5" class="signalValue" value="" />
				</div>
			</div>
		</div>
		<div id="signalEscalationPeriodArea" class="dialogContentArea">
			<div id="signalEscalationPeriodItem" class="dialogItem">Escalation Period : </div>
			<div id="signalEscalationPeriodValue" class="dialogValue">
				<input type="text" id="escalationPeriod" class="signalValue" value="" />
			</div>
			<div id="signalEscalationPeriodUnit">ms</div>
		</div>
	</div>
	<script type="text/javascript">
		var viewArea1 = {};
		var viewArea2 = {};

		viewArea1.width = 300;
		viewArea1.height = 800;
		viewArea1.rowspan = 1;
		viewArea1.colspan = 1;

		viewArea2.width = 900;
		viewArea2.height = 800;
		viewArea2.rowspan = 1;
		viewArea2.colspan = 1;

		var table = [ [ new wgp.PerspectiveModel(viewArea1),
				new wgp.PerspectiveModel(viewArea2) ] ];
		var perspectiveView = new wgp.PerspectiveView({
			id : "persArea",
			collection : table,
			minimum : false,
			close : false
		});
		perspectiveView.dropView("persArea_drop_0_0", "tree_area");
		perspectiveView.dropView("persArea_drop_0_1", "contents_area");

		var appView = new ENS.AppView();
	</script>
	
	<%@ include file="../include/pluginsInclude.jsp"%>
	<script src="<%=request.getContextPath()%>/resources/js/common/user.js"
		type="text/javaScript"></script>

	<script>
		var treeView = new ENS.treeView({
			id : "tree_area",
			targetId : "contents_area",
			themeUrl : wgp.common.getContextPath()
			+ "/resources/css/jsTree/style.css"
		});
		// ツリー連携を追加。
		treeView.setClickEvent("contents_area");
		treeView.addContextMenu(ENS.tree.contextOption);
		appView.addView(treeView, wgp.constants.TREE.DATA_ID);
		websocketClient = new wgp.WebSocketClient(appView, "notifyEvent");
		websocketClient.initialize();
		appView.getTermData([ wgp.constants.TREE.DATA_ID ], new Date(),
				new Date());

		$("#tree_area")
				.click(
						function() {
							if ($("[id$='mapreduce/task']") != undefined) {

								var elem = $("[id$='mapreduce/task']");

								$("#tree_area").jstree("delete_node",
										elem);
							}
						});
	</script>
	<input type="hidden" id="context" value="<%=request.getContextPath()%>" />
</body>
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/common.css"
	type="text/css" media="all">
</html>