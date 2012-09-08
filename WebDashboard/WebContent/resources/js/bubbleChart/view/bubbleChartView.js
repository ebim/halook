var sampleDatasJob = {
	StartTime : 1346160591456,
	FinishTime : 1346160991946,
	SubmitTime : 1346160591446,
	JobID : "job_20120907140000_0001",
	JobName : "PiEstimator",
	Status : "KILLED",
};

var BubbleChartView = wgp.AbstractView
		.extend({
			initialize : function(arguments, treeSettings) {

				this.viewType = wgp.constants.VIEW_TYPE.VIEW;// ビュータイプ

				this.maxId = 0;// ???

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
				this.graph = new BubbleElementView({
					id : "Bubble",
					treeSettings : treeSettings,
					width : 700,
					height : 480,
					attributes : {
						xlabel : "StartTime [Date]",
						ylabel : "ProcessTime [Seconds]",
						labels : [ "StartTime", "MapSuccess", "MapFailed","MapKilled",
								"ReduceSuccess", "ReduceFailed", "ReduceKilled", "Null" ],
						strokeWidth : 0,
						drawPoints : true,
						pointSize : 3,
						highlightCircleSize : 7,
						/*colors : [ "#00FF7F", "#FF0000", "#008000", "#4B0082",
								"#FFFFFF" ]*/
						colors : ["#008000", "#FF0000", "#333333", "#0000FF", "#C400C4",
						          "#663300", "#FFFFFF"]
					}
				});

				console.log('called bubbleChartView');
			},
			render : function() {
				console.log('call render');
			},
			onAdd : function(element) {
				// ここにgetする処理を書く
				this.graph.onAdd(element);
				console.log('call onAdd');
			},
			onChange : function(element) {
				console.log('called changeModel');
			},
			onRemove : function(element) {
				console.log('called removeModel');

			},
			destory : function(){
				this.graph.destory();
			},
			// htmlタグの定義
			_callHtmlConstructor : function() {
				$("#" + this.$el.attr("id"))
						.css(
								{
									// background :
									// "-moz-linear-gradient(-45deg,
									// rgba(255,255,255,1) 0%,
									// rgba(241,241,241,1) 50%,
									// rgba(225,225,225,1) 51%,
									// rgba(246,246,246,1) 100%)"
									// background: "#000000"
									//background : "-moz-linear-gradient(45deg, rgba(248,255,232,1) 0%, rgba(227,245,171,1) 33%)"
								// background : "-moz-linear-gradient(top left,
								// #EBEBEB 0%, #E3FFE4 100%)"
								});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="jobInfoSpace" style="border:outset;border-color:#EEEEEE;border-width:7px;"><div id="jobInfoSpaceHtml"  width="450" height = "60"></div><div id = "jobInfoImage" width="250" height="50"><img  src ="/WebDashboard/resources/images/halook_120x30.png" alt="nopage" ></div></div>'
								+ '<div class="clearSpace"></div>');
				$("#jobInfoSpace")
						.css(
								{
									width : 855,
									height : 100,
									marginTop : 5,
									marginLeft : 5,
									float : "left",
									/* For Mozilla/Gecko (Firefox etc) */
									// background : " -moz-linear-gradient(top,
									// #1e5799 0%, #2989d8 50%, #207cca 51%,
									// #7db9e8 100%)",
									// background : "-moz-linear-gradient(45deg,
									// rgba(181,189,200,1) 0%,
									// rgba(130,140,149,1) 36%, rgba(40,52,59,1)
									// 100%)",
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
									/* For Internet Explorer 5.5 - 7 */
									filter : " progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF, endColorstr=#FFFFFFFF)",
								// /* For Internet Explorer 8 */
								// -ms-filter:
								// "progid:DXImageTransform.Microsoft.gradient(startColorstr=#FF0000FF,
								// endColorstr=#FFFFFFFF)",
								});
				var sd = new Date();
				var fd = new Date();
				var subd = new Date();
				sd.setTime(sampleDatasJob.StartTime);
				fd.setTime(sampleDatasJob.FinishTime);
				subd.setTime(sampleDatasJob.SubmitTime);

				var jobColor;
				if (sampleDatasJob.Status == "SUCCESS") {
					jobColor = "#00FF00";
				} else if (sampleDatasJob.Status == "KILLED") {
					jobColor = "#777777";
				} else if (sampleDatasJob.Status == "FAILED") {
					jobColor = "#FF0000";
				} else if (sampleDatasJob.Status == "RUNNING") {
					jobColor = "#0000FF";
				}

				$("#jobInfoSpaceHtml").html(
						"<p><font size='6' face='Comic Sans MS' ><b>" + sampleDatasJob.JobID
								+ " : </b></font>" + "<font size='6' color='"
								+ jobColor + "'><b>" + sampleDatasJob.Status
								+ "</b></font></br> " + "<font size='5'>("
								+ sampleDatasJob.JobName + ")</font></br>"
								+ "  " + " <font  face='Comic Sans MS'> "
								+ sd.toLocaleString() + "  -  "
								+ fd.toLocaleString() + "( SUBMIT_TIME:"
								+ subd.toLocaleString() + " )</font></br></p>");
				$("#jobInfoSpaceHtml").css({
					float:"left"
				});
				$("#jobInfoImage").css({
					float:"right"
				});
				
				$(".clearSpace").css({
					height : 15,
					clear : "both"
				});
				$("#jobInfoSpaceHtml p").css({
					marginLeft : 10,
					marginTop :0
				});

				$("#" + this.$el.attr("id"))
				.append(
						'<div id="leftTop"></div><div id="rightTop"><div id ="checkLeft" class = "checkTable"></div><div id ="checkCenter" class = "checkTable"></div><div id ="checkRight" class = "checkTable"></div></div><div id="marginSpace"></div>');
				$("#leftTop").css({
					float : "left",
					width : 350,
					height : 50
				/* , "background-color":"red" */});
				$("#leftTop")
						.append(
								'<input type="button" id="backButton" value="Back" onClick="self.history.back()">');
				$("#backButton").button();
				$("#leftTop").append(
				'<input type="button" id="finishButton" value='+sortCheck()+'>');
				$("#finishButton").button();
				
				$("#rightTop").css({
					float : "right",
					width : 400,
					height : 50
				/* , "background-color":"green" */});
				$("#marginSpace").css({
					clear : "both",
					width : 900,
					height : 5
				});
				$(".checkTable").css({
					float : "left"
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
					marginLeft : 100
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