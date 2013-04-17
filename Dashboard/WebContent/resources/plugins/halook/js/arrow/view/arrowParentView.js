////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// starttime; finishtime

halook.arrow = {};
halook.arrow.buttonSize = {};
halook.arrow.buttonSize.width = "120px";
halook.arrow.buttonSize.height = "40px";
halook.arrow.buttonSize.marginLeft = "5px";

halook.arrow.DisplayMode = "node";// "task";

halook.arrow.ignoretask = {
	"COMMIT_PENDING" : true
};
halook.arrow.buttonSize = {};

halook.jobInfoSpace = {};
halook.filterMode = null;

halook.jobInfoSpace.width = "865px";
halook.jobInfoSpace.height = "90px";
halook.jobInfoSpace.marginTop = "10px";
halook.jobInfoSpace.marginLeft = "1px";
halook.jobInfoSpace.float = "left";

halook.clearSpace = {};
halook.clearSpace.height = "15px";
halook.clearSpace.clear = "both";

halook.taskInfoSpace = {};
halook.taskInfoSpace.width = "115px";
halook.taskInfoSpace.height = "400px";
halook.taskInfoSpace.marginTop = "5px";
halook.taskInfoSpace.marginLeft = "5px";
halook.taskInfoSpace.float = "left";

halook.arrowChart = {};
halook.arrowChart.width = "780px";
halook.arrowChart.height = "320px";
halook.arrowChart.overflow = "scroll";
halook.arrowChart.overflowX = "hidden";
halook.arrowChart.backgroundColor = "#EEEEEE";
halook.arrowChart.float = "left";
halook.arrowChart.marginTop = 5;
halook.arrowChart.background = "-moz-linear-gradient(-45deg, #FFFFFF 0%, #AAAAAA 100%) repeat scroll 0 0 transparent";

halook.dygraphChart = {};
halook.dygraphChart.width = "710px";
halook.dygraphChart.height = "200px";
halook.dygraphChart.backgroundColor = "#EEEEEE";
halook.dygraphChart.float = "left";
halook.dygraphChart.leftMargin = "40px";
halook.dygraphChart.rigntMargin = "7px";
halook.dygraphChart.topMargin = "5px";
halook.dygraphChart.borderStyle = "outset";

halook.parentView = {};

// グラフ最小の時間 1346160591446 1346843780000
halook.parentView.minGraphTime = 0;
// グラフ最大の時間
halook.parentView.maxGraphTime = 0;
// グラフのインターバルの時間
halook.parentView.intervalTime = 0;

// /taskAttemptInfoArrayの情報。試行回数が複数のもののみ保持
// maxTime: 同じタスクの試行回数の最大値
// failNum : 同じタスクの失敗数
// runnningNum:同じタスクの動作数
// (successNum:同じタスクの成功数の最大値・・・イランとおもうけど)
// 同じIDの表に複数の行が入るときの lineNumももつ
halook.parentView.taskAttemptInfoDictionary = {};

halook.parentView.getFromServerDatas = [];

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
halook.parentView._taskIDSort = function(first, second){
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

halook.parentView._nodeSort = function(first, second) {
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

halook.parentView.startTimeOdd = -1;
halook.parentView._startTimeSort = function(first, second) {
	if (first.StartTime > second.StartTime)
		return 1 * halook.parentView.startTimeOdd;
	return -1 * halook.parentView.startTimeOdd;
};

halook.parentView.finishTimeOdd = -1;
halook.parentView._finishTimeSort = function(first, second) {
	if (first.FinishTime > second.FinishTime)
		return 1 * halook.parentView.finishTimeOdd;
	return -1 * halook.parentView.finishTimeOdd;
};
halook.parentView.taskSortFunctionTable = {
		"task" : halook.parentView._taskIDSort,
		"node" : halook.parentView._nodeSort,
		"starttime" : halook.parentView._startTimeSort,
		"finishtime" : halook.parentView._finishTimeSort
};


// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

halook.ArrowParentView = wgp.AbstractView
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

				halook.parentView.minGraphTime = this.jobInfo.startTime
						.getTime();
				halook.parentView.maxGraphTime = this.jobInfo.finishTime
						.getTime();
				halook.parentView.intervalTime = halook.parentView.maxGraphTime
						- halook.parentView.minGraphTime;

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
					// 試行回数を表す
					var attemptTime;
					// m_000033のようなキーの形を作る。
					var keyName = stringArray[3] + "_" + stringArray[4];
					var status = givenDatas[i].Status;

					// とりあえず新しく変数を追加
					givenDatas[i].Mapreduce = stringArray[3];
					givenDatas[i].SimpleID = stringArray[4];
					// セルの中における列情報も保持arrowChartViewで値を更新
					givenDatas[i].indexInCell = 0;

					// attemptTimeの計算
					stringArray[5] = stringArray[5].replace(/0/g, '');
					if (stringArray[5] !== "") {
						attemptTime = parseInt(stringArray[5], 10) + 1;
					} else {
						attemptTime = 1;
					}
					givenDatas[i].attemptTime = attemptTime;

					// 同じtaskIDで最大回数を保存する
					if (halook.parentView.taskAttemptInfoDictionary[keyName] !== undefined
							&& halook.parentView.taskAttemptInfoDictionary[keyName].maxTime < attemptTime) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).maxTime = attemptTime;
					} else if (halook.parentView.taskAttemptInfoDictionary[keyName] === undefined) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]) = {
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
					if (status == halook.task.SUCCESSED) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).successNum = 1;
					} else if (status == halook.task.FAILED) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).failNum++;
					} else if (status == halook.task.RUNNNING) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).runningNum++;
					}

				}
			},
			_executeTaskSort : function(array, mode) {
				if (halook.parentView.taskSortFunctionTable[mode] != null) {
					var a = halook.parentView.taskSortFunctionTable[mode];
					array.sort(halook.parentView.taskSortFunctionTable[mode]);
				}

				// collectionのリセット
				if (this.collection) {
					this.collection.reset();
				}

				if (halook.taskDataForShow && halook.taskDataForShow.length > 0) {
					this.addCollection(halook.taskDataForShow);
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
								'<div id="jobInfoSpace" class="contentHeader"><div id="jobInfoSpaceHtml"  width="450" height = "60"></div><div id = "jobInfoImage" width="250" height="50"><img src ="' + context + '/resources/plugins/halook/images/halook_120x30.png" alt="nopage" ></div></div>'
										+ '<div class="clearSpace"></div>');
				$("#jobInfoSpace")
						.css(
								{
									width : halook.jobInfoSpace.width,
									height : halook.jobInfoSpace.height,
									marginTop : halook.jobInfoSpace.marginTop,
									marginLeft : halook.jobInfoSpace.marginLeft,
									float : halook.jobInfoSpace.float
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
				var jobColor = "";
				if (this.jobInfo.jobStatus == halook.job.SUCCESS) {
					jobColor = halook.constants.STATE_COLOR[halook.constants.STATE.SUCCESS];
				} else if (this.jobInfo.jobStatus ==halook.job.FAIL) {
					jobColor = halook.constants.STATE_COLOR[halook.constants.STATE.FAIL];
				} else if (this.jobInfo.jobStatus == halook.job.KILL) {
					jobColor = halook.constants.STATE_COLOR[halook.constants.STATE.KILLED];
				} else if (this.jobInfo.jobStatus == halook.job.RUNNING) {
					jobColor = halook.constants.STATE_COLOR[halook.constants.STATE.RUNNING];
				}　else {
					jobColor = halook.constants.STATE_COLOR[halook.constants.STATE.KILLED];
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
					height : halook.clearSpace.height,
					clear : halook.clearSpace.clear
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
					width : halook.arrow.buttonSize.width,
					height : halook.arrow.buttonSize.height,
					marginLeft : halook.arrow.buttonSize.marginLeft,
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
									width : halook.taskInfoSpace.width,
									height : halook.taskInfoSpace.height,
									marginTop : halook.taskInfoSpace.marginTop,
									marginLeft : halook.taskInfoSpace.marginLeft,
									float : halook.taskInfoSpace.float,
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
								'<div id="arrowChart" class="halookContents"></div>');
				$("#arrowChart").css({
					width : halook.arrowChart.width,
					height : halook.arrowChart.height,
					overflow : halook.arrowChart.overflow,
					overflowX : halook.arrowChart.overflowX,
					marginTop : halook.arrowChart.marginTop,
					float : halook.arrowChart.float
				});

				this.arrowChartView = new halook.ArrowChartView({
					id : "arrowChart",
					rootView : this,
					jobInfo : this.jobInfo
				});
				// console.log("this.arrowView : " + this.arrowView);
				// /////////////////////////////////////////////////////////////////
				// graph用のdiv Tagの作成を行う。//////////////////////////////////////
				$("#" + this.$el.attr("id")).append(
						'<div id="dygraphChart" class="halookContents"></div>');
				$("#dygraphChart").css({
					width : halook.dygraphChart.width,
					height : halook.dygraphChart.height,
					backgroundColor : halook.dygraphChart.backgroundColor,
					float : halook.dygraphChart.float,
					marginLeft : halook.dygraphChart.leftMargin,
					marginRight : halook.dygraphChart.rigntMargin,
					marginTop : halook.dygraphChart.topMargin,
					"border-style" : halook.dygraphChart.borderStyle
				});

				this.dygraphView = new halook.DygraphChartView({
					id : "dygraphChart",
					rootView : this
				});
			},
			_backTobeforePage : function() {
				var ganttchartTreeId = halook.ganttchart.treeSettings.id;
				var elem = document.getElementById(ganttchartTreeId);
				$(elem).mousedown();
			},
			_changeToTask : function() {
				// console.log("change to task " + halook.arrow.DisplayMode + " node");

				if (halook.arrow.DisplayMode != "task" || halook.filterMode != null) {
					halook.arrow.DisplayMode = "task";
					halook.taskDataForShow = halook.taskDataOriginal;
					halook.filterMode = null;
					this._executeTaskSort(halook.taskDataForShow, halook.arrow.DisplayMode);
					// console.log("change to task " + this);
					this.arrowChartView.redraw("task");
				}
			},
			_changeToNode : function() {
				// console.log("change to node " + halook.arrow.DisplayMode + " task");
				if (halook.arrow.DisplayMode != "node" || halook.filterMode != null) {
					halook.taskDataForShow = halook.taskDataOriginal;
					halook.filterMode = null;

					halook.arrow.DisplayMode = "node";
					this._executeTaskSort(halook.taskDataForShow, halook.arrow.DisplayMode);
					// console.log("change to node " + this);
					this.arrowChartView.redraw("node");
				}
			},
			_changeToStart : function() {

				halook.parentView.startTimeOdd *= (-1);
				// console.log("change to node " + halook.arrow.DisplayMode + " task");
				halook.taskDataForShow = halook.taskDataOriginal;
				halook.filterMode = null;

				halook.arrow.DisplayMode = "starttime";
				this._executeTaskSort(halook.taskDataForShow, halook.arrow.DisplayMode);
				// console.log("change to node " + this);
				this.arrowChartView.redraw("node");

			},
			_changeToFinish : function() {
				halook.parentView.finishTimeOdd *= (-1);
				// console.log("change to node " + halook.arrow.DisplayMode + " task");
				halook.taskDataForShow = halook.taskDataOriginal;
				halook.filterMode = null;

				halook.arrow.DisplayMode = "finishtime";
				this._executeTaskSort(halook.taskDataForShow, halook.arrow.DisplayMode);
				// console.log("change to node " + this);
				this.arrowChartView.redraw("node");

			},
			_changeToFail : function() {
				if (halook.filterMode != "fail") {
					halook.filterMode = "fail";
					this._executeFilter();
					this.arrowChartView.redraw(halook.arrow.DisplayMode);
				}
			},
			_changeToKilled : function() {
				if (halook.filterMode != "killed") {
					halook.filterMode = "killed";
					this._executeFilter();
					this.arrowChartView.redraw(halook.arrow.DisplayMode);
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
							Mapreduce : data.Mapreduce,
							SimpleID : data.SimpleID,
							attemptTime : data.attemptTime
						});
						instance.collection.add(model,
								wgp.constants.BACKBONE_EVENT.SILENT);
						instance.maxId++;
					});
				}

			},

			// SubmitTime:null,
			// StartTime:null,
			// FinishTime:null,
			// JobID:null,
			// Status:null,
			// Hostname:null,
			// TaskAttemptID: null,
			// Mapreduce: null,
			// SimpleID: null,
			// attemptTime: null,

			_executeFilter : function(array, mode) {
				var resultCollection;
				if (halook.filterMode == "fail") {
					resultCollection = _.filter(halook.parentView.getFromServerDatas, function(model){
						return model.Status == halook.constants.JOB_STATE.FAILED;
					});
				} else if (halook.filterMode == "killed") {
					resultCollection = _.filter(halook.parentView.getFromServerDatas, function(model){
						if (model.Status == halook.constants.JOB_STATE.KILLED){
							return true;
						} else if (model.Status == halook.constants.JOB_STATE.KILLED_UNCLEAN) {
							return true;
						}
						return false;
					});
				}
				halook.taskDataForShow = resultCollection;
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
					halook.parentView.getFromServerDatas = [];
					
					_.each(this.collection.models, function(model) {
						var deleteFlag = false;
						var valueString = model.get("measurementValue");
						var value = $.parseJSON(valueString);
						if (value == null) {
							return;
						}
						
						for ( var i = 0; i < value.length; i++) {
							// if status is commit pending, ignore task.
							if (halook.arrow.ignoretask[value[i].Status] === true) {
								continue;
							}
							if (value[i].JobID == instance.jobInfo.jobId) {
								halook.parentView.getFromServerDatas.push(value[i]);
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
				halook.taskDataOriginal = halook.parentView.getFromServerDatas;
				halook.taskDataForShow = halook.parentView.getFromServerDatas;

				this._rearrangeDatas(halook.taskDataForShow);
				// /sortを実施
				this._executeTaskSort(halook.taskDataForShow, halook.arrow.DisplayMode);
				// halook.arrowChartView.redraw("node");

			},
			_setIntervalTime : function() {
				var finalTime = 0;
				
				var taskDataForAhowLength = halook.taskDataForShow.length;
				
				for ( var i = 0; i < taskDataForAhowLength; i++) {
					var data = halook.taskDataForShow[i];

					if (finalTime < data.FinishTime) {
						finalTime = data.FinishTime;
					}
				}
				
				halook.parentView.intervalTime = finalTime
				- halook.parentView.minGraphTime;
			}
		});