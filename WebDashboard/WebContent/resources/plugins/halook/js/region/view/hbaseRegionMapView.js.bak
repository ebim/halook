halook.HbaseRegionMapView = wgp.AbstractView.extend({
	initialize : function(argument) {
		// set view size
		var viewAttribute = argument.rootView.options.viewAttribute

		this.isRealTime = viewAttribute.realTime;
		this.width = viewAttribute.width;
		this.startXAxis = viewAttribute.startXAxis;
		this.startYAxis = viewAttribute.startYAxis;
		this.textStartX = viewAttribute.textStartX;
		this.textStartY = viewAttribute.textStartY;
		this.yDivisionChartSize = viewAttribute.yDivisionChartSize;
		this.yUnitDivisionCount = viewAttribute.yUnitDivisionCount;
		this.graphMaxValue = viewAttribute.graphMaxValue;
		this.colorList = viewAttribute.colorList;

		this.lastTimeRegionNum = {};
		this.graphRect = [];

		this.treeSetting = argument.treeSettings;

		var realTag = $("#" + this.$el.attr("id"));
		if (this.width == null) {
			this.width = realTag.width();
		}
		if (this.height == null) {
			this.height = realTag.height();
		}
		var appView = wgp.AppView();
		appView.addView(this, this.treeSetting.treeId + '%');

		var end = new Date();
		var start = new Date(end.getTime() - 15000);
		appView.getTermData([ (this.treeSetting.treeId + '%') ], start, end);

		// set paper
		this.render();

	},
	render : function() {
		this.paper = new Raphael(document.getElementById(this.$el.attr("id")),
				this.width, this.height);

		var yProperty = new wgp.MapElement({
			objectId : 1,
			objectName : "wgp.MapStateElementView",
			pointX : this.startXAxis,
			pointY : 0,
			width : 0,
			height : this.startYAxis
		});

		new halook.hbaseRegionMapAxisStateElementView({
			model : yProperty,
			paper : this.paper
		});

		var xProperty = new wgp.MapElement({
			objectId : 2,
			objectName : "wgp.MapElementView",
			pointX : this.startXAxis,
			pointY : this.startYAxis,
			width : this.width,
			height : 0,
		});

		new halook.hbaseRegionMapAxisStateElementView({
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
	onComplete : function() {
		this.data = this._getData();

		var maxRegionNum = this._createMap();
		this._drawYDivision(maxRegionNum);
	},
	getTermData : function() {
		// this._updateDraw();
		if (this.isRealTime) {
			appView.syncData([ (this.treeSetting.treeId + "%") ]);
		}

		this.data = this._getData();

		var maxRegionNum = this._createMap();

		this._drawYDivision(maxRegionNum);
	},
	destroy : function() {
		// ツリー移動時に呼ばれる
		this.stopRegisterCollectionEvent();
	},
	_getData : function() {

		var instance = this;

		var collectionModels = this.collection.models;

		collectionModels.sort();

		var lastTime = this._getLastTime(collectionModels);
		var lastUpdateTime = this
				._getLastUpdateTime(collectionModels, lastTime)

		var data = {};

		_.each(collectionModels, function(model, index) {
			var timeString = model.get("measurementTime");
			var time = parseInt(timeString);

			if (time == lastTime) {
				var parsedModel = instance._parseModel(model);

				var serverName = parsedModel.serverName;

				var dataList = data[serverName];

				if (dataList == undefined) {
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

				data[serverName] = dataList;
			}
		});

		// set Last Update Time.
		this.lastMeasurementTime_ = lastTime;

		var serverNameArray = [];
		for ( var serverName in data) {
			serverNameArray.push(serverName);
		}

		// 以下でサーバ名でのソートをを行う
		serverNameArray.sort();
		var serverNameArrayLength = serverNameArray.length;

		var tmpData = {};
		for ( var index = 0; index < serverNameArrayLength; index++) {
			var serverName = serverNameArray[index];
			tmpData[serverName] = data[serverName];
		}

		data = tmpData;

		return data;
	},
	_parseModel : function(model) {
		var timeString = model.get("measurementTime");
		var time = parseInt(timeString);
		var date = new Date(time);

		var treePath = model.get("measurementItemName");
		var pathList = treePath.split("/");
		var serverName = pathList[4];
		var tableName = pathList[3];

		var valueString = model.get("measurementValue");
		var value = parseFloat(valueString);
		if (this.maxValue < value) {
			this.maxValue = value;
		}
		return {
			date : date,
			tableName : tableName,
			serverName : serverName,
			regionNum : value
		};
	},
	_getLastTime : function(collectionModels) {
		var lastTime = 0;

		_.each(collectionModels, function(model, id) {
			var measurementTime = model.get(halook.ID.MEASUREMENT_TIME);
			var tmpTime = parseInt(measurementTime);
			if (lastTime < tmpTime) {
				lastTime = tmpTime;
			}
		});

		return lastTime;
	},
	_getLastUpdateTime : function(collectionModels, lastTime) {
		var lastupdateTime = 0;

		_.each(collectionModels, function(model, id) {
			var measurementTime = model.get(halook.ID.MEASUREMENT_TIME);
			var tmpTime = parseInt(measurementTime);
			if ((lastupdateTime < tmpTime) && (lastTime != tmpTime)) {
				lastupdateTime = tmpTime;
			}
		});

		return lastupdateTime;
	},
	_createMap : function() {

		var serverNum = 0;
		var data = this.data;
		var maxRegionNum = 0;

		var tableColor = {};
		var colorCount = 0;
		var colorList = this.colorList;

		for ( var serverName in data) {
			var regionList = data[serverName];
			var length = regionList.length;
			var regionNum = 0;

			for ( var index = 0; index < length; index++) {
				var region = regionList[index];
				regionNum += region.regionNum;

				var tableName = region.tableName;

				if (tableColor[tableName] == undefined) {
					tableColor[tableName] = colorList[colorCount
							% colorList.length];
					colorCount++;
				}
			}

			if (maxRegionNum < regionNum) {
				maxRegionNum = regionNum;
			}

			serverNum++;
		}
		
		// グラフの倍率
		var magnification = 0;
			
		// 外枠と内側のグラフで、高さが高い方を基準にグラフの倍率を決める
		if (maxRegionNum < this.lastMaxRegionNum) {
			magnification = this.graphMaxValue / this.lastMaxRegionNum;
		} else {
			magnification = this.graphMaxValue / maxRegionNum;
		}
		
		this.lastMaxRegionNum = maxRegionNum;

		var unitAreaWidth = (this.width - this.startXAxis) / serverNum;
		var unitNodeWidth = unitAreaWidth * 0.3;
		var unitLastNodeWidth = unitAreaWidth * 0.1;

		var count = 0;

		var isRemove = false;
		var graphRectLength = this.graphRect.length;

		for ( var index = 0; index < graphRectLength; index++) {
			this.graphRect[index].remove();
			isRemove = true;
		}
		if (isRemove) {
			this.graphRect = [];
		}

		for ( var serverName in this.data) {

			var textStartX = unitAreaWidth * count + unitAreaWidth / 2
					+ this.startXAxis;
			var startX = textStartX - unitNodeWidth / 2;

			var regionNum = this.data[serverName];
			var tableNum = regionNum.length;

			var sumRegionNum = 0;
			var sumHeight = 0;
			for ( var index = 0; index < tableNum; index++) {
				var model = regionNum[index];

				var regionValue = model.regionNum;
				var tableName = model.tableName;
				var serverName = model.serverName;

				var height = regionValue * magnification;

				this.graphRect.push(this.paper.rect(startX,
						this.startYAxis - height - sumHeight, unitNodeWidth,
						height).attr(
						{
							fill : tableColor[tableName],
							title : serverName + ":" + tableName
									+ " regionNumber: " + regionValue
						}));

				sumHeight += height;
				sumRegionNum += regionValue;
			}

			this.graphRect.push(this.paper.text(textStartX, this.textStartY,
					serverName).attr({
				"font-size" : 12
			}));
			
			var lastRegionNum = this.lastTimeRegionNum[serverName];
			
			if (lastRegionNum) {
				// 外枠作成
				var lastHeight = lastRegionNum * magnification;
				
				this.graphRect.push(this.paper.rect(startX - unitLastNodeWidth,
						this.startYAxis - lastHeight, unitNodeWidth + unitLastNodeWidth * 2,
						lastHeight));
			}

			this.lastTimeRegionNum[serverName] = sumRegionNum;

			count++;
		}

		return maxRegionNum;
	},
	_drawStaticRegioniServer : function(pastTime) {
		var treeSettingId = this.treeSetting.treeId;
		var end = new Date(new Date().getTime() - pastTime);
		var start = new Date(end.getTime() - 60 * 60 * 1000);
		appView.stopSyncData([ (treeSettingId + '%') ]);
		appView.getTermData([ (treeSettingId + '%') ], start, end);
	},
	_drawYDivision : function(maxRegionNum) {
		var yUnitSize = this.graphMaxValue / maxRegionNum;

		// １目盛ごとのRegion数
		var eachDivisionRegionNum = Math.ceil(maxRegionNum
				/ this.yUnitDivisionCount);

		// １目盛ごとの幅のサイズ
		var eachDivisionRealSize = eachDivisionRegionNum * yUnitSize;

		// Y軸目盛を描画する
		for ( var count = 1; count <= maxRegionNum; count++) {
			var regionNum = eachDivisionRegionNum * count;
			var sumHeight = eachDivisionRealSize * count;

			var yUnitHeight = this.startYAxis - sumHeight;

			this.graphRect.push(this.paper.path(
					[ [ "M", this.startXAxis, yUnitHeight ],
							[ "l", this.yDivisionChartSize, 0 ] ]).attr({
				stroke : "#000000"
			}));

			this.graphRect.push(this.paper.text(this.textStartX, yUnitHeight,
					regionNum + "").attr({
				"font-size" : 12
			}));

			if (sumHeight > this.graphMaxValue) {
				break;
			}
		}
	}
});