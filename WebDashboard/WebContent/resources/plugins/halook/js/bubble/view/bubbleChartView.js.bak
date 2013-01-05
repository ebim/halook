halook.BubbleChartView = wgp.AbstractView
		.extend({
			initialize : function(arguments, treeSettings) {
				this.jobInfo = arguments.jobInfo;
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;// ビュータイプ
				this.treeSettings = treeSettings;
				this.maxId = 0;// ???
				this.viewId = arguments.viewId;
				this.viewList = [];
				// 何の処理か不明
				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				this._callHtmlConstructor();

				// グラフビューの表示
				this.graph = new halook.BubbleElementView({
					id : "Bubble",
					treeSettings : treeSettings,
					width : 750,
					height : 480,
					jobInfo : this.jobInfo,
					attributes : {
						xlabel : "StartTime [Date]",
						ylabel : "ProcessTime [Seconds]",
						labels : [ "StartTime", "MapSuccess", "MapFailed",
								"MapKilled", "ReduceSuccess", "ReduceFailed",
								"ReduceKilled", "Null" ],
						strokeWidth : 0,
						drawPoints : true,
						pointSize : 3,
						highlightCircleSize : 7,
						/*
						 * colors : [ "#00FF7F", "#FF0000", "#008000",
						 * "#4B0082", "#FFFFFF" ]
						 */
						colors : [ "#008000", "#FF0000", "#333333", "#0000FF",
								"#C400C4", "#663300", "#FFFFFF" ]
					}
				});

			},
			render : function() {
				console.log('call render');
			},
			onAdd : function(element) {
				// ここにgetする処理を書く
				this.graph.onAdd(element);
			},
			onChange : function(element) {

			},
			onRemove : function() {
			},
			getRegisterId : function() {
				return this.viewId;
			},

			destroy : function() {
				var appTmpView = new wgp.AppView();
				appTmpView.removeView(this.graph);
			},
			// htmlタグの定義
			_callHtmlConstructor : function() {

				var context = $("#context").val();
				
				$("#" + this.$el.attr("id"))
						.append(
								'<div id="jobInfoSpace" style="border:outset;border-color:#EEEEEE;border-width:7px;"><div id="jobInfoSpaceHtml"  width="450" height = "60"></div><div id = "jobInfoImage" width="250" height="50"><img  src ="' + context + '/resources/images/halook_120x30.png" alt="nopage" ></div></div>'
										+ '<div class="clearSpace"></div>');
				$("#jobInfoSpace")
						.css(
								{
									width : 800,
									height : 100,
									marginTop : 5,
									marginLeft : 5,
									float : "left",
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
									filter : " progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF, endColorstr=#FFFFFFFF)",
								});
				var sd = this.jobInfo.startTime;
				var fd = this.jobInfo.finishTime;
				var subd = new Date();
				// TODO submitTime
				subd.setTime("");

				var jobColor;
				if (this.jobInfo.jobStatus == "success") {
					jobColor = "#00FF00";
				} else if (this.jobInfo.jobStatus == "killed") {
					jobColor = "#777777";
				} else if (this.jobInfo.jobStatus == "failed") {
					jobColor = "#FF0000";
				} else if (this.jobInfo.jobStatus == "running") {
					jobColor = "#0000FF";
				}
				// submitTime 補完用
				// $("#jobInfoSpaceHtml").html(
				// "<p><font size='6' face='Comic Sans MS' ><b>"
				// + this.jobInfo.jobId + " : </b></font>"
				// + "<font size='6' color='" + jobColor + "'><b>"
				// + this.jobInfo.jobStatus + "</b></font></br> "
				// + "<font size='5'>(" + this.jobInfo.jobName
				// + ")</font></br>" + " "
				// + " <font face='Comic Sans MS'> "
				// + sd.toLocaleString() + " - "
				// + fd.toLocaleString() + "( SUBMIT_TIME:"
				// + subd.toLocaleString() + " )</font></br></p>");
				$("#jobInfoSpaceHtml").html(
						"<p><font size='6' face='Comic Sans MS' ><b>"
								+ this.jobInfo.jobId + " : </b></font>"
								+ "<font size='6' color='" + jobColor + "'><b>"
								+ this.jobInfo.jobStatus + "</b></font></br> "
								+ "<font size='5'>(" + this.jobInfo.jobName
								+ ")</font></br>" + "  "
								+ " <font  face='Comic Sans MS'> "
								+ sd.toLocaleString() + "  -  "
								+ fd.toLocaleString() + " </font></br></p>");
				$("#jobInfoSpaceHtml").css({
					float : "left"
				});
				$("#jobInfoImage").css({
					float : "right"
				});

				$(".clearSpace").css({
					height : 15,
					clear : "both"
				});
				$("#jobInfoSpaceHtml p").css({
					marginLeft : 10,
					marginTop : 0
				});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="leftTop"></div><div id="rightTop"><div id ="checkLeft" class = "checkTable"></div><div id ="checkCenter" class = "checkTable"></div><div id ="checkRight" class = "checkTable"></div></div><div id="marginSpace"></div>');
				$("#leftTop").css({
					float : "left",
					width : 350,
					height : 50
				});
				$("#leftTop")
						.append(
								'<input type="button" class = "sortButton" id="backButton" value="Back">');
				$("#leftTop").append(
						'<input type="button" class = "sortButton" id="startButton" value="StartTime">');
				$("#leftTop").append(
						'<input type="button" class = "sortButton" id="finishButton" value="FinishTime">');
//				$("#backButton").button();
//				$("#finishButton").button();
				$(".sortButton").css({
					float : "left"
				});

				$("#rightTop").css({
					float : "right",
				});
				$("#marginSpace").css({
					clear : "both",
					width : 900,
					height : 5
				});
				$(".checkTable").css({
					float : "left"
				});
				
				$("#backButton").click(function() {
					var elem = document.getElementById("/mapreduce/job");
					$(elem).mousedown();
				});
				
				$("#checkLeft").append(
						'<input type="checkbox" value="MapSuccess" id="0" '
								+ flagCheck(MAP_SUCCESS) + '>MapSuccess'
								+ '<br>');
				$("#checkCenter")
						.append(
								'<input type="checkbox" value="MapFailed" id="1" '
										+ flagCheck(MAP_FAILED) + '>MapFailed'
										+ '<br>');
				$("#checkRight")
						.append(
								'<input type="checkbox" value="MapKilled" id="2" '
										+ flagCheck(MAP_KILLED) + '>MapKilled'
										+ '<br>');
				$("#checkLeft").append(
						'<input type="checkbox" value="ReduceSuccess" id="3" '
								+ flagCheck(REDUCE_SUCCESS) + '>ReduceSuccess');
				$("#checkCenter").append(
						'<input type="checkbox" value="ReduceFailed" id="4" '
								+ flagCheck(REDUCE_FAILED) + '>ReduceFailed');
				$("#checkRight").append(
						'<input type="checkbox" value="ReduceKilled" id="5" '
								+ flagCheck(REDUCE_KILLED) + '>ReduceKilled');
				$("#" + this.$el.attr("id")).append('<div id="Bubble"></div>');
				$("#Bubble").css({
					marginTop : 20,
					marginLeft : 70
				});
				$("#leftTop").css({
					marginTop : 10,
					marginLeft : 10
				});
				$("#rightTop").css({
					marginTop : 10,
					marginLeft : 10
				});
				$("#selector").css({
					marginTop : 10,
					marginLeft : 10
				});

			}
		});