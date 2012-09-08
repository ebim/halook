/////////////////////////////////////////////////////////
//               Following is constant                 //
/////////////////////////////////////////////////////////
wgp.DygraphAttribute = [
    "colors",
    "labels",
    "valueRange",
    "xlabel",
    "ylabel",
    "strokeWidth",
    "legend",
    "labelsDiv",
    "labelsDivWidth",
    "labelsDivStyles",
    "hideOverlayOnMouseOut",
    "width",
    "height",
    "highlightCallback",
    "pointClickCallback",
    "zoomCallback",
    "drawCallback",
    "dateWindow"
];
/*
halook.hbase.graph;
halook.hbase.graph.attributes = {
	//width		: "650",
	height		: "400",
	xlabel		: "Time",
	ylabel		: "Number of region",
	labels		: ["Time", "Number of region", "Amount"],
	legend		: "always",
	labelsDiv	: halook.hbase.parent.id.legendArea,
	labelsDivWidth			: 100,
	hideOverlayOnMouseOut	: false,
	dateWindow	:	null
};
halook.hbase.graph.annotation = {
	shortTextClassName		: 'annotationShortText',
	xValueClassNamePrefix	: 'x_'
};
halook.hbase.graph.eventType = {
	multiple	: {
		className		: 'multiple',
		shortText		: '*',
		text			: 'Multiple Events were occured',
		css				: {
			color			: 'red',
			backgroundColor : 'black',
			border			: '0px white solid'			
		}
	},
	majorCompaction	: {
		className		: 'majorCompaction',
		shortText		: 'M',
		text			: 'Major Compaction was occured',
		css				: {
			color			: 'black',
			backgroundColor : '#0079F2',
			border			: '0px white solid'
		}
	},
	minorCompaction	: {
		className		: 'minorCompaction',
		shortText		: 'M',
		text			: 'Minor Compaction was occured',
		css				: {
			color			: 'black',
			backgroundColor : '#00E7F2',
			border			: '0px white solid'
		}
	},
	split	: {
		className		: 'split',
		shortText		: 'S',
		text			: 'Split was occured',
		css				: {
			color			: 'black',
			backgroundColor : '#36F200',
			border			: '0px white solid'
		}
	}
};
*/

/////////////////////////////////////////////////////////
//                       Class                         //
/////////////////////////////////////////////////////////
var HbaseView = wgp.AbstractView.extend({
	initialize: function(arguments){
		this.viewtype = wgp.constants.VIEW_TYPE.VIEW;
		this.maxId = 0;
		this.annotationArray = [];
		this.annotationRichDataDict = {};
		this.entity = null;
		
		var appView = new wgp.AppView();
		appView.addView(this, arguments.treeSettings.id);
		console.log('---- graph start to initialize----');
		console.log(this.collection);
		this.nowDate = new Date();
		appView.getTermData([arguments.treeSettings.id], 
							new Date(0), this.nowDate);
		appView.syncData([arguments.treeSettings.id]);
		//this.registerCollectionEvent();
        
		console.log('initialize (graph)');
	},
	/*
	onAdd : function(element){
		console.log('call onAdd (graph)');
		
		var dataArray = [];
		//if(this.collection.length > graphMaxNumber){
		//	this.collection.shift(wgp.constants.BACKBONE_EVENT.SILENT);
		//}
		
		_.each(this.collection.models, function(model,index){
			
			var modelData = model.get("data");
			var timestamp = modelData.timestamp;
			var region_number = modelData.data.region_number;
			var eventString = modelData.event;
			
			// push data
			var tmpArray = [];
			tmpArray.push(new Date(timestamp));
			tmpArray.push(region_number);
			dataArray.push(tmpArray);
		});
		
		
		if(this.entity == null){
			this.render();
		}else{
			this.entity.updateOptions({file: dataArray});
		};
		
	},*/
	onChange : function(element){
		console.log('called changeModel');
	},
	onRemove : function(element){
		console.log('called removeModel');
	},
	getTermData : function() {
		console.log('called getTermData (graph)');
		
		// set the attributes of dygraph
		this.dygraphAttributes = halook.hbase.graph.attributes;
		var instance = this;
		this.dygraphAttributes.zoomCallback = function(){
			instance._setAnnotationCss();
		};
		this.dygraphAttributes.highlightCallback = 
			function(event, x, points, row, seriesName){
			instance._hilightedActionForAnnotation(x);
		};
		var nowTimeMillisecond = this.nowDate.getTime();
		this.dygraphAttributes.dateWindow = [nowTimeMillisecond - 60*60*1000, 
		                                     nowTimeMillisecond];
		
		// set the size of this area
		var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }else{
        	realTag.width(this.width);
        }
        if (this.height == null) {
            this.height = realTag.height();
        }else{
        	realTag.height(this.height);
        }
        
        this.render();
        
	},
	render : function(){
		// get data
		var data = this._getDataAndSetAnnotationData();
		
		// make graph
		if(this.entity != null){
			return;
		}
		this.entity = new Dygraph(
				document.getElementById(this.$el.attr("id")),
				data,
				//this.getAttributes(wgp.DygraphAttribute)
				this.dygraphAttributes
			);
		
		// set annotation
		this.entity.setAnnotations(this.annotationArray);
		this._setAnnotationLegend(halook.hbase.parent.id.annotationLegendArea);
		this._setAnnotationCss();
		console.log('call render (graph)');
	},
	_getDataAndSetAnnotationData : function(){
		var instance = this;
		var data = [];
		console.log('_getDataAndSetAnnotationData');
		
		_.each(this.collection.models, function(model, index){
			var modelData = model.attributes;
			var jsonData = $.parseJSON(modelData.measurementValue);
			
			var timestamp = parseInt(modelData.measurementTime);
			var region_number = jsonData.RegionNumber;
			var eventList = jsonData.EventList;
			
			// push data
			var tmpArray = [];
			tmpArray.push(new Date(timestamp));
			tmpArray.push(region_number);
			data.push(tmpArray);
			
			// push annotation 
			if (eventList.length > 0 && eventList[0].EventName != ''){
				console.log(eventList);
				console.log( jsonData);
				var annotationElement = instance._getAnnotationElement(
												timestamp, 
												eventList, 
												instance.dygraphAttributes.labels[1]
												//"Number of region"
												);
				instance.annotationArray.push(annotationElement);
			}
			instance.annotationRichDataDict[timestamp] = jsonData;
			
		});
		
		return data;
	},
	_getAnnotationElement: function(timestamp, eventList, series){
		var instance = this;
		var annotationElement = {
				series		: series,
				x			: timestamp,
				shortText	: null,
				text		: null,
				tickHeight	: 20,
				cssClass	: null,
				mouseOverHandler : function(ann, point, dg, event){
					instance._hilightedActionForAnnotation(ann.x);
					
				}
		};
		
		// short text, css class name
		var eventTypeDict = halook.hbase.graph.eventType;
		var listLength = eventList.length;
		var eventClassName = null;
		if(listLength > 1){
			annotationElement.shortText = eventTypeDict.multiple.shortText;
			eventClassName = eventTypeDict.multiple.className;
		}else{
			var eventName = eventList[0].EventName;
			annotationElement.shortText = eventTypeDict[eventName].shortText;
			eventClassName = eventTypeDict[eventName].className;
		};
		
		// css
		annotationElement.cssClass = 
			halook.hbase.graph.annotation.shortTextClassName + ' ' +
			eventClassName + ' ' +
			halook.hbase.graph.annotation.xValueClassNamePrefix + timestamp;
		
		return annotationElement
	},
	_setAnnotationLegend:function(targetId){
		// initialize the area
		//var targetId = halook.hbase.parent.id.annotationLegendArea;
		$('#' + targetId).empty();
		
		// add legend of all events
		var eventTypeDict = halook.hbase.graph.eventType;
		var annotationShortTextClassName = 
					halook.hbase.graph.annotation.shortTextClassName;
		for (var typeKey in eventTypeDict) {
			$('#' + targetId).append(
				'<p class="' + 
				annotationShortTextClassName + ' ' +
				eventTypeDict[typeKey].className + '">' +
				eventTypeDict[typeKey].text + '</p>');
		};
	},
	_setAnnotationCss : function(){
		var shortTextClassName = 
					halook.hbase.graph.annotation.shortTextClassName;
		
		var eventTypeDict = halook.hbase.graph.eventType;
		for (var typeKey in eventTypeDict) {
			// add css
			$('.' + shortTextClassName + 
			  '.' + eventTypeDict[typeKey].className).css(
					  							eventTypeDict[typeKey].css);
		};
	},
	_hilightedActionForAnnotation : function(x){
		var className = halook.hbase.graph.annotation.xValueClassNamePrefix + x;
		if(this._defaultSizeOfAnnotation == null){
			this._defaultSizeOfAnnotation = $('.' + className).css('width');
			this._classNameOfPrevious = className;
		};
		
		// previous hilighted
		$('.' + this._classNameOfPrevious).css({
			textAlign	: 'center',
			width		: this._defaultSizeOfAnnotation,
			height		: this._defaultSizeOfAnnotation,
			padding		: '0px',
			zIndex		: '0'
		});
		$('._tmp').remove();
		
		// hilighted
		$('.' + className).css({
			textAlign	: 'left',
			width		: '170px',
			height		: 'auto',
			padding		: '10px',
			zIndex		: '9999'
		});
		var htmlString = '';
		htmlString += '<p class="_tmp">Region Number : <strong>';
		htmlString += this.annotationRichDataDict[x].RegionNumber;
		htmlString += '</strong></p>';
		var eventList = this.annotationRichDataDict[x].EventList;
		for(var index=0; index < eventList.length; index++){
			htmlString += '<p class="_tmp"><strong>';
			htmlString += eventList[index].EventName;
			htmlString += '</strong><br>';
			htmlString += eventList[index].EventTime;
			htmlString += '</p>\n';
		}
		$('.' + className).append(htmlString);
		
		this._classNameOfPrevious = className;
	},
	getData:function(){
		var data = [];
		_.each(this.collection.models, function(model, index){
			data.push(model.get("data"));
		});
		return data;
	},
	getRegisterId : function(){
		return this.graphId;
	},/*
	getGraphObject : function(){
		return this.entity;
	},*/
	updateDisplaySpan: function(fromMillisecond, toMillisecond){
		var earliest = this.nowDate.getTime() - fromMillisecond;
		var latest = this.nowDate.getTime() - toMillisecond;
		
		this.entity.updateOptions({
			dateWindow : [earliest, latest]
		});
		
		this._setAnnotationCss();
	}
	
	
});

