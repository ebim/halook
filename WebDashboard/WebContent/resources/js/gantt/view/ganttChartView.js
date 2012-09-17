halook.gantt = {};
halook.gantt.WIDTH = 700;
halook.gantt.HEIGHT = 0;

var ganttChartView = wgp.AbstractView
		.extend({
			initialize : function(argument) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.attributes = {};
				this.maxId = 0;
				this.dataArray = argument.dataArray;

				var startX = 130;
				var startY = 7 + 20 * this.dataArray.length;

				var width = 0;
				var status = null;

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}
				// realTag.height(this.height);

				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);
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
				var Label = new wgp.MapElement({
					objectId : 3,
					objectName : "wgp.ganttChartAxisNameView",
					pointX : 130,
					pointY : startY + 20,
					text : this.dataArray[0].StartTime,
				});
				new halook.ganttChartAxisNameView({
					model : Label,
					paper : this.paper
				});

				for ( var i = 0; i < this.dataArray.length; i++) {
					if (i == 0) {
						width = (new Date(this.dataArray[0].FinishTime) / 1000 - new Date(
								this.dataArray[0].StartTime) / 1000) / 60;
						status = this._getStatus(this.dataArray[0].Status);
						var ganttChartProperty = new wgp.MapElement({
							objectId : i + 1,
							objectName : "wgp.MapStateElementView",
							pointX : startX,
							pointY : startY,
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
					} else {
						width = (new Date(this.dataArray[i].FinishTime) / 1000 - new Date(
								this.dataArray[i].StartTime) / 1000) / 60;
						status = this._getStatus(this.dataArray[i].Status);
						var ganttChartProperty = new wgp.MapElement(
								{
									objectId : i + 1,
									objectName : "wgp.MapStateElementView",
									pointX : startX
											+ (new Date(
													this.dataArray[i].StartTime) / 1000 - new Date(
													this.dataArray[0].StartTime) / 1000)
											/ 60,
									pointY : startY - i * 20,
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
			},
			render : function() {
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
				if (status.match("SUCCEED")) {
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
			}
		});
