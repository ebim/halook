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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/

halook.HDFS.changeAngleFromUpdate = 0;
halook.HDFS.changeAngleTotal = 0;
halook.HDFS.unitAngle = 0;
halook.HDFS.capacityList = {};
halook.HDFS.usageList = {};
halook.HDFS.rackList = {};
halook.HDFS.angleList = {};
halook.HDFS.center = {};
halook.HDFS.capacity = {};
halook.HDFS.beforeUsage = {};
halook.HDFS.isCompleteDraw = false;

halook.HDFSView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSetting) {
				halook.HDFS.self = this;
				
				this.hdfsDataList_ = {};
				this.hdfsState_ = {};
				this.hostsList_ = [];
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
				halook.HDFS.treeSettingId = treeSetting.id;

				var appView = ENS.AppView();
				appView.addView(this, halook.HDFS.treeSettingId + '%');
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

				// drawing
				// non-raphael elements
				// add slider
				this._addSlider(this);

				// add div for data node status popup
				this._addStatusPopup();

				var end = new Date();
				var start = new Date(end.getTime() - 15000);
				appView
						.getTermData([ (halook.HDFS.treeSettingId + '%') ], start,
								end);

			},
			_staticRender : function() {
				
				halook.HDFS.centerObject = this.paper
						.circle(
								halook.HDFS.center.x,
								halook.HDFS.center.y,
								halook.hdfs.constants.mainCircle.radius
										* halook.hdfs.constants.mainCircle.innerRate)
						.attr(
								{
									"fill" : halook.hdfs.constants.dataNode.color.good,
									"stroke" : halook.hdfs.constants.dataNode.frameColor
								});

				this.paper.circle(
						halook.HDFS.center.x,
						halook.HDFS.center.y,
						halook.hdfs.constants.mainCircle.radius
								- halook.hdfs.constants.rack.height / 2).attr({
					"stroke" : halook.hdfs.constants.dataNode.frameColor,
					"stroke-width" : halook.hdfs.constants.rack.height / 2
				});
				
				this.hostsList_.sort();
				
				var hostsListLength = this.hostsList_.length;
				
				var rotationVal = ~~(halook.HDFS.changeAngleTotal / halook.HDFS.unitAngle) % hostsListLength;
				
				// 右回りで数えていくつ分回転しているかを、正の値で表現する
				if (rotationVal < 0) {
					rotationVal = hostsListLength + rotationVal;
				}
				
				// すでに回転している分、リストの順番を並び替える
				var tmpList = [];
				for (var index = 0; index < hostsListLength; index++){
					var hostIndex = (rotationVal + index) % hostsListLength ;
					
					tmpList[index] = this.hostsList_[hostIndex];
				}
				
				this.hostsList_ = tmpList;
				
				// data node capacity bars
				this._drawCapacity();

				// rack
				this._drawRack();

				this._drawUsage();

				halook.HDFS.changeAngleFromUpdate = 0;
			},
			render : function() {
				// making area to set capacity table
				$(document.getElementById(this.$el
						.attr("id")))
				.append(
						"<div id='capacity_table' style='margin-left:10px;margin-top:260px; float:left'></div>");
				
				// making area to set raphael
				$(document.getElementById(this.$el
						.attr("id")))
				.append(
						"<div id='hdfs_data' style='width:600px;height:630px; float:right'></div>");
				// set paper
				this.paper = new Raphael('hdfs_data');
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
				this._updateDraw();
				if (this.isRealTime) {
					appView.syncData([ (halook.HDFS.treeSettingId + "%") ]);
				}
				
			},
			_initView : function() {
				// enlarge area
				$("#contents_area_0").css("height", 630);
				// set bg olor
				$("#" + this.$el.attr("id")).css("background-color",
						halook.hdfs.constants.bgColor);
			},
			_setHdfsDataList : function() {
				var instance = this;
				// delete data ignore old last update date.
				var tmpUpdateLastTime = 0;
				_.each(this.hdfsDataList_, function(data, time) {
					var tmpTime = parseInt(time, 10);
					if (tmpUpdateLastTime < tmpTime) {
						tmpUpdateLastTime = tmpTime;
					}
				});

				if (tmpUpdateLastTime !== 0) {
					this.oldestMeasurementTime_ = tmpUpdateLastTime;
					_.each(this.hdfsDataList_, function(data, time) {
						var tmpTime = parseInt(time, 10);
						if (tmpUpdateLastTime != tmpTime) {
							delete instance.hdfsDataList_[time];
						}
					});
				}

				// create lastupdate data.
				var lastupdateTime = 0;
				// search lastMeasurementTime
				_.each(this.collection.models,
						function(model, id) {
							var measurementTime = model
									.get(halook.ID.MEASUREMENT_TIME);
							var tmpTime = parseInt(measurementTime, 10);
							if (lastupdateTime < tmpTime) {
								lastupdateTime = tmpTime;
							}
						});
				// set Last Update Time.
				this.lastMeasurementTime_ = lastupdateTime;

				// delete data
				var lastupdatestartTime = lastupdateTime
						- halook.HDFS.MESURE_TERM;
				var removeTargetList = [];
				_.each(this.collection.models,
						function(model, id) {
							var measurementTime = model
									.get(halook.ID.MEASUREMENT_TIME);
							var tmpTime = parseInt(measurementTime, 10);
							if (lastupdatestartTime > tmpTime) {
								removeTargetList.push(model);
							}
						});
				this.collection.remove(removeTargetList, {
					silent : true
				});
				// create measurement data set.
				_
						.each(
								this.collection.models,
								function(model, id) {
									var measurementItemName = model
											.get(halook.ID.MEASUREMENT_ITEM_NAME);
									
									var pathList = measurementItemName.split(halook.HDFS.treeSettingId);
									
									var childTreePath = pathList[1];
									var childPathList = childTreePath.split("/");
									
									var hostname = childPathList[1];
									var valueType = childPathList[2];
									
									var measurementValue = model
											.get(halook.ID.MEASUREMENT_VALUE);
									
									if (valueType != "nodeinfo") {
										measurementValue = Number(measurementValue);
									}
									
									if (instance.hdfsDataList_[instance.lastMeasurementTime_]) {
										if (instance.hdfsDataList_[instance.lastMeasurementTime_][hostname]) {

										} else {
											instance.hdfsDataList_[instance.lastMeasurementTime_][hostname] = {};
										}
										instance.hdfsDataList_[instance.lastMeasurementTime_][hostname][valueType] = measurementValue;
										instance.hdfsDataList_[instance.lastMeasurementTime_][hostname]["capacity"] = instance.hdfsDataList_[instance.lastMeasurementTime_][hostname]["dfsremaining"]
												+ instance.hdfsDataList_[instance.lastMeasurementTime_][hostname]["dfsused"];

									} else {
										instance.hdfsDataList_[instance.lastMeasurementTime_] = {};
										var entry = {};
										entry[valueType] = measurementValue;
										entry["capacity"] = measurementValue;
										instance.hdfsDataList_[instance.lastMeasurementTime_][hostname] = entry;
									}
								});
			},
			_animateBlockTransfer : function() {
				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var host = this.hostsList_[i];
					
					if (halook.HDFS.usageList[host] !== undefined) {
					
						var h = this.hdfsState_[host].dfsusedLength;
						var centerX = halook.HDFS.center.x;
						var centerY = halook.HDFS.center.y;
						
						var centerObjectClone;
						// 前回の使用量ｋ
						var beforeUsage = halook.HDFS.beforeUsage[host];
						if (beforeUsage > h) {
							
							var usageClone = halook.HDFS.usageList[host].clone();
							
							centerObjectClone = this.paper
							.path(
									[
											[
													"M",
													centerX,
													centerY ] ])
							.attr(
									{
										stroke : halook.hdfs.constants.dataNode.frameColor,
										fill : " rgb(256, 256, 256)"
									});
							
							
							
							usageClone.stop().animate({path: "M" + centerX + " "
								+ centerY, fill: " rgb(256, 256, 256)"}, halook.HDFS.BLOCK_TRANSFER_SPEED, "", function() {
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
											stroke : halook.hdfs.constants.dataNode.frameColor,
											fill : " rgb(256, 256, 256)"
										});

							
							var pathValue = halook.HDFS.usageList[host].attrs;				
							
							centerObjectClone.animate(pathValue, halook.HDFS.BLOCK_TRANSFER_SPEED, "", function() {
								this.remove();
							});
						}
					}
					halook.HDFS.beforeUsage[host]　= h;
				}
			},
			_drawingUsageTemporary : function(index,capacity,host,ref){
				
				var radius = halook.hdfs.constants.mainCircle.radius;
                var width = this.dataNodeBarWidth;
				var angle = this.angleUnit * index + halook.utility.toRadian(90);
				var cos = Math.cos(angle);
				var sin = Math.sin(angle);
				var center = halook.HDFS.center;
				var dfsStatus = this.hdfsState_[host].status;
				
				var temp = ref
				.path(
					[
						[ "M", (center.x + radius * cos + width / 2 * sin),
								(center.y - radius * sin + width / 2 * cos) ],
						[ "l", (capacity * cos), (-capacity * sin) ],
						[ "l", (-width * sin), (-width * cos) ],
						[ "l", (-capacity * cos), (capacity * sin) ] ])
				.attr(
					{
						fill : this._getDataNodeColor(dfsStatus)
					});
				
				return temp;
			},
			_setHdfsState : function() {
				// set hdfsState as the last data in hdfsDataList
				if (this.hdfsDataList_[this.lastMeasurementTime_]) {
					this.hdfsState_ = this.hdfsDataList_[this.lastMeasurementTime_];
				} else {
					this.hdfsState_ = {};
				}

				// set hostsList
				this.hostsList_ = [];
				var host = "";
				for (host in this.hdfsState_) {
					if (host != halook.hdfs.constants.hostnameAll) {
						this.hostsList_.push(host);

						// set capacityMax
						if (this.hdfsState_[host]["capacity"] > this.capacityMax_) {
							this.capacityMax_ = this.hdfsState_[host]["capacity"];
						}
					}
				}

				// set the length to display
				for (host in this.hdfsState_) {
					this.hdfsState_[host].capacityLength = halook.hdfs.constants.dataNode.maxLength
							* this.hdfsState_[host]["capacity"]
							/ this.capacityMax_;
					this.hdfsState_[host].dfsusedLength = halook.hdfs.constants.dataNode.maxLength
							* this.hdfsState_[host]["dfsused"]
							/ this.capacityMax_;
					if (this.hdfsState_[host]["dfsused"] / this.capacityMax_ > halook.hdfs.constants.blockTransfer.colorThreshold) {
						this.hdfsState_[host].status = halook.hdfs.constants.dataNode.status.full;
					} else {
						this.hdfsState_[host].status = halook.hdfs.constants.dataNode.status.good;
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
				appView.stopSyncData([ (halook.HDFS.treeSettingId + '%') ]);
				appView
						.getTermData([ (halook.HDFS.treeSettingId + '%') ], start,
								end);
			},
			_addBlockTransfer : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.transfer[i] = {};
					self.nextId = self._getUniqueId();
					self.transfer[i].objectId = self.transfer[i].id = self.nextId;
					self.transfer[i].size = 1;
					self.transfer[i].angle = self.angleUnit * i,
							self.blockTransferIdManager.add(self.nextId,
									this.hostsList_[i]);
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
							.find(this.hostsList_[i]);
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
						height : this.hdfsState_[this.hostsList_[i]].dfsusedLength,
						angle : self.angleUnit * i,
						host : this.hdfsState_[this.hostsList_[i]],
						capacity : this.hdfsState_[this.hostsList_[i]].capacityLength,
						type : wgp.constants.CHANGE_TYPE.ADD,
						objectName : "DataNodeRectangle",
						center : self.center
					};
					self.dataNodeIdManager.add(self.nextId, this.hostsList_[i]);
				}
			},
			_updateDataNode : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {

					if (this.hdfsState_[this.hostsList_[i]] !== undefined) {
						self.diff[i] = this.hdfsState_[this.hostsList_[i]].dfsusedLength
								- self.currentDataNode[i].height;
						self.currentDataNode[i] = {
							type : wgp.constants.CHANGE_TYPE.UPDATE,
							objectId : self.dataNodeIdManager
									.find(this.hostsList_[i]),
							id : self.dataNodeIdManager
									.find(this.hostsList_[i]),
							height : this.hdfsState_[this.hostsList_[i]].dfsusedLength,
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
			_calculateCapacityData : function(data){
				
				var data_size_kb = data / 1024;
				var data_size_mb = data / 1024 / 1024;
				var data_size_gb = data / 1024 / 1024 / 1024;
				var postfix_value = 0;
				
				if(data_size_kb < 1024){
					postfix_value = parseFloat(Math.round(data_size_kb * 100) / 100).toFixed(2)+"KB";
				}
				else if(data_size_mb < 1024){
					postfix_value = parseFloat(Math.round(data_size_mb * 100) / 100).toFixed(2)+"MB";
				}
				else if(data_size_gb < 1024){
					postfix_value = parseFloat(Math.round(data_size_gb * 100) / 100).toFixed(2)+"GB";
				}
				else{
					postfix_value = parseFloat(Math.round((data_size_gb/1024) * 100) / 100).toFixed(2)+"TB";
				}
				
				return postfix_value;
			},
			_showClusterSummary : function(){
				var conf_capacity = 0;
				var dfs_used = 0;
				var dfs_remaining = 0;
				var host = "";
				
				for (host in this.hdfsState_) {
					if(host == "--all--"){
						dfs_used = this.hdfsState_[host]["dfsused"];
						dfs_remaining = this.hdfsState_[host]["dfsremaining"];
						break;
					}
				}
				
				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					host = this.hostsList_[i];
					conf_capacity += this.hdfsState_[host]["capacity"];
				}
				
				if(conf_capacity !== 0){					
					
					var non_dfs_used=conf_capacity-(dfs_used+dfs_remaining);
					var dfs_used_percent=((dfs_used*100)/conf_capacity).toFixed(2);
					var dfs_remaining_percent=((dfs_remaining*100)/conf_capacity).toFixed(2);
					
				$("#capacity_table")
				.html(
						"<table id='stemp' border='1'>" +
										"<tr>" +
											"<td>Configured Capacity</td>" +
											"<td id='data_size'> "+this._calculateCapacityData(conf_capacity)+" </td>" +
										"</tr>" +
										"<tr>" +
											"<td>DFS Used</td>" +
											"<td id='data_size'> "+this._calculateCapacityData(dfs_used)+"</td>" +
										"</tr>" +
										"<tr>" +
											"<td>Non DFS Used</td>" +
											"<td id='data_size'> "+this._calculateCapacityData(non_dfs_used)+"</td>" +
										"</tr>" +
										"<tr>" +
											"<td>DFS Remaining</td>" +
											"<td id='data_size'> "+this._calculateCapacityData(dfs_remaining)+"</td>" +
										"</tr>" +
										"<tr>" +
											"<td>DFS Used%</td>" +
											"<td id='data_size'> "+dfs_used_percent+" %</td>" +
										"</tr>" +
										"<tr>" +
											"<td>DFS Remaining%</td>" +
											"<td id='data_size'> "+dfs_remaining_percent+" %</td>" +
										"</tr>" +
										"<tr>" +
											"<td>Live Nodes </td>" +
											"<td id='data_size'> "+this.numberOfDataNode+"</td>" +
										"</tr>" +
										"<tr><td>Dead Nodes  </td><td id='data_size'>-</td></tr>" +
										"<tr><td>Decommissioning Nodes </td><td id='data_size'>-</td></tr>" +
										"<tr><td>Number of Under-Replicated Blocks </td><td id='data_size'>-</td></tr>" +
										"</table>");
					}
				
			},
			_drawCapacity : function() {
				// prepare temporary vars in order to make codes readable
				var r = halook.hdfs.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;

				
				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var host = this.hostsList_[i];
					var capacity = this.hdfsState_[host].capacityLength;
					var angle = this.angleUnit * i + halook.utility.toRadian(90);
					var cos = Math.cos(angle);
					var sin = Math.sin(angle);
					var c = halook.HDFS.center;
					
					var postfix_value = this._calculateCapacityData(this.hdfsState_[host]["dfsremaining"]);
					
					// actual process
					halook.HDFS.capacityList[host] = this.paper
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
										target : host,
										stroke : halook.hdfs.constants.dataNode.frameColor,
										fill : " rgb(48, 50, 50)",
										title : this.hostsList_[i]
												+ " : remaining"
												+ " : "
												+ postfix_value
									});

				}
			},
			_drawUsage : function() {
				// prepare temporary vars in order to make codes readable
				var r = halook.hdfs.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var host = this.hostsList_[i];
					var h = this.hdfsState_[host].dfsusedLength;
					
					// 初期描画時にHDFS使用量を登録する
					// 以後はリアルタイム更新時に、HDFS使用量を更新する
					if (halook.HDFS.beforeUsage[host] === undefined) {
						halook.HDFS.beforeUsage[host] = h;
					}
					
					var angle = this.angleUnit * i + halook.utility.toRadian(90);
					var cos = Math.cos(angle);
					var sin = Math.sin(angle);
					var c = halook.HDFS.center;
					var dfsStatus = this.hdfsState_[host].status;
					
					var postfix_value = this._calculateCapacityData(this.hdfsState_[host]["dfsused"]);
					
					// actual process
					halook.HDFS.usageList[host] = this.paper.path(
							[
									[ "M", (c.x + r * cos + w / 2 * sin),
											(c.y - r * sin + w / 2 * cos) ],
									[ "l", (h * cos), (-h * sin) ],
									[ "l", (-w * sin), (-w * cos) ],
									[ "l", (-h * cos), (h * sin) ] ]).attr({
						"stroke" : halook.hdfs.constants.dataNode.frameColor,
						fill : this._getDataNodeColor(dfsStatus),
						target : host,
						title : this.hostsList_[i] 
									+ " : used"
									+ " : "
									+ postfix_value
					});
				}
			},
			_setRotationButton : function() {
				var butt1 = this.paper.set(),
				butt2 = this.paper.set();
				butt1.push(this.paper.circle(24.833, 26.917, 26.667).attr({stroke: "#ccc", fill: "#fff", "fill-opacity": 0.4, "stroke-width": 2}),
				this.paper.path("M12.582,9.551C3.251,16.237,0.921,29.021,7.08,38.564l-2.36,1.689l4.893,2.262l4.893,2.262l-0.568-5.36l-0.567-5.359l-2.365,1.694c-4.657-7.375-2.83-17.185,4.352-22.33c7.451-5.338,17.817-3.625,23.156,3.824c5.337,7.449,3.625,17.813-3.821,23.152l2.857,3.988c9.617-6.893,11.827-20.277,4.935-29.896C35.591,4.87,22.204,2.658,12.582,9.551z").attr({stroke: "none", fill: "#000"}),
				this.paper.circle(24.833, 26.917, 26.667).attr({fill: "#fff", opacity: 0}));
				butt2.push(this.paper.circle(24.833, 26.917, 26.667).attr({stroke: "#ccc", fill: "#fff", "fill-opacity": 0.4, "stroke-width": 2}),
				this.paper.path("M37.566,9.551c9.331,6.686,11.661,19.471,5.502,29.014l2.36,1.689l-4.893,2.262l-4.893,2.262l0.568-5.36l0.567-5.359l2.365,1.694c4.657-7.375,2.83-17.185-4.352-22.33c-7.451-5.338-17.817-3.625-23.156,3.824C6.3,24.695,8.012,35.06,15.458,40.398l-2.857,3.988C2.983,37.494,0.773,24.109,7.666,14.49C14.558,4.87,27.944,2.658,37.566,9.551z").attr({stroke: "none", fill: "#000"}),
				this.paper.circle(24.833, 26.917, 26.667).attr({fill: "#fff", opacity: 0}));
				butt1.translate(5, 30);
				butt2.translate(500, 30); 
				
				butt1.click(function(event) {
					halook.HDFS.changeAngleFromUpdate -= halook.HDFS.unitAngle;
					halook.HDFS.changeAngleTotal -= halook.HDFS.unitAngle;
					halook.HDFS.self._rotateNode();
				}).mouseover(function () {
					butt1[1].animate({fill: "#fc0"}, 300);
				}).mouseout(function () {
					butt1[1].stop().attr({fill: "#000"});
				});
				
				butt2.click(function(event) {
					halook.HDFS.changeAngleFromUpdate += halook.HDFS.unitAngle;
					halook.HDFS.changeAngleTotal += halook.HDFS.unitAngle;
					halook.HDFS.self._rotateNode();
				}).mouseover(function () {
					butt2[1].animate({fill: "#fc0"}, 300);
				}).mouseout(function () {
					butt2[1].stop().attr({fill: "#000"});
				});
				
			},
			_drawRack : function() {
				// $("#" + this.$el.attr("id"))
				// prepare temporary vars in order to make codes readable
				var r = halook.hdfs.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;
				var lastRack = "";
				var numberOfRackColor = halook.hdfs.constants.rack.colors.length;
				var colorNo = -1;
				
				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var host = this.hostsList_[i];
					var h = halook.hdfs.constants.rack.height;
					var angle = this.angleUnit * i + halook.utility.toRadian(90);
					var cos = Math.cos(angle);
					var sin = Math.sin(angle);
					var c = halook.HDFS.center;
					
					// get rack name
					var nodeInfoStr = this.hdfsState_[host].nodeinfo;
					
					// onAddから複数データが送られてくる場合、
					// 今のところ、複数データの数だけonAddイベントが発生するが、
					// 最後以外は不適切なデータなのではじく
					if(nodeInfoStr === undefined) {
						return;
					}
					
					var nodeInfo = (new Function("return " + nodeInfoStr))();
					var rackName = nodeInfo["rack-name"];
					
					var rackColor = this.rackColorList[rackName];
					
					if (rackColor === undefined) {
						rackColor = ++colorNo;
						this.rackColorList[rackName] = rackColor;
					}
					
					// actual process
					halook.HDFS.rackList[host] = this.paper
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
										target : host,
										stroke : halook.hdfs.constants.rack.colors[rackColor
												% numberOfRackColor],
										fill : halook.hdfs.constants.rack.colors[rackColor
												% numberOfRackColor],
										title : rackName + " : rack"
									});

				}
			},
			_rotateNode : function(clickObject) {
				var centerX = halook.HDFS.center.x;
				var centerY = halook.HDFS.center.y;
				for ( var host in halook.HDFS.capacityList) {
					halook.HDFS.capacityList[host].animate({
						transform : "r"
								+ [ halook.HDFS.changeAngleFromUpdate, centerX, centerY ]
					}, halook.HDFS.BLOCK_ROTATE_SPEED, "<>");
					halook.HDFS.usageList[host].animate({
						transform : "r"
								+ [ halook.HDFS.changeAngleFromUpdate, centerX, centerY ]
					}, halook.HDFS.BLOCK_ROTATE_SPEED, "<>");
					halook.HDFS.rackList[host].animate({
						transform : "r"
								+ [ halook.HDFS.changeAngleFromUpdate, centerX, centerY ]
					}, halook.HDFS.BLOCK_ROTATE_SPEED, "<>");
				}
			},
			_initIdManager : function() {
				// id manager prototype
				function IdManager() {
					this.ids = [];
					this.add = function(number, host) {
						this.ids[host] = number;
					};
					this.remove = function(host) {
						delete (this.ids[host]);
					};
					this.find = function(host) {
						return this.ids[host];
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
						appView.syncData([ (halook.HDFS.treeSettingId + "%") ]);
					}
					this.isRealTime = true;

					var end = new Date();
					var start = new Date(end.getTime() - 60 * 60 * 1000);
					appView.getTermData([ (halook.HDFS.treeSettingId + '%') ], start,
							end);
				} else {
					this.isRealTime = false;
					this._drawStaticDataNode(pastTime);
				}

			},
			_updateDraw : function() {

				this._setHdfsDataList();

				var localHdfsLastData = this.hdfsDataList_[this.lastMeasurementTime_];
				var mapSize = 0;
				var mapId = "";
				_.each(localHdfsLastData, function(value, id) {
					mapId = id;
					mapSize++;
				});

				if (mapSize == 1 && mapId == halook.hdfs.constants.hostnameAll) {
					return;
				}

				this.paper.clear();
				
				this._setRotationButton();

				// set hdfsState as the last data in hdfsDataList
				this._setHdfsState();

				// data node
				this.numberOfDataNode = this.hostsList_.length;

				if (this.numberOfDataNode !== 0) {
					halook.HDFS.unitAngle = 360 / this.numberOfDataNode;
				} else {
					halook.HDFS.unitAngle = 0;
				}

				this.dataNodeBarWidth = halook.hdfs.constants.mainCircle.radius
						* 2 * Math.PI / this.numberOfDataNode;
				if (this.dataNodeBarWidth > halook.hdfs.constants.dataNode.maxWidth) {
					this.dataNodeBarWidth = halook.hdfs.constants.dataNode.maxWidth;
				}
				this.dataNodeChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// base numbers for drawing
				halook.HDFS.center = {
					x : viewArea2.width / 3,
					y : viewArea2.height / 1.8 - 90
				};
				this.angleUnit = halook.utility.toRadian(360 / this.numberOfDataNode);

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
			_getDataNodeColor : function(status) {
				if (status == halook.hdfs.constants.dataNode.status.good) {
					return halook.hdfs.constants.dataNode.color.good;
				} else if (status == halook.hdfs.constants.dataNode.status.full) {
					return halook.hdfs.constants.dataNode.color.full;
				} else {
					return halook.hdfs.constants.dataNode.color.dead;
				}
			},
			destroy : function() {
				this.stopRegisterCollectionEvent();
				var appView = ENS.AppView();
				appView.stopSyncData([halook.HDFS.treeSettingId + '%']);
				if (this.collection) {
					this.collection.reset();
				}
			}
		});

_.bindAll(wgp.MapView);