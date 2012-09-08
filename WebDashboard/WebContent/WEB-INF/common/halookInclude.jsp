<meta charset="UTF-8" />
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/constants.js">
	
</script>

<%-- dual slider --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/dualSliderView.js">
	
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/selectToUISlider.jQuery.js">
	
</script>
<link rel="Stylesheet"
	href="<%=request.getContextPath()%>/resources/css/common/ui.slider.extras.css"
	type="text/css" />

<%-- nodeInfo graph --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/nodeinfomation/view/nodeInfoParentView.js">
	
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/nodeinfomation/view/resourceGraphView.js">
	
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/nodeinfomation/model/resourceGraphModel.js">
	
</script>

<style type="text/css">
</style>
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/nodeInfo/nodeStyles.css"
	type="text/css" media="all">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/ui.slider.extras.css"
	type="text/css" media="all">

<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/lib/jQuery/css/jquery-ui-1.8.19.custom.css"
	type="text/css" media="all">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/lib/jqGrid/css/ui.jqgrid.css"
	type="text/css" media="all">
<link rel="stylesheet" type="text/css" media="screen"
	href="<%=request.getContextPath()%>/resources/lib/jeegoocontext/skins/cm_default/style.css" />

<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/wgp-graph.css"
	type="text/css" media="all">
<link rel="stylesheet"
	href="<%=request.getContextPath()%>/resources/css/wgp.css"
	type="text/css" media="all">

<%-- static values --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/hbase/staticValues.js">
	
</script>

<%-- hbase graph --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/hbase/model/hbaseModel.js">
	
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/hbase/mock/hbaseMock.js">
	
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/hbase/view/hbaseView.js">
	
</script>

<%-- parent view --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/hbase/model/hbaseParentModel.js">
	
</script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/hbase/view/hbaseParentView.js">
	
</script>

<%-- arrow view --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ParentView/view/parentTmpView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ParentView/model/parentTmpModel.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ParentView/mock/parentTmpDataMock.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/customtriangle.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ArrowChart/view/dygraphChartView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ArrowChart/model/dygraphChartModel.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ArrowChart/mock/dygraphChartDataMock.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ArrowChart/view/arrowChartView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ArrowChart/model/arrowChartModel.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ArrowChart/mock/arrowChartDataMock.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/arrowStateElementView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/errorStateElementView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/lineStateElementView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/textAreaStateElementView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/arrowInfoStateElementView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/common/map/InfoTextAreaStateElementView.js"></script>

<%-- gantt view --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/view/ganttChartView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/model/ganttChartModel.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/mock/ganttChartDataMock.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/view/ganttChartDetailView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/view/ganttChartParentView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/view/ganttChartAxisNameView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/view/ganttChartAxisStateElementView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/ganttChart/view/ganttChartStateElementView.js"></script>

<%-- bubble view --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/bubbleChart/model/bubbleChartModel.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/bubbleChart/view/bubbleChartView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/bubbleChart/mock/bubbleChartMock.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/bubbleChart/graph/bubbleElementView.js"></script>

<%-- hdfs view --%>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/HDFSView/HDFSView/HDFSView.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/HDFSView/HDFSModel/HDFSModel.js"></script>
<script type="text/javascript"
	src="<%=request.getContextPath()%>/resources/js/HDFSView/testData.js"></script>
<script
	src="<%=request.getContextPath()%>/resources/js/utility/utility.js"></script>
