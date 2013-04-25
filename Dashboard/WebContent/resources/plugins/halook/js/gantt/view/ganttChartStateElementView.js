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
halook.ganttchart = {};

halook.ganttchartStateElementView = Backbone.View.extend({
	initialize : function(argument, treeSettings) {
		_.bindAll();
		
		halook.ganttchart.treeSettings = argument.treeSettings;
		this._paper = argument.paper;
		if (this._paper == null) {
			alert("paper is not exist");
			return;
		}
		this.id = this.model.get("objectId");
		this.render();

	},
	render : function() {
		var color = this.getStateColor();
		var mouseOverColor = "rgba(255, 120, 0, 30)";
		var strokeWidth = this.getStateStrokeWidth();
		var dotLineX = 0;
		this.model.set({
			"attributes" : {
				stroke : color,
				"stroke-width" : strokeWidth
			}
		}, 
		{
			silent : true
		});

		var isNonLeft = false;
		var isNonRight = false;
		
		if(this.model.attributes.pointX < this.model.attributes.startX)
		{
			this.model.attributes = {
				pointX : this.model.attributes.startX,
				pointY : this.model.attributes.pointY,
				width : this.model.attributes.width,
				height : this.model.attributes.height,
				state : this.model.attributes.state,
				label : this.model.attributes.label,
				text : this.model.attributes.text,
				stroke : this.model.attributes.stroke,
				startTime : this.model.attributes.startTime,
				finishTime : this.model.attributes.finishTime,
				submitTime : this.model.attributes.submitTime,
				objectId : this.model.attributes.objectId,
				objectName : this.model.attributes.objectName,
				startX : this.model.attributes.startX,
				attributes : this.model.attributes.attributes
			};
			
			isNonLeft = true;
		}
		else if((this.model.attributes.pointX + this.model.attributes.width) > this.model.attributes.startX + 700)
		{
			this.model.attributes = {
				pointX : this.model.attributes.pointX,
				pointY : this.model.attributes.pointY,
				width : this.model.attributes.startX + 700 -  this.model.attributes.pointX,
				height : this.model.attributes.height,
				state : this.model.attributes.state,
				label : this.model.attributes.label,
				text : this.model.attributes.text,
				stroke : this.model.attributes.stroke,
				startTime : this.model.attributes.startTime,
				finishTime : this.model.attributes.finishTime,
				submitTime : this.model.attributes.submitTime,
				objectId : this.model.attributes.objectId,
				objectName : this.model.attributes.objectName,
				startX : this.model.attributes.startX,
				attributes : this.model.attributes.attributes
			};

			isNonRight = true;
		}

		//stateがrunningの場合は、点線
		if (this.model.attributes.state.match("RUNNING")) {
			var dotLine = [];
			var models;
			for ( var num = 0; num < this.model.attributes.width / 20; num++) {
				if (num == parseInt((this.model.attributes.width / 20) ,10)) {
					models = new wgp.MapElement({
						pointX : this.model.attributes.pointX + dotLineX,
						pointY : this.model.attributes.pointY,
						width : this.model.attributes.width - dotLineX,
						height : 0
					});
				} else {
					models = new wgp.MapElement({
						pointX : this.model.attributes.pointX + dotLineX,
						pointY : this.model.attributes.pointY,
						width : 16,
						height : 0
					});
				}

				dotLine.push(models);
				dotLineX += 20;
			}
			for ( var num2 = 0; num2 < dotLine.length; num2++) {
				dotLine[num2].set({
					"attributes" : {
						stroke : color,
						"stroke-width" : strokeWidth
					}
				}, {
					silent : true
				});
			}

		}
		var leftLine = new wgp.MapElement({
			pointX : this.model.attributes.pointX,
			pointY : this.model.attributes.pointY - 8,
			width : 0,
			height : 16
		});
		var rightLine = new wgp.MapElement(
				{
					pointX : this.model.attributes.pointX
							+ this.model.attributes.width,
					pointY : this.model.attributes.pointY - 8,
					width : 0,
					height : 16
				});
		var jobLabel = new wgp.MapElement({
			pointX : 65,
			pointY : this.model.attributes.pointY,
			text : this.model.attributes.label,
			fontSize : 14
		});
		var jobName = new wgp.MapElement({
			pointX : this.model.attributes.pointX + this.model.attributes.width / 2,
			pointY : this.model.attributes.pointY - 5,
			text : this.model.attributes.text,
			fontSize : 10
		});
		var detail = new wgp.MapElement({
			pointX : this.model.attributes.pointX + this.model.attributes.width
					+ 100,
			pointY : this.model.attributes.pointY - 10,
			text : "■JOB DETAIL <br /> jobId : "
					+ this.model.attributes.label
					+ "<br /> jobName : "
					+ this.model.attributes.text
					+ "<br /> status : "
					+ this.model.attributes.state
					// + "<br /> submitTime : "
					// + this.model.attributes.submitTime
					+ "<br /> startTime : "
					+ halook.comDateFormat(new Date(this.model.attributes.startTime),
							halook.DATE_FORMAT_DETAIL)
					+ "<br /> finishTime : "
					+ halook.comDateFormat(new Date(this.model.attributes.finishTime),
							halook.DATE_FORMAT_DETAIL)
					+ "<br /> submitTime : "
					+ halook.comDateFormat(new Date(this.model.attributes.submitTime),
							halook.DATE_FORMAT_DETAIL),
			fontSize : 12
		});

		var mouseOverRect = new wgp.MapElement({
			pointX : 130,
			pointY : this.model.attributes.pointY - 5,
			width : 700,
			height : 10
		});

		leftLine.set({
			"attributes" : {
				stroke : color,
				"stroke-width" : strokeWidth / 2
			}
		}, {
			silent : true
		});
		rightLine.set({
			"attributes" : {
				stroke : color,
				"stroke-width" : strokeWidth / 2
			}
		}, {
			silent : true
		});
		mouseOverRect.set({
			"attributes" : {
				fill : mouseOverColor
			}
		}, {
			silent : true
		});

		this.element = [];
		var focusElement;
		var textElement;
		if (this.model.attributes.state.match("RUNNING")) {
			for ( var num3 = 0; num3 < dotLine.length; num3++) {
				this.element
						.push(new line(dotLine[num3].attributes, this._paper));
			}
			
			if (!isNonLeft) {
				this.element.push(new line(leftLine.attributes, this._paper));
			}
			if (!isNonRight) {
				this.element.push(new line(rightLine.attributes, this._paper));
			}
			
			textElement = this._paper.text(jobLabel.attributes.pointX,
					jobLabel.attributes.pointY, jobLabel.attributes.text);
			textElement.attr({
				stroke : halook.gantt.AXIS_COLOR
			});
			
			for ( var num4 = 0; num4 < this.element.length; num4++) {
				this.element[num4].object.mouseover(function() {
					$("#ganttChartDetail").html(detail.attributes.text);
				});
			}
		} else {
			this.element.push(new line(this.model.attributes, this._paper));
			
			if (!isNonLeft) {
				this.element.push(new line(leftLine.attributes, this._paper));
			}
			if (!isNonRight) {
				this.element.push(new line(rightLine.attributes, this._paper));
			}
			
			textElement = this._paper.text(jobLabel.attributes.pointX,
					jobLabel.attributes.pointY, jobLabel.attributes.text);
			textElement.attr({
				stroke : halook.gantt.AXIS_COLOR
			});
			for ( var num5 = 0; num5 < this.element.length; num5++) {
				this.element[num5].object.mouseover(function() {
					$("#ganttChartDetail").html(detail.attributes.text);
				});
				var instance = this;
				this.element[num5].object.click(function(e) {

					if (instance.childView) {
						var tmpAppView = new ENS.AppView();
						tmpAppView.removeView(instance.childView);
						this.childView = null;
					}
					$("#contents_area").children().remove();

					var dataId = "/mapreduce/task";
					var viewSettings = null;

					$.each(wgp.constants.VIEW_SETTINGS, function(index, value) {
						if (dataId.match(index)) {
							viewSettings = value;
							return false;
						}
					});
					var viewClassName = viewSettings.viewClassName;
					$.extend(true, viewSettings, {
						id : instance.targetId
					});
					
					var parentTreeId = halook.ganttchart.treeSettings.parentTreeId;
					var taskTreeId = parentTreeId + "/task";
					
					var treeSettings = {
						id : taskTreeId,
						graphId : taskTreeId
					};

					$.extend(true, viewSettings, {
						startTime : new Date(
								instance.model.attributes.startTime),
						finishTime : new Date(
								instance.model.attributes.finishTime),
						jobName : instance.model.attributes.text,
						jobId : instance.model.attributes.label,
						jobStatus : instance.model.attributes.state,
						rootView : appView,
						id : "contents_area"
					});
					// 動的に生成するオブジェクトを切り替える必要があるため、やむを得ずeval()を使う
					halook.ganttchart.childView = eval("new " + viewClassName
							+ "(viewSettings, treeSettings)");
				});
			}
		}
	},
	update : function(model) {
		var instance = this;
		var color = this.getStateColor();
		this.model.set({
			"fill" : color
		}, {
			silent : true
		});
		this.element.setAttributes(model);
	},
	remove : function(property) {
		this.element.hide();
	},
	getStateColor : function() {
		var state = this.model.get("state");
		var color = halook.constants.STATE_COLOR[state];
		if (color == null) {
			color = halook.constants.STATE_COLOR[halook.constants.STATE.NORMAL];
		}
		return color;
	},
	getStateStrokeWidth : function() {
		var width = this.model.get("stroke");
		return width;
	},
	destroy : function() {
		var appView = ENS.AppView();
		if (halook.ganttchart.childView) {
			appView.removeView(halook.ganttchart.childView);
		}
	}
});