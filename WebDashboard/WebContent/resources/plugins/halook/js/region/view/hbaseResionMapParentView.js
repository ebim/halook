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
				this.stopRegisterCollectionEvent();
			},
			makeLogoArea : function() {
				idName = 'logo';
				$(this.viewId).append('<div id="' + idName + '"></div>');
				$('#' + idName).append(
						'<h1>HBase RegionMap</h1>');
				$('#' + idName)
						.append(
								'<img src="/WebDashboard/resources/images/halook_120x30.png">');
				$('#' + idName)
						.css(
								{
									overflow : 'auto',
									margin : '10px 0px 0px 10px',
									border : '1px #dcdcdc solid',
									background : "-moz-linear-gradient(-45deg, rgba(255,255,255,1) 0%, rgba(241,241,241,1) 50%, rgba(225,225,225,1) 51%, rgba(246,246,246,1) 100%)",
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
				$('#slider').css(halook.nodeinfo.parent.css.dualSliderArea);
				$('#slider').css(halook.nodeinfo.parent.css.dualSliderArea);
				this.singleSliderView = new halook.SingleSliderView({
					id : "slider",
					rootView : this
				});

				this.singleSliderView.setScaleMovedEvent(function(pastTime) {
					self._updateDisplaySpan(pastTime);
				});
			},
			_updateDisplaySpan : function(pastTime) {
				if (pastTime == 0) {

					if (this.isRealTime == false) {
						appView.syncData([ (this.treeSettingId_ + "%") ]);
					}
					this.isRealTime = true;

					var end = new Date();
					var start = new Date(end.getTime() - 60 * 60 * 1000);
					appView.getTermData([ (this.treeSettingId_ + '%') ], start,
							end);
				} else {
					this.isRealTime = false;
					this.hbaseView._drawStaticRegioniServer(pastTime);
				}

			},
		});
