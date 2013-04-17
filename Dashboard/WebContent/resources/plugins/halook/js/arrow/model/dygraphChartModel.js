halook.dygraphChartModel = Backbone.Model.extend({
	defaults:{
		time:null,
		counter:null
	},
	idAttribute:"time"
});

halook.dygraphModelCollection = Backbone.Collection.extend({
	model : halook.dygraphChartModel
});