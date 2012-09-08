var ganttChartView = wgp.AbstractView.extend({
	initialize: function(){
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new GanttChartModelCollection();
		this.attributes = {};
		this.registerCollectionEvent();
//		this.graphId = 1;

    	this.maxId = 0;

		
    	//初期化する。
    	var dataArray = [{
    	     jobId : "job_201208270000_0001",
    	     jobName : "PiEstimator",
    	     status : "success",
    	     submitTime : "2012/08/27 00:00:00",
    	     startTime : "2012/08/27 00:02:00",
    	     finishTime : "2012/08/27 00:30:00"
    	},
    	{
   	     	jobId : "job_201208270032_0002",
   	     	jobName : "PiEstimator",
   	     	status : "success",
   	     	submitTime : "2012/08/27 01:00:00",
   	     	startTime : "2012/08/27 01:04:00",
   	     	finishTime : "2012/08/27 01:32:00"

    	},
    	{
   	     	jobId : "job_201208270055_0003",
   	     	jobName : "PiEstimator",
   	     	status : "success",
   	     	submitTime : "2012/08/27 02:00:00",
   	     	startTime : "2012/08/27 02:04:00",
   	     	finishTime : "2012/08/27 02:40:00"

    	},
    	{
   	     	jobId : "job_201208270125_0004",
   	     	jobName : "PiEstimator",
   	     	status : "success",
   	     	submitTime : "2012/08/27 03:00:00",
   	     	startTime : "2012/08/27 03:04:00",
   	     	finishTime : "2012/08/27 03:42:00"

    	},
    	{
   	     	jobId : "job_201208270150_0005",
   	     	jobName : "PiEstimator",
   	     	status : "success",
   	     	submitTime : "2012/08/27 04:00:00",
   	     	startTime : "2012/08/27 04:05:00",
   	     	finishTime : "2012/08/27 04:50:00"

    	},
    	{
   	     	jobId : "job_201208270228_0006",
   	     	jobName : "PiEstimator",
   	     	status : "error",
   	     	submitTime : "2012/08/27 03:42:00",
   	     	startTime : "2012/08/27 03:48:00",
   	     	finishTime : "2012/08/27 04:43:00"

    	},
    	{
   	     	jobId : "job_201208270020_0007",
   	     	jobName : "PiEstimator",
   	     	status : "success",
   	     	submitTime : "2012/08/27 05:00:00",
   	     	startTime : "2012/08/27 05:12:00",
   	     	finishTime : "2012/08/27 05:57:00"

    	},
    	{
   	     	jobId : "job_201208270021_0008",
   	     	jobName : "PiEstimator",
   	     	status : "success",
   	     	submitTime : "2012/08/27 06:00:00",
   	     	startTime : "2012/08/27 06:10:00",
   	     	finishTime : "2012/08/27 07:10:00"

    	},
    	{
   	     	jobId : "job_201208270021_0009",
   	     	jobName : "PiEstimator",
   	     	status : "warn",
   	     	submitTime : "2012/08/27 07:00:00",
   	     	startTime : "2012/08/27 07:08:00",
   	     	finishTime : "2012/08/27 08:13:00"

    	},
    	{
   	     	jobId : "job_201208270110_0010",
   	     	jobName : "PiEstimator",
   	     	status : "running",
   	     	submitTime : "2012/08/27 08:00:00",
   	     	startTime : "2012/08/27 08:10:00",
   	     	finishTime : "2012/08/27 08:50:00"

    	}];
    	
    	var startX = 130;
    	var startY = 7+20*dataArray.length;
    	var width = 0;
    	var status = null;
    	

//    	
//    	var sendModel = [{
//    		windowId : "contents_area_0",
//    		data:[dataArray]
//    	}];
//
//    	
        var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }
        if (this.height == null) {
            this.height = realTag.height();
        }
//        
//        if(dataArray && dataArray.length > 0){
//        	this.addCollection(dataArray);
//            this.render();
//        }
        

        this.paper =  new Raphael(document.getElementById(this.$el.attr("id")), this.width, this.height);    	
        var property = new wgp.MapElement({
        	    objectId : 1,
        	    objectName : "wgp.MapStateElementView",
        	    pointX : 130,
        	    pointY : 0,
        	    width : 0,
        	    height : 450
        	});
        new halook.ganttChartAxisStateElementView({
        	model : property,
        	paper : this.paper
        	});
        var property1 = new wgp.MapElement({
    	    objectId : 2,
    	    objectName : "wgp.MapElementView",
    	    pointX : 130,
    	    pointY : 450,
    	    width : 700,
    	    height : 0,
    	});
        new halook.ganttChartAxisStateElementView({
        	model : property1,
        	paper : this.paper
    	});
        var Label = new wgp.MapElement({
    	    objectId : 3,
    	    objectName : "wgp.ganttChartAxisNameView",
    	    pointX : 130,
    	    pointY : 450,
    	    widthX : 700,
    	    text : dataArray[0].submitTime,
    	});
        new halook.ganttChartAxisNameView({
        	model : Label,
        	paper : this.paper
    	});
        
        for(var i=0; i<dataArray.length; i++)
        {
        	if(i == 0)
        	{
        		width = (new Date(dataArray[0].finishTime)/1000-new Date(dataArray[0].submitTime)/1000)/60;
        		status = this.getStatus(dataArray[0].status);
        		var ganttChartProperty = new wgp.MapElement({
        			objectId : i+1,
        			objectName : "wgp.MapStateElementView",
        			pointX : startX,
        			pointY : startY,
        			width : width,
        			height : 0,
        			state : status,
        			label : dataArray[0].jobId,
        			text : dataArray[0].jobName,
        			submitTime : dataArray[0].submitTime,
        			startTime : dataArray[0].startTime,
        			finishTime : dataArray[0].finishTime,
           	    	stroke : 6
        		});
        		new halook.ganttchartStateElementView({
        			model : ganttChartProperty,
        			paper : this.paper
        		});
        	}
        	else {
        		width = (new Date(dataArray[i].finishTime)/1000-new Date(dataArray[i].submitTime)/1000)/60;
        		status = this.getStatus(dataArray[i].status);
        		var ganttChartProperty = new wgp.MapElement({
        			objectId : i+1,
        			objectName : "wgp.MapStateElementView",
        			pointX : startX + (new Date(dataArray[i].submitTime)/1000 - new Date(dataArray[0].submitTime)/1000)/60,
        			pointY : startY - i*20,
        			width : width,
        			height : 0,
        			state : status,
        			label : dataArray[i].jobId,
        			text : dataArray[i].jobName,
        			submitTime : dataArray[i].submitTime,
        			startTime : dataArray[i].startTime,
        			finishTime : dataArray[i].finishTime,
           	    	stroke : 6
        		});
        		new halook.ganttchartStateElementView({
        			model : ganttChartProperty,
        			paper : this.paper
        		});
        	}
        }
        
		console.log('called ganttChartView');
	},
	render : function(){
//		var data = this.getData();
//		this.entity = new Dygraph(
//			document.getElementById(this.$el.attr("id")),
//			data,
//			this.getAttributes(wgp.DygraphAttribute)
//		);

		console.log('call render');
	},
	onAdd : function(element){
//		var dataArray = [];
//		if(this.collection.length > graphMaxNumber){
//			this.collection.shift(wgp.constants.BACKBONE_EVENT.SILENT);
//		}
//		
//		_.each(this.collection.models, function(model,index) {
//			var modelData = model.get("data");
//			var array = [];
//			array.push(modelData.jobId);
//			array.push(modelData.submitTime);
//			dataArray.push(array);
//		});
//		if(this.entity == null){
//			this.rensder();
//		}else{
//			this.entity.updateOptions({file: dataArray});
//		}
		console.log('call onAdd');
	},
	onChange : function(element){
		console.log('called changeModel');
	},
	onRemove : function(element){
		console.log('called removeModel');
	},
	getStatus : function(status){
		if(status.match("success")){
			return wgp.constants.STATE.SUCCESS;
		}
		else if(status.match("error")){
			return wgp.constants.STATE.ERROR;
		}
		else if(status.match("warn")){
			return wgp.constants.STATE.WARN;
		}
		else if(status.match("running")){
			return wgp.constants.STATE.RUNNING;
		}
		else {
			return wgp.constants.STATE.NORMAL;
		}
	}
//	addCollection:function(dataArray){
//		if(dataArray != null){
//			var instance = this;
//			_.each(dataArray, function(data, index){
//				var model = new instance.collection.model({dataId: instance.maxId, data:data});
//				instance.collection.add(model, wgp.constants.BACKBONE_EVENT.SILENT);
//				instance.maxId++;
//			});
//		}
//	},
//	getData : function() {
//		var data = [];
//		_.each(this.collection.models, function(model, index){
//			var modelData = model.get("data");
//			var array = [];
//			array.push(modelData.jobId);
//			array.push(modelData.submitTime);
//			data.push(array);
//		});
//		return data;
//
//	}
});
