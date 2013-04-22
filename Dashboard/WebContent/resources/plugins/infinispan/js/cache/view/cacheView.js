infinispan.cache = {};

infinispan.CacheView = wgp.AbstractView
		.extend({
			initialize : function(argument) {
				// set view option
				var option = argument.rootView.options;

				this.isRealTime = option.realTime;
				this.graphSVGWidth = option.graphSVGWidth;
				this.graphSVGHeight = option.graphSVGHeight;
				this.startXAxis = option.startXAxis;
				this.startYAxis = option.startYAxis;
				this.textStartX = option.textStartX;
				this.textStartY = option.textStartY;
				this.yDivisionChartSize = option.yDivisionChartSize;
				this.yUnitDivisionCount = option.yUnitDivisionCount;
				this.graphMaxValue = option.graphMaxValue;
				this.colorList = option.colorList;
				this.cachePath = option.cachePath;
				this.treeSetting = argument.treeSettings;

				var clusterName = this.treeSetting.treeId.split("/")[1];
				infinispan.cache.treeSettingId = "/" + clusterName + "/%"
						+ this.cachePath;

				this.lastTimeCacheNum = {};
				this.graphRect = [];

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}
				var appView = ENS.AppView();
				appView.addView(this, infinispan.cache.treeSettingId + '%');

				var end = new Date();
				var start = new Date(end.getTime() - 15000);
				appView.getTermData([ (infinispan.cache.treeSettingId + '%') ],
						start, end);

				// set paper
				this.render();
			},
			render : function() {
				this.paper = new Raphael(document.getElementById(this.$el
						.attr("id")), this.graphSVGWidth, this.graphSVGHeight);

				var yProperty = new wgp.MapElement({
					objectId : 1,
					objectName : "wgp.MapStateElementView",
					pointX : this.startXAxis,
					pointY : 0,
					width : 0,
					height : this.startYAxis
				});

				new infinispan.CacheAxisStateElementView({
					model : yProperty,
					paper : this.paper
				});

				var xProperty = new wgp.MapElement({
					objectId : 2,
					objectName : "wgp.MapElementView",
					pointX : this.startXAxis,
					pointY : this.startYAxis,
					width : this.width,
					height : 0
				});

				new infinispan.CacheAxisStateElementView({
					model : xProperty,
					paper : this.paper
				});

			},
			onAdd : function(element) {

			},
			onChange : function(element) {
				console.log('called changeModel (parent)');
			},
			onRemove : function(element) {
				console.log('called removeModel (parent)');
			},
			onComplete : function(type) {
				if (type == wgp.constants.syncType.SEARCH) {
					this._getTermData();
				} else {
					this.data = this._getData();

					var maxCacheNum = this._createMap();
					this._drawYDivision(maxCacheNum);
				}
			},
			_getTermData : function() {
				// this._updateDraw();
				if (this.isRealTime) {
					appView
							.syncData([ (infinispan.cache.treeSettingId + "%") ]);
				}

				this.data = this._getData();

				var maxCacheNum = this._createMap();

				this._drawYDivision(maxCacheNum);
			},
			_getData : function() {

				var instance = this;

				var collectionModels = this.collection.models;

				collectionModels.sort();

				var lastTime = this._getLastTime(collectionModels);
				var lastUpdateTime = this._getLastUpdateTime(collectionModels,
						lastTime);

				var data = {};

				_.each(collectionModels, function(model, index) {
					var timeString = model.get("measurementTime");
					var time = parseInt(timeString, 10);

					if (time == lastTime) {
						var parsedModel = instance._parseModel(model);

						var agentName = parsedModel.agentName;

						var dataList = data[agentName];

						if (dataList === undefined) {
							dataList = [];
						}

						dataList.push(parsedModel);

						dataList.sort(function(a, b) {
							var x = a.tableName;
							var y = b.tableName;
							if (x > y)
								return 1;
							if (x < y)
								return -1;
							return 0;
						});

						data[agentName] = dataList;
					}
				});

				// set Last Update Time.
				this.lastMeasurementTime_ = lastTime;

				var agentNameArray = [];
				for ( var agentName in data) {
					agentNameArray.push(agentName);
				}

				// 以下でサーバ名でのソートをを行う
				agentNameArray.sort();
				var agentNameArrayLength = agentNameArray.length;

				var tmpData = {};
				for ( var index = 0; index < agentNameArrayLength; index++) {
					var tmpServerName = agentNameArray[index];
					tmpData[tmpServerName] = data[tmpServerName];
				}

				data = tmpData;

				return data;
			},
			_parseModel : function(model) {
				var timeString = model.get("measurementTime");
				var time = parseInt(timeString, 10);
				var date = new Date(time);

				var cachePath = this.cachePath;

				var treePath = model.get("measurementItemName");
				var pathList = treePath.split(cachePath);

				var parentTreePath = pathList[0];
				var parentPathList = parentTreePath.split("/");
				var agentName = parentPathList[parentPathList.length - 2];

				var childTreePath = pathList[1];
				var childPathList = childTreePath.split("/");
				var cacheName = childPathList[1];

				var valueString = model.get("measurementValue");
				var value = parseFloat(valueString);
				if (this.maxValue < value) {
					this.maxValue = value;
				}
				return {
					date : date,
					tableName : cacheName,
					agentName : agentName,
					cacheNum : value
				};
			},
			_getLastTime : function(collectionModels) {
				var lastTime = 0;

				_.each(collectionModels, function(model, id) {
					var measurementTime = model
							.get(infinispan.ID.MEASUREMENT_TIME);
					var tmpTime = parseInt(measurementTime, 10);
					if (lastTime < tmpTime) {
						lastTime = tmpTime;
					}
				});

				return lastTime;
			},
			_getLastUpdateTime : function(collectionModels, lastTime) {
				var lastupdateTime = 0;

				_.each(collectionModels, function(model, id) {
					var measurementTime = model
							.get(infinispan.ID.MEASUREMENT_TIME);
					var tmpTime = parseInt(measurementTime, 10);
					if ((lastupdateTime < tmpTime) && (lastTime != tmpTime)) {
						lastupdateTime = tmpTime;
					}
				});

				return lastupdateTime;
			},
			_createMap : function() {

				var serverNum = 0;
				var data = this.data;
				var maxCacheNum = 0;

				var tableColor = {};
				var colorCount = 0;
				var colorList = this.colorList;
				var agentName = "";
				var tableName = "";

				for (agentName in data) {
					var cacheList = data[agentName];
					var length = cacheList.length;
					var cacheNum = 0;

					for ( var cacheIndex = 0; cacheIndex < length; cacheIndex++) {
						var cache = cacheList[cacheIndex];
						cacheNum += cache.cacheNum;

						tableName = cache.tableName;

						if (tableColor[tableName] === undefined) {
							tableColor[tableName] = colorList[colorCount
									% colorList.length];
							colorCount++;
						}
					}

					if (maxCacheNum < cacheNum) {
						maxCacheNum = cacheNum;
					}

					serverNum++;
				}

				// グラフの倍率
				var magnification = 0;

				// 外枠と内側のグラフで、高さが高い方を基準にグラフの倍率を決める
				if (maxCacheNum < this.lastMaxCacheNum) {
					magnification = this.graphMaxValue / this.lastMaxCacheNum;
				} else {
					magnification = this.graphMaxValue / maxCacheNum;
				}

				this.lastMaxCacheNum = maxCacheNum;

				var unitAreaWidth = (this.width - this.startXAxis) / serverNum;
				var unitNodeWidth = unitAreaWidth * 0.3;
				var unitLastNodeWidth = unitAreaWidth * 0.1;

				var count = 0;

				var isRemove = false;
				var graphRectLength = this.graphRect.length;

				for ( var graphRectIndex = 0; graphRectIndex < graphRectLength; graphRectIndex++) {
					this.graphRect[graphRectIndex].remove();
					isRemove = true;
				}
				if (isRemove) {
					this.graphRect = [];
				}

				for (agentName in this.data) {

					var textStartX = unitAreaWidth * count + unitAreaWidth / 2
							+ this.startXAxis;
					var startX = textStartX - unitNodeWidth / 2;

					var tableList = this.data[agentName];
					var tableNum = tableList.length;

					var sumCacheNum = 0;
					var sumHeight = 0;

					// 先に外枠を作成
					var lastCacheNum = this.lastTimeCacheNum[agentName];

					if (lastCacheNum) {
						var lastHeight = lastCacheNum * magnification;

						this.graphRect.push(this.paper.rect(
								startX - unitLastNodeWidth,
								this.startYAxis - lastHeight,
								unitNodeWidth + unitLastNodeWidth * 2,
								lastHeight).attr({
							stroke : "#FFFFFF",
							fill : "#FFFFFF",
							"fill-opacity" : 0.2
						}));
					}
					// 中身を作成する。
					for ( var index = 0; index < tableNum; index++) {
						var model = tableList[index];

						var cacheValue = model.cacheNum;
						tableName = model.tableName;
						agentName = model.agentName;

						var height = cacheValue * magnification;

						this.graphRect.push(this.paper.rect(startX,
								this.startYAxis - height - sumHeight,
								unitNodeWidth, height).attr(
								{
									fill : tableColor[tableName],
									title : agentName + " : " + cacheValue
								}));

						sumHeight += height;
						sumCacheNum += cacheValue;
					}

					this.graphRect.push(this.paper.text(textStartX,
							this.textStartY, agentName).attr({
						"font-size" : 11,
						stroke : "#FFFFFF",
						"text-anchor" : "start"
					}).rotate(45, textStartX, this.textStartY));

					this.lastTimeCacheNum[agentName] = sumCacheNum;

					count++;
				}

				return maxCacheNum;
			},
			_drawStaticCacheiServer : function(pastTime) {
				var treeSettingId = infinispan.cache.treeSettingId;
				var end = new Date(new Date().getTime() - pastTime);
				var start = new Date(end.getTime() - 60 * 60 * 1000);
				appView.stopSyncData([ (treeSettingId + '%') ]);
				appView.getTermData([ (treeSettingId + '%') ], start, end);
			},
			_drawYDivision : function(maxCacheNum) {
				var yUnitSize = this.graphMaxValue / maxCacheNum;

				// １目盛ごとのCache数
				var eachDivisionCacheNum = Math.ceil(maxCacheNum
						/ this.yUnitDivisionCount);

				// １目盛ごとの幅のサイズ
				var eachDivisionRealSize = eachDivisionCacheNum * yUnitSize;

				// Y軸目盛を描画する
				for ( var count = 1; count <= maxCacheNum; count++) {
					var cacheNum = eachDivisionCacheNum * count;
					var sumHeight = eachDivisionRealSize * count;

					var yUnitHeight = this.startYAxis - sumHeight;

					this.graphRect.push(this.paper.path(
							[ [ "M", this.startXAxis, yUnitHeight ],
									[ "l", this.yDivisionChartSize, 0 ] ])
							.attr({
								stroke : "#FFFFFF"
							}));

					this.graphRect.push(this.paper.text(this.textStartX,
							yUnitHeight, cacheNum + "").attr({
						"font-size" : 12,
						stroke : "#FFFFFF",
						"text-anchor" : "end"
					}));

					if (sumHeight > this.graphMaxValue) {
						break;
					}
				}
			},
			destroy : function() {
				this.stopRegisterCollectionEvent();
				var appView = ENS.AppView();
				appView.stopSyncData([ this.treeSetting ]);
				if (this.collection) {
					this.collection.reset();
				}
			}
		});