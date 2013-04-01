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
	viewClassName : "ENS.NodeInfoParentView",
	viewAttribute : {
		ids : {
			dualSliderArea : "sliderArea",
			graphArea : "graphArea"
		}
	}

};
var hbaseGrowthGraphView = {
	viewClassName : "halook.HbaseView"
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
	viewClassName : "halook.HbaseParentView"
};

var hbaseRegionMapView = {
	viewClassName : "halook.HbaseResionMapParentView",
	viewAttribute : {
		realTime : true,
		width : 800,
		startXAxis :50,
		startYAxis : 350,
		textStartY : 360,
		textStartX : 40,
		yDivisionChartSize : 10,
		yUnitDivisionCount : 10,
		graphMaxValue : 280,
		graphSVGWidth : 880,
		graphSVGHeight : 540,
		colorList : [
		 　　　"#AFEEEE",
		    "#FFC0CB",
		    "#ADFF2F",
		    "#FFA500",
		    "#FFFF00"
		],
	},
	
};

var parentTmpElement = {
	viewClassName : "halook.ParentTmpView",
	rootView : appView,
	viewAttribute : {},
};

var ganttChartParentElement = {
	viewClassName : "halook.ganttChartParentView",
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
	viewClassName : "halook.HDFSView",
	tabTitle : "HDFSView",
};

var HDFSParentElement = {
	viewClassName : "wgp.MultiAreaView",
	collection : [ HDFSViewElement ]
};

var bubbleTabViewElement = {
	viewClassName : "halook.BubbleChartView",
	rootView : appView,
	tabTitle : "Bubble Chart",
};

var arrowTabViewElement = {
	viewClassName : "halook.ArrowParentView",
	rootView : appView,
	tabTitle : "Arrow Chart",
};

var mapReduceTabViewElement = {
	viewClassName : "halook.TabView",
	 collection : [ arrowTabViewElement, bubbleTabViewElement ],
};

wgp.constants.VIEW_SETTINGS = {
	"/hdfs" : HDFSParentElement,
	"/hbase/event" : hbaseGrowthGraphParentView,
	"/hbase/table" : hbaseRegionMapView,
	"/mapreduce/job" : ganttChartViewElement,
	"/mapreduce/task" : mapReduceTabViewElement,
};