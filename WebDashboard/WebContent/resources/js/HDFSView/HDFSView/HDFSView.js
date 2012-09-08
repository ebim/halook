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
halook.hdfs.constants.dataNode.frameColor = "rgba(255,255,255,0.5)";
halook.hdfs.constants.dataNode.color = {
	good : "#0C80A0",
	full : "#F09B4A",
	dead : "#AE1E2F"
};

halook.hdfs.constants.blockTransfer = {};
halook.hdfs.constants.blockTransfer.width = 4;
halook.hdfs.constants.blockTransfer.colorThreshold = 10;

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
halook.hdfs.sampleDatasJob = {
	StartTime : 1340160591456,
	FinishTime : 1346160991946,
	SubmitTime : 1346160591446,
	JobID : "job_20120907140000_0001",
	JobName : "PiEstimator",
	Status : "KILLED",
};
halook.hdfs.START_DATE = new Date(2012, 8, 5);// 9/5の0時
halook.hdfs.END_DATE = new Date(2012, 8, 8);// 9/6の0時
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
				this.collection = new MapElementList();
				if (argument["collection"]) {
					this.collection = argument["collection"];
				}
				// init view collection
				this.viewCollection = {};

				// bind event
				this.registerCollectionEvent();
				console.log(this.collection);

				
				// init ids for view on this view
				this.maxId = 0;
				this.nextId = -1;

				// data node
				this.numberOfDataNode = dataFromServer.data.length;
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

				// raphael emements
				// static objects
				this._staticRender();

				// prepare for animation
				// block transfer
				this._setBlockTransferLoop(this);
				// data node
				this._setDataNodeLoop(this);

				// launch animation
				// this._launchAnimation();

				// this.
				// //////////////////////////////////////////////////////
				// //////////////////////////////////////////////////////
				// //////////////////////////////////////////////////////
				// //////////////////////////////////////////////////////
				// //////////////////////////////////////////////////////
				// //////////////////////////////////////////////////////
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
			_initView : function() {
				// enlarge area
				$("#contents_area_0").css("height", 600);

				// set bg olor
				$("#" + this.$el.attr("id")).css("background-color",
						halook.hdfs.constants.bgColor);
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
									dataFromServer.data[i].host);
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
							.find(dataFromServer.data[i].host);
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
						height : dataFromServer.data[i].used,
						angle : self.angleUnit * i,
						host : dataFromServer.data[i].host,
						capacity : dataFromServer.data[i].capacity,
						type : wgp.constants.CHANGE_TYPE.ADD,
						objectName : "DataNodeRectangle",
						center : self.center
					};
					self.dataNodeIdManager.add(self.nextId,
							dataFromServer.data[i].host);
				}
			},
			// ////////////////////////////////////////////////////////
			// ////////////////////////////////////////////////////////
			_updateDataNode : function(self) {
				// /////temporary function: renew input data
				// setDataFromServer();
				// /////temporary function: renew input data
				for ( var i = 0; i < self.numberOfDataNode; i++) {
					self.diff[i] = dataFromServer.data[i].used
							- self.currentDataNode[i].height;
					self.currentDataNode[i] = {
						type : wgp.constants.CHANGE_TYPE.UPDATE,
						objectId : self.dataNodeIdManager
								.find(dataFromServer.data[i].host),
						id : self.dataNodeIdManager
								.find(dataFromServer.data[i].host),
						height : dataFromServer.data[i].used,
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
					var capacity = dataFromServer.data[i].capacity;
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
					if (lastRack != dataFromServer.data[i].rack) {
						colorNo++;
						lastRack = dataFromServer.data[i].rack;
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
			},
			getTermData : function() {
				console.log(this.collection);
			}
		});

_.bindAll(wgp.MapView);