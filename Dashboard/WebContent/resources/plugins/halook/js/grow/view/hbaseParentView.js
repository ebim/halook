/////////////////////////////////////////////////////////
//                       Class                         //
/////////////////////////////////////////////////////////
halook.HbaseParentView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSettings) {
				this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
				this.viewId = '#' + this.$el.attr('id');
				var idDict = halook.hbase.parent.id;
				var cssDict = halook.hbase.parent.css;

				// logo area
				this.makeLogoArea();

				// dual slider area (add div and css, and make slider)
				$(this.viewId).append(
						'<div id="' + idDict.dualSliderArea + '"></div>');
				$('#' + idDict.dualSliderArea).css(cssDict.dualSliderArea);
				this.dualSliderView = new ENS.DualSliderView({
					id : idDict.dualSliderArea,
					rootView : this
				});

				// information area (add div and css)
				$(this.viewId).append(
						'<div id="' + idDict.informationArea + '"></div>');
				$('#' + idDict.informationArea).css(cssDict.informationArea);

				// graph legend area (add div and css)
				$('#' + idDict.informationArea).append(
						'<div id="' + idDict.legendArea + '"></div>');
				$('#' + idDict.legendArea).css(cssDict.legendArea);

				// annotation legend area (add div and css)
				$('#' + idDict.informationArea).append(
						'<div id="' + idDict.annotationLegendArea + '"></div>');
				$('#' + idDict.annotationLegendArea).css(
						cssDict.annotationLegendArea);

				// graph area (add div and css, and make graph)
				$(this.viewId).append(
						'<div id="' + idDict.graphArea + '"></div>');
				$('#' + idDict.graphArea).css(cssDict.graphArea);
				this.hbaseView = new halook.HbaseView({
					id : idDict.graphArea,
					rootView : this,
					treeSettings : treeSettings
				});

				// associate with the slider and graph
				var instance = this;
				this.dualSliderView.setScaleMovedEvent(function(
						fromMillisecond, toMillisecond) {
					instance.hbaseView.updateDisplaySpan(fromMillisecond,
							toMillisecond);
				});

			},
			render : function() {
				console.log('call render (parent)');
			},
			onAdd : function(element) {
				console.log('call onAdd (parent)');
			},
			onChange : function(element) {
				console.log('called changeModel (parent)');
			},
			onRemove : function(element) {
				console.log('called removeModel (parent)');
			},
			getTermData : function() {
				// データの整形などの処理 データ取ってきたとき呼ばれる
				console.log('called getTermData (parent)');
			},
			destroy : function() {
				// ツリー移動時に呼ばれる
				var appView = ENS.AppView();
				appView.removeView(this.hbaseView);
			},
			makeLogoArea : function() {
				var idName = 'logo';
				$(this.viewId).append('<div id="' + idName + '" class="contentHeader" ></div>');
				$('#' + idName).append(
						'<h1>HBase GrowMap</h1>');
				
				var context = $("#context").val();
				
				$('#' + idName)
						.append(
								'<img src="' + context + '/resources/plugins/halook/images/halook_120x30.png">');
				$('#' + idName)
						.css(
								{
									margin : '10px 0px 0px 10px'
								});
				$('#' + idName + ' h1').css({
					fontSize : '25px',
					width : '600px',
					margin : '10px 0px 10px 20px',
					float : 'left'
				});
				$('#' + idName + ' img').css({
					width : '120px',
					height : '30px',
					margin : '5px 10px 10px 0px',
					float : 'right'
				});
			}
		});
