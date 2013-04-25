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
halook.ganttChartAxisNameView = Backbone.View
		.extend({
			initialize : function(argument) {
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
				var color = halook.gantt.AXIS_COLOR;
				this.model.set({
					"attributes" : {
						fill : color,
						font : color
					}
				}, {
					silent : true
				});

				var timeLabel = [];
				var timeLine = [];
				var timeRange;
				
				// X軸の分割数　
				var splitter = 6;
				
				// X軸の1区間の時間幅
				var timeWidthSplitter = ((new Date(this.model.attributes.endText) / 1000) - (new Date(this.model.attributes.text) / 1000)) / splitter;

				//　X軸の1区間の幅
				var timeWidthInit = 700 / splitter;
								
				var timeWidth = timeWidthInit;
				var unixTime = new Date(this.model.attributes.text) / 1000 + timeWidthSplitter;
				var year, month, day, hour, minute, second;
				for ( var num = 0; num < splitter; num++) {
					timeLabel.push(new wgp.MapElement({
						pointX : this.model.attributes.pointX + timeWidth,
						pointY : this.model.attributes.pointY,
						text : new Date(unixTime) * 1000
					}));
					timeLine.push(new wgp.MapElement({
						pointX : this.model.attributes.pointX + timeWidth,
						pointY : 0,
						width : 0,
						height : this.model.attributes.pointY
					}));
					timeLine[num].set({
						"attributes" : {
							stroke : color
						}
					}, {
						silent : true
					});

					timeWidth += timeWidthInit;
					unixTime += timeWidthSplitter;
					timeLabel[num].set({
						"attributes" : {
							fill : color
						}
					}, {
						silent : true
					});
					timeLine[num].set({
						"attributes" : {
							stroke : color
						}
					}, {
						silent : true
					});
				}

				this.element = [];
				this.element.push(new line(this.model.attributes, this._paper));
				this._paper.text(this.model.attributes.pointX,
						this.model.attributes.pointY + 10, halook.comDateFormat(
								new Date(this.model.attributes.text),
								halook.DATE_FORMAT_HOUR));

				for ( var num2 = 0; num2 < timeLabel.length; num2++) {
					this.element.push(new line(timeLine[num2].attributes,
							this._paper));
					var labelElement = this._paper.text(timeLabel[num2].attributes.pointX,
							timeLabel[num2].attributes.pointY + 10,
							halook.comDateFormat(new Date(
									timeLabel[num2].attributes.text),
									halook.DATE_FORMAT_HOUR));
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
				this.render();
			},
			remove : function(property) {
				this.element.object.remove();
			},
			getStateColor : function() {
				var state = this.model.get("state");
				var color = halook.constants.STATE_COLOR[state];
				if (color == null) {
					color = halook.constants.STATE_COLOR[halook.constants.STATE.NORMAL];
				}
				return color;
			}
		});