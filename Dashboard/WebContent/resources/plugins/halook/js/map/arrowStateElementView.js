
var arrowMinLength = 10;
var arrowMaxLength = 20;

var makeID = 0;

// 矢印の終点を終了時刻を示すようにする。
halook.arrowState = {};
halook.arrowState.xOffset = halook.customTriangle.width;
halook.arrowState.changableFlag = true;
halook.arrowState.minLength = 30;

halook.ArrowStateElementView = Backbone.View.extend({
	// /stateを渡す。NORMAL or ERROR or WARN
	initialize : function(argument) {
		_.bindAll();
		this.model.set({
			state : argument.state
		});
		// console.log(argument.state);
		this.taskInfo = argument.info;

		this._paper = argument.paper;
		if (this._paper == null) {
			alert("paper is not exist");
			return;
		}
		this.id = this.model.get("objectId");
		this.render();
	},
	render : function() {
		var rate = 1;
		if (this.model.attributes.width < halook.arrowState.minLength) {
			rate = this.model.attributes.width*1.0/halook.arrowState.minLength;
			if(rate < 0.7) {
				rate = 0.7;
			}
		} else
			this.model.attributes.width = this.model.attributes.width
					- halook.arrowState.xOffset;
		var color = this.getStateColor();
		this.model.set({
			"attributes" : {
				fill : color,
				stroke : color,
				"stroke-width" : 8*rate // 矢印の線の部分の太さ
			}
		}, {
			silent : true
		});


//		console.log(this.model.attributes.height + " "
//				+ this.model.attributes.width + " "
//				+ this.model.attributes.pointX + " "
//				+ this.model.attributes.width + " " + halook.arrowState.xOffset
//				+ " " + this.model.attributes.pointY);
		var triangleData;
		if(rate != 1){
			
		triangleData = new wgp.MapElement({
			objectId : 3,
			objectName : null,
			height : this.model.attributes.height,
			width : this.model.attributes.width,
			pointX : this.model.attributes.pointX + this.model.attributes.width*2
					,
			pointY : this.model.attributes.pointY
		});
		}else{
		triangleData = new wgp.MapElement({
			objectId : 3,
			objectName : null,
			height : this.model.attributes.height,
			width : this.model.attributes.width,
			pointX : this.model.attributes.pointX + this.model.attributes.width
					+ halook.arrowState.xOffset,
			pointY : this.model.attributes.pointY
		});
		}

		triangleData.set({
			"attributes" : {
				fill : color,
				stroke : color
			}
		}, {
			silent : true
		});

		this.element = [];

		this.element[0] = new line(this.model.attributes, this._paper);
		this.element[1] = new halook.customtriangle(triangleData.attributes,
				this._paper, rate);
		// this.element[1] = new line(overModelData.attributes, this._paper);
		// this.element[2] = new line(underModelData.attributes, this._paper);
		this.element[0].object.taskInfo = this.taskInfo;
		this.element[1].object.taskInfo = this.taskInfo;
		// this.element[1].object.taskInfo = this.taskInfo;
		// this.element[2].object.taskInfo = this.taskInfo;
		var instance = this;
		if ($.isArray(this.element)) {
			for ( var index = 0; index < this.element.length; index++) {
				(this.element)[index].object.mouseover(function(event) {
					instance.addMouseoverArrow(event);
				});
			}
		}
		if ($.isArray(this.element)) {
			for ( var index2 = 0; index2 < this.element.length; index2++) {
				(this.element)[index2].object.mouseout(function(event) {
					instance.addMouseoutArrow(event);
				});
			}
		}
		if ($.isArray(this.element)) {
			for ( var index3 = 0; index3 < this.element.length; index3++) {
				(this.element)[index3].object.click(function(event) {
					instance.addMouseClickArrow(event);
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
		this.element[0].setAttributes(model);
		this.element[1].setAttributes(model);
		// this.element[1].setAttributes(model);
		// this.element[2].setAttributes(model);
	},
	remove : function(property) {
		this.element[0].hide();
		this.element[1].hide();

		// this.element[1].hide();
		// this.element[2].hide();
	},
	getStateColor : function() {
		var state = this.model.get("state");
		// console.log(" getStateColor: " + state);
		var color = halook.constants.STATE_COLOR[state];
		if (color == null) {
			color = halook.constants.STATE_COLOR[halook.constants.STATE.NORMAL];
		}
		return color;
	},
	addMouseoutArrow : function() {
		halook.arrowChart.detailInfoElement.animationDisappear({
			text : ""
		});

		if (halook.arrowState.changableFlag) {
			// var targetInfo = this.arrowInfo;
			$("#arrowInfoView").css("display", "none");
			// console.log("mouseout "+targetInfo+ " " +
			// targetInfo.element.object);
			// targetInfo.element.object.hide();
			// targetInfo.remove();
			// targetInfo.hide();
		}
	},
	addMouseoverArrow : function(event) {
		halook.arrowChart.detailInfoElement.animationAppear({
			text : this.taskInfo.TaskAttemptID+"\n"+ this.taskInfo.Status + ":  @" + this.taskInfo.Hostname,
			"event" : event
		});
		if (halook.arrowState.changableFlag) {

			var arrowElement = this.element;
			var arrow = this.taskInfo;
			var startTime = new Date();
			startTime.setTime(arrow.StartTime);
			var find = new Date();
			find.setTime(arrow.FinishTime);
			var infoString = "";
			
			makeID++;
			if ($.isArray(arrowElement)) {
				// $("#arrowInfoView").css("display","block");
				$("#arrowInfoView").css("top", event.screenY - 40);
				$("#arrowInfoView").css("left", event.screenX - 150);
				$("#arrowInfoView").css("background-color",
						"rgba(255,255,255,0.9)");
				$("#arrowInfoView").css("color", "#222222");
				$("#arrowInfoView").css("z-index", 100);
				
				
				// console.log("mousex, mousey, " + event.layerX + ", "
				// + event.layerY);
				// view を追加
				var modelData5 = new wgp.MapElement({
					objectId : 50000 + makeID,
					objectName : null,
					height : 0,
					width : 90,
					pointX : event.layerX,
					pointY : event.layerY, // +
					// stringHeightOffset,
					text : "testTextArea",
					fontSize : 20
				});
				var attemptIDArray = arrow.TaskAttemptID.split("_");
				infoString = " ID:</br>" + attemptIDArray[0] + "</br>"
						+ "_" + attemptIDArray[1] + "</br>" + "_"
						+ attemptIDArray[2] + "_" + attemptIDArray[3] + "</br>"
						+ "_" + attemptIDArray[4] + "_" + attemptIDArray[5]
						+ "</br>" + "</br>" + "Status:</br>" + arrow.Status
						+ "</br>" + "</br>" + startTime + " - </br>" + find
						+ "</br>" + "</br>" + "Hostname:</br>" + arrow.Hostname
						+ "</br>";
				$("#taskInfoSpace").html(
						"<font face = 'Verdana' size = '2'>" + infoString
								+ "</font>");
			} else {
				infoString = "<p>JobId:</br>" + arrow.JobID + "</br>"
						+ "TaskAttemptID:</br>" + arrow.TaskAttemptID + "</br>"
						+ "Status:</br>" + arrow.Status + "</br>"
						+ "StartTime:</br>" + startTime + "</br>"
						+ "FinishTime:</br>" + find + "</br>"
						+ "Hostname:</br>" + arrow.Hostname + "</br></p>";
				$("#taskInfoSpace").html(infoString);
			}
		}
	},
	addMouseClickArrow : function(event) {
		if (halook.arrowState.changableFlag){
			halook.arrowState.changableFlag = false;
			$("#taskInfoSpace").css({"border-style":"inset"});
		}
		else {
			halook.arrowState.changableFlag = true;
			var arrow = this.taskInfo;
			var startTime = new Date();
			startTime.setTime(arrow.StartTime);
			var find = new Date();
			find.setTime(arrow.FinishTime);
			// view を追加
			var modelData5 = new wgp.MapElement({
				objectId : 50000 + makeID,
				objectName : null,
				height : 0,
				width : 90,
				pointX : event.layerX,
				pointY : event.layerY, // +
				// stringHeightOffset,
				text : "testTextArea",
				fontSize : 20
			});
			var attemptIDArray = arrow.TaskAttemptID.split("_");
			var infoString = " ID:</br>" + attemptIDArray[0] + "</br>" + "_"
					+ attemptIDArray[1] + "</br>" + "_" + attemptIDArray[2]
					+ "_" + attemptIDArray[3] + "</br>" + "_"
					+ attemptIDArray[4] + "_" + attemptIDArray[5] + "</br>"
					+ "</br>" + "Status:</br>" + arrow.Status + "</br>"
					+ "</br>" + startTime + " - </br>" + find + "</br>" + "</br>"
					+ "Hostname:</br>" + arrow.Hostname + "</br>";
			$("#taskInfoSpace").css({"border-style":"outset"});
			$("#taskInfoSpace").html(
					"<font face = 'Verdana' size = '2'>" + infoString
							+ "</font>");

		}
	}

});