/*******************************************************************************
 * ENdoSnipe 5.0 - (https://github.com/endosnipe)
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2012 Acroquest Technology Co.,Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
infinispan.ganttChartView = wgp.AbstractView
		.extend({
			initialize : function(argument) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.attributes = {};
				this.termData = argument.termData;
				this.maxId = 0;
				this.dataArray = argument.dataArray;
				this.treeSettings = argument.rootView.treeSettings;

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
						.attr("id")), this.width, 30 + 20 * this.dataArray.length);

				var startX = 0;
				var startY = 0;
				var property;
				var width = 0;
				var status = "";
				var ganttPointX = 0;
				var ganttChartProperty;
				var property1;
				
				if(this.dataArray != null) {
					startX = 130;
					startY = 7 + 20 * this.dataArray.length;
					
					// ganttChartの初期Y軸の設定
					property = new wgp.MapElement({
						objectId : 1,
						objectName : "wgp.MapStateElementView",
						pointX : 130,
						pointY : 0,
						width : 0,
						height : startY + 20
					});
					new infinispan.ganttChartAxisStateElementView({
						model : property,
						paper : this.paper
					});

					// ganttChartの初期X軸の設定
					property1 = new wgp.MapElement({
						objectId : 2,
						objectName : "wgp.MapElementView",
						pointX : 130,
						pointY : startY + 20,
						width : 700,
						height : 0
					});
					new infinispan.ganttChartAxisStateElementView({
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
						endText : this.termData.endDate
					});
					new infinispan.ganttChartAxisNameView({
						model : Label,
						paper : this.paper
					});

					// ganttChart幅の分割数の決定
					var splitter = 6;
					var timeWidthSplitter = ((new Date(this.termData.endDate) / 1000) - (new Date(this.termData.startDate) / 1000)) / splitter;

					// ganttChartの1時間分の幅の設定
					var timeWidthInit = (700 / splitter) / timeWidthSplitter;

					for ( var i = 0; i < this.dataArray.length; i++) {
						if (i === 0) {
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
							ganttChartProperty = new wgp.MapElement({
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
								submitTime : this.dataArray[0].SubmitTime,
								startTime : this.dataArray[0].StartTime,
								finishTime : this.dataArray[0].FinishTime,
								stroke : 6
							});
							this.childView = new infinispan.ganttchartStateElementView({
								model : ganttChartProperty,
								treeSettings : this.treeSettings,
								paper : this.paper
							});
						} else {
							var targetData = this.dataArray[i];
							width = timeWidthInit * ((new Date(targetData.FinishTime) / 1000 - new Date(
									targetData.StartTime) / 1000));
							status = this._getStatus(targetData.Status);
							ganttPointX = startX;
							ganttPointX += timeWidthInit * ((new Date(
									targetData.StartTime) / 1000 - new Date(
										this.termData.startDate) / 1000));

							// dataArrayの2番目以降のjobの設定
							ganttChartProperty = new wgp.MapElement({
									objectId : i + 1,
									objectName : "wgp.MapStateElementView",
									pointX : ganttPointX,
									pointY : startY - i * 20,
									startX : startX,
									width : width,
									height : 0,
									state : status,
									label : targetData.JobID,
									text : targetData.JobName,
									submitTime : targetData.SubmitTime,
									startTime : targetData.StartTime,
									finishTime : targetData.FinishTime,
									stroke : 6
							});
							this.childView = new infinispan.ganttchartStateElementView({
								model : ganttChartProperty,
								treeSettings : this.treeSettings,
								paper : this.paper
							});
						}
					}
				} else {
					startX = 130;
					startY = 7;
					
					// ganttChartの初期Y軸の設定
					property = new wgp.MapElement({
						objectId : 1,
						objectName : "wgp.MapStateElementView",
						pointX : 130,
						pointY : 0,
						width : 0,
						height : startY + 100
					});
					new infinispan.ganttChartAxisStateElementView({
						model : property,
						paper : this.paper
					});

					// ganttChartの初期X軸の設定
					property1 = new wgp.MapElement({
						objectId : 2,
						objectName : "wgp.MapElementView",
						pointX : 130,
						pointY : startY + 100,
						width : 700,
						height : 0
					});
					new infinispan.ganttChartAxisStateElementView({
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
				if (status.match("SUCCEEDED")) {
					return infinispan.constants.STATE.SUCCESS;
				} else if (status.match("ERROR")) {
					return infinispan.constants.STATE.ERROR;
				} else if (status.match("KILLED")) {
					return infinispan.constants.STATE.KILLED;
				} else if (status.match("FAILED")) {
					return infinispan.constants.STATE.FAILED;
				} else if (status.match("RUNNING")) {
					return infinispan.constants.STATE.RUNNING;
				} else {
					return infinispan.constants.STATE.NORMAL;
				}
			},
			setDataArray : function(dataArray) {
				this.dataArray = dataArray;
				this.render();
			},
			destroy : function() {
				if (this.childView) {
					this.childView.destroy();
				}
			}
		});
