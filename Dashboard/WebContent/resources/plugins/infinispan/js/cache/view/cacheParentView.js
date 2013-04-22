infinispan.cacheParent = {};

infinispan.CacheParentView = wgp.AbstractView
		.extend({
			initialize : function(argument, treeSettings) {

				this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
				this.viewId = '#' + this.$el.attr('id');
				this.treeSettingId_ = treeSettings.treeId;
				var idDict = infinispan.hbase.parent.id;
				var cssDict = infinispan.hbase.parent.css;

				this.cachePath = argument.cachePath;
				var clusterName = treeSettings.treeId.split("/")[1];
				infinispan.cacheParent.treeSettingId = "/" + clusterName + "/%"
						+ this.cachePath;

				// logo area
				this.makeLogoArea();

				// create single slider
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
				this.cacheView = new infinispan.CacheView({
					id : idDict.graphArea,
					rootView : this,
					treeSettings : treeSettings
				});
				$(this.viewId).append(
						'<div class="clearFloat"></div><br /><br />');
			},
			render : function() {
			},
			onAdd : function(element) {
			},
			onChange : function(element) {
			},
			onRemove : function(element) {
			},
			getTermData : function() {
			},
			destroy : function() {
				// ツリー移動時に呼ばれる
				var appView = ENS.AppView();
				appView.removeView(this.cacheView);
			},
			makeLogoArea : function() {
				var idName = 'logo';
				$(this.viewId)
						.append(
								'<div id="' + idName
										+ '" class="contentHeader"></div>');
				$('#' + idName).append('<h1>Cache View</h1>');

				var context = $("#context").val();

				$('#' + idName).css({
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
				$(this.viewId).append('<div id="cacheSlider"></div>');
				$('#cacheSlider').css(ENS.nodeinfo.parent.css.dualSliderArea);
				$('#cacheSlider').css(ENS.nodeinfo.parent.css.dualSliderArea);
				this.singleSliderView = new ENS.SingleSliderView({
					id : "cacheSlider",
					rootView : this
				});

				this.singleSliderView.setScaleMovedEvent(function(pastTime) {
					self._updateDisplaySpan(pastTime);
				});
			},
			_updateDisplaySpan : function(pastTime) {
				if (pastTime === 0) {
					if (this.cacheView.isRealTime === false) {
						appView
								.syncData([ (infinispan.cacheParent.treeSettingId + "%") ]);
					}
					this.cacheView.isRealTime = true;

					var end = new Date();
					var start = new Date(end.getTime() - 60 * 60 * 1000);
					appView.getTermData(
							[ (infinispan.cacheParent.treeSettingId + '%') ],
							start, end);
				} else {
					this.cacheView.isRealTime = false;
					this.cacheView._drawStaticCacheiServer(pastTime);
				}

			}
		});
