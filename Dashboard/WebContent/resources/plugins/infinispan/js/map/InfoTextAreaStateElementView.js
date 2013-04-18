infinispan.infoText = {};
infinispan.infoText.width = 400;
infinispan.infoText.height = 50;
infinispan.infoText.x = 100;
infinispan.infoText.y = 100;
infinispan.infoText.offsetx = 10;
infinispan.infoText.offsety = 10;
infinispan.infoText.textObjectOffsety = 30;

infinispan.infoText.defaultPath = [ [ "M", infinispan.infoText.x, infinispan.infoText.y ],
		[ "l", infinispan.infoText.width, 0 ], [ "l", 0, infinispan.infoText.height ],
		[ "l", -infinispan.infoText.width, 0 ], [ "z" ] ];

infinispan.infoText.inTransfer = [ [ "M", infinispan.infoText.x, infinispan.infoText.y ],
		[ "l", 0, 0 ], [ "l", 0, 0 ], [ "l", 0, 0 ], [ "z" ] ];

infinispan.InfoTextAreaStateElementView = Backbone.View
		.extend({
			initialize : function(argument) {
				_.bindAll();
				this._paper = argument.paper;
				if (this._paper == null) {
					alert("paper is not exist");
					return;
				}
				this.hide = true;
				this.id = this.model.get("objectId");
				
				// if initailized yet, initalize textarea
				if ($("#taskInfoDiv").length === 0) {
					// task info area.
					$("#arrowChart").before("<div id='taskInfoDiv'></div>");
					$("#taskInfoDiv").append("<textarea id='textArea'></div>");
					$("#taskInfoDiv").css({
						'background-color' : 'white',
						'display' : 'none',
						position : 'absolute',
						'z-index' : 1
					});
					$("#textArea").css({
						width : '400px',
						height : '50px',
						'text-align' : 'center',
						resize: 'none'
					});					
				}

				this.render();
				infinispan.arrowChart.detailInfoElement = this;
			},
			render : function() {
				var color = this.getStateColor();
				this.model.set({
					"attributes" : {
						"stroke-width" : 0,
						"stroke-opacity" : 0,
						"fill" : 'red',
						r : 7
					}
				}, {
					silent : true
				});
				this.element = [];
				this.element[0] = this._paper.path(infinispan.infoText.inTransfer)
						.attr({
							"fill" : "red",
							"stroke" : "blue"
						});
				this.element[1] = new textArea(this.model.attributes,
						this._paper);

			},
			update : function(model) {
				var instance = this;
				var color = this.getStateColor();
				this.model.set({
					"fill" : color
				}, {
					silent : true
				});
				this.element[0].setAttributes(model);
				this.element[1].setAttributes(model);
			},
			remove : function(property) {
				this.element[0].hide();
				this.element[1].hide();
			},
			getStateColor : function() {
				var state = this.model.get("state");
				var color = infinispan.constants.STATE_COLOR[state];
				if (color == null) {
					color = infinispan.constants.STATE_COLOR[infinispan.constants.STATE.NORMAL];
				}
				return color;
			},
			animationAppear : function(info) {
				this._makePath(info.event);
				var tmpText = info.text;
				var scrollHeight = $("#arrowChart").scrollTop();
				$("#textArea").val(tmpText);
				$("#taskInfoDiv").css({
					display : "inline",
					left : infinispan.infoText.x + infinispan.infoText.width / 2 - 160,
					top : infinispan.infoText.y + infinispan.infoText.textObjectOffsety - scrollHeight + 225
				});

				this.hide = false;
			},
			animationDisappear : function(info) {
				$("#taskInfoDiv").css({
					display : "none"
				});
				this.hide = true;
			},
			_makePath : function(event) {
				infinispan.infoText.x = event.layerX;
				infinispan.infoText.y = event.layerY;
				if (infinispan.arrowChart.paperWidth / 2
						+ infinispan.arrowChart.startLineX < infinispan.infoText.x) {
					infinispan.infoText.x = infinispan.infoText.x
							- infinispan.infoText.width;
				}

				infinispan.infoText.defaultPath = [
						[ "M", infinispan.infoText.x + infinispan.infoText.offsetx,
								infinispan.infoText.y + infinispan.infoText.offsety ],
						[ "l", infinispan.infoText.width, 0 ],
						[ "l", 0, infinispan.infoText.height ],
						[ "l", -infinispan.infoText.width, 0 ], [ "z" ] ];

				infinispan.infoText.inTransfer = [
						[ "M", infinispan.infoText.x + infinispan.infoText.offsetx,
								infinispan.infoText.y + infinispan.infoText.offsety ],
						[ "l", 0, 0 ], [ "l", 0, 0 ], [ "l", 0, 0 ], [ "z" ] ];

			}

		});
