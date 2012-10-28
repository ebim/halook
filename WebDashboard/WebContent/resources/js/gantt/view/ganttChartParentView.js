var ganttChartParentView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSettings) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.collection = new GanttChartModelCollection();
				this.attributes = {};
				this.treeSettings = treeSettings;

				// 一時的に固定値
//				 var dateS = new Date(2012, 9, 17);
//				 var dateE = new Date(2012, 9, 19);

				// END:現在の時刻、START:現在の時刻から1時間前 
				var dateE = new Date();
				var dateS = new Date(dateE.getTime() - 60 * 1000 * 60);

				var appView = new wgp.AppView();
				appView.addView(this, (treeSettings.id + "%"));
				appView.getTermData([ (treeSettings.id + "%") ], dateS, dateE);
				
				this.termData = {};
				this.termData.startDate = dateS;
				this.termData.endDate = dateE;

				this.maxId = 0;

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				/* ganttChart */
				$("#" + this.$el.attr("id"))
				.css(
						{
							background : "-moz-linear-gradient(-45deg, rgba(76,76,76,1) 0%, rgba(89,89,89,1) 12%, rgba(102,102,102,1) 25%, rgba(71,71,71,1) 39%, rgba(44,44,44,1) 50%, rgba(17,17,17,1) 60%, rgba(43,43,43,1) 76%, rgba(28,28,28,1) 91%, rgba(19,19,19,1) 100%)",
							overflow : "hidden",

						});

				$("#" + this.$el.attr("id")).append(
						'<div id="viewTitle" style="border:outset;border-color:#EEEEEE;border-width:7px;"></div>');
				$("#viewTitle").css({
					width : "850px",
					height : "70px",
				});
				$('#viewTitle').append('<h1>GanttChart</h1>'
										+ '<img src="/WebDashboard/resources/images/halook_120x30.png">');
				$('#viewTitle').css({
					overflow : 'auto',
					margin : '5px 0px 0px 0px',
					background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
				});
				$('#viewTitle' + ' h1').css({
					fontSize : '30px',
					width : '500px',
					margin : '10px 0px 10px 20px',
					float : 'left',
					"font-family" : 'Comic Sans MS'
				});
				$('#viewTitle' + ' img').css({
					width : '120px',
					height : '30px',
					margin : '10px 10px 10px 10px',
					float : 'right'
				});

				$("#" + this.$el.attr("id")).append(
						'<div id="ganttChartSliderArea" style="border:outset;border-color:#EEEEEE;border-width:4px;"></div>');
				$('#ganttChartSliderArea').css({
					// width : "auto",
					background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
					margin : "10px 0px 0px 0px"
				});
				this.dualSliderView = new halook.DualSliderView({
					id : "ganttChartSliderArea",
					rootView : this
				});
				$("#" + this.$el.attr("id")).append(
					'<div id="ganttChart" style="border:outset;border-color:#EEEEEE;border-width:4px;"></div>');
				$("#ganttChart").css({
					height : "420px",
					overflow : "auto",
					"margin-top" : "10px",
					backgroundColor : "#FFFFFF"
				});
				
				/* ganttChartDetail */
				$("#" + this.$el.attr("id")).append(
						'<div id="ganttChartDetail" style="border:outset;border-color:#EEEEEE;border-width:4px;"></div>');
				$("#ganttChartDetail").css({
					margin : "10px 0px 0px 0px",
					overflow : "auto",
					backgroundColor : "#FFFFFF"
				});
				$("#ganttChartDetail").html("■JOB DETAIL");
				// 作成したデータをもとにガントチャートを作成
				this._createGanttChartView();

			},
			render : function() {
				this.gantt.hoge(this.dataArray);
//				console.log('call render');
			},
			onAdd : function(element) {
				// console.log('call onAdd');
			},
			onChange : function(element) {
				console.log('called changeModel');
			},
			onRemove : function(element) {
				// console.log('called removeModel');
			},
			destoroy : function() {
				console.log("test dest");
			},

			getTermData : function() {
				var instance = this;
				this.dataArray = [];
				var max = 0;

				_.each(this.collection.models, function(model) {
					var valueString = model.get("measurementValue");
					var value = $.parseJSON(valueString);
					var length = value.length;

					for (i = 0; i < length; i++) {
						var processedData = instance._processingData(value, i);
						instance.dataArray.push(processedData);
					}
				});
				this.render();
			},
			
			// dataArrayの中身
			_processingData : function(value, index) {
				var processedData = {
					JobID : value[index]['JobID'],
					JobName : value[index]['JobName'],
					StartTime : value[index]['StartTime'],
					FinishTime : value[index]['FinishTime'],
					Status : value[index]['Status'],
				}
				return processedData;
			},
			
			// ganttChartView作成
			_createGanttChartView : function() {
				var ganttChart = new ganttChartView({
					id : "ganttChart",
					rootView : this,
					dataArray : this.dataArray,
					termData : this.termData

				});
				this.gantt = ganttChart;

				var ganttChartDetail = new ganttChartDetailView({
					id : "ganttChartDetail",
					rootView : this
				});

				// associate with the slider and graph
				var instance = this;
				this.dualSliderView.setScaleMovedEvent(function(
						fromMillisecond, toMillisecond) {
					instance.updateDisplaySpan(fromMillisecond,
							toMillisecond);
				});

			},
			
			// スライダ調整後の描画
			updateDisplaySpan : function(from, to) {
				this.termData.startDate = new Date().getTime() - from;
				this.termData.endDate = new Date().getTime() - to;
				var appView = new wgp.AppView();
				appView.getTermData([ (this.treeSettings.id + "%") ], new Date(this.termData.startDate), new Date(this.termData.endDate));
//				this.gantt.hoge(this.dataArray);
			}

		});