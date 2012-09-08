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
				var color = "rgba(0,0,0,50)";
				this.model.set({
					"attributes" : {
						fill : color
					}
				}, {
					silent : true
				});

				var timeLabel = [];
				var timeLine = [];
				var timeWidth = 120;
				var unixTime = new Date(this.model.attributes.text) / 1000 + 7200;
				var year, month, day, hour, minute, second;
				for ( var num = 0; num < this.model.attributes.widthX / 120 - 1; num++) {
					var normalTime = unixTime * 1000;
					year = new Date(normalTime).getYear();
					month = new Date(normalTime).getMonth() + 1;
					day = new Date(normalTime).getDate();
					hour = new Date(normalTime).getHours();
					minute = new Date(normalTime).getMinutes();
					second = new Date(normalTime).getSeconds();

					if (year < 2000) {
						year += 1900;
					}
					if (month < 10) {
						month = "0" + month;
					}
					if (day < 10) {
						day = "0" + day;
					}
					if (hour < 10) {
						hour = "0" + hour;
					}
					if (minute < 10) {
						minute = "0" + minute;
					}
					if (second < 10) {
						second = "0" + second;
					}

					timeLabel.push(new wgp.MapElement({
						pointX : this.model.attributes.pointX + timeWidth,
						pointY : 450,
						height : 400,
						text : year + "/" + month + "/" + day + " " + hour
								+ ":" + minute + ":" + second
					}));
					timeLine.push(new wgp.MapElement({
						pointX : this.model.attributes.pointX + timeWidth,
						pointY : 0,
						width : 0,
						height : 450
					}));
					timeWidth += 120;
					unixTime += 7200;
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
					})
				}

				this.element = [];
				this.element.push(new line(this.model.attributes, this._paper));
				this._paper.text(this.model.attributes.pointX,
						this.model.attributes.pointY + 10,
						this.model.attributes.text);

				for ( var num = 0; num < timeLabel.length; num++) {
					this.element.push(new line(timeLine[num].attributes,
							this._paper));
					this._paper.text(timeLabel[num].attributes.pointX,
							timeLabel[num].attributes.pointY + 10,
							timeLabel[num].attributes.text);
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
				this.element.object.remove();
			},
			getStateColor : function() {
				var state = this.model.get("state");
				var color = wgp.constants.STATE_COLOR[state];
				if (color == null) {
					color = wgp.constants.STATE_COLOR[wgp.constants.STATE.NORMAL];
				}
				return color;
			}
		});