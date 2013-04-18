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
infinispan.ganttChartParentView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSettings) {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.attributes = {};
				this.treeSettings = treeSettings;
				this.PAGER_COUNT = 15;

				// 一時的に固定値
				// var dateS = new Date(2012, 9, 17);
				// var dateE = new Date(2012, 9, 19);

				// END:現在の時刻、START:現在の時刻から1時間前
				var dateE = new Date();
				var dateS = new Date(dateE.getTime() - 60 * 1000 * 60);

				var appView = new ENS.AppView();
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
									overflow : "hidden"
								});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="viewTitle" class="contentHeader"></div>');
				$("#viewTitle").css({
					width : "850px",
					height : "70px"
				});
				
				var context = $("#context").val();
				
				$('#viewTitle')
						.append('<h1>GanttChart</h1>');
				$('#viewTitle')
						.css(
								{
									margin : '5px 0px 0px 0px'
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

				// スライダを追加。
				$("#" + this.$el.attr("id"))
						.append(
								'<div id="ganttChartSliderArea" style="border:outset;border-color:#222222;;border-width:4px;"></div>');
				$('#ganttChartSliderArea')
						.css(
								{
									// width : "auto",
									background : "-moz-linear-gradient(-45deg, #555555 0%, #111111 100%) repeat scroll 0 0 transparent",
									margin : "10px 0px 0px 0px"
								});
				this.dualSliderView = new ENS.DualSliderView({
					id : "ganttChartSliderArea",
					rootView : this
				});

				// pagingを追加。
				$("#ganttChartSliderArea")
						.append(
								'<div id="ganttChartPagination" class="pagination" style="height:30px"></div>');

				// ganttchartを追加する。
				$("#" + this.$el.attr("id"))
						.append(
								'<div id="ganttChart" class="infinispanContents"></div>');
				$("#ganttChart").css({
					height : "360px",
					overflow : "auto",
					"margin-top" : "10px"
				});

				/* ganttChartDetail */
				$("#" + this.$el.attr("id"))
						.append(
								'<div id="ganttChartDetail" style="border:outset;border-color:#000000;border-width:4px;"></div>');
				$("#ganttChartDetail").css({
					margin : "10px 0px 0px 0px",
					overflow : "auto",
					backgroundColor : "-moz-linear-gradient(-45deg, #111111 0%, #000000 100%) repeat scroll 0 0 transparent"
				});
				$("#ganttChartDetail").html("■JOB DETAIL");

				// pagingを挿入。

				// 作成したデータをもとにガントチャートを作成
				this._createGanttChartView();

			},
			render : function() {
				this.gantt.setDataArray(this.dataArray);
				// console.log('call render');
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
			onComplete : function(type){
				if (type == wgp.constants.syncType.SEARCH) {
					this._getTermData();
				}
			},
			destroy : function() {
				var appView = ENS.AppView();
				appView.removeView(this.gantt);
				this.stopRegisterCollectionEvent();
				appView.stopSyncData([this.treeSettings.id + "%"]);
				if (this.collection) {
					this.collection.reset();
				}
			},
			_getTermData : function() {
				var instance = this;
				this.masterDataArray = [];
				var max = 0;

				var maxCount = this.PAGER_COUNT;
				var count = 0;
				var tmpArray = [];

				$
						.each(
								this.collection.models,
								function(key, model) {
									var valueString = model
											.get("measurementValue");
									if (valueString == "0") {
										return true;
									}
									var value = $.parseJSON(valueString);
									var length = value.length;
									if (value) {
										for ( var valueCount = 0, maxValueCount = length; valueCount < maxValueCount; valueCount++) {
											tmpArray.unshift(value[valueCount]);
										}
									}
								});
				this.masterDataArray = tmpArray;
				this._createPagination();
				// 初期表示時は1。
				this._chooseData(0);
				this.render();
			},
			_chooseData : function(pagerNum) {
				var startCount = pagerNum * this.PAGER_COUNT;
				var endCount = startCount + this.PAGER_COUNT - 1;
				var displayDataList = [];
				for ( var count = endCount; count >= startCount; count--) {
					if (!this.masterDataArray[count]) {
						continue;
					}
					var data = this.masterDataArray[count];
					displayDataList.push(data);
				}
				this.dataArray = displayDataList;
			},
			_createPagination : function() {
				var instance = this;
				$("#ganttChartPagination").pagination(
						this.masterDataArray.length, {
							items_per_page : this.PAGER_COUNT,
							num_display_entries : 10,
							num_edge_entries : 2,
							callback : function(pageIndex, jq) {
								instance._clickPager(pageIndex, jq);
							}
						});
			},
			_clickPager : function(pageIndex, jq) {
				this._chooseData(pageIndex);
				this.render();
			},
			// dataArrayの中身
			_processingData : function(value, index) {
				var processedData = {
					JobID : value[index]['JobID'],
					JobName : value[index]['JobName'],
					StartTime : value[index]['StartTime'],
					FinishTime : value[index]['FinishTime'],
					SubmitTime : value[index]['SubmitTime'],
					Status : value[index]['Status']
				};
				return processedData;
			},

			// ganttChartView作成
			_createGanttChartView : function() {
				var ganttChart = new infinispan.ganttChartView({
					id : "ganttChart",
					rootView : this,
					dataArray : this.dataArray,
					termData : this.termData

				});
				this.gantt = ganttChart;

				// associate with the slider and graph
				var instance = this;
				this.dualSliderView.setScaleMovedEvent(function(
						fromMillisecond, toMillisecond) {
					instance.updateDisplaySpan(fromMillisecond, toMillisecond);
				});

			},

			// スライダ調整後の描画
			updateDisplaySpan : function(from, to) {
				this.termData.startDate = new Date().getTime() - from;
				this.termData.endDate = new Date().getTime() - to;
				var appView = new ENS.AppView();
				appView.getTermData([ (this.treeSettings.id + "%") ], new Date(
						this.termData.startDate), new Date(
						this.termData.endDate));
			}

		});