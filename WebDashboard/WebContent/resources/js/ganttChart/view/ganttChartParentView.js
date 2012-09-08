var ganttChartParentView = wgp.AbstractView
		.extend({
			initialize : function() {
				this.viewType = wgp.constants.VIEW_TYPE.VIEW;
				this.collection = new GanttChartModelCollection();
				this.attributes = {};
				this.registerCollectionEvent();

				/**
				 * ganttChart
				 * 
				 */

				$("#" + this.$el.attr("id")).append(
						'<div id="viewTitle" style="position:absolute"></div>');
				$("#viewTitle").css({
					width : "800px",
					height : "50px",
				});
				$('#viewTitle').append('<h1>GanttChart</h1>');
				$('#viewTitle')
						.append(
								'<img src="/WebDashboard/resources/images/halook_120x30.png">');
				$('#viewTitle')
						.css(
								{
									overflow : 'auto',
									margin : '5px 0px 0px 5px',
									border : '1px #dcdcdc solid',
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
								});
				$('#viewTitle' + ' h1').css({
					fontSize : '25px',
					width : '500px',
					margin : '10px 0px 10px 20px',
					float : 'left'
				});
				$('#viewTitle' + ' img').css({
					width : '120px',
					height : '30px',
					margin : '10px 10px 10px 10px',
					float : 'right'
				});

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="ganttChart" style="position:absolute"></div>');
				$("#ganttChart").css({
					width : "890px",
					height : "500px",
					"margin-top" : "60px",
					overflow : "scroll",
					backgroundColor : "#F0FFFF"
				});

				var ganttChart = new ganttChartView({
					id : "ganttChart",
					rootView : this
				});

				/**
				 * ganttChartDetail
				 * 
				 */

				$("#" + this.$el.attr("id"))
						.append(
								'<div id="ganttChartDetail" style="position:absolute"></div>');
				$("#ganttChartDetail").css({
					width : "890px",
					height : "170px",
					"margin-top" : "570px",
					overflow : "scroll",
					backgroundColor : "#FFFFFF"
				});
				$("#ganttChartDetail").html("■JOB DETAIL");

				var ganttChartDetail = new ganttChartDetailView({
					id : "ganttChartDetail",
					rootView : this
				});

				this.maxId = 0;

				var realTag = $("#" + this.$el.attr("id"));
				if (this.width == null) {
					this.width = realTag.width();
				}
				if (this.height == null) {
					this.height = realTag.height();
				}

				console.log('called initialize parent view');
			},
			render : function() {
				console.log('call render');
			},
			onAdd : function(element) {
				console.log('call onAdd');
			},
			onChange : function(element) {
				console.log('called changeModel');
			},
			onRemove : function(element) {
				console.log('called removeModel');
			},

		});