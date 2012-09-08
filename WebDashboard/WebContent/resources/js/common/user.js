var graphViewElement = {
	viewClassName : "wgp.DygraphElementView",
	viewAttribute : {
		term : 1800,
		noTermData : false
	}
};

var mapTabElement = {
	viewClassName : "wgp.MapView",
	tabTitle : "Map",
};

var graphAreaTabElement = {
	viewClassName : "wgp.MultiAreaView",
	tabTitle : "Graph",
	collection : [ graphViewElement ]
};

var tabViewElement = {
	viewClassName : "wgp.TabView",
	collection : [ mapTabElement, graphAreaTabElement ]
};
var nodeInfoParentView = {
	viewClassName : "halook.NodeInfoParentView",
	viewAttribute : {
		ids : {
			dualSliderArea : "sliderArea",
			graphArea : "graphArea"
		}
	}

};
var hbaseGrowthGraphView = {
	viewClassName : "HbaseView"
};
var sliderView = {
	viewClassName : "SliderView"
};

var nodeInfoField = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ nodeInfoParentView ]
};

var hbaseGrowthGraphParentView = {
	viewClassName : "HbaseParentView"
};
var hbaseGrowthGraphField = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ hbaseGrowthGraphParentView ]
};
var parentTmpElement = {
	viewClassName : "ParentTmpView",
	rootView : appView,
};

var ganttChartElement = {
	viewClassName : "ganttChartView",
};

var ganttChartDetailElement = {
	viewClassName : "ganttChartDetailView",
};

var ganttChartParentElement = {
	viewClassName : "ganttChartParentView",
	rootView : appView,
};

var ganttChartViewElement = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ ganttChartParentElement ]

};

var bubbleViewElement = {
	viewClassName : "BubbleChartView",
};

var bubbleMultiElement = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ bubbleViewElement ]
};

var HDFSViewElement = {
		viewClassName : "HDFSView",
		tabTitle : "HDFSView",
};

var HDFSParentElement = { 
	viewClassName : "wgp.MultiAreaView",
	collection :[HDFSViewElement]
};

wgp.constants.VIEW_SETTINGS = {
	"default" : graphViewElement,
	"process" : nodeInfoField,
	"/hdfs" : HDFSParentElement,
	"/hbase/event" : hbaseGrowthGraphParentView,
//	"/mapreduce/task" : parentTmpElement,
	"/mapreduce/job" : ganttChartViewElement,
	"/mapreduce/task" : bubbleMultiElement,
};