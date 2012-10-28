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

halook.ganttchartStateElementView = Backbone.View.extend({
	initialize : function(argument, treeSettings) {
		_.bindAll();
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

//		if(this.model.attributes.pointX < this.model.attributes.startX)
//		{
			var nonLeftLine = new wgp.MapElement({
				pointX : this.model.attributes.startX,
				pointY : this.model.attributes.pointY,
				width : this.model.attributes.width - (this.model.attributes.startX - this.model.attributes.pointX),
				height : 0,
				state : this.model.attributes.status,
				label : this.model.attributes.label,
				text : this.model.attributes.text,
				stroke : 6
			});
			
			nonLeftLine.set({
				"attributes" : {
					stroke : color,
					"stroke-width" : strokeWidth
				}
			}, {
				silent : true
			});
//		}
//		else if(this.model.attributes.pointY > this.model.attributes.startX + 700)
//		{
			var nonRightLine = new wgp.MapElement({
				pointX : this.model.attributes.pointX,
				pointY : this.model.attributes.pointY,
				width : this.model.attributes.width - (this.model.attributes.pointY - this.model.attributes.startX + 700),
				height : 0,
				state : this.model.attributes.status,
				label : this.model.attributes.label,
				text : this.model.attributes.text,
				stroke : 6
			});

			nonRightLine.set({
				"attributes" : {
					stroke : color,
					"stroke-width" : strokeWidth
				}
			}, {
				silent : true
			});
//		}

		//stateがrunningの場合は、点線
		if (this.model.attributes.state.match("RUNNING")) {
			var dotLine = [];
			var models;
			for ( var num = 0; num < this.model.attributes.width / 20; num++) {
				if (num == parseInt(this.model.attributes.width / 20)) {
					models = new wgp.MapElement({
						pointX : this.model.attributes.pointX + dotLineX,
						pointY : this.model.attributes.pointY,
						width : this.model.attributes.width - dotLineX,
						height : 0,
					});
				} else {
					models = new wgp.MapElement({
						pointX : this.model.attributes.pointX + dotLineX,
						pointY : this.model.attributes.pointY,
						width : 16,
						height : 0,
					});
				}

				dotLine.push(models);
				dotLineX += 20;
			}
			for ( var num = 0; num < dotLine.length; num++) {
				dotLine[num].set({
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
			height : 16,
		});
		var rightLine = new wgp.MapElement(
				{
					pointX : this.model.attributes.pointX
							+ this.model.attributes.width,
					pointY : this.model.attributes.pointY - 8,
					width : 0,
					height : 16,
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
					+ comDateFormat(new Date(this.model.attributes.startTime),
							halook.DATE_FORMAT_DETAIL)
					+ "<br /> finishTime : "
					+ comDateFormat(new Date(this.model.attributes.finishTime),
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
				"stroke-width" : strokeWidth
			}
		}, {
			silent : true
		});
		rightLine.set({
			"attributes" : {
				stroke : color,
				"stroke-width" : strokeWidth
			}
		}, {
			silent : true
		});
		jobLabel.set({
			"attributes" : {
				stroke : color,
				"stroke-width" : strokeWidth,
				"font-size" : 14
			}
		}, {
			silent : true
		});
		jobName.set({
			"attributes" : {
				stroke : color,
				"stroke-width" : strokeWidth
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
		if (this.model.attributes.state.match("RUNNING")) {
			for ( var num = 0; num < dotLine.length; num++) {
				this.element
						.push(new line(dotLine[num].attributes, this._paper));
			}
			this.element.push(new line(leftLine.attributes, this._paper),
					new line(rightLine.attributes, this._paper));
			this._paper.text(jobLabel.attributes.pointX,
					jobLabel.attributes.pointY, jobLabel.attributes.text);

			for ( var num = 0; num < this.element.length; num++) {
				this.element[num].object.mouseover(function() {
					$("#ganttChartDetail").html(detail.attributes.text);
				});
			}
		} else {
			if(this.model.attributes.pointX < this.model.attributes.startX)
			{
				this.element.push(new line(nonLeftLine.attributes, this._paper));
			}
			else if(this.model.attributes.pointY > this.model.attributes.startX + 700)
			{
				this.element.push(new line(nonRightLine.attributes, this._paper));
			}
			else
			{
			this.element.push(new line(this.model.attributes, this._paper));
			this.element.push(new line(leftLine.attributes, this._paper));
			this.element.push(new line(rightLine.attributes, this._paper));
			this._paper.text(jobLabel.attributes.pointX,
					jobLabel.attributes.pointY, jobLabel.attributes.text);
			}
			for ( var num = 0; num < this.element.length; num++) {
				this.element[num].object.mouseover(function() {
					$("#ganttChartDetail").html(detail.attributes.text);
				});
				var instance = this;
				this.element[num].object.click(function(e) {

					if (instance.childView) {
						var tmpAppView = new wgp.AppView();
						tmpAppView.removeView(inctance.childView);
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
					var treeSettings = {
						id : "/mapreduce/task",
						graphId : "/mapreduce/task"
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
						id : "contents_area",
					});
					instance.childView = eval("new " + viewClassName
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
		var color = wgp.constants.STATE_COLOR[state];
		if (color == null) {
			color = wgp.constants.STATE_COLOR[wgp.constants.STATE.NORMAL];
		}
		return color;
	},
	getStateStrokeWidth : function() {
		var width = this.model.get("stroke");
		return width;
	}	
});