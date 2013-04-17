halook.graphViewElement = {
	viewClassName : "wgp.DygraphElementView",
	viewAttribute : {
		term : 1800,
		noTermData : false
	}
};

halook.mapTabElement = {
	viewClassName : "wgp.MapView",
	tabTitle : "Map"
};

halook.graphAreaTabElement = {
	viewClassName : "wgp.MultiAreaView",
	tabTitle : "Graph",
	collection : [ halook.graphViewElement ]
};

halook.tabViewElement = {
	viewClassName : "wgp.TabView",
	collection : [ halook.mapTabElement, halook.graphAreaTabElement ]
};

halook.nodeInfoParentView = {
	viewClassName : "ENS.NodeInfoParentView",
	viewAttribute : {
		ids : {
			dualSliderArea : "sliderArea",
			graphArea : "graphArea"
		}
	}

};
halook.hbaseGrowthGraphView = {
	viewClassName : "halook.HbaseView"
};

halook.sliderView = {
	viewClassName : "SliderView"
};

halook.nodeInfoField = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ halook.nodeInfoParentView ]
};

halook.hbaseGrowthGraphParentView = {
	viewClassName : "halook.HbaseParentView"
};

halook.hbaseRegionMapView = {
	viewClassName : "halook.HbaseResionMapParentView",
	viewAttribute : {
		realTime : true,
		width : 800,
		startXAxis : 50,
		startYAxis : 350,
		textStartY : 360,
		textStartX : 40,
		yDivisionChartSize : 10,
		yUnitDivisionCount : 10,
		graphMaxValue : 280,
		graphSVGWidth : 880,
		graphSVGHeight : 540,
		colorList : [ "#AFEEEE", "#FFC0CB", "#ADFF2F", "#FFA500", "#FFFF00" ]
	}
};

halook.parentTmpElement = {
	viewClassName : "halook.ParentTmpView",
	rootView : appView,
	viewAttribute : {}
};

halook.ganttChartParentElement = {
	viewClassName : "halook.ganttChartParentView",
	rootView : appView
};

halook.ganttChartViewElement = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ halook.ganttChartParentElement ]

};

halook.bubbleViewElement = {
	viewClassName : "BubbleChartView"
};

halook.bubbleMultiElement = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ halook.bubbleViewElement ]
};

halook.HDFSViewElement = {
	viewClassName : "halook.HDFSView",
	tabTitle : "HDFSView"
};

halook.HDFSParentElement = {
	viewClassName : "wgp.MultiAreaView",
	collection : [ halook.HDFSViewElement ]
};

halook.bubbleTabViewElement = {
	viewClassName : "halook.BubbleChartView",
	rootView : appView,
	tabTitle : "Bubble Chart"
};

halook.arrowTabViewElement = {
	viewClassName : "halook.ArrowParentView",
	rootView : appView,
	tabTitle : "Arrow Chart"
};

halook.mapReduceTabViewElement = {
	viewClassName : "halook.TabView",
	collection : [ halook.arrowTabViewElement, halook.bubbleTabViewElement ]
};

if (!wgp.constants.VIEW_SETTINGS) {
	wgp.constants.VIEW_SETTINGS = {};
}
wgp.constants.VIEW_SETTINGS = $.extend(wgp.constants.VIEW_SETTINGS, {
	"/hdfs" : halook.HDFSParentElement,
	"/hbase/event" : halook.hbaseGrowthGraphParentView,
	"/hbase/table" : halook.hbaseRegionMapView,
	"/mapreduce/job" : halook.ganttChartViewElement,
	"/mapreduce/task" : halook.mapReduceTabViewElement
});