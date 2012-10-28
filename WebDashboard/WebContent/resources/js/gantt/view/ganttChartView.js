halook.gantt = {};
halook.gantt.WIDTH = 700;
halook.gantt.HEIGHT = 0;

var ganttChartView = wgp.AbstractView
		.extend({
			initialize : function(argument) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.attributes = {};
				this.termData = argument.termData;
				this.maxId = 0;
				this.dataArray = argument.dataArray;

				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);

				var width = 0;
				var status = null;
				var ganttPointX = 0;

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}
				// realTag.height(this.height);
				
			},
			render : function() {
				this.paper.remove();
				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);

				if(this.dataArray != null) {
					var startX = 130;
					var startY = 7 + 20 * this.dataArray.length;
//					console.log(this.dataArray[0].StartTime);
					
					// ganttChartの初期Y軸の設定
					var property = new wgp.MapElement({
						objectId : 1,
						objectName : "wgp.MapStateElementView",
						pointX : 130,
						pointY : 0,
						width : 0,
						height : startY + 20
					});
					new halook.ganttChartAxisStateElementView({
						model : property,
						paper : this.paper
					});

					// ganttChartの初期X軸の設定
					var property1 = new wgp.MapElement({
						objectId : 2,
						objectName : "wgp.MapElementView",
						pointX : 130,
						pointY : startY + 20,
						width : 700,
						height : 0,
					});
					new halook.ganttChartAxisStateElementView({
						model : property1,
						paper : this.paper
					});
					
					// ganttChartのY軸の間隔を設定
					var Label = new wgp.MapElement({
						objectId : 3,
						objectName : "wgp.ganttChartAxisNameView",
						pointX : 130,
						pointY : startY + 20,
						width : 700,
//						text : this.dataArray[0].StartTime
						text : this.termData.startDate,
						endText : this.termData.endDate,
					});
					new halook.ganttChartAxisNameView({
						model : Label,
						paper : this.paper
					});

					// ganttChart幅の分割数の決定
					var splitter = 6;
					var timeWidthSplitter = ((new Date(this.termData.endDate) / 1000) - (new Date(this.termData.startDate) / 1000)) / splitter;

					// ganttChartの1時間分の幅の設定
					var timeWidthInit = (700 / splitter) / timeWidthSplitter;

					for ( var i = 0; i < this.dataArray.length; i++) {
						if (i == 0) {
							width = timeWidthInit * ((new Date(this.dataArray[0].FinishTime) / 1000 - new Date(
									this.dataArray[0].StartTime) / 1000));
							status = this._getStatus(this.dataArray[0].Status);
							ganttPointX = startX;
							if(new Date(this.dataArray[0].StartTime) / 1000 < new Date(this.termData.startDate) / 1000)
								continue;
							ganttPointX += timeWidthInit * ((new Date(
											this.dataArray[0].StartTime) / 1000 - new Date(
											this.termData.startDate) / 1000));
							// dataArrayの1番目のjobの設定
							var ganttChartProperty = new wgp.MapElement({
								objectId : i + 1,
								objectName : "wgp.MapStateElementView",
								pointX : ganttPointX,
								pointY : startY,
								startX : startX,
								width : width,
								height : 0,
								state : status,
								label : this.dataArray[0].JobID,
								text : this.dataArray[0].JobName,
								// submitTime : this.dataArray[0].submitTime,
								startTime : this.dataArray[0].StartTime,
								finishTime : this.dataArray[0].FinishTime,
								stroke : 6
							});
							new halook.ganttchartStateElementView({
								model : ganttChartProperty,
								paper : this.paper
							});
						}
						else {
							width = timeWidthInit * ((new Date(this.dataArray[i].FinishTime) / 1000 - new Date(
									this.dataArray[i].StartTime) / 1000));
							status = this._getStatus(this.dataArray[i].Status);
							ganttPointX = startX;
//							if(new Date(this.dataArray[i].StartTime) / 1000 < new Date(this.termData.startDate) / 1000)
//								continue;
							ganttPointX += timeWidthInit * ((new Date(
										this.dataArray[i].StartTime) / 1000 - new Date(
										this.termData.startDate) / 1000));

							// dataArrayの2番目以降のjobの設定
							var ganttChartProperty = new wgp.MapElement({
									objectId : i + 1,
									objectName : "wgp.MapStateElementView",
									pointX : ganttPointX,
									pointY : startY - i * 20,
									startX : startX,
									width : width,
									height : 0,
									state : status,
									label : this.dataArray[i].JobID,
									text : this.dataArray[i].JobName,
									// submitTime : this.dataArray[i].StartTime,
									startTime : this.dataArray[i].StartTime,
									finishTime : this.dataArray[i].FinishTime,
									stroke : 6
							});
							new halook.ganttchartStateElementView({
								model : ganttChartProperty,
								paper : this.paper
							});
						}
					}
				}
				else
				{
					var startX = 130;
					var startY = 7;
//					console.log(this.dataArray[0].StartTime);
					
					// ganttChartの初期Y軸の設定
					var property = new wgp.MapElement({
						objectId : 1,
						objectName : "wgp.MapStateElementView",
						pointX : 130,
						pointY : 0,
						width : 0,
						height : startY + 100
					});
					new halook.ganttChartAxisStateElementView({
						model : property,
						paper : this.paper
					});

					// ganttChartの初期X軸の設定
					var property1 = new wgp.MapElement({
						objectId : 2,
						objectName : "wgp.MapElementView",
						pointX : 130,
						pointY : startY + 100,
						width : 700,
						height : 0,
					});
					new halook.ganttChartAxisStateElementView({
						model : property1,
						paper : this.paper
					});
				}
	
			},
			onAdd : function(element) {
			},
			onChange : function(element) {
				console.log('called changeModel');
			},
			onRemove : function(element) {
				console.log('called removeModel');
			},
			_getStatus : function(status) {
				if (status.match("SUCCESS")) {
					return wgp.constants.STATE.SUCCESS;
				} else if (status.match("ERROR")) {
					return wgp.constants.STATE.ERROR;
				} else if (status.match("KILLED")) {
					return wgp.constants.STATE.KILLED;
				} else if (status.match("RUNNING")) {
					return wgp.constants.STATE.RUNNING;
				} else {
					return wgp.constants.STATE.NORMAL;
				}
			},
			hoge : function(dataArray) {
				this.dataArray = dataArray;
				this.render();
			}
		});
