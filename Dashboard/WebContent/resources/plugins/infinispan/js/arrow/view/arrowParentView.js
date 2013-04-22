infinispan.arrow = {};
infinispan.arrow.buttonSize = {};
infinispan.arrow.buttonSize.width = "120px";
infinispan.arrow.buttonSize.height = "60px";
infinispan.arrow.buttonSize.marginLeft = "5px";

infinispan.arrow.DisplayMode = "node";// "task";

infinispan.arrow.ignoretask = {
	"COMMIT_PENDING" : true
};
infinispan.arrow.buttonSize = {};

infinispan.jobInfoSpace = {};
infinispan.filterMode = null;

infinispan.jobInfoSpace.width = "865px";
infinispan.jobInfoSpace.height = "90px";
infinispan.jobInfoSpace.marginTop = "10px";
infinispan.jobInfoSpace.marginLeft = "1px";
infinispan.jobInfoSpace.float = "left";

infinispan.clearSpace = {};
infinispan.clearSpace.height = "15px";
infinispan.clearSpace.clear = "both";

infinispan.taskInfoSpace = {};
infinispan.taskInfoSpace.width = "115px";
infinispan.taskInfoSpace.height = "400px";
infinispan.taskInfoSpace.marginTop = "5px";
infinispan.taskInfoSpace.marginLeft = "5px";
infinispan.taskInfoSpace.float = "left";

infinispan.arrowChart = {};
infinispan.arrowChart.width = "780px";
infinispan.arrowChart.height = "320px";
infinispan.arrowChart.overflow = "scroll";
infinispan.arrowChart.overflowX = "hidden";
infinispan.arrowChart.backgroundColor = "#EEEEEE";
infinispan.arrowChart.float = "left";
infinispan.arrowChart.marginTop = 5;
infinispan.arrowChart.background = "-moz-linear-gradient(-45deg, #FFFFFF 0%, #AAAAAA 100%) repeat scroll 0 0 transparent";

infinispan.dygraphChart = {};
infinispan.dygraphChart.width = "710px";
infinispan.dygraphChart.height = "200px";
infinispan.dygraphChart.backgroundColor = "#EEEEEE";
infinispan.dygraphChart.float = "left";
infinispan.dygraphChart.leftMargin = "40px";
infinispan.dygraphChart.rigntMargin = "7px";
infinispan.dygraphChart.topMargin = "5px";
infinispan.dygraphChart.borderStyle = "outset";

infinispan.parentView = {};

// グラフ最小の時間 1346160591446 1346843780000
infinispan.parentView.minGraphTime = 0;
// グラフ最大の時間
infinispan.parentView.maxGraphTime = 0;
// グラフのインターバルの時間
infinispan.parentView.intervalTime = 0;

// /taskAttemptInfoArrayの情報。試行回数が複数のもののみ保持
// maxTime: 同じタスクの試行回数の最大値
// failNum : 同じタスクの失敗数
// runnningNum:同じタスクの動作数
// (successNum:同じタスクの成功数の最大値・・・イランとおもうけど)
// 同じIDの表に複数の行が入るときの lineNumももつ
infinispan.parentView.taskAttemptInfoDictionary = {};

infinispan.parentView.getFromServerDatas = [];

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////データの整理をするところ
// givenDatasはsampleDatasの形を入れることを想定
// attemptIDは１はじまりです。

// //////////ソートの関数の実装///////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ソートのモードとソート用関数の対応付け辞書
// 新しくソートを追加するときは、ここにその名前と、比較関数の定義を対応付ける。
// デフォルトは、taskID順に表示

// ソートを実際に行う関数

// 以下ソート関数群
infinispan.parentView._taskIDSort = function(first, second){
	var firstNumID = first.SimpleID;
	var secondNumID = second.SimpleID;
	var firstAttemptTime = first.attemptTime;
	var secondAttemptTime = second.attemptTime;

	if (firstNumID === "") {
		firstNumID = 0;
	} else {
		firstNumID -= 0;
	}
	
	if (secondNumID === "") {
		secondNumID = 0;
	} else {
		secondNumID -= 0;
	}
	
	if (firstNumID > secondNumID) {
		// console.log(parseInt(firstNumID), parseInt(secondNumID));
		return 1;
	} else if (firstNumID == secondNumID) {
		// console.log(parseInt(firstNumID), parseInt(secondNumID));
		if (firstAttemptTime > secondAttemptTime) {
			// console.log(firstAttemptTime, secondAttemptTime);
			return 1;
		}
	}
	return -1;
};

infinispan.parentView._nodeSort = function(first, second) {
	// そのまんま
	if (first.Hostname < second.Hostname)
		return -1;
	// 並び替え
	if (first.Hostname > second.Hostname)
		return 1;
	// 等しいときは、時間順
	if (first.StartTime > second.StartTime)
		return 1;
	return -1;
};

// 偶数か奇数かで値がかわる

infinispan.parentView.startTimeOdd = -1;
infinispan.parentView._startTimeSort = function(first, second) {
	if (first.StartTime > second.StartTime)
		return 1 * infinispan.parentView.startTimeOdd;
	return -1 * infinispan.parentView.startTimeOdd;
};

infinispan.parentView.finishTimeOdd = -1;
infinispan.parentView._finishTimeSort = function(first, second) {
	if (first.FinishTime > second.FinishTime)
		return 1 * infinispan.parentView.finishTimeOdd;
	return -1 * infinispan.parentView.finishTimeOdd;
};
infinispan.parentView.taskSortFunctionTable = {
		"task" : infinispan.parentView._taskIDSort,
		"node" : infinispan.parentView._nodeSort,
		"starttime" : infinispan.parentView._startTimeSort,
		"finishtime" : infinispan.parentView._finishTimeSort
};


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

infinispan.ArrowParentView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSettings) {
				this.isFirst = true;
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.viewId = argument.viewId;
				this.treeSettings = treeSettings;
				this.maxId = 0;
				var realTag = $("#" + this.$el.attr("id"));
				var dt = new Date();

				this.jobInfo = argument.jobInfo;
				var finishTime = new Date(
						this.jobInfo.finishTime.getTime() + 120 * 1000);

				var appView = new ENS.AppView();
				appView.addView(this, (treeSettings.id + "%"));
				appView.getTermData([ (treeSettings.id + "%") ],
						this.jobInfo.startTime, finishTime);

				infinispan.parentView.minGraphTime = this.jobInfo.startTime
						.getTime();
				infinispan.parentView.maxGraphTime = this.jobInfo.finishTime
						.getTime();
				infinispan.parentView.intervalTime = infinispan.parentView.maxGraphTime
						- infinispan.parentView.minGraphTime;

				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}
				// 必要なhtml群を追加する。
				this._insertInitHtml();

				this._initDataProcesser();
			},
			render : function() {
			},
			onAdd : function(element) {
				// console.log('call onAdd');
			},
			onChange : function(element) {
				// console.log('called changeModel');
			},
			onRemove : function(element) {
				// console.log('called removeModel');
			},
			getRegisterId : function() {
				return this.viewId;
			},
			_rearrangeDatas : function(givenDatas) {
				var pcounter = 0;
				for ( var i = 0; i < givenDatas.length; i++) {
					pcounter++;
					// IDを＿で区分けする
					var stringArray = (givenDatas[i].TaskAttemptID).split('_');
					
					var keyName = stringArray[2];
					var status = givenDatas[i].Status;
					
					givenDatas[i].SimpleID = stringArray[2];
					// セルの中における列情報も保持arrowChartViewで値を更新
					givenDatas[i].indexInCell = 0;

					// 試行回数
					var attemptTime = 1;
					givenDatas[i].attemptTime = attemptTime;

					// 同じtaskIDで最大回数を保存する
					if (infinispan.parentView.taskAttemptInfoDictionary[keyName] !== undefined
							&& infinispan.parentView.taskAttemptInfoDictionary[keyName].maxTime < attemptTime) {
						(infinispan.parentView.taskAttemptInfoDictionary[keyName]).maxTime = attemptTime;
					} else if (infinispan.parentView.taskAttemptInfoDictionary[keyName] === undefined) {
						(infinispan.parentView.taskAttemptInfoDictionary[keyName]) = {
							maxTime : attemptTime,
							successNum : 0,
							failNum : 0,
							runningNum : 0,
							lineNum : 1
						};
					}
					// 自分の状況を保存する。
					// failNum : 同じタスクの失敗数
					// runningNum:同じタスクの動作数
					// (successNum:同じタスクの成功数の最大値・・・イランとおもうけど)
					if (status == infinispan.task.SUCCESSED) {
						(infinispan.parentView.taskAttemptInfoDictionary[keyName]).successNum = 1;
					} else if (status == infinispan.task.FAILED) {
						(infinispan.parentView.taskAttemptInfoDictionary[keyName]).failNum++;
					} else if (status == infinispan.task.RUNNNING) {
						(infinispan.parentView.taskAttemptInfoDictionary[keyName]).runningNum++;
					}

				}
			},
			_executeTaskSort : function(array, mode) {
				if (infinispan.parentView.taskSortFunctionTable[mode] != null) {
					var a = infinispan.parentView.taskSortFunctionTable[mode];
					array.sort(infinispan.parentView.taskSortFunctionTable[mode]);
				}

				// collectionのリセット
				if (this.collection) {
					this.collection.reset();
				}

				if (infinispan.taskDataForShow && infinispan.taskDataForShow.length > 0) {
					this.addCollection(infinispan.taskDataForShow);
					this.render();
				}

			},
			_insertInitHtml : function() {
				$("#" + this.$el.attr("id"))
						.css(
								{
									background : "-moz-linear-gradient(-45deg, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 50%, rgba(17,17,17,1) 60%, rgba(43,43,43,1) 76%, rgba(28,28,28,1) 91%, rgba(19,19,19,1) 100%)",
									overflow : "hidden"
								});
				
				var context = $("#context").val();

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="jobInfoSpace" class="contentHeader"><div id="jobInfoSpaceHtml"  width="450" height = "60"></div><div id = "jobInfoImage" width="250" height="50"></div></div>'
										+ '<div class="clearSpace"></div>');
				$("#jobInfoSpace")
						.css(
								{
									width : infinispan.jobInfoSpace.width,
									height : infinispan.jobInfoSpace.height,
									marginTop : infinispan.jobInfoSpace.marginTop,
									marginLeft : infinispan.jobInfoSpace.marginLeft,
									float : infinispan.jobInfoSpace.float
								});
				$("#jobInfoSpace p").css({
					marginLeft : 5,
					marginTop : 0
				});
				$("#jobInfoSpaceHtml").css({
					float : "left",
					"margin-top" : "-4px"
				});

				$("#jobInfoImage").css({
					float : "right"
				});
				
				// Job status color
				var jobColor;
				if (this.jobInfo.jobStatus == infinispan.job.SUCCESS) {
					jobColor = infinispan.constants.STATE_COLOR[infinispan.constants.STATE.SUCCESS];
				} else if (this.jobInfo.jobStatus ==infinispan.job.FAIL) {
					jobColor = infinispan.constants.STATE_COLOR[infinispan.constants.STATE.FAIL];
				} else if (this.jobInfo.jobStatus == infinispan.job.KILL) {
					jobColor = infinispan.constants.STATE_COLOR[infinispan.constants.STATE.KILLED];
				} else if (this.jobInfo.jobStatus == infinispan.job.RUNNING) {
					jobColor = infinispan.constants.STATE_COLOR[infinispan.constants.STATE.RUNNING];
				}　else {
					jobColor = infinispan.constants.STATE_COLOR[infinispan.constants.STATE.KILLED];
				}	
				$("#jobInfoSpaceHtml").append(
						"<p><font size='6' face='Comic Sans MS'><b>"
								+ this.jobInfo.jobId + " : </b></font>"
								+ "<font size='6' color='" + jobColor + "'><b>"
								+ this.jobInfo.jobStatus + "</b></font></br> "
								+ "<font size='4'>(" + this.jobInfo.jobName
								+ ")</font></br>"
								+ " <font  face='Comic Sans MS'> "
								+ this.jobInfo.startTime.toLocaleString() + "  -  "
								+ this.jobInfo.finishTime.toLocaleString() + "</font></br></p>");
				$("#jobInfoSpaceHtml p").css({
					marginLeft : 10,
					marginTop : 0
				});

				$(".clearSpace").css({
					height : infinispan.clearSpace.height,
					clear : infinispan.clearSpace.clear
				});
				
				
				// ///////////////////////////////////////////////////////////
				// ボタンたちの追加を行う。////////////////////////////////////////////
				$("#" + this.$el.attr("id"))
				.append('<div id="buttonSpace"></div>');

				this.buttonList = [];
				
				var backButton = {
					type : "button",
					id : "arrowBackButton",
					value : "Back",
					classType : "sortButton"
				};
				this.buttonList.push(backButton);
					
				var taskButton = {
					type : "button",
					id : "arrowTaskButton",
					value : "Task",
					classType : "sortButton"
				};
				this.buttonList.push(taskButton);

				var nodeButton = {
					type : "button",
					id : "arrowNodeButton",
					value : "Node",
					classType : "sortButton"
				};
				this.buttonList.push(nodeButton);

				var startButton = {
					type : "button",
					id : "arrowStartButton",
					value : "StartTime",
					classType : "sortButton"
				};
				this.buttonList.push(startButton);

				var finishButton = {
					type : "button",
					id : "arrowFinishButton",
					value : "FinishTime",
					classType : "sortButton"
				};
				this.buttonList.push(finishButton);

				var failButton = {
					type : "button",
					id : "arrowFailButton",
					value : "Failed",
					classType : "sortButton"
				};
				this.buttonList.push(failButton);
				var killedButton = {
					type : "button",
					id : "arrowKilledButton",
					classType : "sortButton",
					value : "Killed"
				};
				this.buttonList.push(killedButton);

				var instance = this;
				_.each(this.buttonList, function(button) {
					$("#buttonSpace").append(
							'<input type=' + button.type + ' id=' + button.id
									+ ' class=' + button.classType + ' value='
									+ button.value + '>');
				});

				$(".sortButton").css({
					width : infinispan.arrow.buttonSize.width,
					height : infinispan.arrow.buttonSize.height,
					marginLeft : infinispan.arrow.buttonSize.marginLeft,
					float : "left"
				});

				$("#arrowBackButton").click(function() {
					instance._backTobeforePage();
				});
				$("#arrowTaskButton").click(function() {
					instance._changeToTask();
				});
				$("#arrowNodeButton").click(function() {
					instance._changeToNode();
				});
				$("#arrowFailButton").click(function() {
					instance._changeToFail();
				});
				$("#arrowKilledButton").click(function() {
					instance._changeToKilled();
				});
				$("#arrowStartButton").click(function() {
					instance._changeToStart();
				});
				$("#arrowFinishButton").click(function() {
					instance._changeToFinish();
				});
				$("#taskInfoSpace")
						.append(
								'<div id="taskInfoSpace" style="background-color:#EEDDDD;border:outset;border-color:#AA7777;border-width:4px;"></div>');
				$("#taskInfoSpace")
						.css(
								{
									width : infinispan.taskInfoSpace.width,
									height : infinispan.taskInfoSpace.height,
									marginTop : infinispan.taskInfoSpace.marginTop,
									marginLeft : infinispan.taskInfoSpace.marginLeft,
									float : infinispan.taskInfoSpace.float,
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)"
								});
				

				

				// ///////////////////////////////////////////////////////////

				// /////////////////////////////////////////////////////////////////
				// ////arrow detail view
				// $("#" + this.$el.attr("id")).append('<div id="arrowInfoView"
				// style="padding:10px; color:white; position:absolute;
				// border:white 2px dotted; display:none">detail info is
				// here</div>');
				// console.log($("#arrowInfoView") + " arrowInfoView");
				// $("#arrowInfoView").css({
				// "width":"200",
				// "height":"200",
				// "top":"0",
				// "left":"0"
				// });

				// ////////////////////////////////////////////////////////////////////////

			},
			_createChartScreen : function() {
				// arrow用のdiv Tagの作成を行う。////////////////////////////////////
				$("#" + this.$el.attr("id"))
						.append(
								'<div id="arrowChart" class="infinispanContents"></div>');
				$("#arrowChart").css({
					width : infinispan.arrowChart.width,
					height : infinispan.arrowChart.height,
					overflow : infinispan.arrowChart.overflow,
					overflowX : infinispan.arrowChart.overflowX,
					marginTop : infinispan.arrowChart.marginTop,
					float : infinispan.arrowChart.float
				});

				this.arrowChartView = new infinispan.ArrowChartView({
					id : "arrowChart",
					rootView : this,
					jobInfo : this.jobInfo
				});
				// console.log("this.arrowView : " + this.arrowView);
				// /////////////////////////////////////////////////////////////////
				// graph用のdiv Tagの作成を行う。//////////////////////////////////////
				$("#" + this.$el.attr("id")).append(
						'<div id="dygraphChart" class="infinispanContents"></div>');
				$("#dygraphChart").css({
					width : infinispan.dygraphChart.width,
					height : infinispan.dygraphChart.height,
					backgroundColor : infinispan.dygraphChart.backgroundColor,
					float : infinispan.dygraphChart.float,
					marginLeft : infinispan.dygraphChart.leftMargin,
					marginRight : infinispan.dygraphChart.rigntMargin,
					marginTop : infinispan.dygraphChart.topMargin,
					"border-style" : infinispan.dygraphChart.borderStyle
				});

				this.dygraphView = new infinispan.DygraphChartView({
					id : "dygraphChart",
					rootView : this
				});
			},
			_backTobeforePage : function() {
				var ganttchartTreeId = infinispan.ganttchart.treeSettings.id;
				var elem = document.getElementById(ganttchartTreeId);
				$(elem).mousedown();
			},
			_changeToTask : function() {
				// console.log("change to task " + infinispan.arrow.DisplayMode + " node");

				if (infinispan.arrow.DisplayMode != "task" || infinispan.filterMode != null) {
					infinispan.arrow.DisplayMode = "task";
					infinispan.taskDataForShow = infinispan.taskDataOriginal;
					infinispan.filterMode = null;
					this._executeTaskSort(infinispan.taskDataForShow, infinispan.arrow.DisplayMode);
					// console.log("change to task " + this);
					this.arrowChartView.redraw("task");
				}
			},
			_changeToNode : function() {
				// console.log("change to node " + infinispan.arrow.DisplayMode + " task");
				if (infinispan.arrow.DisplayMode != "node" || infinispan.filterMode != null) {
					infinispan.taskDataForShow = infinispan.taskDataOriginal;
					infinispan.filterMode = null;

					infinispan.arrow.DisplayMode = "node";
					this._executeTaskSort(infinispan.taskDataForShow, infinispan.arrow.DisplayMode);
					// console.log("change to node " + this);
					this.arrowChartView.redraw("node");
				}
			},
			_changeToStart : function() {

				infinispan.parentView.startTimeOdd *= (-1);
				// console.log("change to node " + infinispan.arrow.DisplayMode + " task");
				infinispan.taskDataForShow = infinispan.taskDataOriginal;
				infinispan.filterMode = null;

				infinispan.arrow.DisplayMode = "starttime";
				this._executeTaskSort(infinispan.taskDataForShow, infinispan.arrow.DisplayMode);
				// console.log("change to node " + this);
				this.arrowChartView.redraw("node");

			},
			_changeToFinish : function() {
				infinispan.parentView.finishTimeOdd *= (-1);
				// console.log("change to node " + infinispan.arrow.DisplayMode + " task");
				infinispan.taskDataForShow = infinispan.taskDataOriginal;
				infinispan.filterMode = null;

				infinispan.arrow.DisplayMode = "finishtime";
				this._executeTaskSort(infinispan.taskDataForShow, infinispan.arrow.DisplayMode);
				// console.log("change to node " + this);
				this.arrowChartView.redraw("node");

			},
			_changeToFail : function() {
				if (infinispan.filterMode != "fail") {
					infinispan.filterMode = "fail";
					this._executeFilter();
					this.arrowChartView.redraw(infinispan.arrow.DisplayMode);
				}
			},
			_changeToKilled : function() {
				if (infinispan.filterMode != "killed") {
					infinispan.filterMode = "killed";
					this._executeFilter();
					this.arrowChartView.redraw(infinispan.arrow.DisplayMode);
				}
			},
			addCollection : function(dataArray) {
				if (dataArray != null) {
					var instance = this;
					_.each(dataArray, function(data, index) {
						var model = new instance.collection.model({
							SubmitTime : data.SubmitTime,
							StartTime : data.StartTime,
							FinishTime : data.FinishTime,
							JobID : data.JobID,
							Status : data.Status,
							Hostname : data.Hostname,
							TaskAttemptID : data.TaskAttemptID,
							SimpleID : data.SimpleID,
							attemptTime : data.attemptTime
						});
						instance.collection.add(model,
								wgp.constants.BACKBONE_EVENT.SILENT);
						instance.maxId++;
					});
				}

			},

			_executeFilter : function(array, mode) {
				var resultCollection;
				if (infinispan.filterMode == "fail") {
					resultCollection = _.filter(infinispan.parentView.getFromServerDatas, function(model){
						return model.Status == infinispan.constants.JOB_STATE.FAILED;
					});
				} else if (infinispan.filterMode == "killed") {
					resultCollection = _.filter(infinispan.parentView.getFromServerDatas, function(model){
						if (model.Status == infinispan.constants.JOB_STATE.KILLED){
							return true;
						} else if (model.Status == infinispan.constants.JOB_STATE.KILLED_UNCLEAN) {
							return true;
						}
						return false;
					});
				}
				infinispan.taskDataForShow = resultCollection;
			},
			onComplete : function(type) {
				if (type == wgp.constants.syncType.SEARCH) {
					this._getTermData();
				}
			},
			_getTermData : function() {
				if (this.isFirst) {
					this.render();
					var instance = this;
					infinispan.parentView.getFromServerDatas = [];
					
					_.each(this.collection.models, function(model) {
						var deleteFlag = false;
						var valueString = model.get("measurementValue");
						var value = $.parseJSON(valueString);
						if (value == null) {
							return;
						}
						
						for ( var i = 0; i < value.length; i++) {
							// if status is commit pending, ignore task.
							if (infinispan.arrow.ignoretask[value[i].Status] === true) {
								continue;
							}
							if (value[i].JobID == instance.jobInfo.jobId) {
								infinispan.parentView.getFromServerDatas.push(value[i]);
							}
						}
					});
					
					this._initDataProcesser();
					this._setIntervalTime();
					this._createChartScreen();
					
					this.isFirst = false;
				}
				
			},
			destroy : function() {
				var appView = new ENS.AppView();
				appView.removeView(this.arrowChartView);
				this.stopRegisterCollectionEvent();
				appView.stopSyncData([this.treeSettings.id]);
				if (this.collection) {
					this.collection.reset();
				}

			},
			_initDataProcesser : function() {
				// 取得したデータを保存用の部位に代入する。
				infinispan.taskDataOriginal = infinispan.parentView.getFromServerDatas;
				infinispan.taskDataForShow = infinispan.parentView.getFromServerDatas;

				this._rearrangeDatas(infinispan.taskDataForShow);
				// /sortを実施
				this._executeTaskSort(infinispan.taskDataForShow, infinispan.arrow.DisplayMode);
				// infinispan.arrowChartView.redraw("node");

			},
			_setIntervalTime : function() {
				var finalTime = 0;
				
				var taskDataForAhowLength = infinispan.taskDataForShow.length;
				
				for ( var i = 0; i < taskDataForAhowLength; i++) {
					var data = infinispan.taskDataForShow[i];

					if (finalTime < data.FinishTime) {
						finalTime = data.FinishTime;
					}
				}
				
				infinispan.parentView.intervalTime = finalTime
				- infinispan.parentView.minGraphTime;
			}
		});