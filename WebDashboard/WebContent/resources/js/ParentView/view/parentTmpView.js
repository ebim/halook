////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

DisplayMode = "node";// "task";
// starttime; finishtime

halook.jobInfoSpace = {};
halook.filterMode = null;

halook.jobInfoSpace.width = "865px";
halook.jobInfoSpace.height = "90px";
halook.jobInfoSpace.marginTop = "10px";
halook.jobInfoSpace.marginLeft = "10px";
halook.jobInfoSpace.float = "left";

halook.clearSpace = {};
halook.clearSpace.height = "15px";
halook.clearSpace.clear = "both";

halook.buttons = {};
halook.buttons.marginLeft = "15px";
halook.buttons.marginFilterLeft = "45px";
halook.buttons.float = "left";

halook.taskButton = {};
halook.taskButton.width = "120px";
halook.taskButton.height = "40px";

halook.nodeButton = {};
halook.nodeButton.width = "120px";
halook.nodeButton.height = "40px";

halook.taskInfoSpace = {};
halook.taskInfoSpace.width = "115px";
halook.taskInfoSpace.height = "400px";
halook.taskInfoSpace.marginTop = "5px";
halook.taskInfoSpace.marginLeft = "5px";
halook.taskInfoSpace.float = "left";

halook.arrowChart = {};
halook.arrowChart.width = "750px";
halook.arrowChart.height = "320px";
halook.arrowChart.overflow = "scroll";
halook.arrowChart.overflowX = "hidden";
halook.arrowChart.backgroundColor = "#EEEEEE";
halook.arrowChart.float = "right";
halook.arrowChart.marginTop = 5;
halook.arrowChart.background = "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)";

halook.dygraphChart = {};
halook.dygraphChart.width = "700px";
halook.dygraphChart.height = "200px";
halook.dygraphChart.backgroundColor = "#EEEEEE";
halook.dygraphChart.float = "right";
halook.dygraphChart.rigntMargin = "7px";
halook.dygraphChart.topMargin = "5px";
halook.dygraphChart.borderStyle = "outset";

halook.parentView = {};
halook.parentViewer;
halook.parentView.taskSortFunctionTable = {
	"task" : _taskIDSort,
	"node" : _nodeSort,
	"starttime" : _startTimeSort,
	"finishtime" : _finishTimeSort,
};

halook.arrowChartView;

// グラフ最小の時間 1346160591446 1346843780000
halook.parentView.minGraphTime = 1346986703230;
// グラフ最大の時間
halook.parentView.maxGraphTime = 1346987603230;
console.log( halook.parentView.maxGraphTime + "  " + halook.parentView.minGraphTime);
// グラフのインターバルの時間
halook.parentView.intervalTime = halook.parentView.maxGraphTime
		- halook.parentView.minGraphTime;

// halook.arrowChart = {};

// /taskAttemptInfoArrayの情報。試行回数が複数のもののみ保持
// maxTime: 同じタスクの試行回数の最大値
// failNum : 同じタスクの失敗数
// runnningNum:同じタスクの動作数
// (successNum:同じタスクの成功数の最大値・・・イランとおもうけど)
// 同じIDの表に複数の行が入るときの lineNumももつ
halook.parentView.taskAttemptInfoDictionary = {};

var sampleDatasJob = {
	StartTime : 1346160591456,
	FinishTime : 1346160991946,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	JobName : "PiEstimator",
	Status : "SUCCESS",
};
var sampleDatas = [ {
	StartTime : 1346160591456,
	FinishTime : 1346160591946,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_m_000004_1",
	Hostname : "/abcfield/raoh",
	Status : "KILLED",
}, {
	StartTime : 1346160591856,
	FinishTime : 1346160592046,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_r_000033_1",
	Hostname : "/default-rack/raoh02",
	Status : "FAIL",
}, {
	StartTime : 1346160591556,
	FinishTime : 1346160591846,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_m_000004_2",
	Hostname : "/default-rack/kenma",
	Status : "SUCCESS",
}, {
	StartTime : 1346160591956,
	FinishTime : 1346160592319,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_m_000004_0",
	Hostname : "/default-rack/raoh05",
	Status : "FAIL",
}, {
	StartTime : 1346160591446,
	FinishTime : 1346160592246,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_r_000013_0",
	Hostname : "/abcfield/raoh",
	Status : "SUCCESS",
}, {
	StartTime : 1346160591756,
	FinishTime : 1346160592046,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_r_000083_0",
	Hostname : "/default-rack/raoh02",
	Status : "FAIL",
}, {
	StartTime : 1346160592156,
	FinishTime : 1346160592280,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_r_000033_2",
	Hostname : "/oioioi/raoh",
	Status : "SUCCESS",
}, {
	StartTime : 1346160591556,
	FinishTime : 1346160591646,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_r_000039_0",
	Hostname : "/default-rack/raoh02",
	Status : "KILLED",
}, {
	StartTime : 1346160591446,
	FinishTime : 1346160592319,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_m_000028_0",
	Hostname : "/abcfield/raoh",
	Status : "KILLED",
}, {
	StartTime : 1346160591756,
	FinishTime : 1346160591956,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_r_000033_0",
	Hostname : "/default-rack02/menma02",
	Status : "FAIL",
}, {
	StartTime : 1346160591746,
	FinishTime : 1346160592300,
	SubmitTime : 1346160591446,
	JobID : "job_201208281744_0012",
	TaskAttemptID : "attempt_201306281744_0012_m_000028_1",
	Hostname : "/abcfield/raoh",
	Status : "SUCCESS",
}, ];

getFromServerDatas = [];
halook.taskDataOriginal = sampleDatas;
halook.taskDataForShow = sampleDatas;

halook.jobDataForShow = sampleDatasJob;

// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ////////////////データの整理をするところ
// givenDatasはsampleDatasの形を入れることを想定
// attemptIDは１はじまりです。

// //////////ソートの関数の実装///////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ソートのモードを設定///
var sortString = "default";
// ソートのモードとソート用関数の対応付け辞書
// 新しくソートを追加するときは、ここにその名前と、比較関数の定義を対応付ける。
// デフォルトは、taskID順に表示

// ソートを実際に行う関数

// 以下ソート関数群
function _taskIDSort(first, second) {
	var firstNumID = first.SimpleID;
	var secondNumID = second.SimpleID;
	var firstAttemptTime = first.attemptTime;
	var secondAttemptTime = second.attemptTime;

	firstNumID = firstNumID.replace(/0/g, '');
	if (firstNumID == "")
		firstNumID = "0";

	secondNumID = secondNumID.replace(/0/g, '');
	if (secondNumID == "")
		secondNumID = "0";

	if (parseInt(firstNumID) > parseInt(secondNumID)) {
		// console.log(parseInt(firstNumID), parseInt(secondNumID));
		return 1;
	} else if (parseInt(firstNumID) == parseInt(secondNumID)) {
		// console.log(parseInt(firstNumID), parseInt(secondNumID));
		if (firstAttemptTime > secondAttemptTime) {
			// console.log(firstAttemptTime, secondAttemptTime);
			return 1;
		}
	}
	return -1;
}

function _nodeSort(first, second) {
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
}

// 偶数か奇数かで値がかわるぉ

var startTimeOdd = -1;
function _startTimeSort(first, second) {
	if (first.StartTime > second.StartTime)
		return 1 * startTimeOdd;
	return -1 * startTimeOdd;
}

var finishTimeOdd = -1;
function _finishTimeSort(first, second) {
	if (first.FinishTime > second.FinishTime)
		return 1 * finishTimeOdd;
	return -1 * finishTimeOdd;
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var ParentTmpView = wgp.AbstractView
		.extend({
			initialize : function(arguments, treeString) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				// this.collection = new parentTmpModelCollection();
				var appView = new wgp.AppView();
				appView.addView(this, "/mapreduce/task%");
				// this.registerCollectionEvent();
				this.maxId = 0;
				var realTag = $("#" + this.$el.attr("id"));
				var dt = new Date();

				appView.getTermData([ "/mapreduce/task%" ], new Date(halook.parentView.minGraphTime), new Date(halook.parentView.maxGraphTime));

				halook.parentViewer = this;

				// firstDataprocesser

				// ///////////******************************:caution**********************/////////////////////
				// var dataArray = halook.taskDataForShow;
				//
				// if (dataArray && dataArray.length > 0) {
				// this.addCollection(dataArray);
				// this.render();
				// }

				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}
				// console.log("get test term data");

				// console.log('called initialize parent view');
			},
			render : function() {
				// console.log('call render');
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
					if (stringArray[5] != "") {
						attemptTime = parseInt(stringArray[5]) + 1;
					} else
						attemptTime = 1;
					givenDatas[i].attemptTime = attemptTime;

					// 同じtaskIDで最大回数を保存する
					if (halook.parentView.taskAttemptInfoDictionary[keyName] != undefined
							&& halook.parentView.taskAttemptInfoDictionary[keyName].maxTime < attemptTime) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).maxTime = attemptTime;
					} else if (halook.parentView.taskAttemptInfoDictionary[keyName] == undefined) {
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
					if (status == wgp.constants.JOB_STATE.SUCCESS) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).successNum = 1;
					} else if (status == wgp.constants.JOB_STATE.FAIL) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).failNum++;
					} else if (status == wgp.constants.JOB_STATE.RUNNING) {
						(halook.parentView.taskAttemptInfoDictionary[keyName]).runningNum++;
					}

					// console.log("now taskAttemp " + pcounter + " "
					// + taskAttemptInfoDictionary[keyName].maxTime + " name: "
					// + keyName + "time:" + attemptTime + " status "
					// + (taskAttemptInfoDictionary[keyName]).failNum
					// + (taskAttemptInfoDictionary[keyName]).successNum
					// + (taskAttemptInfoDictionary[keyName]).runningNum);
				}
			},
			_executeTaskSort : function(array, mode) {
				if (halook.parentView.taskSortFunctionTable[mode] != null) {
					// console.log("execute sort");
					array.sort(halook.parentView.taskSortFunctionTable[mode]);
				} else {
					// console.log("didn't execute sort");
				}
				// for ( var i = 0; i < halook.taskDataForShow.length; i++) {
				// // console.log("HostName :"
				// // + halook.taskDataForShow[i].Hostname + " "
				// // + halook.taskDataForShow[i].StartTime);
				// }
				// for ( var i = 0; i < halook.taskDataForShow.length; i++) {
				// console.log("taskName :"
				// + halook.taskDataForShow[i].TaskAttemptID);
				// }

				// /collectionのリセット
				this.collection.reset();

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
									overflow : "hidden",

								});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="jobInfoSpace" style="border:outset;border-color:#EEEEEE;border-width:7px;"><div id="jobInfoSpaceHtml"  width="450" height = "60"></div><div id = "jobInfoImage" width="250" height="50"><img src ="/WebDashboard/resources/images/halook_120x30.png" alt="nopage" ></div></div>'
										+ '<div class="clearSpace"></div>');
				$("#jobInfoSpace")
						.css(
								{
									width : halook.jobInfoSpace.width,
									height : halook.jobInfoSpace.height,
									marginTop : halook.jobInfoSpace.marginTop,
									marginLeft : halook.jobInfoSpace.marginLeft,
									float : halook.jobInfoSpace.float,
									/* For Mozilla/Gecko (Firefox etc) */
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
									/* For Internet Explorer 5.5 - 7 */
									filter : " progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF, endColorstr=#FFFFFFFF)",
								// /* For Internet Explorer 8 */
								// -ms-filter:
								// "progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF,
								// endColorstr=#FFFFFFFF)",
								});
				$("#jobInfoSpace p").css({
					marginLeft : 5,
					marginTop : 0
				});
				$("#jobInfoSpaceHtml").css({
					float : "left"
				});

				$("#jobInfoImage").css({
					float : "right"
				});

				$(".clearSpace").css({
					height : halook.clearSpace.height,
					clear : halook.clearSpace.clear
				});
				// ///////////////////////////////////////////////////////////
				// ボタンたちの追加を行う。////////////////////////////////////////////
				$("#" + this.$el.attr("id"))
						.append(
								'<input type="button" id="taskButton" value="task"></input><input type="button" id="nodeButton" value="node"></input><input type="button" id="startButton" value="START_TIME"></input><input type="button" id="finishButton" value="FINISH_TIME"></input><input type="button" id="failButton" value="FAIL"></input><input type="button" id="killedButton" value="KILLED"></input></br></br></br><div id="taskInfoSpace" style="background-color:#EEDDDD;border:outset;border-color:#AA7777;border-width:4px;"></div>');

				// $("#" + this.$el.attr("id"))
				// .append(
				// '<div id="searchSpace"><h3><a href="#">Normal
				// Sort</a></h3><div id="buttons"><input type="button"
				// id="taskButton" value="task"></input><input type="button"
				// id="nodeButton" value="node"></input><input type="button"
				// id="failButton" value="FAIL"></input><input type="button"
				// id="killedButton" value="KILLED"></input></br></div><h3><a
				// href="#">Detail Sort</a></h3><div id="detailSearch"
				// style="width:900;">aaa</div></div><div id="taskInfoSpace"
				// style="background-color:#EEDDDD;border:outset;border-color:#AA7777;border-width:4px;"></div>');
				// $("#searchSpace").css({height:500});
				// $("#detailSearch").css({ height:300});
				// $("#buttons").css({
				// height: 100
				// // marginLeft : halook.buttons.marginLeft,
				// // float : halook.buttons.float,
				// });
				$("#taskButton").css({
					width : halook.taskButton.width,
					height : halook.taskButton.height,
					marginLeft : halook.buttons.marginLeft,
					float : "left",
				});

				var instance = this;

				$("#taskButton").click(instance._changeToTask);
				$("#taskButton").button();
				$("#nodeButton").css({
					// marginLeft:"10px",
					width : halook.nodeButton.width,
					height : halook.nodeButton.height,
					float : "left",
					marginLeft : halook.buttons.marginLeft,

				});
				$("#nodeButton").button();
				$("#nodeButton").click(instance._changeToNode);

				$("#failButton").css({
					// marginLeft:"10px",
					width : halook.nodeButton.width,
					height : halook.nodeButton.height,
					float : "left",
					marginLeft : halook.buttons.marginFilterLeft,

				});
				$("#failButton").button();
				$("#failButton").click(instance._changeToFail);

				$("#killedButton").css({
					// marginLeft:"10px",
					width : halook.nodeButton.width,
					height : halook.nodeButton.height,
					float : "left",
					marginLeft : halook.buttons.marginLeft,

				});
				$("#killedButton").button();
				$("#killedButton").click(instance._changeToKilled);

				$("#startButton").css({
					// marginLeft:"10px",
					width : halook.nodeButton.width,
					height : halook.nodeButton.height,
					float : "left",
					marginLeft : halook.buttons.marginLeft,

				});
				$("#startButton").button();
				$("#startButton").click(instance._changeToStart);

				$("#finishButton").css({
					// marginLeft:"10px",
					width : halook.nodeButton.width,
					height : halook.nodeButton.height,
					float : "left",
					marginLeft : halook.buttons.marginLeft,

				});
				$("#finishButton").button();
				$("#finishButton").click(instance._changeToFinish);

				// $("#searchSpace").css({
				// "margin-left" : 10
				// });
				// $("#searchSpace").accordion({
				// autoHeight : false,
				// navigation : true
				// });

				$("#taskInfoSpace")
						.css(
								{
									width : halook.taskInfoSpace.width,
									height : halook.taskInfoSpace.height,
									marginTop : halook.taskInfoSpace.marginTop,
									marginLeft : halook.taskInfoSpace.marginLeft,
									float : halook.taskInfoSpace.float,
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
								});

				// ///////////////////////////////////////////////////////////
				// arrow用のdiv Tagの作成を行う。////////////////////////////////////
				$("#" + this.$el.attr("id"))
						.append(
								'<div id="arrowChart" style="border:outset;border-color:#AA7777;border-width:4px;"></div>');
				$("#arrowChart").css({
					width : halook.arrowChart.width,
					height : halook.arrowChart.height,
					overflow : halook.arrowChart.overflow,
					overflowX : halook.arrowChart.overflowX,
					marginTop : halook.arrowChart.marginTop,
					float : halook.arrowChart.float,
					background : halook.arrowChart.background
				// background :"-moz-linear-gradient(-45deg,
				// rgba(226,226,226,1) 0%, rgba(219,219,219,1)
				// 50%, rgba(209,209,209,1) 51%,
				// rgba(254,254,254,1) 100%)"
				});
				halook.arrowChartView = new ArrowChartView({
					id : "arrowChart",
					rootView : this
				});
				// console.log("this.arrowView : " + this.arrowView);
				// /////////////////////////////////////////////////////////////////
				// graph用のdiv Tagの作成を行う。//////////////////////////////////////
				$("#" + this.$el.attr("id")).append(
						'<div id="dygraphChart"></div>');
				$("#dygraphChart").css({
					width : halook.dygraphChart.width,
					height : halook.dygraphChart.height,
					backgroundColor : halook.dygraphChart.backgroundColor,
					float : halook.dygraphChart.float,
					marginRight : halook.dygraphChart.rigntMargin,
					marginTop : halook.dygraphChart.topMargin,
					"border-style" : halook.dygraphChart.borderStyle
				});

				this.dygraphView = new DygraphChartView({
					id : "dygraphChart",
					rootView : this
				});

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
			_changeToTask : function() {
				// console.log("change to task " + DisplayMode + " node");

				if (DisplayMode != "task" || halook.filterMode != null) {
					DisplayMode = "task";
					halook.taskDataForShow = halook.taskDataOriginal;
					halook.filterMode = null;

					halook.parentViewer._executeTaskSort(
							halook.taskDataForShow, DisplayMode);
					// console.log("change to task " + this);
					halook.arrowChartView.redraw("task");
				}
			},
			_changeToNode : function() {
				// console.log("change to node " + DisplayMode + " task");
				if (DisplayMode != "node" || halook.filterMode != null) {
					halook.taskDataForShow = halook.taskDataOriginal;
					halook.filterMode = null;

					DisplayMode = "node";
					halook.parentViewer._executeTaskSort(
							halook.taskDataForShow, DisplayMode);
					// console.log("change to node " + this);
					halook.arrowChartView.redraw("node");
				}
			},
			_changeToStart : function() {

				startTimeOdd *=(-1);
				// console.log("change to node " + DisplayMode + " task");
				halook.taskDataForShow = halook.taskDataOriginal;
				halook.filterMode = null;

				DisplayMode = "starttime";
				halook.parentViewer._executeTaskSort(halook.taskDataForShow,
						DisplayMode);
				// console.log("change to node " + this);
				halook.arrowChartView.redraw("node");

			},
			_changeToFinish : function() {
				finishTimeOdd *=(-1);
				// console.log("change to node " + DisplayMode + " task");
				halook.taskDataForShow = halook.taskDataOriginal;
				halook.filterMode = null;

				DisplayMode = "finishtime";
				halook.parentViewer._executeTaskSort(halook.taskDataForShow,
						DisplayMode);
				// console.log("change to node " + this);
				halook.arrowChartView.redraw("node");

			},
			_changeToFail : function() {
				if (halook.filterMode != "fail") {
					halook.filterMode = "fail";
					// console.log("change to fail " + DisplayMode + " fail");
					halook.parentViewer._executeFilter();
					// console.log("change to fail " + this);

					halook.arrowChartView.redraw(DisplayMode);
				}
			},
			_changeToKilled : function() {
				if (halook.filterMode != "killed") {
					halook.filterMode = "killed";
					// console.log("change to killed " + DisplayMode + "
					// killed");
					halook.parentViewer._executeFilter();
					// console.log("change to killed " + this);
					halook.arrowChartView.redraw(DisplayMode);
				}
			},
			addCollection : function(dataArray) {
				if (dataArray != null) {
					var instance = this;
					// console.log("dataArray :start");
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
							attemptTime : data.attemptTime,
						});
						// console.log(model + " modelwaaaaaaaa"
						// + model.get("StartTime"));
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

			// //////////描き加えるべき場所////////////////////////////////////////////
			getData : function() {
				var data = [];
				_.each(this.collection.models, function(model, index) {
					var modelData = {
						StartTime : model.get("StartTime"),
						FinishTime : model.get("FinishTime"),
						SubmitTime : model.get("SubmitTime"),
						Status : model.get("Status"),
						attemptTime : model.get("attemptTime"),
						JobID : model.get("JobID"),
						Hostname : model.get("Hostname"),
						TaskAttemptID : model.get("TaskAttemptID"),
						Mapreduce : model.get("Mapreduce"),
						SimpleID : model.get("SimpleID"),
					};
					// nsole.log("modelData: " + modelData.Status +
					// modelData.JobID + modelData.TaskAttemptID);
					data.push(modelData);
				});

				return data;
			},
			_executeFilter : function(array, mode) {
				var resultCollection;
				if (halook.filterMode == "fail") {
					resultCollection = halook.parentViewer.collection.where({
						Status : wgp.constants.JOB_STATE.FAIL

					});
				} else if (halook.filterMode == "killed") {
					resultCollection = halook.parentViewer.collection.where({
						Status : wgp.constants.JOB_STATE.KILLED
					});
				}

				var data = [];
				for ( var i = 0; i < resultCollection.length; i++) {
					var modelData = {
						StartTime : resultCollection[i].get("StartTime"),
						FinishTime : resultCollection[i].get("FinishTime"),
						SubmitTime : resultCollection[i].get("SubmitTime"),
						Status : resultCollection[i].get("Status"),
						attemptTime : resultCollection[i].get("attemptTime"),
						JobID : resultCollection[i].get("JobID"),
						Hostname : resultCollection[i].get("Hostname"),
						TaskAttemptID : resultCollection[i]
								.get("TaskAttemptID"),
						Mapreduce : resultCollection[i].get("Mapreduce"),
						SimpleID : resultCollection[i].get("SimpleID"),
					};
					// nsole.log("modelData: " + modelData.Status +
					// modelData.JobID + modelData.TaskAttemptID);
					data.push(modelData);
				}
				;

				halook.taskDataForShow = data;

			},
			getTermData : function() {
				// console.log("getDataNow");
				_.each(this.collection.models, function(model) {
					var deleteFlag = false;
					var valueString = model.get("measurementValue");
					var value = $.parseJSON(valueString);
					if (value == null)
						return;
					for ( var i = 0; i < value.length; ++i) {
//						if(targetJobID == value[i].JobID){
							getFromServerDatas.push(value[i]);
//						}else{
//							
//						}
						
						
					}
					// console.log(value);

				});
				console.log("DoneDataNow");
				this._initDataProcesser();

			},
			destroy : function() {
				// delete items
			},
			_initDataProcesser : function() {
				// //////////////////最初のデータの処理を行う。//////////////////////////////////////////////////////////////////////
				// 取得したデータを保存用の部位に代入する。
				console.log("initData now");
				// halook.taskDataOriginal = sampleDatas;
				// halook.taskDataForShow = sampleDatas;
				halook.taskDataOriginal = getFromServerDatas;
				halook.taskDataForShow = getFromServerDatas;

				console.log("rearrange start now");

				this._rearrangeDatas(halook.taskDataForShow);

				// /////////////////////////////////////////////////////////////////////////////////////////////////////////////
				// /sortを実施
				console.log("sorting now");
				this._executeTaskSort(halook.taskDataForShow, DisplayMode);
				// for ( var i = 0; i < halook.taskDataForShow.length; i++) {
				// console.log("HostName :" + halook.taskDataForShow[i].Hostname
				// + " "
				// + halook.taskDataForShow[i].StartTime);
				// }
				// for ( var i = 0; i < halook.taskDataForShow.length; i++) {
				// console.log("taskName :" +
				// halook.taskDataForShow[i].TaskAttemptID);
				// }
				// 必要なhtml群を追加する。
				this._insertInitHtml();

				// halook.arrowChartView.redraw("node");

			}

		});