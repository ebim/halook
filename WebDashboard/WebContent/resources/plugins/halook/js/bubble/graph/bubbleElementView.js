//グラフ表示用プロパティ
halook.BubbleChartAttribute = [ "colors", "labels", "valueRange", "xlabel",
		"ylabel", "strokeWidth", "legend", "labelsDiv", "width", "height",
		"drawPoints", "pointSize", "highlightCircleSize", "drawPointCallback",
		"drawHighlightPointCallback" ];

// MapSuccess,MapFailed,MapKilled,ReduceSuccess,ReduceFailed,ReduceKilledの順で表示用のフラグ
halook.bubble = {};
var MAP_SUCCESS = 0;
var MAP_FAILED = 1;
var MAP_KILLED = 2;
var REDUCE_SUCCESS = 3;
var REDUCE_FAILED = 4;
var REDUCE_KILLED = 5;
var EDGE_RATE = 1;// グラフ両端のダミーデータの占める大きさの割合(%)
var sortFlag = [ true, true, true, true, true, true ];
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
							&& undefined != value[0]) {
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
			destory : function() {
				var tmpAppView = new ENS.AppView();
				tmpAppView.removeView(this);
			},
			_getData : function() {
				this.dataArray = [];
				var instance = this;
				this.collection.sort();
				var max = 0;
				_.each(this.collection.models, function(model) {
					instance._convartModelToArray(instance, model, max);
				});
				if (instance.dataArray.length != 0) {
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
					
					var time = date.getTime()
					
					if (time == 0) {
						dataArrayTmp[index][0] = jobStartTimeDate;
					}
				}
				
				this.dataArray = dataArrayTmp;
			},
			_convartModelToArray : function(instance, model, max) {
				var valueString = model.get("measurementValue");
				var value = $.parseJSON(valueString);
				if (null != value && null != value[0] && undefined != value[0]) {
					var length = value.length;

					for (i = 0; i < length; i++) {
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
							&& undefined != value[0]) {
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
				if (finishTime == 0) {
					finishTime = startTime;
				}
				var processTime = (finishTime - startTime) / divTime;// 秒単位

				return this._dataPusher(startTime, processTime, modelData);
			},
			// データの種類、成功別に分類し、グラフ表示用の配列に加工する関数
			_sortingByFinishData : function(modelData) {

				var startTime = modelData.StartTime;
				var finishTime = modelData.FinishTime;
				if (finishTime == 0) {
					finishTime = startTime;
				}
				var processTime = (finishTime - startTime) / divTime;// 秒単位

				return this._dataPusher(finishTime, processTime, modelData);
			},
			_dataPusher : function(time, processTime, modelData) {
				var array = [];
				if (modelData.Sort == "m") {
					if (modelData.Status == halook.task.SUCCESSED
							&& sortFlag[MAP_SUCCESS]) {
						array.push(new Date(time), processTime, null, null,
								null, null, null, null);
					} else if (modelData.Status == halook.task.FAILED
							&& sortFlag[MAP_FAILED]) {
						array.push(new Date(time), null, processTime, null,
								null, null, null, null);
					} else if (modelData.Status == halook.task.KILLED
							&& sortFlag[MAP_KILLED]) {
						array.push(new Date(time), null, null, processTime,
								null, null, null, null);
					} else {
						array.push(new Date(time), null, null, null, null,
								null, null, processTime);
					}
				} else if (modelData.Sort == "r") {
					if (modelData.Status == halook.task.SUCCESSED
							&& sortFlag[REDUCE_SUCCESS]) {
						array.push(new Date(time), null, null, null,
								processTime, null, null, null);
					} else if (modelData.Status == halook.task.FAILED
							&& sortFlag[REDUCE_FAILED]) {
						array.push(new Date(time), null, null, null, null,
								processTime, null, null);
					} else if (modelData.Status == halook.task.KILLED
							&& sortFlag[REDUCE_KILLED]) {
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

				this.entity.updateOptions({
					xlabel : xlabel,
					visibility : [ sortFlag[MAP_SUCCESS], sortFlag[MAP_FAILED],
							sortFlag[MAP_KILLED], sortFlag[REDUCE_SUCCESS],
							sortFlag[REDUCE_FAILED], sortFlag[REDUCE_KILLED],
							true ],
					axisLabelFontSize : 11,
				/*
				 * 形表示用の定義の仕方 ReduceSuccess:{ //pointSize : 7, //drawPoints :
				 * false, drawPointCallback : instance._mouthlessFace,
				 * drawHighlightPointCallback : instance._mouthlessFace },
				 * ReduceFailed:{ drawPointCallback : instance._mouthlessFace,
				 * drawHighlightPointCallback : instance._mouthlessFace },
				 */
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
					}
					return processedData;
				} else {
					return null;
				}
			}
		/*
		 * 三角を描く関数 _mouthlessFace : function(g, seriesName, canvasContext, cx,
		 * cy, color, pointSize) { var canvasList = $("canvas"); var canvas =
		 * canvasList[0]; //if ( ! canvas || ! canvas.getContext ) { return
		 * false; } ctx = canvas.getContext("2d"); // 三角形を描く ctx.fillStyle =
		 * "#000000"; ctx.beginPath(); ctx.moveTo(250, 10); ctx.lineTo(300, 90);
		 * ctx.lineTo(210, 90); ctx.closePath(); // 三角形を塗りつぶす ctx.fill(); return
		 * ctx; }
		 */

		});

// データ振り分け用のフラグチェック(0:MapSuccess,1:MapFailed,2:MapKilled,3:ReduceSuccess,4:ReduceFailed,5:ReduceKilled)
function flagChange(index) {
	if (sortFlag[index]) {
		sortFlag[index] = false;
	} else {
		sortFlag[index] = true;
	}
}

// フラグが何かを見る
function flagCheck(index) {
	if (sortFlag[index]) {
		return "checked";
	} else {
		return "";
	}
}

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
	// events: {
	// "change input": "_check"
	// },
	_check : function(e) {
		var id = $(e.target).attr("id");
		flagChange(id);
		this.parentView.trigger("updateGraphOptions");
	}
});

/*
 * var buttonView = Backbone.View.extend({ el : "#leftTop", events:{ "click":
 * "_back" }, _back : function(){ //alert(""); } });
 */