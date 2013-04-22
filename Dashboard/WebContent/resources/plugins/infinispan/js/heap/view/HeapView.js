/*******************************************************************************
 * WGP 0.2 - Web Graphical Platform (https://sourceforge.net/projects/wgp/)
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
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/

infinispan.Heap.changeAngleFromUpdate = 0;
infinispan.Heap.changeAngleTotal = 0;
infinispan.Heap.unitAngle = 0;
infinispan.Heap.capacityList = {};
infinispan.Heap.usageList = {};
infinispan.Heap.rackList = {};
infinispan.Heap.angleList = {};
infinispan.Heap.center = {};
infinispan.Heap.capacity = {};
infinispan.Heap.beforeUsage = {};
infinispan.Heap.isCompleteDraw = false;

infinispan.HeapView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSetting) {
				// idをheapに変更する。
				this.heapPath = argument.heapPath;
				var clusterName = treeSetting.treeId.split("/")[1];
				infinispan.Heap.treeSettingId = "/" + clusterName + "/%" + this.heapPath;

				infinispan.Heap.self = this;

				this.heapDataList_ = {};
				this.heapState_ = {};
				this.agentsList_ = [];
				this.lastMeasurementTime_ = 0;
				this.oldestMeasurementTime_ = 0;
				this.capacityMax_ = 1;
				this.rackColorList = [];
				// vars
				// setting view type
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				// set bg color and height
				this._initView();

				this.isRealTime = true;

				$("#persArea_drop_0_1").append();

				var appView = ENS.AppView();
				appView.addView(this, infinispan.Heap.treeSettingId + '%');
				// set paper
				this.render();

				// set view size
				this.width = argument["width"];
				this.height = argument["height"];
				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				this.viewCollection = {};

				this.maxId = 0;
				this.nextId = -1;

				// add slider
				this._addSlider(this);

				// add div for data node status popup
				this._addStatusPopup();

				var end = new Date();
				var start = new Date(end.getTime() - 15000);
				appView.getTermData([ (infinispan.Heap.treeSettingId + '%') ],
						start, end);

			},
			_staticRender : function() {
				this.agentsList_.sort();

				var agentsListLength = this.agentsList_.length;

				var rotationVal = ~~(infinispan.Heap.changeAngleTotal / infinispan.Heap.unitAngle)
						% agentsListLength;

				// 右回りで数えていくつ分回転しているかを、正の値で表現する
				if (rotationVal < 0) {
					rotationVal = agentsListLength + rotationVal;
				}

				// すでに回転している分、リストの順番を並び替える
				var tmpList = [];
				for ( var index = 0; index < agentsListLength; index++) {
					var agentIndex = (rotationVal + index) % agentsListLength;

					tmpList[index] = this.agentsList_[agentIndex];
				}

				this.agentsList_ = tmpList;

				// draw capacity bars
				this._drawCapacity();
		
				// draw rack bars
				this._drawRack();
		
				// draw usage bars
				this._drawUsage();

				infinispan.Heap.changeAngleFromUpdate = 0;
			},
			_updateRender : function() {
				
				this.agentsList_.sort();
		
				var agentsListLength = this.agentsList_.length;
		
				var rotationVal = ~~(infinispan.Heap.changeAngleTotal / infinispan.Heap.unitAngle)
						% agentsListLength;
		
				// 右回りで数えていくつ分回転しているかを、正の値で表現する
				if (rotationVal < 0) {
					rotationVal = agentsListLength + rotationVal;
				}
		
				// すでに回転している分、リストの順番を並び替える
				var tmpList = [];
				for ( var index = 0; index < agentsListLength; index++) {
					var agentIndex = (rotationVal + index) % agentsListLength;
		
					tmpList[index] = this.agentsList_[agentIndex];
				}
		
				this.agentsList_ = tmpList;
		
				// redraw capacity bars
				this._drawCapacity();
		
				// redraw rack bars
				this._drawRack();
		
				// redraw usage bars
				this._drawUsage();
		
				infinispan.Heap.changeAngleFromUpdate = 0;
			},
			render : function() {
				var elem = document.getElementById(this.$el.attr("id"));
				// making area to set capacity table
				$(elem).append(
								"<div id='capacity_table' style='margin-left:10px;margin-top:260px; float:left'></div>");

				
				
				// making area to set raphael
				$(elem).append(
								"<div id='heap_data' style='width:625px;height:630px; float:right'></div>");
				
				$(elem).append(
				"<div class='clearFloat'></div>");
				
				// set paper
				this.paper = new Raphael('heap_data');
				
				// 固定の初期パーツを描画する
				this._drawInitializeParts();
			},
			onAdd : function(mapElement) {
			},
			onComplete : function(type) {
				if (type == wgp.constants.syncType.SEARCH) {
					this._getTermData();
				} else {
					this._updateDraw();
					this._animateBlockTransfer();
				}
			},
			onChange : function(mapElement) {
				this.viewCollection[mapElement.id].update(mapElement);
			},
			onRemove : function(mapElement) {
				var objectId = mapElement.get("objectId");
				this.viewCollection[objectId].remove(mapElement);
				delete this.viewCollection[objectId];
			},
			_getTermData : function() {
				this._drawHeap();
				if (this.isRealTime) {
					appView.syncData([ (infinispan.Heap.treeSettingId + "%") ]);
				}

			},
			_initView : function() {
				// enlarge area
				$("#contents_area_0").css("height", 630);
				// set bg olor
				$("#" + this.$el.attr("id")).css("background-color",
						infinispan.heap.constants.bgColor);
			},
			_setHeapDataList : function() {
				
				var measurementList = {};
				var removeTargetList = [];
				// 削除するmodelのリストを作成する。
				// 削除対処になるモデルは、measurementItemNameとmeasurementValueが同一のデータが
				// collection内で重複していて、かつ、計測時間が古いものとなる。
				_.each(this.collection.models, function(model, id) {
					var measurementItemName = model
							.get(infinispan.ID.MEASUREMENT_ITEM_NAME);
					var measurementTime = model
							.get(infinispan.ID.MEASUREMENT_TIME);
					
					var tmpModel = measurementList[measurementItemName];
					if (tmpModel) {
						var tmpMeasurementTime = tmpModel
								.get(infinispan.ID.MEASUREMENT_TIME);
						var tmpMeasurementTimeInt = parseInt(tmpMeasurementTime, 10);
						var measurementTimeInt = parseInt(measurementTime, 10);
						
						if (tmpMeasurementTimeInt <= measurementTimeInt) {
							removeTargetList.push(tmpModel);
							measurementList[measurementItemName] = model;
						} else {
							removeTargetList.push(model);
							measurementList[measurementItemName] = tmpModel;
						}
					} else {
						measurementList[measurementItemName] = model;
					}
				});
				this.collection.remove(removeTargetList, {
					silent : true
				});
				
				var instance = this;
				// delete data ignore old last update date.
				var tmpUpdateLastTime = 0;
				_.each(this.heapDataList_, function(data, time) {
					var tmpTime = parseInt(time, 10);
					if (tmpUpdateLastTime < tmpTime) {
						tmpUpdateLastTime = tmpTime;
					}
				});

				if (tmpUpdateLastTime !== 0) {
					this.oldestMeasurementTime_ = tmpUpdateLastTime;
					_.each(this.heapDataList_, function(data, time) {
						var tmpTime = parseInt(time, 10);
						if (tmpUpdateLastTime != tmpTime) {
							delete instance.heapDataList_[time];
						}
					});
				}

				// create lastupdate data.
				var lastupdateTime = 0;
				// search lastMeasurementTime
				_.each(this.collection.models, function(model, id) {
					var measurementTime = model
							.get(infinispan.ID.MEASUREMENT_TIME);
					var tmpTime = parseInt(measurementTime, 10);
					if (lastupdateTime < tmpTime) {
						lastupdateTime = tmpTime;
					}
				});
				// set Last Update Time.
				this.lastMeasurementTime_ = lastupdateTime;
				
				// create measurement data set.
				_
						.each(
								this.collection.models,
								function(model, id) {
									var measurementItemName = model
											.get(infinispan.ID.MEASUREMENT_ITEM_NAME);

									var pathList = measurementItemName
											.split("/");

									var agentName = pathList[3];
									var valueType = pathList[pathList.length - 1];

									var measurementValue = model
											.get(infinispan.ID.MEASUREMENT_VALUE);

									if (instance.heapDataList_[instance.lastMeasurementTime_]) {
										if (instance.heapDataList_[instance.lastMeasurementTime_][agentName]) {

										} else {
											instance.heapDataList_[instance.lastMeasurementTime_][agentName] = {};
										}
										instance.heapDataList_[instance.lastMeasurementTime_][agentName][valueType] = measurementValue;

									} else {
										instance.heapDataList_[instance.lastMeasurementTime_] = {};
										var entry = {};
										entry[valueType] = measurementValue;
										entry["max:bytes"] = measurementValue;
										instance.heapDataList_[instance.lastMeasurementTime_][agentName] = entry;
									}
								}, instance);
			},
			_animateBlockTransfer : function() {
				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var agent = this.agentsList_[i];
					
					if (infinispan.Heap.usageList[agent] !== undefined) {
					
						var h = this.heapState_[agent].heapusedLength;
						var centerX = infinispan.Heap.center.x;
						var centerY = infinispan.Heap.center.y;
						
						var centerObjectClone;
						// 前回の使用量ｋ
						var beforeUsage = infinispan.Heap.beforeUsage[agent];
						if (beforeUsage > h) {
							
							var usageClone = infinispan.Heap.usageList[agent].clone();
							
							centerObjectClone = this.paper
								.path(
									[
											[
													"M",
													centerX,
													centerY ] ])
							.attr(
									{
										stroke : infinispan.heap.constants.dataNode.frameColor,
										fill : " rgb(256, 256, 256)"
									});
							
							
							
							usageClone.stop().animate({path: "M" + centerX + " "
								+ centerY, fill: " rgb(256, 256, 256)"}, infinispan.Heap.BLOCK_TRANSFER_SPEED, "", function() {
									this.remove();
								});
						
						} else if (beforeUsage < h) {
							centerObjectClone = this.paper
								.path(
										[
												[
														"M",
														centerX,
														centerY ] ])
								.attr(
										{
											stroke : infinispan.heap.constants.dataNode.frameColor,
											fill : " rgb(256, 256, 256)"
										});

							
							var pathValue = infinispan.Heap.usageList[agent].attrs;				
							
							centerObjectClone.animate(pathValue, infinispan.Heap.BLOCK_TRANSFER_SPEED, "", function() {
								this.remove();
							});
						}
					}
					infinispan.Heap.beforeUsage[agent]　= h;
				}
			},
			_drawingUsageTemporary : function(index, capacity, agent, ref) {

				var radius = infinispan.heap.constants.mainCircle.radius;
				var width = this.dataNodeBarWidth;
				var angle = this.angleUnit * index
						+ infinispan.utility.toRadian(90);
				var cos = Math.cos(angle);
				var sin = Math.sin(angle);
				var center = infinispan.Heap.center;
				var heapStatus = this.heapState_[agent].status;

				var temp = ref.path(
						[
								[
										"M",
										(center.x + radius * cos + width / 2
												* sin),
										(center.y - radius * sin + width / 2
												* cos) ],
								[ "l", (capacity * cos), (-capacity * sin) ],
								[ "l", (-width * sin), (-width * cos) ],
								[ "l", (-capacity * cos), (capacity * sin) ] ])
						.attr({
							fill : this._getDataNodeColor(heapStatus)
						});

				return temp;
			},
			_setHeapState : function() {
				// set heapState as the last data in heapDataList
				if (this.heapDataList_[this.lastMeasurementTime_]) {
					this.heapState_ = this.heapDataList_[this.lastMeasurementTime_];
				} else {
					this.heapState_ = {};
				}

				// set agentsList
				this.agentsList_ = [];
				for ( var agent in this.heapState_) {
					if (agent != infinispan.heap.constants.agentnameAll) {
						this.agentsList_.push(agent);

						// set capacityMax
						if (this.heapState_[agent]["max:bytes"] > this.capacityMax_) {
							this.capacityMax_ = this.heapState_[agent]["max:bytes"];
						}
					}
				}

				// set the length to display
				for ( var agent2 in this.heapState_) {
					this.heapState_[agent2].capacityLength = infinispan.heap.constants.dataNode.maxLength
							* this.heapState_[agent2]["max:bytes"]
							/ this.capacityMax_;
					this.heapState_[agent2].heapusedLength = infinispan.heap.constants.dataNode.maxLength
							* this.heapState_[agent2]["used:bytes"]
							/ this.capacityMax_;
					if (this.heapState_[agent2]["used:bytes"] / this.capacityMax_ > infinispan.heap.constants.blockTransfer.colorThreshold) {
						this.heapState_[agent2].status = infinispan.heap.constants.dataNode.status.full;
					} else {
						this.heapState_[agent2].status = infinispan.heap.constants.dataNode.status.good;
					}
				}
			},
			_addSlider : function(self) {
				$("#" + this.$el.attr("id")).parent().prepend(
						'<div id="slider"></div>');
				$('#slider').css(ENS.nodeinfo.parent.css.dualSliderArea);
				$('#slider').css(ENS.nodeinfo.parent.css.dualSliderArea);
				this.singleSliderView = new ENS.SingleSliderView({
					id : "slider",
					rootView : this
				});

				this.singleSliderView.setScaleMovedEvent(function(pastTime) {
					self.updateDisplaySpan(pastTime);
				});
			},
			_addStatusPopup : function() {
				// hidden div for data node info popup
				$("#" + this.$el.attr("id"))
						.parent()
						.prepend(
								'<div id="nodeStatusBox" '
										+ 'style="padding:10px; color:white; position:absolute; '
										+ 'border:white 2px dotted; display:none">'
										+ '</div>');
			},
			_addClusterStatus : function() {
				// div for cluster status
				$("#" + this.$el.attr("id"))
						.parent()
						.prepend(
								'<div style="padding:10px; background-color:rgba(255,255,255,0.9);">'
										+ '<b>'
										+ 'Cluster Status : '
										+ '</b>'
										+ '<span id="clusterStatus">'
										+ 'total capacity : 1TB, name node : 100, data node : 100'
										+ '</span>' + '</div>');
			},
			_drawStaticDataNode : function(pastTime) {
				var end = new Date(new Date().getTime() - pastTime);
				var start = new Date(end.getTime() - 60 * 60 * 1000);
				appView.stopSyncData([ (infinispan.Heap.treeSettingId + '%') ]);
				appView.getTermData([ (infinispan.Heap.treeSettingId + '%') ],
						start, end);
			},
			_addBlockTransfer : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.transfer[i] = {};
					self.nextId = self._getUniqueId();
					self.transfer[i].objectId = self.transfer[i].id = self.nextId;
					self.transfer[i].size = 1;
					self.transfer[i].angle = self.angleUnit * i,
							self.blockTransferIdManager.add(self.nextId,
									this.agentsList_[i]);
				}
				_.each(self.transfer, function(obj) {
					obj.type = wgp.constants.CHANGE_TYPE.ADD;
					obj.objectName = "BlockTransferAnimation";
					obj.center = self.center;
					obj.width = 4;
				});
			},
			_updateBlockTransfer : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.transfer[i].objectId = self.transfer[i].id = self.blockTransferIdManager
							.find(this.agentsList_[i]);
					self.transfer[i].size = self.diff[i];
				}
				_.each(self.transfer, function(obj) {
					obj.type = self.blockTransferChangeType;
				});
			},
			_addDataNode : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.nextId = self._getUniqueId();
					self.currentDataNode[i] = {
						objectId : self.nextId,
						id : self.nextId,
						width : self.dataNodeBarWidth,
						height : this.heapState_[this.agentsList_[i]].heapusedLength,
						angle : self.angleUnit * i,
						agent : this.heapState_[this.agentsList_[i]],
						capacity : this.heapState_[this.agentsList_[i]].capacityLength,
						type : wgp.constants.CHANGE_TYPE.ADD,
						objectName : "DataNodeRectangle",
						center : self.center
					};
					self.dataNodeIdManager.add(self.nextId, this.agentsList_[i]);
				}
			},
			_updateDataNode : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {

					if (this.heapState_[this.agentsList_[i]] !== undefined) {
						self.diff[i] = this.heapState_[this.agentsList_[i]].heapusedLength
								- self.currentDataNode[i].height;
						self.currentDataNode[i] = {
							type : wgp.constants.CHANGE_TYPE.UPDATE,
							objectId : self.dataNodeIdManager
									.find(this.agentsList_[i]),
							id : self.dataNodeIdManager
									.find(this.agentsList_[i]),
							height : this.heapState_[this.agentsList_[i]].heapusedLength,
							diff : self.diff[i]
						};
					}
				}
			},
			_getUniqueId : function() {
				// return next id
				this.nextId++;
				return this.nextId;
			},
			_calculateCapacityData : function(data) {

				var data_size_kb = data / 1024;
				var data_size_mb = data / 1024 / 1024;
				var data_size_gb = data / 1024 / 1024 / 1024;

				var postfix_value = "";
				if (data_size_kb < 1024) {
					postfix_value = parseFloat(
							Math.round(data_size_kb * 100) / 100).toFixed(2)
							+ "KB";
				} else if (data_size_mb < 1024) {
					postfix_value = parseFloat(
							Math.round(data_size_mb * 100) / 100).toFixed(2)
							+ "MB";
				} else if (data_size_gb < 1024) {
					postfix_value = parseFloat(
							Math.round(data_size_gb * 100) / 100).toFixed(2)
							+ "GB";
				} else {
					postfix_value = parseFloat(
							Math.round((data_size_gb / 1024) * 100) / 100)
							.toFixed(2)
							+ "TB";
				}

				return postfix_value;
			},
			_showClusterSummary : function() {
				var conf_capacity = 0;
				var heap_used = 0;
				var heap_remaining = 0;

				for ( var serverName in this.heapState_) {
					// -0をすることで、数値化している
					heap_used += this.heapState_[serverName]["used:bytes"] - 0;
					heap_remaining += (this.heapState_[serverName]["max:bytes"] - this.heapState_[serverName]["used:bytes"]);
				}

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var agent = this.agentsList_[i];
					// -0をすることで、数値化している
					conf_capacity += this.heapState_[agent]["max:bytes"] - 0;
				}

				if (conf_capacity !== 0) {
					var heap_used_percent = ((heap_used * 100) / conf_capacity)
							.toFixed(2);
					var heap_remaining_percent = ((heap_remaining * 100) / conf_capacity)
							.toFixed(2);

					$("#capacity_table")
							.html(
									"<table id='stemp' border='1'>" + "<tr>"
											+ "<td>Configured Capacity</td>"
											+ "<td id='data_size'> "
											+ this
													._calculateCapacityData(conf_capacity)
											+ " </td>"
											+ "</tr>"
											+ "<tr>"
											+ "<td>Heap Used</td>"
											+ "<td id='data_size'> "
											+ this
													._calculateCapacityData(heap_used)
											+ "</td>"
											+ "</tr>"
											+ "<tr>"
											+ "<td>Heap Remaining</td>"
											+ "<td id='data_size'> "
											+ this
													._calculateCapacityData(heap_remaining)
											+ "</td>"
											+ "</tr>"
											+ "<tr>"
											+ "<td>Heap Used%</td>"
											+ "<td id='data_size'> "
											+ heap_used_percent
											+ " %</td>"
											+ "</tr>"
											+ "<tr>"
											+ "<td>Heap Remaining%</td>"
											+ "<td id='data_size'> "
											+ heap_remaining_percent
											+ " %</td>"
											+ "</tr>"
											+ "<tr>"
											+ "<td>Live Server Heap</td>"
											+ "<td id='data_size'> "
											+ this.numberOfDataNode
											+ "</td>"
											+ "</tr>"
											+ "</table>");
				}

			},
			_drawCapacity : function() {
				// prepare temporary vars in order to make codes readable
				var r = infinispan.heap.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var agent = this.agentsList_[i];
					var capacity = this.heapState_[agent].capacityLength;
					var angle = this.angleUnit * i
							+ infinispan.utility.toRadian(90);
					var cos = Math.cos(angle);
					var sin = Math.sin(angle);
					var c = infinispan.Heap.center;

					var postfix_value = this
							._calculateCapacityData(this.heapState_[agent]["max:bytes"] - this.heapState_[agent]["used:bytes"]);

					var oldCapacityObject = infinispan.Heap.capacityList[agent];
					if (oldCapacityObject) {
						oldCapacityObject.remove();
					}
					// actual process
					infinispan.Heap.capacityList[agent] = this.paper
							.path(
									[
											[
													"M",
													(c.x + r * cos + w / 2
															* sin),
													(c.y - r * sin + w / 2
															* cos) ],
											[ "l", (capacity * cos),
													(-capacity * sin) ],
											[ "l", (-w * sin), (-w * cos) ],
											[ "l", (-capacity * cos),
													(capacity * sin) ] ])
							.attr(
									{
										target : agent,
										stroke : infinispan.heap.constants.dataNode.frameColor,
										fill : " rgb(48, 50, 50)",
										title : this.agentsList_[i]
												+ " : heap.remaining" + " : "
												+ postfix_value
									});

				}
			},
			_drawUsage : function() {
				// prepare temporary vars in order to make codes readable
				var r = infinispan.heap.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var agent = this.agentsList_[i];
					var h = this.heapState_[agent].heapusedLength;
					
					// 初期描画時にヒープサイズを登録する
					// 以後はリアルタイム更新時に、ヒープサイズを更新する
					if (infinispan.Heap.beforeUsage[agent] === undefined) {
						infinispan.Heap.beforeUsage[agent] = h;
					}
					
					var angle = this.angleUnit * i
							+ infinispan.utility.toRadian(90);
					var cos = Math.cos(angle);
					var sin = Math.sin(angle);
					var c = infinispan.Heap.center;
					var heapStatus = this.heapState_[agent].status;
					
					var postfix_value = this
							._calculateCapacityData(this.heapState_[agent]["used:bytes"]);

					var oldUsageObject = infinispan.Heap.usageList[agent];
					if (oldUsageObject) {
						oldUsageObject.remove();
					}
					// actual process
					infinispan.Heap.usageList[agent] = this.paper
							.path(
									[
											[
													"M",
													(c.x + r * cos + w / 2
															* sin),
													(c.y - r * sin + w / 2
															* cos) ],
											[ "l", (h * cos), (-h * sin) ],
											[ "l", (-w * sin), (-w * cos) ],
											[ "l", (-h * cos), (h * sin) ] ])
							.attr(
									{
										"stroke" : infinispan.heap.constants.dataNode.frameColor,
										fill : this
												._getDataNodeColor(heapStatus),
										target : agent,
										title : this.agentsList_[i] + " : heap.used"
												+ " : " + postfix_value
									});
				}
			},
			_drawInitializeParts : function() {
				// ボタンを作成する
				this._drawRotationButton();
				
				// 中心の円オブジェクトを作成する
				this._drawCenterObject();
			},
			_drawRotationButton : function() {
				var butt1 = this.paper.set(), butt2 = this.paper.set();
				butt1
						.push(
								this.paper.circle(24.833, 26.917, 26.667).attr(
										{
											stroke : "#ccc",
											fill : "#fff",
											"fill-opacity" : 0.4,
											"stroke-width" : 2
										}),
								this.paper
										.path(
												"M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z")
										.attr({
											stroke : "none",
											fill : "#000"
										}), this.paper.circle(24.833, 26.917,
										26.667).attr({
									fill : "#fff",
									opacity : 0
								}));
				butt2
						.push(
								this.paper.circle(24.833, 26.917, 26.667).attr(
										{
											stroke : "#ccc",
											fill : "#fff",
											"fill-opacity" : 0.4,
											"stroke-width" : 2
										}),
								this.paper
										.path(
												"M37.566,9.551c9.331,6.686,11.661,19.471,5.502,29.014l2.36,1.689l-4.893,2.262l-4.893,2.262l0.568-5.36l0.567-5.359l2.365,1.694c4.657-7.375,2.83-17.185-4.352-22.33c-7.451-5.338-17.817-3.625-23.156,3.824C6.3,24.695,8.012,35.06,15.458,40.398l-2.857,3.988C2.983,37.494,0.773,24.109,7.666,14.49C14.558,4.87,27.944,2.658,37.566,9.551z")
										.attr({
											stroke : "none",
											fill : "#000"
										}), this.paper.circle(24.833, 26.917,
										26.667).attr({
									fill : "#fff",
									opacity : 0
								}));
				butt1.translate(5, 30);
				butt2.translate(500, 30);

				butt1
						.click(
								function(event) {
									infinispan.Heap.changeAngleFromUpdate -= infinispan.Heap.unitAngle;
									infinispan.Heap.changeAngleTotal -= infinispan.Heap.unitAngle;
									infinispan.Heap.self._rotateNode();
								}).mouseover(function() {
							butt1[1].animate({
								fill : "#fc0"
							}, 300);
						}).mouseout(function() {
							butt1[1].stop().attr({
								fill : "#000"
							});
						});

				butt2
						.click(
								function(event) {
									infinispan.Heap.changeAngleFromUpdate += infinispan.Heap.unitAngle;
									infinispan.Heap.changeAngleTotal += infinispan.Heap.unitAngle;
									infinispan.Heap.self._rotateNode();
								}).mouseover(function() {
							butt2[1].animate({
								fill : "#fc0"
							}, 300);
						}).mouseout(function() {
							butt2[1].stop().attr({
								fill : "#000"
							});
						});
			},
			_drawCenterObject : function() {
				// base numbers for drawing
				infinispan.Heap.center = {
					x : viewArea2.width / 3,
					y : viewArea2.height / 1.8 - 90
				};
				
				infinispan.Heap.centerObject = this.paper
						.circle(
								infinispan.Heap.center.x,
								infinispan.Heap.center.y,
								infinispan.heap.constants.mainCircle.radius
										* infinispan.heap.constants.mainCircle.innerRate)
						.attr(
								{
									"fill" : infinispan.heap.constants.dataNode.color.good,
									"stroke" : infinispan.heap.constants.dataNode.frameColor
								});
		
				this.paper
						.circle(
								infinispan.Heap.center.x,
								infinispan.Heap.center.y,
								infinispan.heap.constants.mainCircle.radius
										- infinispan.heap.constants.rack.height
										/ 2)
						.attr(
								{
									"stroke" : infinispan.heap.constants.dataNode.frameColor,
									"stroke-width" : infinispan.heap.constants.rack.height / 2
								});
			},
			_drawRack : function() {
				// $("#" + this.$el.attr("id"))
				// prepare temporary vars in order to make codes readable
				var r = infinispan.heap.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;
				var lastRack = "";
				var numberOfRackColor = infinispan.heap.constants.rack.colors.length;
				var colorNo = -1;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					var rackName = this.agentsList_[i];

					// prepare temporary vars in order to make codes readable
					var agent = this.agentsList_[i];
					var h = infinispan.heap.constants.rack.height;
					var angle = this.angleUnit * i
							+ infinispan.utility.toRadian(90);
					var cos = Math.cos(angle);
					var sin = Math.sin(angle);
					var c = infinispan.Heap.center;

					var rackColor = this.rackColorList[rackName];

					if (rackColor === undefined) {
						rackColor = ++colorNo;
						this.rackColorList[rackName] = rackColor;
					}

					var oldRackObject = infinispan.Heap.rackList[agent];
					if (oldRackObject) {
						oldRackObject.remove();
					}
					// actual process
					infinispan.Heap.rackList[agent] = this.paper
							.path(
									[
											[
													"M",
													(c.x + (r - h) * cos + w
															/ 2 * sin),
													(c.y - (r - h) * sin + w
															/ 2 * cos) ],
											[ "l", (h * cos), (-h * sin) ],
											[ "l", (-w * sin), (-w * cos) ],
											[ "l", (-h * cos), (h * sin) ] ])
							.attr(
									{
										target : agent,
										stroke : infinispan.heap.constants.rack.colors[rackColor
												% numberOfRackColor],
										fill : infinispan.heap.constants.rack.colors[rackColor
												% numberOfRackColor],
										title : rackName + " : agent"
									});

				}
			},
			_rotateNode : function(clickObject) {
				var centerX = infinispan.Heap.center.x;
				var centerY = infinispan.Heap.center.y;
				for ( var agent in infinispan.Heap.capacityList) {
					infinispan.Heap.capacityList[agent].animate({
						transform : "r"
								+ [ infinispan.Heap.changeAngleFromUpdate,
										centerX, centerY ]
					}, infinispan.Heap.BLOCK_ROTATE_SPEED, "<>");
					infinispan.Heap.usageList[agent].animate({
						transform : "r"
								+ [ infinispan.Heap.changeAngleFromUpdate,
										centerX, centerY ]
					}, infinispan.Heap.BLOCK_ROTATE_SPEED, "<>");
					infinispan.Heap.rackList[agent].animate({
						transform : "r"
								+ [ infinispan.Heap.changeAngleFromUpdate,
										centerX, centerY ]
					}, infinispan.Heap.BLOCK_ROTATE_SPEED, "<>");
				}
			},
			_initIdManager : function() {
				// id manager prototype
				function IdManager() {
					this.ids = [];
					this.add = function(number, agent) {
						this.ids[agent] = number;
					};
					this.remove = function(agent) {
						delete (this.ids[agent]);
					};
					this.find = function(agent) {
						return this.ids[agent];
					};
				}

				// obj in order to manage relation between id numbers with data
				// node
				this.dataNodeIdManager = new IdManager();
				// obj in order to manage relation between id numbers with block
				// transfer
				this.blockTransferIdManager = new IdManager();
			},
			updateDisplaySpan : function(pastTime) {
				if (pastTime === 0) {
					if (this.isRealTime === false) {
						appView
								.syncData([ (infinispan.Heap.treeSettingId + "%") ]);
					}
					this.isRealTime = true;

					var end = new Date();
					var start = new Date(end.getTime() - 60 * 60 * 1000);
					appView.getTermData(
							[ (infinispan.Heap.treeSettingId + '%') ], start,
							end);
				} else {
					this.isRealTime = false;
					this._drawStaticDataNode(pastTime);
				}

			},
			_drawHeap : function() {
				this._setHeapDataList();

				var localHeapLastData = this.heapDataList_[this.lastMeasurementTime_];
				var mapSize = 0;
				var mapId = "";
				_.each(localHeapLastData, function(value, id) {
					mapId = id;
					mapSize++;
				});

				if (mapSize == 1
						&& mapId == infinispan.heap.constants.agentnameAll) {
					return;
				}

				// set heapState as the last data in heapDataList
				this._setHeapState();

				// data node
				this.numberOfDataNode = this.agentsList_.length;

				if (this.numberOfDataNode !== 0) {
					infinispan.Heap.unitAngle = 360 / this.numberOfDataNode;
				} else {
					infinispan.Heap.unitAngle = 0;
				}

				this.dataNodeBarWidth = infinispan.heap.constants.mainCircle.radius
						* 2 * Math.PI / this.numberOfDataNode;
				if (this.dataNodeBarWidth > infinispan.heap.constants.dataNode.maxWidth) {
					this.dataNodeBarWidth = infinispan.heap.constants.dataNode.maxWidth;
				}
				this.dataNodeChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// base numbers for drawing
				infinispan.Heap.center = {
					x : viewArea2.width / 3,
					y : viewArea2.height / 1.8 - 90
				};
				this.angleUnit = infinispan.utility
						.toRadian(360 / this.numberOfDataNode);

				// block transfer
				this.blockTransferChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// id manager
				this._initIdManager();

				// raphael elements
				// static objects
				this._staticRender();

				// show cluster summary
				this._showClusterSummary();

			},
			_updateDraw : function() {
				// データを更新する
				this._setHeapDataList();
				
				var localHeapLastData = this.heapDataList_[this.lastMeasurementTime_];
				
				// set heapState as the last data in heapDataList
				this._setHeapState();

				// data node
				this.numberOfDataNode = this.agentsList_.length;

				if (this.numberOfDataNode !== 0) {
					infinispan.Heap.unitAngle = 360 / this.numberOfDataNode;
				} else {
					infinispan.Heap.unitAngle = 0;
				}

				this.dataNodeBarWidth = infinispan.heap.constants.mainCircle.radius
						* 2 * Math.PI / this.numberOfDataNode;
				if (this.dataNodeBarWidth > infinispan.heap.constants.dataNode.maxWidth) {
					this.dataNodeBarWidth = infinispan.heap.constants.dataNode.maxWidth;
				}
				this.dataNodeChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// base numbers for drawing
				infinispan.Heap.center = {
					x : viewArea2.width / 3,
					y : viewArea2.height / 1.8 - 90
				};
				this.angleUnit = infinispan.utility
						.toRadian(360 / this.numberOfDataNode);

				// block transfer
				this.blockTransferChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// id manager
				this._initIdManager();
				
				// update changed object
				this._updateRender();

				// show cluster summary
				this._showClusterSummary();
			},
			_getDataNodeColor : function(status) {
				if (status == infinispan.heap.constants.dataNode.status.good) {
					return infinispan.heap.constants.dataNode.color.good;
				} else if (status == infinispan.heap.constants.dataNode.status.full) {
					return infinispan.heap.constants.dataNode.color.full;
				} else {
					return infinispan.heap.constants.dataNode.color.dead;
				}
			},
			destroy : function() {
				this.stopRegisterCollectionEvent();
				var appView = ENS.AppView();
				appView.stopSyncData([ infinispan.Heap.treeSettingId + '%' ]);
				if (this.collection) {
					this.collection.reset();
				}
			}
		});

_.bindAll(wgp.MapView);