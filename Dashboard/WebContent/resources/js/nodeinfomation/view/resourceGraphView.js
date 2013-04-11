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
ENS.ResourceGraphElementView = wgp.DygraphElementView.extend({
	initialize : function(argument, treeSettings) {
		this.isRealTime = true;
		this._initData(argument, treeSettings);

		var appView = new ENS.AppView();
		appView.addView(this, argument.graphId);
		this.render();
		this.registerCollectionEvent();

		if (!this.noTermData) {
			var startTime = new Date(new Date().getTime() - this.term * 1000);
			var endTime = new Date();
			appView.getTermData([ this.graphId ], startTime, endTime);
		}

		var realTag = $("#" + this.$el.attr("id"));
		if (this.width == null) {
			this.width = realTag.width();
		} else {
			realTag.width(this.width);
		}
		if (this.height == null) {
			this.height = realTag.height();
		} else {
			realTag.height(this.height);
		}

		$("#" + this.$el.attr("id")).attr("class", "graphbox");
		$("#" + this.$el.attr("id")).css({
			margin : "10px",
			float : "left"
		});
	},
	_initData : function(argument, treeSettings) {
		var defauldSettings = {
			term : 60 * 30,
			graphMaxNumber : 50,
			maxValue : 100
		};
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new ENS.ResourceGraphCollection();
		this.parentId = argument["parentId"];
		this.term = argument.term;
		this.noTermData = argument.noTermData;
		this.graphId = argument["graphId"];
		this.width = argument["width"];
		this.height = argument["height"];
		this.title = argument["title"];
		this.labelX = "time";
		this.labelY = "value";
		this.rootView = argument["rootView"];
		this.graphHeight = this.height - ENS.nodeinfo.GRAPH_HEIGHT_MARGIN;
		this.dateWindow = argument["dateWindow"];
		this.maxId = 0;

		 this.graphMaxNumber = 50;//argument.graphMaxNumber;
		 this.maxValue = 100;//argument.maxValue;
	},
	render : function() {
		var data = this.getData();
		var optionSettings = {
			title : this.title,
			xlabel : this.labelX,
			ylabel : this.labelY,
			axisLabelColor : "#FFFFFF",
			labelsDivStyles : {
				background: "none repeat scroll 0 0 #000000"
			}
		};

		this.attributes = undefined;
		var attributes = this.getAttributes(ENS.ResourceGraphAttribute);

		optionSettings = $.extend(true, optionSettings, attributes);

		var element = document.getElementById(this.$el.attr("id"));
		this.entity = new Dygraph(element, data, optionSettings);
		this.entity.resize(this.width, this.graphHeight);
		$("#" + this.$el.attr("id")).height(this.height);
		this.getGraphObject().updateOptions({
			dateWindow : this.dateWindow,
			axisLabelFontSize : 10,
			titleHeight : 22
		});
	},
	onAdd : function(graphModel) {
		
		if (this.isRealTime) {
			if (this.collection.length > this.graphMaxNumber) {
				this.collection.shift(wgp.constants.BACKBONE_EVENT.SILENT);
			}
			this.data = this.getData();
			var updateOption = {
				'file' : this.data
			};
			if (this.data.length != 0) {
				updateOption['dateWindow'] = [ this.data[1][0],
						this.data[this.data.length - 1][0] ];
			}
			this.entity.updateOptions(updateOption);
		}
	},
	addCollection : function(dataArray) {
		if (dataArray != null) {
			var instance = this;
			_.each(dataArray, function(data, index) {
				var model = new instance.collection.model({
					dataId : instance.maxId,
					data : data
				});
				instance.collection.add(model,
						wgp.constants.BACKBONE_EVENT.SILENT);
				instance.maxId++;
			});
		}
	},
	_getTermData : function() {
		this.data = this.getData();
		var updateOption = {
			'file' : this.data,
		};
		this.entity.updateOptions(updateOption);
		
		var tmpAppView = new ENS.AppView();
		tmpAppView.syncData([ this.graphId ]);
	},
	onComplete : function(syncType) {
		if (syncType = wgp.constants.syncType.SEARCH) {
			this._getTermData();
		}
	},
	getData : function() {

		var data = [];
		var instance = this;
		data.push([ new Date(0), null, null, null, null, null, null, null,
				null, null, null, null, null, null, null, null ]);
		_.each(this.collection.models, function(model, index) {
			data.push(instance._parseModel(model));
		});
		return data;
	},
	getRegisterId : function() {
		return this.graphId;
	},
	getGraphObject : function() {
		return this.entity;
	},
	updateDisplaySpan : function(from, to) {
		var startDate = new Date().getTime() - from;
		var endDate = new Date().getTime() - to;
		this.getGraphObject().updateOptions({
			dateWindow : [ startDate, endDate ]
		});

	},
	updateGraphData : function(graphId, from, to) {
		if (to == 0) {
			this.isRealTime = true;
		} else {
			this.isRealTime = false;
		}
		
		var startTime = new Date(new Date().getTime() - from);
		var endTime = new Date(new Date().getTime() - to);
		appView.getTermData([ graphId ], startTime, endTime);
	},
	_parseModel : function(model) {
		var timeString = model.get("measurementTime");
		var time = parseInt(timeString);
		var date = new Date(time);
		var valueString = model.get("measurementValue");
		var value = parseFloat(valueString);
		if (this.maxValue < value) {
			this.maxValue = value;
		}
		return [ date, value ];
	}

});