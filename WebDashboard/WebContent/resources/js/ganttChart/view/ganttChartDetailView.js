var ganttChartDetailView = wgp.AbstractView.extend({
	initialize: function(){
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new GanttChartModelCollection();
		this.attributes = {};
		this.registerCollectionEvent();
//		this.graphId = 1;

    	this.maxId = 0;
    	
        var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }
        if (this.height == null) {
            this.height = realTag.height();
        }
        
		console.log('called ganttChartDetailView');
	},
	render : function(){

		console.log('call render');
	},
	onAdd : function(element){

		console.log('call onAdd');
	},
	onChange : function(element){
		console.log('called changeModel');
	},
	onRemove : function(element){
		console.log('called removeModel');
	},
});
