infinispan.dygraphChartModel = Backbone.Model.extend({
	defaults:{
		time:null,
		counter:null
	},
	idAttribute:"time"
});

infinispan.dygraphModelCollection = Backbone.Collection.extend({
	model : infinispan.dygraphChartModel
});