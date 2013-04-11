halook.HbaseResionMapParentView = wgp.AbstractView
		.extend({
			initialize : function(arguments, treeSettings) {
				this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
				this.viewId = '#' + this.$el.attr('id');
				this.treeSettingId_ = treeSettings.treeId;
				var idDict = halook.hbase.parent.id;
				var cssDict = halook.hbase.parent.css;

				// logo area
				this.makeLogoArea();

				this._addSlider(this);

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
				this.hbaseView = new halook.HbaseRegionMapView({
					id : idDict.graphArea,
					rootView : this,
					treeSettings : treeSettings
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
				idName = 'logo';
				$(this.viewId).append('<div id="' + idName + '" class="contentHeader"></div>');
				$('#' + idName).append(
						'<h1>HBase RegionMap</h1>');
				
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
			},
			_addSlider : function(self) {
				$(this.viewId).append(
						'<div id="slider"></div>');
				$('#slider').css(ENS.nodeinfo.parent.css.dualSliderArea);
				$('#slider').css(ENS.nodeinfo.parent.css.dualSliderArea);
				this.singleSliderView = new ENS.SingleSliderView({
					id : "slider",
					rootView : this
				});

				this.singleSliderView.setScaleMovedEvent(function(pastTime) {
					self._updateDisplaySpan(pastTime);
				});
			},
			_updateDisplaySpan : function(pastTime) {
				if (pastTime == 0) {

					if (this.hbaseView.isRealTime == false) {
						appView.syncData([ (this.treeSettingId_ + "%") ]);
					}
					this.hbaseView.isRealTime = true;

					var end = new Date();
					var start = new Date(end.getTime() - 60 * 60 * 1000);
					appView.getTermData([ (this.treeSettingId_ + '%') ], start,
							end);
				} else {
					this.hbaseView.isRealTime = false;
					this.hbaseView._drawStaticRegioniServer(pastTime);
				}

			},
		});
