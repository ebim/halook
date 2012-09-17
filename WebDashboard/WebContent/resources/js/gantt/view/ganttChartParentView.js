var ganttChartParentView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSettings) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.collection = new GanttChartModelCollection();
				this.attributes = {};

				var appView = new wgp.AppView();
				appView.addView(this, (treeSettings.id + "%"));
				// ///一時的に固定値
				var dateS = new Date(2012, 8, 14);
				var dateE = new Date(2012, 8, 15);
				appView.getTermData([ (treeSettings.id + "%") ], dateS, dateE);

				this.tarmData = {};
				this.tarmData.startDate = dateS;
				this.tarmData.endDate = dateE;

				console.log("startTime : " + this.tarmData.startDate
						+ "    endTime : " + this.tarmData.endDate);

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
				// 作成したデータをもとにガントチャートを作成
				this._createGanttChartView();
			},
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
			_createGanttChartView : function() {
				/* ganttChart */
				$("#" + this.$el.attr("id")).append(
						'<div id="viewTitle"></div>');
				$("#viewTitle").css({
					width : "800px",
					height : "50px",
				});
				$('#viewTitle').append('<h1>GanttChart</h1>');
				$('#viewTitle')
						.append(
								'<img src="/WebDashboard/resources/images/halook_120x30.png">');
				$('#viewTitle')
						.css(
								{
									overflow : 'auto',
									margin : '5px 0px 0px 5px',
									border : '1px #dcdcdc solid',
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
								});
				$('#viewTitle' + ' h1').css({
					fontSize : '25px',
					width : '500px',
					margin : '10px 0px 10px 20px',
					float : 'left'
				});
				$('#viewTitle' + ' img').css({
					width : '120px',
					height : '30px',
					margin : '10px 10px 10px 10px',
					float : 'right'
				});

				$("#" + this.$el.attr("id")).append(
						'<div id="ganttChart"></div>');
				$("#ganttChart").css({
					height : "400px",
					overflow : "auto",
					"margin-top" : "10px",
					backgroundColor : "#F0FFFF"
				});

				var ganttChart = new ganttChartView({
					id : "ganttChart",
					rootView : this,
					dataArray : this.dataArray,
					
				});

				/* ganttChartDetail */
				$("#" + this.$el.attr("id")).append(
						'<div id="ganttChartDetail"></div>');
				$("#ganttChartDetail").css({
					"margin-top" : "10px",
					overflow : "auto",
					backgroundColor : "#FFFFFF"
				});
				$("#ganttChartDetail").html("■JOB DETAIL");

				var ganttChartDetail = new ganttChartDetailView({
					id : "ganttChartDetail",
					rootView : this
				});

			}

		});