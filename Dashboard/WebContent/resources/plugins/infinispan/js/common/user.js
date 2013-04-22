infinispan.CacheViewElement = {
	viewClassName : "infinispan.CacheParentView",
	viewAttribute : {
		realTime : true,
		width : 800,
		startXAxis :50,
		startYAxis : 350,
		textStartY : 360,
		textStartX : 45,
		yDivisionChartSize : 10,
		yUnitDivisionCount : 10,
		graphMaxValue : 280,
		graphSVGWidth : 880,
		graphSVGHeight : 540,
		colorList : [
            "#1B676B",
            "#519548",
            "#88C425",
            "#BEF202",
            "#EAFDE6",
            "#25B5C2",
            "#0EA0AD",
            "#B3D13A",
            "#CEE571",
            "#F0EEBF"
		],
		cachePath : "jmx/org.infinispan/Cache"
	}
};

infinispan.CacheParentElement = {
	viewClassName : "wgp.MultiAreaView",
	tabTitle : "CacheView",
	collection : [ infinispan.CacheViewElement ]
};

infinispan.HeapViewElement = {
	viewClassName : "infinispan.HeapView",
	viewAttribute : {
		heapPath : "/process/heap"
	}
};

infinispan.HeapParentElement = {
	viewClassName : "wgp.MultiAreaView",
	tabTitle : "HeapView",
	collection : [ infinispan.HeapViewElement ]
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

infinispan.HeapCacheTabViewElement = {
	viewClassName : "infinispan.TabView",
	collection : [ infinispan.HeapParentElement, infinispan.CacheParentElement ]
};

if (!wgp.constants.VIEW_SETTINGS) {
	wgp.constants.VIEW_SETTINGS = {};
}
wgp.constants.VIEW_SETTINGS = $.extend(wgp.constants.VIEW_SETTINGS,{
	"/infinispan/mapreduce/job" : infinispan.GanttChartViewElement,
	"/infinispan/mapreduce/task" : infinispan.MapReduceTabViewElement,
	"/infinispan" : infinispan.HeapCacheTabViewElement
});