//paperの高さ
halook.arrowChart.paperHeight = halook.parentView.getFromServerDatas.length
		* halook.arrowChart.cellHeight;
// paperの幅
halook.arrowChart.paperWidth = 750;
// 矢印絵画領域の始まるオフセット分
halook.arrowChart.startLineX = 100;
// ひとつのセルの高さの設定
halook.arrowChart.cellHeight = 30;
// アローチャート部分の長さ
halook.arrowChart.arrowChartWidth = halook.arrowChart.paperWidth
		- halook.arrowChart.startLineX - 4;

// string offset
halook.arrowChart.stringHeightOffset = -10;

// IDと登場回数を記憶する辞書
halook.arrowChart.idCounter = {};

halook.arrowChart.defaultIndexInCell = 1;
halook.arrowChart.defaultTotalInCell = 1;
halook.arrowChart.TableLineColor = "#777777";
halook.arrowChart.CellLineColor = "#FFFFFF";
halook.arrowChart.cellTitleFontSize = 14;
halook.arrowChart.cellTitleFontSizeForNode = 14;

halook.arrowChart.CellTitleObjectIDs = 40000;
halook.arrowChart.CellTitleHeight = 90;
halook.arrowChart.CellTitlePointX = 5;
halook.arrowChart.CellLineObjectID = 10000;

// detail 表示用のelementを保存しておく箱
halook.arrowChart.detailInfoElement = null;

halook.arrowChart.InfoElementObjectID = 50000;
halook.arrowChart.infoElementFontSize = 15;

// //////////////////////////////////////アロー関数群////////////////////////////////////////////////////////////
halook.ArrowChartView = wgp.AbstractView
		.extend({
			initialize : function(argument) {
				var jobColor;
				this.jobInfo = argument.jobInfo;
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.attributes = {};
				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);
				halook.arrowChart.paperHeight = halook.parentView.getFromServerDatas.length
						* halook.arrowChart.cellHeight;

				this.paper.setSize(halook.arrowChart.paperWidth,
						halook.arrowChart.paperHeight);

				// /複数回登場するIDの記憶と番号登録
				var taskDataShowLength = halook.taskDataOriginal.length;
				var idstring;
				var idArray;
				var rowCounter;
				for ( var i = 0; i < taskDataShowLength; i++) {
					idstring = halook.taskDataOriginal[i].TaskAttemptID;
					idArray = idstring.split('_');
					rowCounter = 0;
					idArray[5] = idArray[5].replace(/0/g, '');
					if (idArray[5] !== 0) {
						if (halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] === undefined)
							halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] = idArray[5];
						else if (halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] < idArray[5])
							halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] = idArray[5];
					}
				}

				// StartTime,FinishTimeが0であるtaskがあった場合、
				// 0の代わりにJobの開始時間を入れる
				this._setJobStartTimeToZeroTask();

				// 基本となるテーブルの線を描く
				this._drawTableLines();

				// 矢印たちと×印の絵画の作成
				this._drawArrowAndError();

				// textAreaの描画を行う。
				this._drawCellTitle();

				// taskInfo表示用
				this._initInfoElement();

				// /////グラフのtaskのカウントを実行

				this.maxId = 0;

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				// console.log('called initialize');
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
			_drawArrowAndError : function(element) {
				var rowCounter = 0;

				var taskShowLength = halook.taskDataForShow.length;
				for ( var i = 0; i < taskShowLength; i++) {
					var data = halook.taskDataForShow[i];
					var modelInfo;
					var indexInCell = 1;
					var totalInCell = 1;
					var modelInfoArray = [];
					var stateString;

					if (halook.arrow.DisplayMode == "task") {

						modelInfo = this._calcArrowLengthAndStartPos(
								data.StartTime, data.FinishTime, indexInCell,
								totalInCell, rowCounter);
					} else if (halook.arrow.DisplayMode == "node") {
						modelInfo = this._calcArrowLengthAndStartPos(
								data.StartTime, data.FinishTime,
								halook.arrowChart.defaultIndexInCell,
								halook.arrowChart.defaultTotalInCell,
								rowCounter);
					}

					var modelDataForArrow = new wgp.MapElement({
						objectId : 30000 + i,
						objectName : null,
						height : 0,
						width : modelInfo.length,
						pointX : modelInfo.posX,
						pointY : modelInfo.posY
					});

					// KILLED_UNCLEANはKILLEDとみなす
					if (data.Status == halook.constants.JOB_STATE.KILLED_UNCLEAN) {
						data.Status = halook.constants.JOB_STATE.KILLED;
					}

					// ///statusがエラーの場合の処理はこれも行う
					if (data.Status == halook.constants.JOB_STATE.FAIL
							|| data.Status == halook.constants.JOB_STATE.FAILED_UNCLEAN
							|| data.Status == halook.constants.JOB_STATE.KILLED) {
						var errorInfo;
						if (halook.arrow.DisplayMode == "task") {
							errorInfo = this._calcErrorLengthAndStartPos(
									data.FinishTime, indexInCell, totalInCell,
									rowCounter);
						} else if (halook.arrow.DisplayMode == "node") {
							errorInfo = this._calcErrorLengthAndStartPos(
									data.FinishTime, 1, 1, rowCounter);
						}

						var modelDataForError = new wgp.MapElement({
							objectId : 15,
							objectName : null,
							height : 50,
							width : 50,
							pointX : errorInfo.posX,
							pointY : errorInfo.posY
						});
						stateString = halook.constants.STATE[data.Status];

						var errorStateString = stateString;
						stateString = data.Mapreduce + stateString;

						if (data.Status == halook.constants.JOB_STATE.FAIL) {
							new halook.ErrorStateElementView({
								model : modelDataForError,
								paper : this.paper,
								state : errorStateString,
								info : data
							});
						}

					} else if (data.Status == "RUNNING") {
						stateString = "run";
						stateString = data.Mapreduce + stateString;
					} else if (data.Status == "UNASSIGNED") {
						stateString = "unassigned";
						stateString = data.Mapreduce + stateString;
					} else {
						stateString = "normal";
						stateString = data.Mapreduce + stateString;
					}
					new halook.ArrowStateElementView({
						model : modelDataForArrow,
						paper : this.paper,
						state : stateString,
						info : data
					});

					rowCounter++;
				}
			},
			_calcErrorLengthAndStartPos : function(eventTime, trialTime,
					allTrialTime, rowNum) {
				// ここで長さとスタート位置の計算
				var x = 0, y = 0;
				x = halook.arrowChart.startLineX
						+ halook.arrowChart.arrowChartWidth
						* (eventTime - halook.parentView.minGraphTime) * 1.0
						/ halook.parentView.intervalTime;
				// スタートy位置
				y = halook.arrowChart.cellHeight * trialTime * 1.0
						/ (1 + allTrialTime) + rowNum
						* halook.arrowChart.cellHeight;

				return {
					posX : x,
					posY : y
				};
			},
			_calcArrowLengthAndStartPos : function(startTime, finishTime,
					trialTime, allTrialTime, rowNum) {
				var x = 0, y = 0, width = 0;
				// 幅
				width = halook.arrowChart.arrowChartWidth
						* (finishTime - startTime) * 1.0
						/ halook.parentView.intervalTime;
				// スタートx位置
				x = halook.arrowChart.startLineX
						+ halook.arrowChart.arrowChartWidth
						* (startTime - halook.parentView.minGraphTime) * 1.0
						/ halook.parentView.intervalTime;
				// スタートy位置
				y = halook.arrowChart.cellHeight * trialTime
						/ (1 + allTrialTime) + rowNum
						* halook.arrowChart.cellHeight;
				return {
					posX : x,
					posY : y,
					length : width
				};
			},
			_drawCellTitle : function() {
				var labelString;
				var textRowCounter = 0;
				var data;
				var modelDataForCellTitle;
				var tmpLabelArray;

				var taskDataForAhowLength = halook.taskDataForShow.length;
				if (halook.arrow.DisplayMode == "task") {

					for ( var index = 0; index < taskDataForAhowLength; index++) {
						data = halook.taskDataForShow[index];

						modelDataForCellTitle = new wgp.MapElement({
							objectId : halook.arrowChart.CellTitleObjectIDs
									+ index,
							objectName : null,
							height : 0,
							width : halook.arrowChart.CellTitleHeight,
							pointX : halook.arrowChart.CellTitlePointX,
							pointY : halook.arrowChart.cellHeight * 1.0 / 2
									+ textRowCounter
									* halook.arrowChart.cellHeight,
							text : data.Mapreduce + "_" + data.SimpleID,
							fontSize : halook.arrowChart.cellTitleFontSize
						});
						new halook.TextAreaStateElementView({
							model : modelDataForCellTitle,
							paper : this.paper,
							state : "merror"
						});
						textRowCounter++;
					}
				} else if (halook.arrow.DisplayMode == "node") {
					for ( var index2 = 0; index2 < taskDataForAhowLength; index2++) {
						labelString = halook.taskDataForShow[index2].Hostname;
						tmpLabelArray = labelString.split('/');
						labelString = tmpLabelArray.join('\n');
						// console.log(labelString);
						modelDataForCellTitle = new wgp.MapElement(
								{
									objectId : halook.arrowChart.CellTitleObjectIDs
											+ index2,
									objectName : null,
									height : 0,
									width : halook.arrowChart.CellTitleHeight,
									pointX : halook.arrowChart.CellTitlePointX,
									pointY : halook.arrowChart.cellHeight * 1.0
											/ 2 + index2
											* halook.arrowChart.cellHeight,// +
									text : labelString,
									fontSize : halook.arrowChart.cellTitleFontSizeForNode
								});
						new halook.TextAreaStateElementView({
							model : modelDataForCellTitle,
							paper : this.paper,
							state : "merror"
						});
					}
				}
			},
			_drawTableLines : function() {
				// 縦線の表示 端から100px
				var modelDataForTableLines = new wgp.MapElement({
					objectId : 0,
					objectName : null,
					height : halook.arrowChart.paperHeight,
					width : 0,
					pointX : halook.arrowChart.startLineX,
					pointY : 0,
					color : halook.arrowChart.TableLineColor
				});
				new halook.LineStateElementView({
					model : modelDataForTableLines,
					paper : this.paper,
					state : "rerror"
				});

				this._drawCellLine();

			},
			_drawCellLine : function() {
				// /セルの線引きの作成
				var cellCounter = Math.floor(halook.arrowChart.paperHeight
						/ halook.arrowChart.cellHeight);
				var modelDataForCellLine;
				for ( var k = 0; k < cellCounter + 1; k++) {

					modelDataForCellLine = new wgp.MapElement({
						objectId : k + halook.arrowChart.CellLineObjectID,
						objectName : null,
						height : 0,
						width : halook.arrowChart.paperWidth,
						pointX : 0,
						pointY : k * halook.arrowChart.cellHeight,
						color : halook.arrowChart.CellLineColor,
						strokeWidth : 2
					});
					new halook.LineStateElementView({
						model : modelDataForCellLine,
						paper : this.paper,
						state : "rerror"
					});
				}

				var x = halook.arrowChart.startLineX
						+ halook.arrowChart.arrowChartWidth
						* (halook.parentView.maxGraphTime - halook.parentView.minGraphTime)
						* 1.0 / halook.parentView.intervalTime;

				var jobFinishTimeLine = new wgp.MapElement({
					objectId : k + halook.arrowChart.CellLineObjectID,
					objectName : null,
					height : halook.arrowChart.paperHeight,
					width : 0,
					pointX : x,
					pointY : 0,
					color : "#777777",
					strokeWidth : 4,
					title : "JobFinishTime"
				});
				var elem = new halook.LineStateElementView({
					model : jobFinishTimeLine,
					paper : this.paper,
					state : "rerror"
				});
			},
			_initInfoElement : function() {

				var modelDataForInfoElement = new wgp.MapElement({
					objectId : halook.arrowChart.InfoElementObjectID,
					objectName : null,
					height : 0,
					width : 0,
					pointX : 100,
					pointY : 100,
					text : "",
					fontSize : halook.arrowChart.infoElementFontSize
				});
				new halook.InfoTextAreaStateElementView({
					model : modelDataForInfoElement,
					paper : this.paper,
					state : "rerror"
				});
			},
			_setJobStartTimeToZeroTask : function() {
				var jobStartTime = (this.jobInfo.startTime).getTime();

				var dataArrayTmp = halook.taskDataForShow;
				var dataArrayLength = dataArrayTmp.length;

				for ( var index = 0; index < dataArrayLength; index++) {
					var date = dataArrayTmp[index];

					if (date.StartTime === 0 && date.FinishTime === 0) {
						dataArrayTmp[index].StartTime = jobStartTime;
						dataArrayTmp[index].FinishTime = jobStartTime;
					} else if (date.StartTime === 0) {
						dataArrayTmp[index].StartTime = date.FinishTime;
					} else if (date.FinishTime === 0) {
						dataArrayTmp[index].FinishTime = date.StartTime;
					}
				}

				halook.taskDataForShow = dataArrayTmp;
			},
			redraw : function(mode) {
				halook.arrowChart.paperHeight = halook.taskDataForShow.length
						* halook.arrowChart.cellHeight;
				this.paper.clear();
				this.paper.setSize(halook.arrowChart.paperWidth,
						halook.arrowChart.paperHeight);
				halook.arrow.DisplayMode = mode;
				// 基本となるテーブルの線を描く
				this._drawTableLines();
				// 矢印たちと×印の絵画の作成
				halook.arrowChart.paperHeight = halook.parentView.getFromServerDatas.length
						* halook.arrowChart.cellHeight;

				this._drawArrowAndError();
				// console.log("drawed arrow and errors lines");

				// textAreaの描画を行う。
				this._drawCellTitle();

				this._initInfoElement();

			}

		});