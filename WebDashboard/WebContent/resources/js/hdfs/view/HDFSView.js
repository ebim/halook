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

// //////////////////////////////////////////////////////////
// option start
// //////////////////////////////////////////////////////////
halook.hdfs = {};
halook.hdfs.constants = {};

halook.hdfs.constants.cycle = 5000;

halook.hdfs.constants.bgColor = "#303232";

halook.hdfs.constants.mainCircle = {};
halook.hdfs.constants.mainCircle.radius = 140;
halook.hdfs.constants.mainCircle.innerRate = 0.2;
halook.hdfs.constants.mainCircle.transferLineColor = "#EEEEEE";

halook.hdfs.constants.dataNode = {};
halook.hdfs.constants.dataNode.maxWidth = 60;
halook.hdfs.constants.dataNode.maxLength = 130;
halook.hdfs.constants.dataNode.frameColor = "rgba(255,255,255,0.5)";
halook.hdfs.constants.dataNode.color = {
	good : "#0C80A0",
	full : "#F09B4A",
	dead : "#AE1E2F"
};

halook.hdfs.constants.blockTransfer = {};
halook.hdfs.constants.blockTransfer.width = 4;
halook.hdfs.constants.blockTransfer.colorThreshold = 0.9;

halook.hdfs.constants.rack = {};
halook.hdfs.constants.rack.height = 10;
halook.hdfs.constants.rack.colors = [ "#666666", "#AAAAAA", "#CCCCCC" ];
// //////////////////////////////////////////////////////////
// option end
// //////////////////////////////////////////////////////////
halook.hdfs.constants.dataNode.status = {};
halook.hdfs.constants.dataNode.status.good = 0;
halook.hdfs.constants.dataNode.status.full = 1;
halook.hdfs.constants.dataNode.status.dead = 2;
halook.hdfs.constants.cycleInterval = 2000;
halook.hdfs.constants.hostnameAll = "--all--";

halook.hdfs.START_DATE = new Date(2012, 8, 15);// 9/15の0時
halook.hdfs.END_DATE = new Date(2012, 8, 18);// 9/18の0時

// HDFS usage data.
// key: measurement time (long)
// value: HDFS usage data at that time.
//        key: hostname
//        value: HDFS usage for the host
//               dfsused, dfsremaining
var hdfsDataList = {};

// oldest and newest time
var lastMeasurementTime = 0;
var oldestMeasurementTime = 0;

// hdfsState which is displayed
var hdfsState = {};

// list of hostnames
var hostsList = [];

// the biggest capacity 
var capacityMax = 1;

// ////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////
HDFSView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSetting) {
				// vars
				// setting view type
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				// set bg color and height
				this._initView();

				var appView = wgp.AppView();
				appView.addView(this, treeSetting.id + '%');
				appView.getTermData([ (treeSetting.id + '%') ],
						halook.hdfs.START_DATE, halook.hdfs.END_DATE);

				console.log(this.collection);
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
//				this.collection = new MapElementList();
//				if (argument["collection"]) {
//					this.collection = argument["collection"];
//				}
				// init view collection
				this.viewCollection = {};

				// bind event
//				this.registerCollectionEvent();
//				console.log(this.collection);

				
				// init ids for view on this view
				this.maxId = 0;
				this.nextId = -1;
				
				// set hdfsDataList from this.collection.models
				this._setHdfsDataList();
				
				// set hdfsState as the last data in hdfsDataList
				this._setHdfsState();

				// data node
				this.numberOfDataNode = hostsList.length;
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

				// drawing
				// non-raphael elements
				// add slider
				this._addSlider();

				// add div for data node status popup
				this._addStatusPopup();

				// add div for cluster status
				this._addClusterStatus();

				// set paper
				this.render();

				// raphael elements
				// static objects
				this._staticRender();

				// prepare for animation
				// block transfer
				this._setBlockTransferLoop(this);
				// data node
				this._setDataNodeLoop(this);

				// launch animation
				this._launchAnimation();

				var end = new Date();
				var start = new Date(end.getTime() - 10000);
				appView.getTermData([ treeSetting.id + '%' ], start, end);
				// //////////////////////////////////////////////////////
				// //////////////////////////////////////////////////////
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
				var id = mapElement.id;
				if (id == null) {
					id = this.maxId;
					this.maxId++;

					var idAttributeName = mapElement.idAttribute;
					mapElement.set({
						idAttributeName : id
					}, {
						silent : true
					});
				} else {
					if (id > this.maxId) {
						this.maxId = id + 1;
					}
				}

				// if same id exists, process as change event
				if (this.viewCollection[id]) {
					this.viewCollection[id].destory();
					console.log(id + " already Exists");
				}
				var objectName = "wgp." + mapElement.get("objectName");
				var view = eval("new " + objectName
						+ "({model:mapElement, paper:this.paper})");
				this.viewCollection[id] = view;
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
				// 型変換を行う
				console.log("getTermData");
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
				var numberOfCollections = this.collection.models.length;
				hdfsDataList = new Array();
				for ( var index = 0; index < numberOfCollections; index++) {
					var attribute = this.collection.models[index].attributes;
					var measurementTime = attribute.measurementTime;
					var measurementItemNameSplit = attribute.measurementItemName.split("/");
					var hostname = measurementItemNameSplit[2];
					var valueType = measurementItemNameSplit[3];
					var measurementValue = Number(attribute.measurementValue);
					if (hdfsDataList[measurementTime]){
						if (hdfsDataList[measurementTime][hostname]){
							hdfsDataList[measurementTime][hostname][valueType] = measurementValue;
							hdfsDataList[measurementTime][hostname]["capacity"] += measurementValue;
						}
						else {
							hdfsDataList[measurementTime][hostname]= new Array();
							hdfsDataList[measurementTime][hostname][valueType] = measurementValue;
							hdfsDataList[measurementTime][hostname]["capacity"] = measurementValue;
						}
					}
					else {
						hdfsDataList[measurementTime] = new Array();
						var entry = new Array();
						entry[valueType] = measurementValue;
						entry["capacity"] = measurementValue;
						hdfsDataList[measurementTime][hostname] = entry;
						
						// get newest measurement time
						lastMeasurementTime = measurementTime;
					}
					// get oldest measurement time
					if (index == 0){
						oldestMeasurementTime = measurementTime;
					}
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_setHdfsState : function() {
				// set hdfsState as the last data in hdfsDataList
				if (hdfsDataList[lastMeasurementTime]) {
					hdfsState = hdfsDataList[lastMeasurementTime];
				}
				
				// set hostsList
				hostsList = [];
				for (var host in hdfsState){
					if (host != halook.hdfs.constants.hostnameAll){
						hostsList.push(host);
						
						// set capacityMax
						if (hdfsState[host]["capacity"] > capacityMax){
							capacityMax = hdfsState[host]["capacity"];
						}
					}
				}

				// set the length to display
				for (var host in hdfsState){
					hdfsState[host].capacityLength = halook.hdfs.constants.dataNode.maxLength *
							hdfsState[host]["capacity"] / capacityMax;
					hdfsState[host].dfsusedLength = halook.hdfs.constants.dataNode.maxLength *
							hdfsState[host]["dfsused"] / capacityMax;
					if ( hdfsState[host]["dfsused"] / capacityMax > 
							halook.hdfs.constants.blockTransfer.colorThreshold){
						hdfsState[host].status = halook.hdfs.constants.dataNode.status.full;
					}
					else {
						hdfsState[host].status = halook.hdfs.constants.dataNode.status.good;
					}
//					hdfsState[host].dfsusedLength = 50;
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_addSlider : function() {
				// slider on the top
				$("#" + this.$el.attr("id")).parent().prepend(
						'<div id="slider" '
								+ 'style="width:800px; margin:15px;">'
								+ '</div>');

				// area to show slider value
				$("#" + this.$el.attr("id"))
						.parent()
						.prepend(
								'<div '
										+ 'style="color:white; margin:15px 0px 0px 15px;">'
										+ '<b id="sliderValue">Real time view</b>'
										+ '</div>');
				var self = this;
				// set slider option and event
				$('#slider').slider({
					min : 0,
					max : 100,
					value : 100,
					change : function(event, ui) {
						self._killAnimation();

						if (ui.value == 100) {
							$('#sliderValue').html("Real time view");
							self._launchAnimation();
						} else {
							$('#sliderValue').html(ui.value);
							self._drawStaticDataNode();
						}
					}
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
			_drawStaticDataNode : function() {
				// draw static data node bar when the slider value is set to
				// past date
				// /////temporary function: renew input data
				// setDataFromServer();
				// /////temporary function: renew input data
				setTimeout(this.dataNodeInterval("#" + this.$el.attr("id")),
						100);
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
									hostsList[i]);
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
							.find(hostsList[i]);
					self.transfer[i].size = self.diff[i];
				}
				_.each(self.transfer, function(obj) {
					obj.type = self.blockTransferChangeType;
				});
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_setDataNodeLoop : function(self) {
				self.currentDataNode = [];
				self.diff = [];

				self.dataNodeInterval = function(windowId) {
					function innerFunction() {
						// /////temporary function: renew input data
						// setDataFromServer();
						// /////temporary function: renew input data
						if (self.dataNodeChangeType == wgp.constants.CHANGE_TYPE.ADD) {
							self._addDataNode(self);
							self.dataNodeChangeType = wgp.constants.CHANGE_TYPE.UPDATE;
						} else {
							self._updateDataNode(self);
						}
						var addData = [ {
							windowId : windowId,
							data : self.currentDataNode
						} ];
						appView.notifyEvent(addData);
					}
					;
					return innerFunction;
				};
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_addDataNode : function(self) {
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.nextId = self._getUniqueId();
					self.currentDataNode[i] = {
						objectId : self.nextId,
						id : self.nextId,
						width : self.dataNodeBarWidth,
						height : hdfsState[hostsList[i]].dfsusedLength,
						angle : self.angleUnit * i,
						host : hdfsState[hostsList[i]],
						capacity : hdfsState[hostsList[i]].capacityLength,
						type : wgp.constants.CHANGE_TYPE.ADD,
						objectName : "DataNodeRectangle",
						center : self.center
					};
					self.dataNodeIdManager.add(self.nextId,
							hostsList[i]);
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_updateDataNode : function(self) {
				// /////temporary function: renew input data
				// setDataFromServer();
				// /////temporary function: renew input data
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.diff[i] = hdfsState[hostsList[i]].dfsusedLength
							- self.currentDataNode[i].height;
					self.currentDataNode[i] = {
						type : wgp.constants.CHANGE_TYPE.UPDATE,
						objectId : self.dataNodeIdManager
								.find(hostsList[i]),
						id : self.dataNodeIdManager
								.find(hostsList[i]),
						height : hdfsState[hostsList[i]].dfsusedLength,
						diff : self.diff[i]
					};
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
					var capacity = hdfsState[hostsList[i]].capacityLength;
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
										stroke : halook.hdfs.constants.dataNode.frameColor
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
					var h = hdfsState[hostsList[i]].dfsusedLength;
					var cos = Math.cos(this.angleUnit * i);
					var sin = Math.sin(this.angleUnit * i);
					var c = this.center;
					var dfsStatus = hdfsState[hostsList[i]].status;
					// actual process
					this.paper
							.path(
									[
											[
													"M",
													(c.x + r * cos + w
															/ 2 * sin),
													(c.y - r * sin + w
															/ 2 * cos) ],
											[ "l", (h * cos), (-h * sin) ],
											[ "l", (-w * sin), (-w * cos) ],
											[ "l", (-h * cos), (h * sin) ] ])
							.attr(
									{
										"stroke" : halook.hdfs.constants.dataNode.frameColor,
										fill : this._getDataNodeColor(dfsStatus)
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