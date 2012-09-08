//paperの高さ
halook.arrowChart.paperHeight = getFromServerDatas.length * halook.arrowChart.cellHeight;
// paperの幅
halook.arrowChart.paperWidth = 725;
// 矢印絵画領域の始まるオフセット分
halook.arrowChart.startLineX = 100;
// ひとつのセルの高さの設定
halook.arrowChart.cellHeight = 40;
// アローチャート部分の長さ
halook.arrowChart.arrowChartWidth = halook.arrowChart.paperWidth
		- halook.arrowChart.startLineX;

// string offset
halook.arrowChart.stringHeightOffset = -10;

// IDと登場回数を記憶する辞書
halook.arrowChart.idCounter = {};

halook.arrowChart.defaultIndexInCell = 1;
halook.arrowChart.defaultTotalInCell = 1;
halook.arrowChart.TableLineColor = "#777777";
halook.arrowChart.CellLineColor = "black";
halook.arrowChart.cellTitleFontSize = 20;
halook.arrowChart.cellTitleFontSizeForNode = 15;

halook.arrowChart.CellTitleObjectIDs = 40000;
halook.arrowChart.CellTitleHeight = 90;
halook.arrowChart.CellTitlePointX = 5;
halook.arrowChart.CellLineObjectID = 10000;

// detail 表示用のelementを保存しておく箱
halook.arrowChart.detailInfoElement = null;

halook.arrowChart.InfoElementObjectID = 50000;
halook.arrowChart.infoElementFontSize = 15;

// //////////////////////////////////////アロー関数群////////////////////////////////////////////////////////////

// アローチャート座標をチャート全体座標系に直す。
function getChartPosition(x, y) {
	return {
		posX : x + halook.arrowChart.startLineX,
		posY : y
	};
}

// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var ArrowChartView = wgp.AbstractView
		.extend({
			initialize : function() {
				var jobColor;

				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.collection = new arrowModelCollection();
				this.attributes = {};
				this.registerCollectionEvent();

				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);
				halook.arrowChart.paperHeight = getFromServerDatas.length * halook.arrowChart.cellHeight;

				this.paper.setSize(halook.arrowChart.paperWidth,
						halook.arrowChart.paperHeight);


				// /複数会登場するIDの記憶と番号登録
				var taskDataShowLength = halook.taskDataForShow.length;
				var idstring;
				var idArray;
				var rowCounter;
				for ( var i = 0; i < taskDataShowLength; i++) {
					idstring = halook.taskDataForShow[i].TaskAttemptID;
					idArray = idstring.split('_');
					rowCounter = 0;
					idArray[5] = idArray[5].replace(/0/g, '');
					if (idArray[5] != 0) {
						if (halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] == undefined)
							halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] = idArray[5];
						else if (halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] < idArray[5])
							halook.arrowChart.idCounter[(idArray[3] + "_" + idArray[4])] = idArray[5];
					}
				}

				// JobInfoの表示内容の確認
				this._decideJobInfo();

				// 基本となるテーブルの線を描く
				this._drawTableLines();

				// 矢印たちと×印の絵画の作成
				this._drawArrowAndError();

				// textAreaの描画を行う。
				this._drawCellTitle();

				//taskInfo表示用
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

					if (DisplayMode == "task") {
						if (halook.parentView.taskAttemptInfoDictionary[data.Mapreduce
								+ "_" + data.SimpleID].maxTime > 1)
							totalInCell = 2;
						if (0 == data.attemptTime % 2) {
							indexInCell = 2;
						} else {
							indexInCell = 1;
						}
						modelInfo = this._calcArrowLengthAndStartPos(
								data.StartTime, data.FinishTime, indexInCell,
								totalInCell, rowCounter);
						// console.log("index info : " + totalInCell + " "
						// + indexInCell + " " + data.Mapreduce
						// + data.SimpleID + " counter " + rowCounter
						// + " " + data.attemptTime + " status "
						// + data.Status);
					} else if (DisplayMode == "node") {
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

					// ///statusがエラーの場合の処理はこれも行う
					// console.log(data.Mapreduce
					// + "_"
					// + data.SimpleID
					// + " attempt "
					// + data.attemptTime
					// + " "
					// +
					// halook.parentView.taskAttemptInfoDictionary[data.Mapreduce
					// + "_" + data.SimpleID]);
					if (data.Status == wgp.constants.JOB_STATE.FAIL || data.Status == wgp.constants.JOB_STATE.KILLED) {
						var errorInfo;
						if (DisplayMode == "task") {
							errorInfo = this._calcErrorLengthAndStartPos(
									data.FinishTime, indexInCell, totalInCell,
									rowCounter);
						} else if (DisplayMode == "node") {
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
						stateString = wgp.constants.STATE[data.Status];
						// if (data.Status == wgp.constants.JOB_STATE.FAIL)
						// stateString = "fail";
						// else if (data.Status == wgp.constants.JOB_STATE.KILLED)
						// stateString = wgp.constants.JOB_STATE.KILLED;
						var errorStateString = stateString;
						stateString = data.Mapreduce + stateString;

//						console.log("state string : " + stateString
//								+ " error state " + errorStateString + " "
//								+ data.SimpleID);
						if (data.Status == wgp.constants.JOB_STATE.FAIL) {
							new wgp.ErrorStateElementView({
								model : modelDataForError,
								paper : this.paper,
								state : errorStateString,
								info : data
							});
						}

					} else if (data.Status == "RUNNING") {
						// console.log("these are running");
						stateString = "run";
						stateString = data.Mapreduce + stateString;
					} else {
						stateString = "normal";
						stateString = data.Mapreduce + stateString;
					}
					// console.log("state " + stateString + " " + data.Mapreduce
					// + data.SimpleID + " " + (data.attemptTime - 1));
					new wgp.ArrowStateElementView({
						model : modelDataForArrow,
						paper : this.paper,
						state : stateString,
						info : data
					});

					rowCounter++;
					if (DisplayMode == "task"
							&& (i != halook.taskDataForShow.length - 1 && halook.taskDataForShow[i + 1].attemptTime != 1)) {
						rowCounter--;
					}
				}
			},
			_calcErrorLengthAndStartPos : function(eventTime, trialTime,
					allTrialTime, rowNum) {
				// /////////ここで長さとスタート位置の計算
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
				// console.log("x = " + x + " y = " + y + " width = " + width);
				return {
					posX : x,
					posY : y,
					length : width
				};
			},
			_drawCellTitle : function() {
				var labelString
				var textRowCounter = 0;
				var data;
				var modelDataForCellTitle;
				var tmpLabelArray;
				if (DisplayMode == "task") {
					for ( var i = 0; i < halook.taskDataForShow.length; i++) {
						data = halook.taskDataForShow[i];
						// samokeDatasがソートされていることを前提に、ひとつ前のものと名前が同じなら、パスする。
						if (textRowCounter != 0
								&& halook.taskDataForShow[i - 1].Mapreduce == data.Mapreduce
								&& halook.taskDataForShow[i - 1].SimpleID == data.SimpleID) {
							// rowCounter--;
							continue;
						} else {
							modelDataForCellTitle = new wgp.MapElement({
								objectId : halook.arrowChart.CellTitleObjectIDs
										+ i,
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
							new wgp.TextAreaStateElementView({
								model : modelDataForCellTitle,
								paper : this.paper,
								state : "merror"
							});
							textRowCounter++;
						}
					}
				} else if (DisplayMode == "node") {
					for ( var i = 0; i < halook.taskDataForShow.length; i++) {
						labelString = halook.taskDataForShow[i].Hostname;
						tmpLabelArray = labelString.split('/');
						labelString = tmpLabelArray.join('\n');
						// console.log(labelString);
						modelDataForCellTitle = new wgp.MapElement(
								{
									objectId : halook.arrowChart.CellTitleObjectIDs
											+ i,
									objectName : null,
									height : 0,
									width : halook.arrowChart.CellTitleHeight,
									pointX : halook.arrowChart.CellTitlePointX,
									pointY : halook.arrowChart.cellHeight * 1.0
											/ 2 + i
											* halook.arrowChart.cellHeight,// +
									text : labelString,
									fontSize : halook.arrowChart.cellTitleFontSizeForNode
								});
						new wgp.TextAreaStateElementView({
							model : modelDataForCellTitle,
							paper : this.paper,
							state : "merror"
						});
					}
				}
				;
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
				new wgp.LineStateElementView({
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
				// console.log(cellCounter + "aaa");
				for ( var k = 0; k < cellCounter + 1; k++) {
					// console.log(i *halook.arrowChart.cellHeight + " cell
					// height");

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
					new wgp.LineStateElementView({
						model : modelDataForCellLine,
						paper : this.paper,
						state : "rerror"
					});
				}
			},
			_decideJobInfo : function() {
				var jobColor;
				var sd = new Date();
				var fd = new Date();
				var subd = new Date();

				sd.setTime(halook.jobDataForShow.StartTime);
				fd.setTime(halook.jobDataForShow.FinishTime);
				subd.setTime(halook.jobDataForShow.SubmitTime);

				if (halook.jobDataForShow.Status == wgp.constants.JOB_STATE.SUCCESS) {
					jobColor = wgp.constants.STATE_COLOR[wgp.constants.STATE.SUCCESS];
				} else if (halook.jobDataForShow.Status == wgp.constants.JOB_STATE.FAIL) {
					jobColor = wgp.constants.STATE_COLOR[wgp.constants.STATE.FAIL];
				} else if (halook.jobDataForShow.Status == wgp.constants.JOB_STATE.KILLED) {
					jobColor = wgp.constants.STATE_COLOR[wgp.constants.STATE.KILLED];
				} else if (halook.jobDataForShow.Status == wgp.constants.JOB_STATE.RUNNING) {
					jobColor = wgp.constants.STATE_COLOR[wgp.constants.STATE.RUNNING];
				}

				$("#jobInfoSpaceHtml").append(
						"<p><font size='6' face='Comic Sans MS'><b>"
								+ halook.jobDataForShow.JobID
								+ " : </b></font>" + "<font size='6' color='"
								+ jobColor + "'><b>"
								+ halook.jobDataForShow.Status
								+ "</b></font></br> " + "<font size='4'>("
								+ halook.jobDataForShow.JobName
								+ ")</font></br>"
								+ " <font  face='Comic Sans MS'> "
								+ sd.toLocaleString() + "  -  "
								+ fd.toLocaleString() + "( SUBMIT_TIME:"
								+ subd.toLocaleString() + " )</font></br></p>");
				$("#jobInfoSpaceHtml p").css({
					marginLeft : 10,
					marginTop : 0
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
				new wgp.InfoTextAreaStateElementView({
					model : modelDataForInfoElement,
					paper : this.paper,
					state : "rerror"
				});

			},

			redraw : function(mode) {
				halook.arrowChart.paperHeight = getFromServerDatas.length * halook.arrowChart.cellHeight;
				this.paper.clear();
				this.paper.setSize(halook.arrowChart.paperWidth,halook.arrowChart.paperHeight);
				DisplayMode = mode;
				// 基本となるテーブルの線を描く
				this._drawTableLines();
				// 矢印たちと×印の絵画の作成
				halook.arrowChart.paperHeight = getFromServerDatas.length * halook.arrowChart.cellHeight;
							console.log(halook.arrowChart.paperWidth + " "+halook.arrowChart.paperHeight + " "+halook.arrowChart.paperHeight + " "+halook.arrowChart.cellHeight + " ");
				
				
				this._drawArrowAndError();
				console.log("drawed arrow and errors lines");

				// textAreaの描画を行う。
				this._drawCellTitle();
				
				this._initInfoElement();
				
			}

		});