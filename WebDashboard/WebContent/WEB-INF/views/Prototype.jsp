<!DOCTYPE html>
<html>
<head>
<%@ include file="../common/javaScriptInclude.jsp"%>
<%@ include file="../common/halookInclude.jsp"%>
</head>
<body id="main" oncontextmenu="return false;" onload="self.focus();">
	<div id="menuBar_" style="width: 1280px; height: 20px;"></div>
	<div id="toolBar_" style="width: 1280px; height: 25px;"></div>
	<div id="persArea"></div>
	<input id="treeData" type="hidden" value='${treeData}' />
	<script type="text/javascript">
		var viewArea1 = {};
		var viewArea2 = {};

		//è¡¨ç¤ºé å1(ããªã¼ã¨ãªã¢)
		viewArea1.width = 300;
		viewArea1.height = 800;
		viewArea1.rowspan = 1;
		viewArea1.colspan = 1;

		//è¡¨ç¤ºé å2(ã³ã³ãã³ãã¨ãªã¢)
		viewArea2.width = 900;
		viewArea2.height = 800;
		viewArea2.rowspan = 1;
		viewArea2.colspan = 1;

		var table = [ [ new wgp.PerspactiveModel(viewArea1),
				new wgp.PerspactiveModel(viewArea2) ] ];
		var perspactiveView = new wgp.PerspactiveView({
			id : "persArea",
			collection : table
		});
		perspactiveView.dropView("persArea_drop_0_0", "tree_area");
		perspactiveView.dropView("persArea_drop_0_1", "contents_area");

		var appView = new wgp.AppView();
	</script>

	<script src="/WebDashboard/resources/js/common/user.js"
		type="text/javaScript"></script>

	<script>
		var treeView = new wgp.TreeView({
			id : "tree_area",
			targetId : "contents_area"
		});
		appView.addView(treeView, wgp.constants.TREE.DATA_ID);
		websocketClient = new wgp.WebSocketClient(appView, "notifyEvent");
		websocketClient.initialize();
		appView.getTermData([ wgp.constants.TREE.DATA_ID ], new Date(),
				new Date());

		$("#tree_area")
				.click(
						function() {
							if (document.getElementById("/mapreduce/task") != undefined) {

								var parentElem = document
										.getElementById("/mapreduce/task").parentNode;
								$("#tree_area").jstree("delete_node",
										parentElem);
							}
						});
	</script>
</body>
</html>