<!DOCTYPE html>
<html>
<head>
<%@ include file="../common/javaScriptInclude.jsp"%>
<style type="text/css">
</style>
</head>
<body id="main" oncontextmenu="return false;" onload="self.focus();">
<div id="menuBar_" style="width: 1280px; height: 20px;"></div>
<div id="toolBar_" style="width: 1280px; height: 25px;"></div>
<div id="persArea"></div>
<input id="treeData" type="hidden" value='${treeData}' />
<script type="text/javascript">
	var viewArea1 = {};
	var viewArea2 = {};

	//表示領域1(ツリーエリア)
	viewArea1.width = 300;
	viewArea1.height = 800;
	viewArea1.rowspan = 1;
	viewArea1.colspan = 1;

	//表示領域2(コンテンツエリア)
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
	appView.syncData(["/graph/graph1", "/graph/graph2"]);
	appView.getTermData([wgp.constants.TREE.DATA_ID], new Date(), new Date());
	appView.syncData(["/graph/graph1", "/graph/graph2"]);
</script>
</body>
</html>