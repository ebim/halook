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
var angle = 0;
var HDFSView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSetting) {
				
				
				this.hdfsDataList_ = {};
				this.hdfsState_ = {};
				this.hostsList_ = [];
				this.lastMeasurementTime_ = 0;
				this.oldestMeasurementTime_ = 0;
				this.capacityMax_ = 1;
				this.treeSettingId_;
				// vars
				// setting view type
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				// set bg color and height
				this._initView();

				this.isRealTime = true;

				this.treeSettingId_ = treeSetting.id;

				var appView = wgp.AppView();
				appView.addView(this, this.treeSettingId_ + '%');
				// set paper
				this.render();
				// リアルタイム通信の受け口を作る
				this.registerCollectionEvent();

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

				// init collection
				// this.collection = new MapElementList();
				// if (argument["collection"]) {
				// this.collection = argument["collection"];
				// }
				// init view collection
				this.viewCollection = {};

				// bind event
				// this.registerCollectionEvent();
				// console.log(this.collection);

				// init ids for view on this view
				this.maxId = 0;
				this.nextId = -1;

				// drawing
				// non-raphael elements
				// add slider
				this._addSlider(this);

				// add div for data node status popup
				this._addStatusPopup();

				// TODO モックデータを本データにし、表示させる
				// this._addClusterStatus();

				var end = new Date();
				var start = new Date(end.getTime() - 15000);
				appView
						.getTermData([ (this.treeSettingId_ + '%') ], start,
								end);

			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_staticRender : function() {
				// drawing static object
				// core circle (name node)
				// console.log(this.paper);
				this.paper
						.circle(
								this.center.x,
								this.center.y,
								halook.hdfs.constants.mainCircle.radius
										* halook.hdfs.constants.mainCircle.innerRate)
						.attr(
								{
									"fill" : halook.hdfs.constants.dataNode.color.good,
									"stroke" : halook.hdfs.constants.dataNode.frameColor
								});

				this.paper.circle(
						this.center.x,
						this.center.y,
						halook.hdfs.constants.mainCircle.radius
								- halook.hdfs.constants.rack.height / 2).attr({
					"stroke" : halook.hdfs.constants.dataNode.frameColor,
					"stroke-width" : halook.hdfs.constants.rack.height / 2
				});

				// data node capacity bars
				this._drawCapacity();

				// rack
				this._drawRack();

				this._drawUsage();

				/*
				 * var mainCircleInterval = function(windowId){ function
				 * innerFunction(){ this._notifyToThisView(this.rackMarker) };
				 * return innerFunction; };
				 */
				// rack
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			render : function() {
				// set paper
				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.width, this.height);
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			onAdd : function(mapElement) {
				this._updateDraw();
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			onChange : function(mapElement) {
				this.viewCollection[mapElement.id].update(mapElement);
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			onRemove : function(mapElement) {
				var objectId = mapElement.get("objectId");
				this.viewCollection[objectId].remove(mapElement);
				delete this.viewCollection[objectId];
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			getTermData : function() {
				this._updateDraw();
				if (this.isRealTime) {
					appView.syncData([ (this.treeSettingId_ + "%") ]);
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_initView : function() {
				// enlarge area
				$("#contents_area_0").css("height", 600);

				// set bg olor
				$("#" + this.$el.attr("id")).css("background-color",
						halook.hdfs.constants.bgColor);
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_setHdfsDataList : function() {
				var instance = this;
				// delete data ignore old last update date.
				var tmpUpdateLastTime = 0;
				_.each(this.hdfsDataList_, function(data, time) {
					var tmpTime = parseInt(time);
					if (tmpUpdateLastTime < tmpTime) {
						tmpUpdateLastTime = tmpTime;
					}
				});

				if (tmpUpdateLastTime != 0) {
					this.oldestMeasurementTime_ = tmpUpdateLastTime;
					_.each(this.hdfsDataList_, function(data, time) {
						var tmpTime = parseInt(time);
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
							var tmpTime = parseInt(measurementTime);
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
							var tmpTime = parseInt(measurementTime);
							if (lastupdatestartTime > tmpTime) {
								removeTargetList.push(model);
							}
						});
				this.collection.remove(removeTargetList, {
					silent : true
				})
				// create measurement data set.
				_
						.each(
								this.collection.models,
								function(model, id) {
									var measurementItemName = model
											.get(halook.ID.MEASUREMENT_ITEM_NAME);
									var measurementItemNameSplit = measurementItemName
											.split("/");
									var hostname = measurementItemNameSplit[2];
									var valueType = measurementItemNameSplit[3];
									var measurementValue = Number(model
											.get(halook.ID.MEASUREMENT_VALUE));
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
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_setHdfsState : function() {
				// set hdfsState as the last data in hdfsDataList
				if (this.hdfsDataList_[this.lastMeasurementTime_]) {
					this.hdfsState_ = this.hdfsDataList_[this.lastMeasurementTime_];
				} else {
					this.hdfsState_ = {};
				}

				// set hostsList
				this.hostsList_ = [];
				for ( var host in this.hdfsState_) {
					if (host != halook.hdfs.constants.hostnameAll) {
						this.hostsList_.push(host);

						// set capacityMax
						if (this.hdfsState_[host]["capacity"] > this.capacityMax_) {
							this.capacityMax_ = this.hdfsState_[host]["capacity"];
						}
					}
				}

				// set the length to display
				for ( var host in this.hdfsState_) {
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
					// hdfsState[host].dfsusedLength = 50;
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_addSlider : function(self) {
				// dual slider area (add div and css, and make slider)
				$("#" + this.$el.attr("id")).parent().prepend(
						'<div id="slider"></div>');
				$('#slider').css(halook.nodeinfo.parent.css.dualSliderArea);
				$('#slider').css(halook.nodeinfo.parent.css.dualSliderArea);
				this.singleSliderView = new halook.SingleSliderView({
					id : "slider",
					rootView : this
				});

				this.singleSliderView.setScaleMovedEvent(function(pastTime) {
					self.updateDisplaySpan(pastTime);
				});
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
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
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
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
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_launchAnimation : function() {
				// start animation in real time mode
				var self = this;
				setTimeout(self.dataNodeInterval("#" + this.$el.attr("id")), 10);
				setTimeout(self
						.blockTransferInterval("#" + this.$el.attr("id")), 10);
				this.timerDn = setInterval(self.dataNodeInterval("#"
						+ this.$el.attr("id")), halook.hdfs.constants.cycle
						+ halook.hdfs.constants.cycleInterval);
				this.timerBt = setInterval(self.blockTransferInterval("#"
						+ this.$el.attr("id")), halook.hdfs.constants.cycle
						+ halook.hdfs.constants.cycleInterval);
				// setInterval(function(){console.log("objects :
				// "+self.maxId);},halook.hdfs.constants.cycle);
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_killAnimation : function() {
				// stop animation
				clearInterval(this.timerDn);
				clearInterval(this.timerBt);
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_drawStaticDataNode : function(pastTime) {
				var end = new Date(new Date().getTime() - pastTime);
				var start = new Date(end.getTime() - 60 * 60 * 1000);
				appView.stopSyncData([ (this.treeSettingId_ + '%') ]);
				// TODO コレクションをリセットする
				// appView.collections["/hdfs%"] = {};
				appView
						.getTermData([ (this.treeSettingId_ + '%') ], start,
								end);
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_setBlockTransferLoop : function(self) {
				self.transfer = [];

				self.blockTransferInterval = function(windowId) {
					function innerFunction() {
						// actual process to loop
						if (self.blockTransferChangeType == wgp.constants.CHANGE_TYPE.ADD) {
							self._addBlockTransfer(self);
							self.blockTransferChangeType = wgp.constants.CHANGE_TYPE.UPDATE;
						} else {
							self._updateBlockTransfer(self);
						}
						var addData = [ {
							windowId : windowId,
							data : self.transfer
						} ];
						appView.notifyEvent(addData);
					}
					return innerFunction;
				};
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_addBlockTransfer : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.transfer[i] = {};
					self.nextId = self._getUniqueId();
					self.transfer[i].objectId = self.transfer[i].id = self.nextId;
					self.transfer[i].size = 1;// 0;//self.diff[i];
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
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
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
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_updateDataNode : function(self) {
				// /////temporary function: renew input data
				// setDataFromServer();
				// /////temporary function: renew input data
				for ( var i = 0; i < self.numberOfDataNode; i++) {

					if (this.hdfsState_[this.hostsList_[i]] != undefined) {
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
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_getUniqueId : function() {
				// return next id
				this.nextId++;
				return this.nextId;
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_drawCapacity : function() {
				// prepare temporary vars in order to make codes readable
				var r = halook.hdfs.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var capacity = this.hdfsState_[this.hostsList_[i]].capacityLength;
					var cos = Math.cos(this.angleUnit * i);
					var sin = Math.sin(this.angleUnit * i);
					var c = this.center;
					// actual process
					this.paper
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
										stroke : halook.hdfs.constants.dataNode.frameColor,
										fill : " rgb(48, 50, 50)",
										title : this.hostsList_[i]
												+ " : remaining"
									});
							
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_drawRack : function() {
				// prepare temporary vars in order to make codes readable
				var r = halook.hdfs.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;
				var lastRack = "";
				var numberOfRackColor = halook.hdfs.constants.rack.colors.length;
				var colorNo = -1;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					if (lastRack != "default") {
						colorNo++;
						lastRack = "default";
					}
					// prepare temporary vars in order to make codes readable
					var h = halook.hdfs.constants.rack.height;
					var cos = Math.cos(this.angleUnit * i);
					var sin = Math.sin(this.angleUnit * i);
					var c = this.center;
					// actual process
					this.paper
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
										stroke : halook.hdfs.constants.rack.colors[colorNo
												% numberOfRackColor],
										fill : halook.hdfs.constants.rack.colors[colorNo
												% numberOfRackColor]
									});

				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_drawUsage : function() {
				// prepare temporary vars in order to make codes readable
				var r = halook.hdfs.constants.mainCircle.radius;
				var w = this.dataNodeBarWidth;

				for ( var i = 0; i < this.numberOfDataNode; i++) {
					// prepare temporary vars in order to make codes readable
					var h = this.hdfsState_[this.hostsList_[i]].dfsusedLength;
					var cos = Math.cos(this.angleUnit * i);
					var sin = Math.sin(this.angleUnit * i);
					var c = this.center;
					var dfsStatus = this.hdfsState_[this.hostsList_[i]].status;
					// actual process
					var rect = this.paper.path(
							[
									[ "M", (c.x + r * cos + w / 2 * sin),
											(c.y - r * sin + w / 2 * cos) ],
									[ "l", (h * cos), (-h * sin) ],
									[ "l", (-w * sin), (-w * cos) ],
									[ "l", (-h * cos), (h * sin) ] ]).attr({
						"stroke" : halook.hdfs.constants.dataNode.frameColor,
						fill : this._getDataNodeColor(dfsStatus),
						title : this.hostsList_[i] + " : used"
					});
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_initIdManager : function() {
				// id manager prototype
				function IdManager() {
					this.ids = [];
					this.add = function(number, host) {
						this.ids[host] = number;
					};
					this.remove = function(host) {
						delete (this.ids[number]);
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
				if (pastTime == 0) {

					if (this.isRealTime == false) {
						appView.syncData([ (this.treeSettingId_ + "%") ]);
					}
					this.isRealTime = true;

					var end = new Date();
					var start = new Date(end.getTime() - 60 * 60 * 1000);
					appView.getTermData([ (this.treeSettingId_ + '%') ], start,
							end);
					// self._launchAnimation();
				} else {
					this.isRealTime = false;
					this._drawStaticDataNode(pastTime);
				}

			},
			_updateDraw : function() {

				// set hdfsDataList from this.collection.models
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

				// set hdfsState as the last data in hdfsDataList
				this._setHdfsState();

				// data node
				this.numberOfDataNode = this.hostsList_.length;
				this.dataNodeBarWidth = halook.hdfs.constants.mainCircle.radius
						* 2 * Math.PI / this.numberOfDataNode;
				if (this.dataNodeBarWidth > halook.hdfs.constants.dataNode.maxWidth) {
					this.dataNodeBarWidth = halook.hdfs.constants.dataNode.maxWidth;
				}
				this.dataNodeChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// base numbers for drawing
				this.center = {
					x : viewArea2.width / 2,
					y : viewArea2.height / 2 - 90
				};
				this.angleUnit = utility.toRadian(360 / this.numberOfDataNode);

				// block transfer
				this.blockTransferChangeType = wgp.constants.CHANGE_TYPE.ADD;

				// id manager
				this._initIdManager();

				// /////temporary function: renew input data
				// setDataFromServer();
				// /////temporary function: renew input data

				// raphael elements
				// static objects
				this._staticRender();

				// prepare for animation
				// block transfer
				// this._setBlockTransferLoop(this);
				// data node
				// this._setDataNodeLoop(this);

				// launch animation
				// this._launchAnimation();
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_getDataNodeColor : function(status) {
				if (status == halook.hdfs.constants.dataNode.status.good) {
					return halook.hdfs.constants.dataNode.color.good;
				} else if (status == halook.hdfs.constants.dataNode.status.full) {
					return halook.hdfs.constants.dataNode.color.full;
				} else {
					return halook.hdfs.constants.dataNode.color.dead;
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_notifyToThisView : function(data) {
				var addData = [ {
					windowId : windowId,
					data : data
				} ];
				appView.notifyEvent(addData);
			}
		});

_.bindAll(wgp.MapView);