halook.infoText = {};
halook.infoText.width = 400;
halook.infoText.height = 50;
halook.infoText.x = 100;
halook.infoText.y = 100;
halook.infoText.offsetx = 10;
halook.infoText.offsety = 10;
halook.infoText.textObjectOffsety = 30;

halook.infoText.defaultPath = [ [ "M", halook.infoText.x, halook.infoText.y ],
		[ "l", halook.infoText.width, 0 ], [ "l", 0, halook.infoText.height ],
		[ "l", -halook.infoText.width, 0 ], [ "z" ] ];

halook.infoText.inTransfer = [ [ "M", halook.infoText.x, halook.infoText.y ],
		[ "l", 0, 0 ], [ "l", 0, 0 ], [ "l", 0, 0 ], [ "z" ] ];

halook.InfoTextAreaStateElementView = Backbone.View
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
				halook.arrowChart.detailInfoElement = this;
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
				this.element[0] = this._paper.path(halook.infoText.inTransfer)
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
				var color = halook.constants.STATE_COLOR[state];
				if (color == null) {
					color = halook.constants.STATE_COLOR[halook.constants.STATE.NORMAL];
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
					left : halook.infoText.x + halook.infoText.width / 2 - 160,
					top : halook.infoText.y + halook.infoText.textObjectOffsety - scrollHeight + 225
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
				halook.infoText.x = event.layerX;
				halook.infoText.y = event.layerY;
				if (halook.arrowChart.paperWidth / 2
						+ halook.arrowChart.startLineX < halook.infoText.x) {
					halook.infoText.x = halook.infoText.x
							- halook.infoText.width;
				}

				halook.infoText.defaultPath = [
						[ "M", halook.infoText.x + halook.infoText.offsetx,
								halook.infoText.y + halook.infoText.offsety ],
						[ "l", halook.infoText.width, 0 ],
						[ "l", 0, halook.infoText.height ],
						[ "l", -halook.infoText.width, 0 ], [ "z" ] ];

				halook.infoText.inTransfer = [
						[ "M", halook.infoText.x + halook.infoText.offsetx,
								halook.infoText.y + halook.infoText.offsety ],
						[ "l", 0, 0 ], [ "l", 0, 0 ], [ "l", 0, 0 ], [ "z" ] ];

			}

		});
