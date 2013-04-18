infinispan.GraphViewElement = {
	viewClassName : "wgp.DygraphElementView",
	viewAttribute : {
		term : 1800,
		noTermData : false
	}
};

infinispan.MapTabElement = {
	viewClassName : "wgp.MapView",
	tabTitle : "Map"
};

infinispan.GraphAreaTabElement = {
	viewClassName : "wgp.MultiAreaView",
	tabTitle : "Graph",
	collection : [ infinispan.GraphViewElement ]
};

infinispan.TabViewElement = {
	viewClassName : "wgp.TabView",
	collection : [ infinispan.MapTabElement, infinispan.GraphAreaTabElement ]
};

infinispan.NodeInfoParentView = {
	viewClassName : "ENS.NodeInfoParentView",
	viewAttribute : {
		ids : {
			dualSliderArea : "sliderArea",
			graphArea : "graphArea"
		}
	}

};
infinispan.HbaseGrowthGraphView = {
	viewClassName : "infinispan.HbaseView"
};

infinispan.SliderView = {
	viewClassName : "SliderView"
};

infinispan.NodeInfoField = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ infinispan.NodeInfoParentView ]
};

infinispan.HbaseGrowthGraphParentView = {
	viewClassName : "infinispan.HbaseParentView"
};

infinispan.HbaseRegionMapView = {
	viewClassName : "infinispan.HbaseResionMapParentView",
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
		]
	}
};

infinispan.ParentTmpElement = {
	viewClassName : "infinispan.ParentTmpView",
	rootView : appView,
	viewAttribute : {}
};

infinispan.GanttChartParentElement = {
	viewClassName : "infinispan.ganttChartParentView",
	rootView : appView
};

infinispan.GanttChartViewElement = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ infinispan.GanttChartParentElement ]
};

infinispan.BubbleViewElement = {
	viewClassName : "BubbleChartView"
};

infinispan.BubbleMultiElement = {
	viewClassName : "wgp.MultiAreaView",
	rootView : appView,
	collection : [ infinispan.BubbleViewElement ]
};

infinispan.HeapViewElement = {
	viewClassName : "infinispan.HeapView",
	tabTitle : "HeapView",
	viewAttribute : {
		heapPath : "/process/heap"
	}
};

infinispan.HeapParentElement = {
	viewClassName : "wgp.MultiAreaView",
	collection : [ infinispan.HeapViewElement ]
};

infinispan.BubbleTabViewElement = {
	viewClassName : "infinispan.BubbleChartView",
	rootView : appView,
	tabTitle : "Bubble Chart"
};

infinispan.ArrowTabViewElement = {
	viewClassName : "infinispan.ArrowParentView",
	rootView : appView,
	tabTitle : "Arrow Chart"
};

infinispan.MapReduceTabViewElement = {
	viewClassName : "infinispan.TabView",
	collection : [ infinispan.ArrowTabViewElement, infinispan.BubbleTabViewElement ]
};

if (!wgp.constants.VIEW_SETTINGS) {
	wgp.constants.VIEW_SETTINGS = {};
}
wgp.constants.VIEW_SETTINGS = $.extend(wgp.constants.VIEW_SETTINGS,{
	"/infinispan/mapreduce/job" : infinispan.GanttChartViewElement,
	"/infinispan/mapreduce/task" : infinispan.MapReduceTabViewElement,
	"/infinispan" : infinispan.HeapParentElement
});