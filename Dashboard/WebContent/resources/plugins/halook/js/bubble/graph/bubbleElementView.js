//グラフ表示用プロパティ
halook.BubbleChartAttribute = [ "colors", "labels", "valueRange", "xlabel",
		"ylabel", "strokeWidth", "legend", "labelsDiv", "width", "height",
		"drawPoints", "pointSize", "highlightCircleSize", "drawPointCallback",
		"drawHighlightPointCallback" ];

// MapSuccess,MapFailed,MapKilled,ReduceSuccess,ReduceFailed,ReduceKilledの順で表示用のフラグ
halook.bubble = {};
halook.bubble.MAP_SUCCESS = 0;
halook.bubble.MAP_FAILED = 1;
halook.bubble.MAP_KILLED = 2;
halook.bubble.REDUCE_SUCCESS = 3;
halook.bubble.REDUCE_FAILED = 4;
halook.bubble.REDUCE_KILLED = 5;
halook.bubble.sortFlag = [ true, true, true, true, true, true ];
var Sort_array = [ "Map", "Reduce" ];// タスクの種類
halook.bubble.Status_array = [ "Success", "Failed", "Killed" ];// ステータスの種類
var sortByFinishTime = false;
var divTime = 1000;// 1:millies,1000:second,60000:minutes,3600000:hours
// var taskNumber = 655;// ランダム用タスクの数

halook.BubbleElementView = wgp.DygraphElementView
		.extend({

			initialize : function(argument) {
				_.extend(this, Backbone.Events);
				this.treeSettings = argument.treeSettings;
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;// ビュータイプ
				this.width = argument["width"];// ウィンドウ幅
				this.height = argument["height"];// ウィンドウの高さ
				this.graphId = 0;// グラフID
				new graphListenerView(this);// グラフのチェックボックスのリスナ用ビュー
				new sortListenerView(this);// ソートのリスナ用ビュー

				this.jobInfo = argument.jobInfo;
				var finishTime = new Date(
						this.jobInfo.finishTime.getTime() + 120 * 1000);

				var appView = new ENS.AppView();
				appView.addView(this, (this.treeSettings.id + "%"));
				appView.getTermData([ (this.treeSettings.id + "%") ],
						this.jobInfo.startTime, finishTime);

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				var instance = this;
				this.on("updateGraphOptions", function() {
					instance.updateGraphOptions();
				});
				this.on("updateData", function() {
					instance.updateData();
				});

				this.collection.comparator = function(model) {
					var value = $.parseJSON(model.get("measurementValue"));
					if (null != value && null != value[0]
							&& undefined !== value[0]) {
						if (!sortByFinishTime) {
							return value[0].StartTime;
						} else {
							return value[0].FinishTime;
						}
					}
				};
			},
			render : function() {
				this._getData();

				// 時間順にソートする。
				this.dataArray = _.sortBy(this.dataArray, function(timeValue) {
					return timeValue[0].getTime();
				});
				// グラフの生成
				var settings = this.getAttributes(halook.BubbleChartAttribute);

				// 表示期間を指定する。
				if (this.dataArray.length > 0) {
					var leftDate = this.dataArray[0][0];
					var rightDate = this.dataArray[this.dataArray.length - 1][0];
					var term = (rightDate.getTime() - leftDate.getTime()) / 90;
					var leftDateTime = leftDate.getTime() - term;
					var rightDateTime = rightDate.getTime() + term;
					settings.dateWindow = [ new Date(leftDateTime),
							new Date(rightDateTime) ];
					settings.axisLabelColor = halook.graph.axisLabelColor;
					settings.labelsDivStyles = halook.graph.labelsDivStyles;
				}
				this.entity = new Dygraph(document.getElementById(this.$el
						.attr("id")), this.dataArray, settings);

				// アップデートオプション（形表示用、要修正)
				this.updateGraphOptions();

				// 描画のリサイズ
				this.entity.resize(this.width, this.height);
			},
			onAdd : function(graphModel) {
			},
			destroy : function() {
				this.stopRegisterCollectionEvent();
				var appView = new ENS.AppView();
				appView.stopSyncData([this.treeSettings.id + "%"]);
				if (this.collection) {
					this.collection.reset();
				}
				// チェックボックスの状態を初期に戻す。
				halook.bubble.sortFlag = [ true, true, true, true, true, true ];
			},
			_getData : function() {
				this.dataArray = [];
				var instance = this;
				this.collection.sort();
				var max = 0;
				_.each(this.collection.models, function(model) {
					instance._convartModelToArray(instance, model, max);
				});
				if (instance.dataArray.length !== 0) {
				} else {
					instance.dataArray.push([ new Date(), null, null, null,
							null, null, null, 0 ]);
				}

				// TaskのStartTimeまたはFinishが0のとき、0の代わりにJobの開始時間を入れる
				// これによってBubbleChartに1970/1/1という時系列にデータが表示される問題を防ぐ
				var jobStartTimeDate = new Date(this.jobInfo.startTime);
				
				var dataArrayTmp = this.dataArray;
				var dataArrayLength = dataArrayTmp.length;
				
				for (var index = 0; index < dataArrayLength; index++) {
					var date = dataArrayTmp[index][0];
					
					var time = date.getTime();
					
					if (time === 0) {
						dataArrayTmp[index][0] = jobStartTimeDate;
					}
				}
				
				this.dataArray = dataArrayTmp;
			},
			_convartModelToArray : function(instance, model, max) {
				var valueString = model.get("measurementValue");
				var value = $.parseJSON(valueString);
				if (null != value && null != value[0] && undefined !== value[0]) {
					var length = value.length;

					for (var i = 0; i < length; i++) {
						var processedData = this._processingData(value, i);
						if (processedData != null) {
							var tempprocessTime = (new Date(
									processedData.FinishTime).getTime() - new Date(
									processedData.StartTime).getTime());
							if (max < tempprocessTime)
								max = tempprocessTime;
							if (!sortByFinishTime) {
								instance.dataArray.push(instance
										._sortingByStartData(processedData));
							} else {
								instance.dataArray.push(instance
										._sortingByFinishData(processedData));
							}
						}
					}
				}
			},
			onComplete : function(type) {
				if (type == wgp.constants.syncType.SEARCH) {
					this._getTermData();
				}
			},
			_getTermData : function() {
				this.render();
			},
			// IDを登録する処理
			getRegisterId : function() {
				return this.graphId;
			},
			// ソート用にデータを再取得する
			updateData : function() {
				this.collection.comparator = function(model) {
					var value = $.parseJSON(model.get("measurementValue"));
					if (null != value && null != value[0]
							&& undefined !== value[0]) {
						if (!sortByFinishTime) {
							return value[0].StartTime;
						} else {
							return value[0].FinishTime;
						}
					}
				};
				var finishTime = new Date(
						this.jobInfo.finishTime.getTime() + 120 * 1000);
				var appView = new ENS.AppView();
				appView.getTermData([ (this.treeSettings.id + "%") ],
						this.jobInfo.startTime, finishTime);
			},
			// データの種類、成功別に分類し、グラフ表示用の配列に加工する関数
			_sortingByStartData : function(modelData) {
				var startTime = modelData.StartTime;
				var finishTime = modelData.FinishTime;
				if (finishTime === 0) {
					finishTime = startTime;
				}
				var processTime = (finishTime - startTime) / divTime;// 秒単位

				return this._dataPusher(startTime, processTime, modelData);
			},
			// データの種類、成功別に分類し、グラフ表示用の配列に加工する関数
			_sortingByFinishData : function(modelData) {

				var startTime = modelData.StartTime;
				var finishTime = modelData.FinishTime;
				if (finishTime === 0) {
					finishTime = startTime;
				}
				var processTime = (finishTime - startTime) / divTime;// 秒単位

				return this._dataPusher(finishTime, processTime, modelData);
			},
			_dataPusher : function(time, processTime, modelData) {
				var sortFlag = halook.bubble.sortFlag;
				var array = [];
				if (modelData.Sort == "m") {
					if (modelData.Status == halook.task.SUCCESSED
							&& sortFlag[halook.bubble.MAP_SUCCESS]) {
						array.push(new Date(time), processTime, null, null,
								null, null, null, null);
					} else if (modelData.Status == halook.task.FAILED
							&& sortFlag[halook.bubble.MAP_FAILED]) {
						array.push(new Date(time), null, processTime, null,
								null, null, null, null);
					} else if (modelData.Status == halook.task.KILLED
							&& sortFlag[halook.bubble.MAP_KILLED]) {
						array.push(new Date(time), null, null, processTime,
								null, null, null, null);
					} else {
						array.push(new Date(time), null, null, null, null,
								null, null, processTime);
					}
				} else if (modelData.Sort == "r") {
					if (modelData.Status == halook.task.SUCCESSED
							&& sortFlag[halook.bubble.REDUCE_SUCCESS]) {
						array.push(new Date(time), null, null, null,
								processTime, null, null, null);
					} else if (modelData.Status == halook.task.FAILED
							&& sortFlag[halook.bubble.REDUCE_FAILED]) {
						array.push(new Date(time), null, null, null, null,
								processTime, null, null);
					} else if (modelData.Status == halook.task.KILLED
							&& sortFlag[halook.bubble.REDUCE_KILLED]) {
						array.push(new Date(time), null, null, null, null,
								null, processTime, null);
					} else {
						array.push(new Date(time), null, null, null, null,
								null, null, processTime);
					}
				} else {
					array.push(new Date(time), null, null, null, null, null,
							null, processTime);
				}

				return array;
			},

			// 系列の表示を変更する処理
			updateGraphOptions : function() {
				var instance = this;
				var xlabel;
				if (sortByFinishTime) {
					xlabel = "FinishTime [Date]";
				} else {
					xlabel = "StartTime [Date]";
				}
				var sortFlag = halook.bubble.sortFlag;

				this.entity.updateOptions({
					xlabel : xlabel,
					visibility : [ sortFlag[halook.bubble.MAP_SUCCESS], sortFlag[halook.bubble.MAP_FAILED],
							sortFlag[halook.bubble.MAP_KILLED], sortFlag[halook.bubble.REDUCE_SUCCESS],
							sortFlag[halook.bubble.REDUCE_FAILED], sortFlag[halook.bubble.REDUCE_KILLED],
							true ],
					axisLabelFontSize : 11
				});
			},
			_processingData : function(value, index) {
				if (this.jobInfo.jobId == value[index]['JobID']) {
					var Sort = value[index]['TaskAttemptID'].split("_");
					var processedData = {
						TaskAttemptID : value[index]['TaskAttemptID'],
						StartTime : value[index]['StartTime'],
						FinishTime : value[index]['FinishTime'],
						Status : value[index]['Status'],
						Sort : Sort[3],
						HostName : value[index]['Hostname']
					};
					return processedData;
				} else {
					return null;
				}
			}
		});

// データ振り分け用のフラグチェック(0:MapSuccess,1:MapFailed,2:MapKilled,3:ReduceSuccess,4:ReduceFailed,5:ReduceKilled)
halook.bubble.flagChange = function(index) {
	if (halook.bubble.sortFlag[index]) {
		halook.bubble.sortFlag[index] = false;
	} else {
		halook.bubble.sortFlag[index] = true;
	}
};

// フラグが何かを見る
halook.bubble.flagCheck = function(index) {
	if (halook.bubble.sortFlag[index]) {
		return "checked";
	} else {
		return "";
	}
};

// フィニッシュボタンが何かを見る

var sortListenerView = Backbone.View.extend({
	el : "#leftTop",// 左上のチェックボックス
	initialize : function(parentView) {
		this.parentView = parentView;
		var instance = this;

		$("#leftTop").find("#startButton").click(function(e) {
			sortByFinishTime = false;
			instance._check(e);
		});

		$("#leftTop").find("#finishButton").click(function(e) {
			sortByFinishTime = true;
			instance._check(e);
		});
	},
	_check : function(e) {
		this.parentView.trigger("updateData");
	}
});

var graphListenerView = Backbone.View.extend({
	el : "#rightTop",// 右上のチェックボックス群
	initialize : function(parentView) {
		this.parentView = parentView;
		var instance = this;
		$("#rightTop").find("input").change(function(e) {
			instance._check(e);
		});

	},
	_check : function(e) {
		var id = $(e.target).attr("id");
		halook.bubble.flagChange(id);
		this.parentView.trigger("updateGraphOptions");
	}
});