//paperの高さ
infinispan.arrowChart.paperHeight = infinispan.parentView.getFromServerDatas.length
		* infinispan.arrowChart.cellHeight;
// paperの幅
infinispan.arrowChart.paperWidth = 750;
// 矢印絵画領域の始まるオフセット分
infinispan.arrowChart.startLineX = 100;
// ひとつのセルの高さの設定
infinispan.arrowChart.cellHeight = 30;
// アローチャート部分の長さ
infinispan.arrowChart.arrowChartWidth = infinispan.arrowChart.paperWidth
		- infinispan.arrowChart.startLineX - 4;

// string offset
infinispan.arrowChart.stringHeightOffset = -10;

// IDと登場回数を記憶する辞書
infinispan.arrowChart.idCounter = {};

infinispan.arrowChart.defaultIndexInCell = 1;
infinispan.arrowChart.defaultTotalInCell = 1;
infinispan.arrowChart.TableLineColor = "#777777";
infinispan.arrowChart.CellLineColor = "#FFFFFF";
infinispan.arrowChart.cellTitleFontSize = 14;
infinispan.arrowChart.cellTitleFontSizeForNode = 14;

infinispan.arrowChart.CellTitleObjectIDs = 40000;
infinispan.arrowChart.CellTitleHeight = 90;
infinispan.arrowChart.CellTitlePointX = 5;
infinispan.arrowChart.CellLineObjectID = 10000;

// detail 表示用のelementを保存しておく箱
infinispan.arrowChart.detailInfoElement = null;

infinispan.arrowChart.InfoElementObjectID = 50000;
infinispan.arrowChart.infoElementFontSize = 15;

// //////////////////////////////////////アロー関数群////////////////////////////////////////////////////////////
infinispan.ArrowChartView = wgp.AbstractView
		.extend({
			initialize : function(argument) {
				var jobColor;
				this.jobInfo = argument.jobInfo;
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.attributes = {};
				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);
				infinispan.arrowChart.paperHeight = infinispan.parentView.getFromServerDatas.length
						* infinispan.arrowChart.cellHeight;

				this.paper.setSize(infinispan.arrowChart.paperWidth,
						infinispan.arrowChart.paperHeight);

				// /複数回登場するIDの記憶と番号登録
				var taskDataShowLength = infinispan.taskDataOriginal.length;
				var idstring;
				var idArray;
				var rowCounter;
				for ( var i = 0; i < taskDataShowLength; i++) {
					idstring = infinispan.taskDataOriginal[i].TaskAttemptID;
					idArray = idstring.split('_');
					rowCounter = 0;
					idArray[3] = idArray[3].replace(/0/g, '');
					if (idArray[3] !== 0) {
						if (infinispan.arrowChart.idCounter[idArray[2]] === undefined)
							infinispan.arrowChart.idCounter[idArray[2]] = idArray[3];
						else if (infinispan.arrowChart.idCounter[idArray[2]] < idArray[3])
							infinispan.arrowChart.idCounter[idArray[2]] = idArray[3];
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

				var taskShowLength = infinispan.taskDataForShow.length;
				for ( var i = 0; i < taskShowLength; i++) {
					var data = infinispan.taskDataForShow[i];
					var modelInfo;
					var indexInCell = 1;
					var totalInCell = 1;
					var modelInfoArray = [];
					var stateString;

					if (infinispan.arrow.DisplayMode == "task") {
						
						modelInfo = this._calcArrowLengthAndStartPos(
								data.StartTime, data.FinishTime, indexInCell,
								totalInCell, rowCounter);
					} else if (infinispan.arrow.DisplayMode == "node") {
						modelInfo = this._calcArrowLengthAndStartPos(
								data.StartTime, data.FinishTime,
								infinispan.arrowChart.defaultIndexInCell,
								infinispan.arrowChart.defaultTotalInCell,
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
					if (data.Status == infinispan.constants.JOB_STATE.KILLED_UNCLEAN) {
						data.Status = infinispan.constants.JOB_STATE.KILLED;
					}
					
					// ///statusがエラーの場合の処理はこれも行う
					if (data.Status == infinispan.constants.JOB_STATE.FAIL
							|| data.Status == infinispan.constants.JOB_STATE.FAILED_UNCLEAN
							|| data.Status == infinispan.constants.JOB_STATE.KILLED) {
						var errorInfo;
						if (infinispan.arrow.DisplayMode == "task") {
							errorInfo = this._calcErrorLengthAndStartPos(
									data.FinishTime, indexInCell, totalInCell,
									rowCounter);
						} else if (infinispan.arrow.DisplayMode == "node") {
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
						stateString = infinispan.constants.STATE[data.Status];
						
						var errorStateString = stateString;

						if (data.Status == infinispan.constants.JOB_STATE.FAIL) {
							new infinispan.ErrorStateElementView({
								model : modelDataForError,
								paper : this.paper,
								state : errorStateString,
								info : data
							});
						}

					} else if (data.Status == "RUNNING") {
						stateString = "run";
					} else if (data.Status == "UNASSIGNED") {
						stateString = "unassigned";
					} else {
						stateString = "normal";
					}
					new infinispan.ArrowStateElementView({
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
				x = infinispan.arrowChart.startLineX
						+ infinispan.arrowChart.arrowChartWidth
						* (eventTime - infinispan.parentView.minGraphTime) * 1.0
						/ infinispan.parentView.intervalTime;
				// スタートy位置
				y = infinispan.arrowChart.cellHeight * trialTime * 1.0
						/ (1 + allTrialTime) + rowNum
						* infinispan.arrowChart.cellHeight;

				return {
					posX : x,
					posY : y
				};
			},
			_calcArrowLengthAndStartPos : function(startTime, finishTime,
					trialTime, allTrialTime, rowNum) {
				var x = 0, y = 0, width = 0;
				// 幅
				width = infinispan.arrowChart.arrowChartWidth
						* (finishTime - startTime) * 1.0
						/ infinispan.parentView.intervalTime;
				// スタートx位置
				x = infinispan.arrowChart.startLineX
						+ infinispan.arrowChart.arrowChartWidth
						* (startTime - infinispan.parentView.minGraphTime) * 1.0
						/ infinispan.parentView.intervalTime;
				// スタートy位置
				y = infinispan.arrowChart.cellHeight * trialTime
						/ (1 + allTrialTime) + rowNum
						* infinispan.arrowChart.cellHeight;
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
				
				var taskDataForAhowLength = infinispan.taskDataForShow.length;
				if (infinispan.arrow.DisplayMode == "task") {
					
					for ( var index = 0; index < taskDataForAhowLength; index++) {
						data = infinispan.taskDataForShow[index];

						modelDataForCellTitle = new wgp.MapElement(
								{
									objectId : infinispan.arrowChart.CellTitleObjectIDs
											+ index,
									objectName : null,
									height : 0,
									width : infinispan.arrowChart.CellTitleHeight,
									pointX : infinispan.arrowChart.CellTitlePointX,
									pointY : infinispan.arrowChart.cellHeight * 1.0
											/ 2 + textRowCounter
											* infinispan.arrowChart.cellHeight,
									text : data.SimpleID,
									fontSize : infinispan.arrowChart.cellTitleFontSize
								});
						new infinispan.TextAreaStateElementView({
							model : modelDataForCellTitle,
							paper : this.paper,
							state : "merror"
						});
						textRowCounter++;
					}
				} else if (infinispan.arrow.DisplayMode == "node") {
					for ( var index2 = 0; index2 < taskDataForAhowLength; index2++) {
						labelString = infinispan.taskDataForShow[index2].Hostname;
						tmpLabelArray = labelString.split('/');
						labelString = tmpLabelArray.join('\n');
						// console.log(labelString);
						modelDataForCellTitle = new wgp.MapElement(
								{
									objectId : infinispan.arrowChart.CellTitleObjectIDs
											+ index2,
									objectName : null,
									height : 0,
									width : infinispan.arrowChart.CellTitleHeight,
									pointX : infinispan.arrowChart.CellTitlePointX,
									pointY : infinispan.arrowChart.cellHeight * 1.0
											/ 2 + index2
											* infinispan.arrowChart.cellHeight,// +
									text : labelString,
									fontSize : infinispan.arrowChart.cellTitleFontSizeForNode
								});
						new infinispan.TextAreaStateElementView({
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
					height : infinispan.arrowChart.paperHeight,
					width : 0,
					pointX : infinispan.arrowChart.startLineX,
					pointY : 0,
					color : infinispan.arrowChart.TableLineColor
				});
				new infinispan.LineStateElementView({
					model : modelDataForTableLines,
					paper : this.paper,
					state : "rerror"
				});

				this._drawCellLine();

			},
			_drawCellLine : function() {
				// /セルの線引きの作成
				var cellCounter = Math.floor(infinispan.arrowChart.paperHeight
						/ infinispan.arrowChart.cellHeight);
				var modelDataForCellLine;
				for ( var k = 0; k < cellCounter + 1; k++) {

					modelDataForCellLine = new wgp.MapElement({
						objectId : k + infinispan.arrowChart.CellLineObjectID,
						objectName : null,
						height : 0,
						width : infinispan.arrowChart.paperWidth,
						pointX : 0,
						pointY : k * infinispan.arrowChart.cellHeight,
						color : infinispan.arrowChart.CellLineColor,
						strokeWidth : 2
					});
					new infinispan.LineStateElementView({
						model : modelDataForCellLine,
						paper : this.paper,
						state : "rerror"
					});
				}
				
				var x = infinispan.arrowChart.startLineX + infinispan.arrowChart.arrowChartWidth
					* (infinispan.parentView.maxGraphTime - infinispan.parentView.minGraphTime) * 1.0
					/ infinispan.parentView.intervalTime;
				
				
				
				var jobFinishTimeLine = new wgp.MapElement({
					objectId : k + infinispan.arrowChart.CellLineObjectID,
					objectName : null,
					height : infinispan.arrowChart.paperHeight,
					width : 0,
					pointX : x,
					pointY : 0,
					color : "#777777",
					strokeWidth : 4,
					title : "JobFinishTime"
				});
				var elem = new infinispan.LineStateElementView({
					model : jobFinishTimeLine,
					paper : this.paper,
					state : "rerror"
				});
			},
			_initInfoElement : function() {

				var modelDataForInfoElement = new wgp.MapElement({
					objectId : infinispan.arrowChart.InfoElementObjectID,
					objectName : null,
					height : 0,
					width : 0,
					pointX : 100,
					pointY : 100,
					text : "",
					fontSize : infinispan.arrowChart.infoElementFontSize
				});
				new infinispan.InfoTextAreaStateElementView({
					model : modelDataForInfoElement,
					paper : this.paper,
					state : "rerror"
				});
			},
			_setJobStartTimeToZeroTask : function() {
				var jobStartTime = (this.jobInfo.startTime).getTime();
				
				var dataArrayTmp = infinispan.taskDataForShow;
				var dataArrayLength = dataArrayTmp.length;
				
				for (var index = 0; index < dataArrayLength; index++) {
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
				
				infinispan.taskDataForShow = dataArrayTmp;
			},
			redraw : function(mode) {
				infinispan.arrowChart.paperHeight = infinispan.taskDataForShow.length
						* infinispan.arrowChart.cellHeight;
				this.paper.clear();
				this.paper.setSize(infinispan.arrowChart.paperWidth,
						infinispan.arrowChart.paperHeight);
				infinispan.arrow.DisplayMode = mode;
				// 基本となるテーブルの線を描く
				this._drawTableLines();
				// 矢印たちと×印の絵画の作成
				infinispan.arrowChart.paperHeight = infinispan.parentView.getFromServerDatas.length
						* infinispan.arrowChart.cellHeight;

				this._drawArrowAndError();
				// console.log("drawed arrow and errors lines");

				// textAreaの描画を行う。
				this._drawCellTitle();

				this._initInfoElement();

			}

		});