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

wgp.InfoTextAreaStateElementView = Backbone.View
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
				var color = wgp.constants.STATE_COLOR[state];
				if (color == null) {
					color = wgp.constants.STATE_COLOR[wgp.constants.STATE.NORMAL];
				}
				return color;
			},
			animationAppear : function(info) {

				this._makePath(info.event);
				this.element[0].attr({
					path : halook.infoText.inTransfer,
					text : "ohhhhhhh"
				});
				this.element[1].textObject.attr({
					x : halook.infoText.x + halook.infoText.width/2,
					y : halook.infoText.y + halook.infoText.textObjectOffsety,
					text : info.text
				});
				// $("#" + this.$el.attr("id")).html("world is mine");
				this.hide = false;
				this.element[0].attr({
					"fill" : "white",
					"stroke" : "blue",
					fontSize : 10,

				}).animate({
					path : halook.infoText.defaultPath,
					"stroke-opacity" : 1,
					"fill-opacity" : 1,
				}, 100, function() {
					endAnimation();
				});

				this.element[1].object.attr({
					"fill" : "white",
					"stroke" : "blue"
				}).animate({
					path : halook.infoText.defaultPath,
					"stroke-opacity" : 1,
					"fill-opacity" : 1,
					r : 10,
				}, 100, function() {
					endAnimation();
				});
			},
			animationDisappear : function(info) {
				console.log("animation disappear");
				this.hide = true;
				instance = this.element[0];
				this.element[0].animate({
					path : halook.infoText.inTransfer,
					"stroke-opacity" : 0,
					"fill-opacity" : 0,
					r : 0,
				}, 100, function() {
					endAnimation;
				});
				halook.arrowChart.detailInfoElement.element[1].textObject
						.attr({
							text : ""
						});

				this.element[1].object.animate({
					path : halook.infoText.inTransfer,
					"stroke-opacity" : 0,
					"fill-opacity" : 0,
				}, 100, function() {
					endAnimation;
				});
				// this.hide = true;
				// this.text = info.text;
				// var anim1 = Raphael.animation({
				// "stroke-opacity" : 0,
				// r : 0,
				// width : 0,
				// height : 0,
				// "fill-opacity" : 0,
				// }, 1500, "easeOut", endAnimationDisappear());
				// this.element[0].object.animate(anim1);
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

// function endAnimationAppear() {
// console.log("endAnimation");
// }

function endAnimation(instance) {
	if (halook.arrowChart.detailInfoElement.hide == true) {
		halook.arrowChart.detailInfoElement.element[0].attr({
			path : halook.infoText.inTransfer,
			"fill-opacity" : 0,
		});
		halook.arrowChart.detailInfoElement.element[1].object.attr({
			path : halook.infoText.inTransfer,
			"fill-opacity" : 0,
		});
		halook.arrowChart.detailInfoElement.element[1].textObject.attr({
			text : ""
		});
	} else
		halook.arrowChart.detailInfoElement.element[0].attr({
			path : halook.infoText.defaultPath
		});
	halook.arrowChart.detailInfoElement.element[1].object.attr({
		path : halook.infoText.defaultPath
	});

}