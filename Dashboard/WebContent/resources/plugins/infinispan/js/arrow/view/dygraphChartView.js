// //////////////////////////////////////グラフ関数群/////////////////////////////////////////////////////////////////////////////

infinispan.parentView.NumAttribute = [ "colors", "labels", "valueRange", "xlabel", "ylabel",
		"strokeWidth", "legend", "labelsDiv", "width", "height", "drawPoints",
		"pointSize", "drawXGrid", "axisLabelFontSize", "axisLabelColor", "labelsDivStyles"
];

// ある時間帯にあるtaskが稼働しているかどうかを返す関数
function isTaskMovingOnTime(taskAttemptInfo, markTime) {
	if (taskAttemptInfo.StartTime <= markTime
			&& markTime <= taskAttemptInfo.FinishTime)
		return true;
	else
		return false;
}

// ある時間帯にいくつのtaskが稼働しているかどうかを返す関数
infinispan.tasksCounter = function(tasks, markTime) {
	var counter = 0;
	for ( var i = 0; i < tasks.length; i++) {
		if (isTaskMovingOnTime(tasks[i], markTime))
			counter++;
	}
	return counter;
};

// 等間隔の時間でtaskの数を数えて時間と結果を辞書式でを返す関数
// Job始まりの時間、Job終わりの時間、taskAttemptの配列、区切り回数
infinispan.executeTaskCount = function(startTime, endTime, tasks, times) {
	if (times <= 0)
		return null;
	var interval = infinispan.parentView.intervalTime / times;
	var resultReturnArray = [];
	for ( var i = 0; i < times + 1; i++) {
		var tmpDictionary;
		var tmpTime = startTime + i * interval;
		var tmpDate = new Date();
		tmpDate.setTime(tmpTime);
		tmpDictionary = {
			time : tmpDate,
			counter : infinispan.tasksCounter(tasks, tmpTime)
		};
		resultReturnArray.push(tmpDictionary);
	}
	return resultReturnArray;
};

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

infinispan.DygraphChartView = wgp.DygraphElementView.extend({
	initialize : function() {
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new infinispan.dygraphModelCollection();
		this.attributes = {
			xlabel : "time [Date]",
			ylabel : "Concurrent task num",
			labels : [ "Date", "Task num" ],
			drawPoints : true,
			pointSize : 2,
			strokeWidth : 3,
			drawXGrid : true,
			axisLabelFontSize : 12,
			axisLabelColor : infinispan.graph.axisLabelColor,
			labelsDivStyles : infinispan.graph.labelsDivStyles
		};
	
		this.graphId = "taskGraph";
		this.maxId = 0;

		var realTag = $("#" + this.$el.attr("id"));
		if (this.width == null) {
			this.width = realTag.width();
		}
		if (this.height == null) {
			this.height = realTag.height();
		}

		var dataArray = infinispan.executeTaskCount(infinispan.parentView.minGraphTime,
				infinispan.parentView.maxGraphTime, infinispan.taskDataForShow, 100);

		this.entity = null;
		if (dataArray && dataArray.length > 0) {
			this.addCollection(dataArray);
			this.render();
		}
	},
	render : function() {
		var data = this.getData();
		this.entity = new Dygraph(document.getElementById(this.$el.attr("id")),
				data, this.getAttributes(infinispan.parentView.NumAttribute));
	},
	onAdd : function(element) {
	},
	onChange : function(element) {
	},
	onRemove : function(element) {
	},
	addCollection : function(dataArray) {
		if (dataArray != null) {
			var instance = this;
			_.each(dataArray, function(data, index) {
				var model = new instance.collection.model({
					dataId : instance.maxId,
					data : data
				});
				instance.collection.add(model,
						wgp.constants.BACKBONE_EVENT.SILENT);
				instance.maxId++;
			});
		}
	},

	// //////////描き加えるべき場所////////////////////////////////////////////
	getData : function() {
		var data = [];
		_.each(this.collection.models, function(model, index) {
			var modelData = model.get("data");
			var array = [];
			array.push(modelData.time);
			array.push(modelData.counter);
			data.push(array);
		});

		return data;
	}
// ///////////////////////////////////////////////////////////////////
});